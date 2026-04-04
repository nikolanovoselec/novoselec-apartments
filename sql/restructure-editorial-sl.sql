-- ============================================================
-- Slovenian (sl) translations — mirrors restructure-editorial.sql
-- ============================================================

-- HRANA
INSERT INTO ec_editorial (page_key, section_key, sort_order, locale, title, body, image, gallery) VALUES
('hrana', 'riba-s-gradela', 1, 'sl',
 'Riba z žara in duh konobe',
 'Na teh otokih riba ne prihaja iz hladilnika — prihaja iz morja, ki ga gledate med jedjo. Konoba Mureta na Pašmanu, Udica v Kukljici, Kiss pri Neviđanah: vsaka ima svoj pomol, svojo zgodbo in svojo hobotnico pod peko. Usedete se za kamnito mizo, naročite, kar so ribiči prinesli danes zjutraj, in spoznate, da je to razlog, zakaj ste prišli.',
 '/api/img/food-grilled-fish',
 '[{"src":"/api/img/food-calamari-fries","alt":"Ocvrti lignji"},{"src":"/api/img/food-seafood-platter","alt":"Plato morskih sadežev"},{"src":"/api/img/food-grilled-prawns","alt":"Škampi na žaru"}]');

INSERT INTO ec_editorial (page_key, section_key, sort_order, locale, title, body, image, gallery) VALUES
('hrana', 'maslinovo-ulje', 2, 'sl',
 'Oljčno olje — tekoče zlato Ugljana',
 'Ugljan nosi vzdevek "Oljčni otok" z dobrim razlogom: več kot 200.000 dreves, dva tisočletja stara tradicija in olje, ki velja za najboljše na Hrvaškem. Tu oljčno olje ni začimba — je temelj vsega. Polijte ga po sveži ribi, namočite kruh, pokapljajte na otočne paradižnike. Obiščite družinske pridelovalce in poskusite olje naravnost iz stiskalnice.',
 '/api/img/food-peka-fireplace',
 '[{"src":"/api/img/food-peka-embers","alt":"Peka na žerjavici"},{"src":"/api/img/food-meat-buckwheat","alt":"Meso z ajdo"},{"src":"/api/img/food-steak-gnocchi","alt":"Zrezek z njoki"}]');

INSERT INTO ec_editorial (page_key, section_key, sort_order, locale, title, body, image, gallery) VALUES
('hrana', 'dalmatinski-ritual', 3, 'sl',
 'Obrok kot ritual, ne obveznost',
 'V Dalmaciji se ne je — uživa se. Kosilo traja dve uri, začne se z mariniranimi inčuni in brudetom, preide na ribo z žara in konča z rožičem ali figovimi plodovi v medu. Med vsakim grižljajem — morje, pogovor, kozarec pošipa. Tu nihče ne gleda na uro. Morje čaka, večer je dolg, miza pa se lahko vedno podaljša.',
 '/api/img/food-sharing-platter',
 '[{"src":"/api/img/food-seafood-beer","alt":"Morski sadeži ob pivu"},{"src":"/api/img/food-fish-stew","alt":"Ribji brodet"},{"src":"/api/img/food-beer-seaside","alt":"Pivo ob morju"}]');

INSERT INTO ec_editorial (page_key, section_key, sort_order, locale, title, body, image, gallery) VALUES
('hrana', 'trznice-i-namirnice', 4, 'sl',
 'S tržnice na mizo',
 'Najsvežejšo ribo kupite ob zori, naravnost s čolna v Kaliju — ribiški prestolnici Jadrana. Na Ribji tržnici v Zadru izbirate med desetinami vrst sveže ribe in školjk. Na otoku ima vsaka vas svojo majhno trgovino za osnovno, za pravi nakup pa obiščite Zadar. In obvezno: sladoled v Hajduku v Kukljici. Vsakič.',
 '/api/img/food-octopus-tomatoes',
 '[{"src":"/api/img/food-pizza","alt":"Pizza"},{"src":"/api/img/food-ice-cream","alt":"Sladoled"},{"src":"/api/img/food-calamari-squid","alt":"Kalamari"}]');

