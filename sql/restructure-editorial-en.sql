-- ============================================================
-- English (en) translations — mirrors restructure-editorial.sql
-- ============================================================

-- HRANA
INSERT INTO ec_editorial (page_key, section_key, sort_order, locale, title, body, image, gallery) VALUES
('hrana', 'riba-s-gradela', 1, 'en',
 'Grilled fish and the spirit of the konoba',
 'On these islands, fish doesn''t come from a fridge — it comes from the sea you''re watching while you eat. Konoba Mureta in Pašman, Udica in Kukljica, Kiss near Neviđane: each has its own pier, its own story, and its own octopus under the peka. You sit at a stone table, order whatever the fishermen brought in this morning, and realize this is why you came.',
 '/api/img/food-grilled-fish',
 '[{"src":"/api/img/food-calamari-fries","alt":"Fried calamari"},{"src":"/api/img/food-seafood-platter","alt":"Seafood platter"},{"src":"/api/img/food-grilled-prawns","alt":"Grilled prawns"}]');

INSERT INTO ec_editorial (page_key, section_key, sort_order, locale, title, body, image, gallery) VALUES
('hrana', 'maslinovo-ulje', 2, 'en',
 'Olive oil — Ugljan''s liquid gold',
 'Ugljan is nicknamed "The Olive Island" for good reason: over 200,000 trees, a tradition spanning two millennia, and oil considered the finest in Croatia. Here, olive oil isn''t a condiment — it''s the foundation of everything. Pour it over fresh fish, dip bread, drizzle it on island tomatoes. Visit family producers and taste oil straight from the press.',
 '/api/img/food-peka-fireplace',
 '[{"src":"/api/img/food-peka-embers","alt":"Peka on embers"},{"src":"/api/img/food-meat-buckwheat","alt":"Meat with buckwheat"},{"src":"/api/img/food-steak-gnocchi","alt":"Steak with gnocchi"}]');

INSERT INTO ec_editorial (page_key, section_key, sort_order, locale, title, body, image, gallery) VALUES
('hrana', 'dalmatinski-ritual', 3, 'en',
 'A meal as ritual, not obligation',
 'In Dalmatia, you don''t eat — you savor. Lunch lasts two hours, starts with marinated anchovies and brudet, moves to grilled fish, and ends with carob or figs in honey. Between every bite — the sea, conversation, a glass of pošip. Nobody watches the clock here. The sea waits, the evening is long, and the table can always be extended.',
 '/api/img/food-sharing-platter',
 '[{"src":"/api/img/food-seafood-beer","alt":"Seafood with beer"},{"src":"/api/img/food-fish-stew","alt":"Fish stew"},{"src":"/api/img/food-beer-seaside","alt":"Beer by the sea"}]');

INSERT INTO ec_editorial (page_key, section_key, sort_order, locale, title, body, image, gallery) VALUES
('hrana', 'trznice-i-namirnice', 4, 'en',
 'From market to table',
 'The freshest fish you buy at dawn, straight from the boat in Kali — the fishing capital of the Adriatic. At the Zadar fish market, choose from dozens of varieties of fresh fish and shellfish. On the island, every village has its small shop for basics, and for real shopping, visit Zadar. And absolutely: ice cream at Hajduk in Kukljica. Every time.',
 '/api/img/food-octopus-tomatoes',
 '[{"src":"/api/img/food-pizza","alt":"Pizza"},{"src":"/api/img/food-ice-cream","alt":"Ice cream"},{"src":"/api/img/food-calamari-squid","alt":"Calamari"}]');

-- AKTIVNOSTI
INSERT INTO ec_editorial (page_key, section_key, sort_order, locale, title, body, image, gallery) VALUES
('aktivnosti', 'staze-i-vidikovci', 1, 'en',
 'Trails that lead to the sky',
 'From the summit of Veliki Bokolj (274 m), Pašman looks like a scale model scattered with olive groves, while Velebit rises behind the sea like a wall from another world. The ascent starts from Dobropoljana — a gravel road accessible on foot, by bike, or by car. At the top awaits a circular stone viewpoint with a panoramic telescope and views of Vrana Lake, Kornati, and the entire Zadar archipelago.',
 '/api/img/island-hilltop-panorama',
 '[{"src":"/api/img/island-hiking-trail","alt":"Hiking trail"},{"src":"/api/img/island-hilltop-seaview","alt":"Hilltop view"},{"src":"/api/img/island-archipelago-panorama","alt":"Archipelago panorama"}]');

