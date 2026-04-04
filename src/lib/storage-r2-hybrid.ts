/**
 * Hybrid R2 Storage Adapter
 *
 * Combines R2 binding (fast downloads) with S3 API (signed upload URLs).
 * - Downloads: R2 binding from cloudflare:workers (no credentials needed)
 * - Uploads: R2 binding directly (no credentials needed)
 * - Signed upload URLs: S3-compatible API with R2 credentials from Worker env
 *
 * This solves the limitation of @emdash-cms/cloudflare's r2() adapter,
 * which doesn't support getSignedUploadUrl().
 */

import { env } from "cloudflare:workers";
import { AwsClient } from "aws4fetch";
import type {
  Storage,
  UploadResult,
  DownloadResult,
  ListResult,
  ListOptions,
  SignedUploadUrl,
  SignedUploadOptions,
} from "emdash";
import { EmDashStorageError } from "emdash";

const TRAILING_SLASH = /\/$/;

class R2HybridStorage implements Storage {
  private bucket: R2Bucket;
  private bucketName: string;
  private publicUrl?: string;

  constructor(bucket: R2Bucket, bucketName: string, publicUrl?: string) {
    this.bucket = bucket;
    this.bucketName = bucketName;
    this.publicUrl = publicUrl;
  }

  async upload(options: {
    key: string;
    body: Buffer | Uint8Array | ReadableStream<Uint8Array>;
    contentType: string;
  }): Promise<UploadResult> {
    try {
      const result = await this.bucket.put(options.key, options.body, {
        httpMetadata: { contentType: options.contentType },
      });
      if (!result) {
        throw new EmDashStorageError(`Failed to upload: ${options.key}`, "UPLOAD_FAILED");
      }
      return { key: options.key, url: this.getPublicUrl(options.key), size: result.size };
    } catch (error) {
      if (error instanceof EmDashStorageError) throw error;
      throw new EmDashStorageError(`Failed to upload: ${options.key}`, "UPLOAD_FAILED", error);
    }
  }

  async download(key: string): Promise<DownloadResult> {
    try {
      const object = await this.bucket.get(key);
      if (!object || !("body" in object) || !object.body) {
        throw new EmDashStorageError(`File not found: ${key}`, "NOT_FOUND");
      }
      return {
        body: object.body,
        contentType: object.httpMetadata?.contentType || "application/octet-stream",
        size: object.size,
      };
    } catch (error) {
      if (error instanceof EmDashStorageError) throw error;
      throw new EmDashStorageError(`Failed to download: ${key}`, "DOWNLOAD_FAILED", error);
    }
  }

  async delete(key: string): Promise<void> {
    try {
      await this.bucket.delete(key);
    } catch (error) {
      throw new EmDashStorageError(`Failed to delete: ${key}`, "DELETE_FAILED", error);
    }
  }

  async exists(key: string): Promise<boolean> {
    try {
      return (await this.bucket.head(key)) !== null;
    } catch (error) {
      throw new EmDashStorageError(`Failed to check: ${key}`, "HEAD_FAILED", error);
    }
  }

  async list(options: ListOptions = {}): Promise<ListResult> {
    try {
      const response = await this.bucket.list({
        prefix: options.prefix,
        limit: options.limit,
        cursor: options.cursor,
      });
      return {
        files: response.objects.map((item) => ({
          key: item.key,
          size: item.size,
          lastModified: item.uploaded,
          etag: item.etag,
        })),
        nextCursor: response.truncated ? response.cursor : undefined,
      };
    } catch (error) {
      throw new EmDashStorageError("Failed to list files", "LIST_FAILED", error);
    }
  }

  async getSignedUploadUrl(options: SignedUploadOptions): Promise<SignedUploadUrl> {
    if (!options.key || options.key.includes("..") || options.key.startsWith("/")) {
      throw new EmDashStorageError("Invalid storage key", "INVALID_KEY");
    }

    const workerEnv = env as unknown as Record<string, string | undefined>;
    const accessKeyId = workerEnv.R2_ACCESS_KEY_ID;
    const secretAccessKey = workerEnv.R2_SECRET_ACCESS_KEY;
    const accountId = workerEnv.CLOUDFLARE_ACCOUNT_ID;

    if (!accessKeyId || !secretAccessKey || !accountId) {
      throw new EmDashStorageError(
        "R2 S3 credentials not configured. Set R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, " +
          "and CLOUDFLARE_ACCOUNT_ID as Worker secrets/vars.",
        "NOT_CONFIGURED",
      );
    }

    const expiresIn = options.expiresIn || 3600;
    const r2Client = new AwsClient({ accessKeyId, secretAccessKey, service: "s3", region: "auto" });
    const endpoint = `https://${accountId}.r2.cloudflarestorage.com`;
    const url = `${endpoint}/${this.bucketName}/${options.key}`;

    const signed = await r2Client.sign(url, {
      method: "PUT",
      headers: { "Content-Type": options.contentType },
      aws: { signQuery: true },
    });

    return {
      url: signed.url,
      method: "PUT",
      headers: {
        "Content-Type": options.contentType,
        ...(options.size ? { "Content-Length": String(options.size) } : {}),
      },
      expiresAt: new Date(Date.now() + expiresIn * 1000).toISOString(),
    };
  }

  getPublicUrl(key: string): string {
    if (this.publicUrl) {
      return `${this.publicUrl.replace(TRAILING_SLASH, "")}/${key}`;
    }
    return `/_emdash/api/media/file/${key}`;
  }
}

/**
 * Factory function called by Emdash at runtime
 */
export function createStorage(config: Record<string, unknown>): Storage {
  const binding = typeof config.binding === "string" ? config.binding : "";
  const bucketName = typeof config.bucketName === "string" ? config.bucketName : "";
  const publicUrl = typeof config.publicUrl === "string" ? config.publicUrl : undefined;

  if (!binding) {
    throw new EmDashStorageError("R2 binding name required", "BINDING_NOT_FOUND");
  }
  if (!bucketName) {
    throw new EmDashStorageError("R2 bucket name required for S3 signed URLs", "BUCKET_NAME_MISSING");
  }

  const bucket = (env as Record<string, unknown>)[binding] as R2Bucket | undefined;
  if (!bucket) {
    throw new EmDashStorageError(
      `R2 binding "${binding}" not found. Check wrangler.jsonc.`,
      "BINDING_NOT_FOUND",
    );
  }

  return new R2HybridStorage(bucket, bucketName, publicUrl);
}