-- AKTIVNOSTI
INSERT INTO ec_editorial (page_key, section_key, sort_order, locale, title, body, image, gallery) VALUES
('aktivnosti', 'staze-i-vidikovci', 1, 'sl',
 'Poti, ki vodijo do neba',
 'Z vrha Velikega Bokolja (274 m) Pašman izgleda kot maketa, posuta z oljčnimi nasadi, Velebit pa se dviga za morjem kot stena drugega sveta. Vzpon se začne iz Dobropoljane — po makadamski cesti, dostopni peš, s kolesom ali z avtom. Na vrhu vas čaka okrogla kamnita razgledna točka s panoramskim teleskopom in razgledom na Vransko jezero, Kornate in celoten zadarski arhipelag.',
 '/api/img/island-hilltop-panorama',
 '[{"src":"/api/img/island-hiking-trail","alt":"Pohodna pot"},{"src":"/api/img/island-hilltop-seaview","alt":"Razgled z vrha"},{"src":"/api/img/island-archipelago-panorama","alt":"Panorama arhipelaga"}]');

INSERT INTO ec_editorial (page_key, section_key, sort_order, locale, title, body, image, gallery) VALUES
('aktivnosti', 'biciklizam', 2, 'sl',
 'Dva otoka, dva kolesa',
 'Most Ždrelac ima kolesarsko stezo, kar pomeni, da z enim kolesom raziščete tako Pašman kot Ugljan — 46 kilometrov raznolikega terena, od obalnih cest ob morju do makadamskih poti skozi oljčne nasade. Lažja Pot 8 vodi skozi vse vasi na otoku, zahtevnejša Pot 7 prečka sredino otoka. E-kolesarske ture organizira ZZUUM, najem kolesa pa se začne pri 10 EUR/dan z dostavo.',
 '/api/img/island-stone-arches',
 '[{"src":"/api/img/island-fortress-bay","alt":"Trdnjava nad zalivom"},{"src":"/api/img/island-beach-entrance","alt":"Pot do plaže"},{"src":"/api/img/island-sunset-coast","alt":"Sončni zahod na obali"}]');

INSERT INTO ec_editorial (page_key, section_key, sort_order, locale, title, body, image, gallery) VALUES
('aktivnosti', 'kornati-i-telascica', 3, 'sl',
 'Kornati in Telašćica — katedrala iz skal in morja',
 'Enodnevni izleti se začnejo v Tkonu in Kukljici proti dvema najlepšima destinacijama Jadrana. Nacionalni park Kornati — 89 otokov, raztresenih po morju kot sled pradavnega velikana — pusti brez sape tudi najbolj izkušene popotnike. Park narave Telašćica skriva slano jezero Mir, 161 metrov visoke pečine in zalive, v katerih zasidrate pod zvezdami. Enodnevni izlet s kosilom na ladji od 40-50 EUR.',
 '/api/img/island-blue-bay-sailboats',
 '[{"src":"/api/img/island-dramatic-sunset","alt":"Dramatičen sončni zahod"},{"src":"/api/img/island-beach-cove","alt":"Zaliv"},{"src":"/api/img/island-crystal-sea","alt":"Kristalno morje"}]');

INSERT INTO ec_editorial (page_key, section_key, sort_order, locale, title, body, image, gallery) VALUES
('aktivnosti', 'more-i-voda', 4, 'sl',
 'Objem morja',
 'Pašman ima najčistejše morje na Jadranu — stalna izmenjava morskih tokov ga ohranja kristalno prozorno. Kajak vas popelje v zalive, do katerih po kopnem ni mogoče priti. SUP na mirnem jutranjem morju, ko je gladina steklena in sonce šele vzhaja, je eden tistih trenutkov, ki jih ne fotografirate — jih le začutite. Za potapljanje podvodni svet okoli otoka skriva bogato življenje.',
 '/api/img/island-beach-boats',
 '[{"src":"/api/img/island-sandy-beach","alt":"Peščena plaža"},{"src":"/api/img/island-kids-beach","alt":"Otroci na plaži"},{"src":"/api/img/island-child-beach","alt":"Otrok v morju"}]');