INSERT INTO ec_editorial (page_key, section_key, sort_order, locale, title, body, image, gallery) VALUES
('aktivnosti', 'biciklizam', 2, 'en',
 'Two islands, two wheels',
 'The Ždrelac bridge has a cycling lane, which means with one bicycle you can explore both Pašman and Ugljan — 46 kilometers of varied terrain, from coastal roads by the sea to gravel paths through olive groves. The easier Route 8 passes through every village on the island, while the more demanding Route 7 cuts through the center. E-bike tours are organized by ZZUUM, and bicycle rental starts from 10 EUR/day with delivery.',
 '/api/img/island-stone-arches',
 '[{"src":"/api/img/island-fortress-bay","alt":"Fortress above the bay"},{"src":"/api/img/island-beach-entrance","alt":"Beach path"},{"src":"/api/img/island-sunset-coast","alt":"Sunset coast"}]');

INSERT INTO ec_editorial (page_key, section_key, sort_order, locale, title, body, image, gallery) VALUES
('aktivnosti', 'kornati-i-telascica', 3, 'en',
 'Kornati and Telašćica — a cathedral of rock and sea',
 'Day trips depart from Tkon and Kukljica toward the two most beautiful destinations in the Adriatic. Kornati National Park — 89 islands scattered across the sea like traces of some ancient giant — leaves even the most experienced travelers breathless. Telašćica Nature Park hides the salt lake Mir, sheer cliffs 161 meters high, and coves where you anchor under the stars. A day trip with lunch on board starts from 40-50 EUR.',
 '/api/img/island-blue-bay-sailboats',
 '[{"src":"/api/img/island-dramatic-sunset","alt":"Dramatic sunset"},{"src":"/api/img/island-beach-cove","alt":"Cove"},{"src":"/api/img/island-crystal-sea","alt":"Crystal sea"}]');

INSERT INTO ec_editorial (page_key, section_key, sort_order, locale, title, body, image, gallery) VALUES
('aktivnosti', 'more-i-voda', 4, 'en',
 'The embrace of the sea',
 'Pašman has the cleanest sea in the Adriatic — constant exchange of currents keeps it crystal clear. A kayak takes you to coves unreachable by land. SUP on calm morning waters, when the surface is glass and the sun is just rising, is one of those moments you don''t photograph — you just feel. For diving, the underwater world around the island hides rich life, from octopuses in rock crevices to schools of colorful fish in posidonia meadows.',
 '/api/img/island-beach-boats',
 '[{"src":"/api/img/island-sandy-beach","alt":"Sandy beach"},{"src":"/api/img/island-kids-beach","alt":"Kids at beach"},{"src":"/api/img/island-child-beach","alt":"Child in the sea"}]');

-- PLAZE
INSERT INTO ec_editorial (page_key, section_key, sort_order, locale, title, body, image, gallery) VALUES
('plaze', 'zdrelac-kupanje', 1, 'en',
 'Ždrelac coves — the sea at your doorstep',
 'Swimming in Ždrelac is spontaneous: grab a towel, walk five minutes, and dive in. Matlovac beach on the north side is sandy with a gentle slope into the sea, a beach bar, and playground — perfect for families with small children. Soline cove holds mineral-rich sand that local fishermen say heals tired joints. And the pine forest in the village center creates a microclimate mixing the scent of sea and resin.',
 '/api/img/island-family-beach',
 '[{"src":"/api/img/island-wide-beach","alt":"Wide beach"},{"src":"/api/img/island-kids-beach","alt":"Kids at beach"},{"src":"/api/img/island-beach-cove","alt":"Cove"}]');