-- PLAZE
INSERT INTO ec_editorial (page_key, section_key, sort_order, locale, title, body, image, gallery) VALUES
('plaze', 'zdrelac-kupanje', 1, 'sl',
 'Zalivi Ždrelca — morje pred vrati',
 'Kopanje v Ždrelcu je spontano: vzemite brisačo, hodite pet minut in se potopite. Plaža Matlovac na severu naselja je peščena s položnim vstopom v morje, plažnim barom in igriščem — popolna za družine z majhnimi otroki. Zaliv Soline hrani z minerali bogat pesek, za katerega lokalni ribiči pravijo, da zdravi utrujene sklepe. Borov gozd v centru vasi pa ustvarja mikroklimo, ki meša vonj morja in smole.',
 '/api/img/island-family-beach',
 '[{"src":"/api/img/island-wide-beach","alt":"Široka plaža"},{"src":"/api/img/island-kids-beach","alt":"Otroci na plaži"},{"src":"/api/img/island-beach-cove","alt":"Zaliv"}]');

INSERT INTO ec_editorial (page_key, section_key, sort_order, locale, title, body, image, gallery) VALUES
('plaze', 'pasman-plaze', 2, 'sl',
 'Peščene plaže Pašmana',
 'Vzdolž celotnega otoka se nizajo peščeni zalivi, obdani s tamariski in borovci. Banj, le nekaj kilometrov od Ždrelca, ima plitvo vodo in fin pesek, idealen za najmlajše plavalce. Lokva v Neviđanah ponuja senco stoletnih tamariskov. Mrljane se razprostirajo ob dolgi plaži z razgledom na srčasti Galešnjak — edini naravno nastali srčasti otok na svetu.',
 '/api/img/island-sandy-beach',
 '[{"src":"/api/img/island-child-beach","alt":"Otrok na plaži"},{"src":"/api/img/island-beach-entrance","alt":"Pot do plaže"},{"src":"/api/img/island-crystal-sea","alt":"Kristalno morje"}]');

INSERT INTO ec_editorial (page_key, section_key, sort_order, locale, title, body, image, gallery) VALUES
('plaze', 'ugljan-plaze', 3, 'sl',
 'Z Ugljana do turkizne',
 'Prečkajte most in odpre se nova obala. Jaz v Preku nosi Modro zastavo in ponuja vse — od senčnikov in ležalnikov do toboganov za otroke in odbojke na mivki. Sabuša v Kukljici, peščena s pogledom na Dugi Otok, je skrita petnajst minut hoje od centra. Mostir v vasi Ugljan vabi na potapljanje v kristalno čisti vodi.',
 '/api/img/island-beach-boats',
 '[{"src":"/api/img/island-blue-bay-sailboats","alt":"Jadrnice v zalivu"},{"src":"/api/img/island-marina","alt":"Marina"},{"src":"/api/img/island-village-harbor","alt":"Pristanišče vasi"}]');

INSERT INTO ec_editorial (page_key, section_key, sort_order, locale, title, body, image, gallery) VALUES
('plaze', 'skrivene-uvale', 4, 'sl',
 'Skrivnosti za tiste, ki iščejo',
 'Najboljši zalivi nimajo imena na Google Maps. Do nekaterih pridete s kajakom, do drugih skozi oljčne nasade, po katerih nihče ne hodi. Južna stran Pašmana je divja in klifovita — tu morje udarja ob skale in ustvarja turkizne bazene, ki so samo vaši. Prtljug v Lukoranu je prodnat zaliv, dolg le 40 metrov, brez vsebin, brez ljudi, brez vsega razen morja. Vprašajte nas za skrivne koordinate.',
 '/api/img/island-dramatic-sunset',
 '[{"src":"/api/img/island-hilltop-seaview","alt":"Pogled na morje"},{"src":"/api/img/island-archipelago-panorama","alt":"Panorama arhipelaga"},{"src":"/api/img/island-sunset-coast","alt":"Sončni zahod na obali"}]');