INSERT INTO ec_editorial (page_key, section_key, sort_order, locale, title, body, image, gallery) VALUES
('plaze', 'pasman-plaze', 2, 'en',
 'Sandy beaches of Pašman',
 'Along the entire length of the island, sandy coves line up surrounded by tamarisk and pine. Banj, just a few kilometers from Ždrelac, has shallow water and fine sand ideal for the youngest swimmers. Lokva in Neviđane offers the shade of century-old tamarisk and carefree play in the sand. Mrljane stretches along a long beach with views of heart-shaped Galešnjak — the only naturally formed heart-shaped island in the world.',
 '/api/img/island-sandy-beach',
 '[{"src":"/api/img/island-child-beach","alt":"Child at beach"},{"src":"/api/img/island-beach-entrance","alt":"Beach path"},{"src":"/api/img/island-crystal-sea","alt":"Crystal sea"}]');

INSERT INTO ec_editorial (page_key, section_key, sort_order, locale, title, body, image, gallery) VALUES
('plaze', 'ugljan-plaze', 3, 'en',
 'From Ugljan to turquoise',
 'Cross the bridge and a new coast opens up. Jaz in Preko carries the Blue Flag and offers everything — from umbrellas and loungers to waterslides for kids and beach volleyball. Sabuša in Kukljica, sandy with views of Dugi Otok, is hidden fifteen minutes'' walk from the center. Mostir in the village of Ugljan tempts you to snorkel in crystal-clear water.',
 '/api/img/island-beach-boats',
 '[{"src":"/api/img/island-blue-bay-sailboats","alt":"Sailboats in the bay"},{"src":"/api/img/island-marina","alt":"Marina"},{"src":"/api/img/island-village-harbor","alt":"Village harbor"}]');

INSERT INTO ec_editorial (page_key, section_key, sort_order, locale, title, body, image, gallery) VALUES
('plaze', 'skrivene-uvale', 4, 'en',
 'Secrets for those who seek',
 'The best coves don''t have names on Google Maps. Some are reached by kayak, others through olive groves where no one walks. The southern side of Pašman is wild and cliffy — here the sea strikes the rocks and creates turquoise pools that are yours alone. Prtljug in Lukoran is a pebble cove just 40 meters long, with no facilities, no people, nothing but the sea. Ask us for the secret coordinates.',
 '/api/img/island-dramatic-sunset',
 '[{"src":"/api/img/island-hilltop-seaview","alt":"Sea view"},{"src":"/api/img/island-archipelago-panorama","alt":"Archipelago panorama"},{"src":"/api/img/island-sunset-coast","alt":"Sunset coast"}]');

-- ZDRELAC
INSERT INTO ec_editorial (page_key, section_key, sort_order, locale, title, body, image, gallery) VALUES
('zdrelac', 'most-i-prolaz', 1, 'en',
 'A bridge between two worlds',
 'The Ždrelac bridge is the only land crossing between Pašman and Ugljan — an arched bridge 210 meters long, renovated in 2009 with a steel arch spanning 68 meters. Below it, through the Ždrilo strait, hundreds of boats pass daily. In the evening, when the sun sets behind the Zadar archipelago and paints the sky pink and orange, the view from the bridge is one of those moments that brings you back to the island.',
 '/api/img/island-zdrelac-harbor',
 '[{"src":"/api/img/island-village-harbor","alt":"Ždrelac harbor"},{"src":"/api/img/island-dramatic-sunset","alt":"Sunset"}]');

INSERT INTO ec_editorial (page_key, section_key, sort_order, locale, title, body, image, gallery) VALUES
('zdrelac', 'selo-i-dusa', 2, 'en',
 'A village of stone and salt',
 'Ždrelac is the largest settlement on Pašman, but it feels as if time moves more slowly here. The old stone center with narrow streets and traditional Dalmatian architecture preserves the spirit of the island. The 13th-century Church of St. Luke stands at the heart of the village, and the small harbor in the center still serves fishermen who head out before dawn. Here, neighbors greet each other by name, children swim until dark, and lavender and rosemary grow from cracks in the stone.',
 '/api/img/island-pine-chapel',
 '[{"src":"/api/img/island-stone-arches","alt":"Stone arches"},{"src":"/api/img/island-fortress-bay","alt":"Fortress above bay"}]');