-- ZDRELAC
INSERT INTO ec_editorial (page_key, section_key, sort_order, locale, title, body, image, gallery) VALUES
('zdrelac', 'most-i-prolaz', 1, 'sl',
 'Most med dvema svetovoma',
 'Most Ždrelac je edini kopenski prehod med Pašmanom in Ugljanom — ločni most, dolg 210 metrov, prenovljen leta 2009 z jeklenim lokom razpona 68 metrov. Pod njim, skozi ožino Ždrilo, dnevno pluje na stotine čolnov. Zvečer, ko sonce zaide za zadarskim arhipelagom in obarva nebo v rožnato in oranžno, je pogled z mostu eden tistih trenutkov, zaradi katerih se vračate na otok.',
 '/api/img/island-zdrelac-harbor',
 '[{"src":"/api/img/island-village-harbor","alt":"Pristanišče Ždrelac"},{"src":"/api/img/island-dramatic-sunset","alt":"Sončni zahod"}]');

INSERT INTO ec_editorial (page_key, section_key, sort_order, locale, title, body, image, gallery) VALUES
('zdrelac', 'selo-i-dusa', 2, 'sl',
 'Vas kamna in soli',
 'Ždrelac je največje naselje na Pašmanu, a se zdi, kot da čas tu teče počasneje. Staro kamnito jedro z ozkimi ulicami in tradicionalno dalmatinsko arhitekturo ohranja duh otoka. Cerkev sv. Luke iz 13. stoletja stoji v samem srcu vasi, majhno pristanišče v centru pa še vedno služi ribičem, ki odplujejo pred zoro. Tu se sosedje pozdravljajo po imenu, otroci se kopajo do mraka, sivka in rožmarin pa rasteta iz razpok v kamnu.',
 '/api/img/island-pine-chapel',
 '[{"src":"/api/img/island-stone-arches","alt":"Kamniti loki"},{"src":"/api/img/island-fortress-bay","alt":"Trdnjava nad zalivom"}]');

INSERT INTO ec_editorial (page_key, section_key, sort_order, locale, title, body, image, gallery) VALUES
('zdrelac', 'ribari-i-more', 3, 'sl',
 'Ljudje od morja',
 'Ždrelac je bil vedno ribiška vas. Ponoči se odpravijo v ožino Ždrilo in zadarski kanal z lučmi za lov na lignje, zjutraj se vrnejo z ulovom, ki konča na žaru ali v brodetu. Ribiška kultura tu ni turistična atrakcija — je način življenja, ki se prenaša iz roda v rod. V pristanišču lahko kupite ribo naravnost s čolna, vonj ribe z žara, ki se ob mraku širi po vasi, pa je boljši od kateregakoli restavracijskega menija.',
 '/api/img/island-beach-boats',
 '[{"src":"/api/img/island-marina","alt":"Marina"},{"src":"/api/img/island-sunset-coast","alt":"Sončni zahod na obali"}]');

INSERT INTO ec_editorial (page_key, section_key, sort_order, locale, title, body, image, gallery) VALUES
('zdrelac', 'maslinici-i-staze', 4, 'sl',
 'Oljčni nasadi, bori in pot do morja',
 'Za vasjo se začne drug Ždrelac: oljčni nasadi, ki se vzpenjajo po gričih, borov gozd z vonjem smole in poti, ki vodijo do skritih zalivov. Rekreacijsko-učna pot, dolga 13 kilometrov, povezuje vrh Bokolja z zalivom Soline in poteka skozi avtohtono mediteransko vegetacijo. Vsak korak ponuja novo perspektivo — pogled na morje z ene strani, oljčne nasade z druge in tišino, ki je na celini ni mogoče slišati.',
 '/api/img/island-hiking-trail',
 '[{"src":"/api/img/island-hilltop-panorama","alt":"Panorama z vrha"},{"src":"/api/img/island-hilltop-seaview","alt":"Pogled na morje z vrha"}]');