INSERT INTO ec_editorial (page_key, section_key, sort_order, locale, title, body, image, gallery) VALUES
('zdrelac', 'ribari-i-more', 3, 'en',
 'People of the sea',
 'Ždrelac has always been a fishing village. At night they head out to the Ždrilo strait and the Zadar channel with lamps to catch squid, and in the morning they return with a haul that ends up on the grill or in brudet. Fishing culture here isn''t a tourist attraction — it''s a way of life passed from generation to generation. At the harbor you can buy fish straight from the boat, and the scent of grilling fish that spreads through the village at dusk is better than any restaurant menu.',
 '/api/img/island-beach-boats',
 '[{"src":"/api/img/island-marina","alt":"Marina"},{"src":"/api/img/island-sunset-coast","alt":"Sunset coast"}]');

INSERT INTO ec_editorial (page_key, section_key, sort_order, locale, title, body, image, gallery) VALUES
('zdrelac', 'maslinici-i-staze', 4, 'en',
 'Olive groves, pines, and the path to the sea',
 'Behind the village begins another Ždrelac: olive groves climbing the hillsides, pine forests fragrant with resin, and trails leading to hidden coves. A recreational-educational trail of 13 kilometers connects the summit of Bokolj with Soline cove, passing through indigenous Mediterranean vegetation. Every step offers a new perspective — a view of the sea on one side, olive groves on the other, and a silence that cannot be heard on the mainland.',
 '/api/img/island-hiking-trail',
 '[{"src":"/api/img/island-hilltop-panorama","alt":"Hilltop panorama"},{"src":"/api/img/island-hilltop-seaview","alt":"Sea view from hilltop"}]');

-- DOLAZAK
INSERT INTO ec_editorial (page_key, section_key, sort_order, locale, title, body, image, gallery) VALUES
('dolazak', 'autom-i-trajektom', 1, 'en',
 'By car to the sea — two ferries, one destination',
 'Two routes lead to Ždrelac. The classic: A1 motorway to Biograd na Moru, then Jadrolinija ferry to Tkon (25 minutes, departures every 1-2 hours). From Tkon, drive 15 km across the island to Ždrelac. The alternative: motorway to Zadar, ferry Zadar-Preko on Ugljan (25 minutes, frequent departures), then 15 km across Ugljan and the Ždrelac bridge straight to us. Both routes take the same time — choose whichever has the better ferry schedule.',
 '/api/img/island-jadrolinija-ferry',
 '[{"src":"/api/img/island-village-harbor","alt":"Harbor"},{"src":"/api/img/island-zdrelac-harbor","alt":"Ždrelac harbor"}]');

INSERT INTO ec_editorial (page_key, section_key, sort_order, locale, title, body, image, gallery) VALUES
('dolazak', 'bez-auta', 2, 'en',
 'Without a car — island freedom',
 'You don''t need a car. From <a href="https://www.zadar-airport.com" target="_blank" rel="noopener">Zadar Airport</a> (ZAD), it''s 15 minutes to the city by bus or taxi. From Zadar, the ferry to Preko departs every hour, and from Preko to the Ždrelac bridge is 15 km — a local bus or arranged transport brings you to the door. On the island, bicycle rental starts from 10 EUR/day with delivery to your address.',
 '/api/img/island-beach-entrance',
 '[{"src":"/api/img/island-sandy-beach","alt":"Sandy beach"},{"src":"/api/img/island-family-beach","alt":"Family beach"}]');

INSERT INTO ec_editorial (page_key, section_key, sort_order, locale, title, body, image, gallery) VALUES
('dolazak', 'savjeti-za-put', 3, 'en',
 'Before you set off',
 'Check the ferry schedule at <a href="https://www.jadrolinija.hr" target="_blank" rel="noopener">jadrolinija.hr</a> — summer departures are more frequent, but weekends and holidays can fill up, so arriving early is wise. Parking at the Biograd terminal is spacious and affordable. The Ždrelac bridge is free and open 24/7. Upon arriving at the apartment, take off your shoes, open the window, breathe in — the scent of salt, pine, and lavender will tell you that you''ve arrived.',
 '/api/img/island-wide-beach',
 '[{"src":"/api/img/island-crystal-sea","alt":"Crystal sea"},{"src":"/api/img/island-archipelago-panorama","alt":"Archipelago panorama"}]');