-- DOLAZAK
INSERT INTO ec_editorial (page_key, section_key, sort_order, locale, title, body, image, gallery) VALUES
('dolazak', 'autom-i-trajektom', 1, 'sl',
 'Z avtom do morja — dva trajekta, en cilj',
 'Do Ždrelca vodita dve poti. Klasična: po avtocesti A1 do Biograda na Moru, nato z Jadrolinija trajektom do Tkona (25 minut, odhodi vsako 1-2 uri). Iz Tkona vozite 15 km čez cel otok do Ždrelca. Alternativna: po avtocesti do Zadra, trajekt Zadar-Preko na Ugljanu (25 minut, pogosti odhodi), nato 15 km čez Ugljan in most Ždrelac naravnost do nas. Obe poti trajata enako dolgo — izberite tisto z boljšim urnikom trajekta.',
 '/api/img/island-jadrolinija-ferry',
 '[{"src":"/api/img/island-village-harbor","alt":"Pristanišče"},{"src":"/api/img/island-zdrelac-harbor","alt":"Ždrelac pristanišče"}]');

INSERT INTO ec_editorial (page_key, section_key, sort_order, locale, title, body, image, gallery) VALUES
('dolazak', 'bez-auta', 2, 'sl',
 'Brez avta — otočna svoboda',
 'Avta ne potrebujete. Z <a href="https://www.zadar-airport.com" target="_blank" rel="noopener">Letališča Zadar</a> (ZAD) do mesta je 15 minut z avtobusom ali taksijem. Iz Zadra trajekt za Preko odpluje vsako uro, s Preka do mostu Ždrelac pa je 15 km — lokalni avtobus ali dogovorjen prevoz vas pripelje do vrat. Na otoku najem kolesa od 10 EUR/dan z dostavo na naslov.',
 '/api/img/island-beach-entrance',
 '[{"src":"/api/img/island-sandy-beach","alt":"Peščena plaža"},{"src":"/api/img/island-family-beach","alt":"Družinska plaža"}]');

INSERT INTO ec_editorial (page_key, section_key, sort_order, locale, title, body, image, gallery) VALUES
('dolazak', 'savjeti-za-put', 3, 'sl',
 'Preden se odpravite',
 'Urnik trajekta preverite na <a href="https://www.jadrolinija.hr" target="_blank" rel="noopener">jadrolinija.hr</a> — poleti so odhodi pogostejši, a ob vikendih in praznikih so trajekti lahko polni, zato je pametno priti prej. Parkirišče ob terminalu v Biogradu je prostorno in ugodno. Most Ždrelac je brezplačen in odprt 24 ur. Ob prihodu v apartma sezujte čevlje, odprite okno, vdihnite — vonj soli, borov in sivke vam bo povedal, da ste prispeli.',
 '/api/img/island-wide-beach',
 '[{"src":"/api/img/island-crystal-sea","alt":"Kristalno morje"},{"src":"/api/img/island-archipelago-panorama","alt":"Panorama arhipelaga"}]');

-- VODIC
INSERT INTO ec_editorial (page_key, section_key, sort_order, locale, title, body, image, gallery) VALUES
('vodic', 'pasman-sela', 1, 'sl',
 'Pašman — deset vasi, ena duša',
 'Pašman ima največjo zeleno površino v celotnem hrvaškem arhipelagu — deset vasi, razporejenih vzdolž 60 km otoka, vsaka s svojim značajem. Ždrelac na vrhu ohranja ribiški duh, Dobropoljana leži v vznožju Bokolja z najlepšimi sončnimi zahodi, Neviđane skrivajo kamniti kip sv. Mihovila iz 12. stoletja. V Tkonu, trajektnem pristanišču, benediktinski samostan na Ćokovcu neprekinjeno deluje od leta 1129.',
 '/api/img/island-hilltop-panorama',
 '[{"src":"/api/img/island-village-harbor","alt":"Pristanišče vasi"},{"src":"/api/img/island-pine-chapel","alt":"Kapelica v borih"},{"src":"/api/img/island-family-beach","alt":"Družinska plaža"},{"src":"/api/img/island-sunset-coast","alt":"Sončni zahod"}]');