-- VODIC
INSERT INTO ec_editorial (page_key, section_key, sort_order, locale, title, body, image, gallery) VALUES
('vodic', 'pasman-sela', 1, 'en',
 'Pašman — ten villages, one soul',
 'Pašman has the largest green area in the entire Croatian archipelago — ten villages spread along 60 km of island, each with its own character. Ždrelac at the top preserves the fishing spirit, Dobropoljana lies at the foot of Bokolj with the most beautiful sunsets, Neviđane hides a 12th-century stone statue of St. Michael. In Tkon, the ferry port, the Benedictine monastery at Ćokovac has been active continuously since 1129 — the only active male Benedictine monastery in Croatia.',
 '/api/img/island-hilltop-panorama',
 '[{"src":"/api/img/island-village-harbor","alt":"Village harbor"},{"src":"/api/img/island-pine-chapel","alt":"Chapel among pines"},{"src":"/api/img/island-family-beach","alt":"Family beach"},{"src":"/api/img/island-sunset-coast","alt":"Sunset coast"}]');

INSERT INTO ec_editorial (page_key, section_key, sort_order, locale, title, body, image, gallery) VALUES
('vodic', 'ugljan-sela', 2, 'en',
 'Ugljan — the green island of olives',
 'Ugljan, connected to Pašman by a bridge at Ždrelac, is nicknamed "The Green Island" — over 200,000 olive trees and a tradition spanning two millennia. Preko is the administrative center with a romantic waterfront and ferry to Zadar (25 minutes). Above Preko, at 265 meters, St. Michael''s Fortress offers a breathtaking view. Kali is the fishing capital with a fishermen''s festival under the full moon. Kukljica is a gastro center with Konoba Udica and the most beautiful beaches.',
 '/api/img/island-fortress-bay',
 '[{"src":"/api/img/island-stone-arches","alt":"Stone arches"},{"src":"/api/img/island-beach-boats","alt":"Beach with boats"},{"src":"/api/img/island-marina","alt":"Marina"},{"src":"/api/img/island-beach-cove","alt":"Cove"}]');

INSERT INTO ec_editorial (page_key, section_key, sort_order, locale, title, body, image, gallery) VALUES
('vodic', 'zadar', 3, 'en',
 'Zadar — the city that plays music to the sea',
 'A 25-minute ferry from Preko brings you to the city that Alfred Hitchcock declared in 1964 as having the most beautiful sunset in the world. On the Zadar waterfront, architect Nikola Bašić''s Sea Organ transforms waves into music — marble steps descend into the sea, and each wave presses air chambers that produce otherworldly sounds. Right beside it, the Sun Salutation — a 22-meter glass circle filled with solar cells — turns the sun''s energy into a hypnotic light show at night. The old town, encircled by Roman walls, hides the Roman Forum, the 9th-century Church of St. Donatus, and the Cathedral of St. Anastasia.',
 '/api/img/zadar-colorful-rooftops',
 '[{"src":"/api/img/zadar-riva-promenade","alt":"Zadar waterfront"},{"src":"/api/img/zadar-old-town-street","alt":"Old town street"},{"src":"/api/img/zadar-harbor-panorama","alt":"Harbor panorama"},{"src":"/api/img/zadar-bell-tower","alt":"Bell tower"}]');

INSERT INTO ec_editorial (page_key, section_key, sort_order, locale, title, body, image, gallery) VALUES
('vodic', 'izleti-s-otoka', 4, 'en',
 'Day trips — Kornati, Telašćica, Vrana Lake',
 'From Pašman and Ugljan, excursions depart that reveal the wild side of the Adriatic. Kornati National Park — 89 islands scattered across the sea like a cosmic sequence — is accessible on a day trip from Tkon or Kukljica (from 40-50 EUR with lunch on board). Telašćica Nature Park hides the salt lake Mir and cliffs 161 meters high. On the mainland, Vrana Lake — Croatia''s largest natural lake — is a paradise for birdwatchers and cyclists.',
 '/api/img/island-blue-bay-sailboats',
 '[{"src":"/api/img/island-dramatic-sunset","alt":"Sunset"},{"src":"/api/img/island-crystal-sea","alt":"Crystal sea"},{"src":"/api/img/island-archipelago-panorama","alt":"Archipelago panorama"}]');