INSERT INTO ec_editorial (page_key, section_key, sort_order, locale, title, body, image, gallery) VALUES
('vodic', 'ugljan-sela', 2, 'sl',
 'Ugljan — zeleni otok oljk',
 'Ugljan, z mostom pri Ždrelcu povezan s Pašmanom, nosi vzdevek "Zeleni otok" — več kot 200.000 oljk in dva tisočletja stara tradicija. Preko je upravno središče z romantičnim obrežjem in trajektom za Zadar (25 min). Nad Prekom, na 265 metrih, Trdnjava sv. Mihovila ponuja razgled, ob katerem zastane dih. Kali je ribiška prestolnica, Kukljica pa gastro središče s Konobo Udica in najlepšimi plažami.',
 '/api/img/island-fortress-bay',
 '[{"src":"/api/img/island-stone-arches","alt":"Kamniti loki"},{"src":"/api/img/island-beach-boats","alt":"Plaža s čolni"},{"src":"/api/img/island-marina","alt":"Marina"},{"src":"/api/img/island-beach-cove","alt":"Zaliv"}]');

INSERT INTO ec_editorial (page_key, section_key, sort_order, locale, title, body, image, gallery) VALUES
('vodic', 'zadar', 3, 'sl',
 'Zadar — mesto, ki igra glasbo morju',
 'S 25-minutnim trajektom iz Preka prispete v mesto, ki ga je Alfred Hitchcock leta 1964 razglasil za kraj najlepšega sončnega zahoda na svetu. Na zadarski obali Morske orgle arhitekta Nikole Bašića pretvarjajo valove v glasbo — marmorne stopnice se spuščajo v morje, vsak val pa stisne zračne komore, ki proizvajajo nadzemeljske zvoke. Tik ob njih Pozdrav Soncu — 22-metrski stekleni krog s solarnimi celicami — ponoči pretvarja sončno energijo v hipnotični svetlobni šov.',
 '/api/img/zadar-colorful-rooftops',
 '[{"src":"/api/img/zadar-riva-promenade","alt":"Zadarska riva"},{"src":"/api/img/zadar-old-town-street","alt":"Ulica starega mesta"},{"src":"/api/img/zadar-harbor-panorama","alt":"Panorama pristanišča"},{"src":"/api/img/zadar-bell-tower","alt":"Zvonik"}]');

INSERT INTO ec_editorial (page_key, section_key, sort_order, locale, title, body, image, gallery) VALUES
('vodic', 'izleti-s-otoka', 4, 'sl',
 'Enodnevni izleti — Kornati, Telašćica, Vransko jezero',
 'S Pašmana in Ugljana se začnejo izleti, ki razkrivajo divjo stran Jadrana. Nacionalni park Kornati — 89 otokov, raztresenih po morju kot kozmično zaporedje — je dostopen z enodnevnim izletom iz Tkona ali Kukljice (od 40-50 EUR s kosilom na ladji). Park narave Telašćica skriva slano jezero Mir in 161 m visoke pečine. Na celini je Vransko jezero — največje naravno jezero na Hrvaškem — raj za opazovalce ptic in kolesarje.',
 '/api/img/island-blue-bay-sailboats',
 '[{"src":"/api/img/island-dramatic-sunset","alt":"Sončni zahod"},{"src":"/api/img/island-crystal-sea","alt":"Kristalno morje"},{"src":"/api/img/island-archipelago-panorama","alt":"Panorama arhipelaga"}]');
