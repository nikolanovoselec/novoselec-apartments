-- ============================================================
-- Editorial content restructure: 3-4 sections per page
-- Consolidates from ~42 sections to 23 across 6 pages
-- Croatian (hr) master locale — translations in separate file
-- ============================================================

-- Step 1: Delete old editorial entries for the 6 pages being restructured
-- Keep: about, homepage, impressum, privacy (not touched)
DELETE FROM ec_editorial WHERE page_key IN ('hrana', 'aktivnosti', 'plaze', 'zdrelac', 'dolazak', 'vodic');

-- Step 2: Delete old guide collection entries (vodic now uses editorial only)
DELETE FROM ec_guide;

-- ============================================================
-- HRANA (Food & Drink) — 4 sections
-- ============================================================

INSERT INTO ec_editorial (page_key, section_key, sort_order, locale, title, body, image, gallery) VALUES
('hrana', 'riba-s-gradela', 1, 'hr',
 'Riba s gradela i duh konobe',
 'Na ovim otocima riba ne dolazi iz hladnjaka — dolazi iz mora koje gledate dok jedete. Konoba Mureta u Pašmanu, Udica u Kukljici, Kiss kraj Neviđana: svaka ima svoju rivu, svoju priču i svoju hobotnicu ispod peke. Sjednete za kameni stol, naručite što su ribari donijeli jutros, i shvatite da je ovo razlog zašto ste došli.',
 '/api/img/food-grilled-fish',
 '[{"src":"/api/img/food-calamari-fries","alt":"Prženi lignji"},{"src":"/api/img/food-seafood-platter","alt":"Plato morskih plodova"},{"src":"/api/img/food-grilled-prawns","alt":"Škampi na žaru"}]');

INSERT INTO ec_editorial (page_key, section_key, sort_order, locale, title, body, image, gallery) VALUES
('hrana', 'maslinovo-ulje', 2, 'hr',
 'Maslinovo ulje — tekuće zlato Ugljana',
 'Ugljan nosi nadimak "Otok maslina" s razlogom: više od 200.000 stabala, tradicija duga dva tisućljeća i ulje koje se smatra najboljim u Hrvatskoj. Ovdje maslinovo ulje nije začin — ono je osnova svega. Prelijete ga preko svježe ribe, umočite kruh, dodajte na rajčicu s otoka. Posjetite obiteljske proizvođače i kušajte ulje ravno iz tijeska.',
 '/api/img/food-peka-fireplace',
 '[{"src":"/api/img/food-peka-embers","alt":"Peka na žeravi"},{"src":"/api/img/food-meat-buckwheat","alt":"Meso s heljdom"},{"src":"/api/img/food-steak-gnocchi","alt":"Odrezak s njokima"}]');

INSERT INTO ec_editorial (page_key, section_key, sort_order, locale, title, body, image, gallery) VALUES
('hrana', 'dalmatinski-ritual', 3, 'hr',
 'Obrok kao ritual, ne obaveza',
 'U Dalmaciji se ne jede — uživa se. Ručak traje dva sata, počinje s marinatom od inćuna i brudetom, prelazi u ribu s gradela, a završava s rogačem ili smokvama u medu. Između svakog zalogaja — more, razgovor, čaša pošipa. Ovdje nitko ne gleda na sat. More čeka, večer je duga, a stol se uvijek može produžiti.',
 '/api/img/food-sharing-platter',
 '[{"src":"/api/img/food-seafood-beer","alt":"Plodovi mora uz pivo"},{"src":"/api/img/food-fish-stew","alt":"Brudet"},{"src":"/api/img/food-beer-seaside","alt":"Pivo uz more"}]');

INSERT INTO ec_editorial (page_key, section_key, sort_order, locale, title, body, image, gallery) VALUES
('hrana', 'trznice-i-namirnice', 4, 'hr',
 'S tržnice na stol',
 'Najsvježiju ribu kupujete u zoru, ravno s barke u Kaliju — ribarskoj prijestolnici Jadrana. Na Ribarnici u Zadru birate između desetaka vrsta svježe ribe i školjki. Na otoku svako selo ima svoju malu trgovinu za osnovno, a za pravi šoping posjetite Zadar. I obavezno: sladoled u Hajduku u Kukljici. Svaki put.',
 '/api/img/food-octopus-tomatoes',
 '[{"src":"/api/img/food-pizza","alt":"Pizza"},{"src":"/api/img/food-ice-cream","alt":"Sladoled"},{"src":"/api/img/food-calamari-squid","alt":"Kalamari"}]');

-- ============================================================
-- AKTIVNOSTI (Nature & Activities) — 4 sections
-- ============================================================

INSERT INTO ec_editorial (page_key, section_key, sort_order, locale, title, body, image, gallery) VALUES
('aktivnosti', 'staze-i-vidikovci', 1, 'hr',
 'Staze koje vode do neba',
 'S vrha Velikog Bokolja (274 m) Pašman izgleda kao maketa posuta maslinicima, a Velebit se diže iza mora kao zid drugog svijeta. Uspon počinje iz Dobropoljane — makadamskim putem dostupnim pješice, biciklom ili autom. Na vrhu vas čeka kružni kameni vidikovac s panoramskim teleskopom i pogledom na Vransko jezero, Kornate i cijeli zadarski arhipelag. Za one koji traže povijest: pješačka staza do utvrde Pustograd iz 6. stoljeća vodi kroz srce otoka.',
 '/api/img/island-hilltop-panorama',
 '[{"src":"/api/img/island-hiking-trail","alt":"Pješačka staza"},{"src":"/api/img/island-hilltop-seaview","alt":"Pogled s vrha"},{"src":"/api/img/island-archipelago-panorama","alt":"Panorama arhipelaga"}]');

INSERT INTO ec_editorial (page_key, section_key, sort_order, locale, title, body, image, gallery) VALUES
('aktivnosti', 'biciklizam', 2, 'hr',
 'Dva otoka, dva kotača',
 'Most Ždrelac ima biciklističku stazu, što znači da s jednim biciklom možete obići i Pašman i Ugljan — 46 kilometara raznolikih terena, od obalnih cesta uz more do makadamskih puteva kroz maslinike. Lakša Staza 8 vodi kroz sva sela na otoku, zahtjevnija Staza 7 prolazi sredinom otoka. E-bike ture organizira ZZUUM, a najam bicikla na Ugljanu kreće od 10 EUR/dan s dostavom na adresu.',
 '/api/img/island-stone-arches',
 '[{"src":"/api/img/island-fortress-bay","alt":"Utvrda iznad uvale"},{"src":"/api/img/island-beach-entrance","alt":"Put do plaže"},{"src":"/api/img/island-sunset-coast","alt":"Zalazak na obali"}]');

INSERT INTO ec_editorial (page_key, section_key, sort_order, locale, title, body, image, gallery) VALUES
('aktivnosti', 'kornati-i-telascica', 3, 'hr',
 'Kornati i Telašćica — katedrala od stijena i mora',
 'Izleti polaze iz Tkona i Kukljice prema dvjema najljepšim destinacijama Jadrana. Nacionalni park Kornati — 89 otoka rasutih po moru kao trag nekog davnog diva — ostavlja bez daha i najiskusnije putnike. Park prirode Telašćica krije slano jezero Mir, strmoglave klifove visoke 161 metar i uvale u kojima se sidri pod zvijezdama. Jednodnevni izlet s ručkom na brodu kreće od 40-50 EUR.',
 '/api/img/island-blue-bay-sailboats',
 '[{"src":"/api/img/island-dramatic-sunset","alt":"Dramatični zalazak"},{"src":"/api/img/island-beach-cove","alt":"Uvala"},{"src":"/api/img/island-crystal-sea","alt":"Kristalno more"}]');

INSERT INTO ec_editorial (page_key, section_key, sort_order, locale, title, body, image, gallery) VALUES
('aktivnosti', 'more-i-voda', 4, 'hr',
 'Zagrljaj mora',
 'Pašman ima najčišće more u Jadranu — stalna izmjena morskih struja čuva ga kristalno prozirnim. Kajak vas vodi u uvale do kojih se ne može doći kopnom. SUP na mirnom jutarnjem moru, dok je površina staklena i sunce tek izlazi, jedan je od onih trenutaka koji se ne fotografiraju — samo osjećaju. Za ronjenje, podmorje oko otoka krije bogat život, od hobotnica u pukotinama kamena do jata šarenih riba u posidoniji.',
 '/api/img/island-beach-boats',
 '[{"src":"/api/img/island-sandy-beach","alt":"Pješčana plaža"},{"src":"/api/img/island-kids-beach","alt":"Djeca na plaži"},{"src":"/api/img/island-child-beach","alt":"Dijete u moru"}]');

-- ============================================================
-- PLAZE (Beaches) — 4 sections
-- ============================================================

INSERT INTO ec_editorial (page_key, section_key, sort_order, locale, title, body, image, gallery) VALUES
('plaze', 'zdrelac-kupanje', 1, 'hr',
 'Uvale Ždrelca — more ispred vrata',
 'Kupanje u Ždrelcu je spontano: ponesite ručnik, prešetajte pet minuta i uronite. Plaža Matlovac na sjeveru naselja je pješčana s blagim ulazom u more, beach barom i igralištem — savršena za obitelji s malom djecom. Uvala Soline čuva pijesak bogat mineralima za koji lokalni ribari kažu da liječi umorne zglobove. A borova šuma u centru sela daje mikroklimu koja miješa miris mora i smole.',
 '/api/img/island-family-beach',
 '[{"src":"/api/img/island-wide-beach","alt":"Široka plaža"},{"src":"/api/img/island-kids-beach","alt":"Djeca na plaži"},{"src":"/api/img/island-beach-cove","alt":"Uvala"}]');

INSERT INTO ec_editorial (page_key, section_key, sort_order, locale, title, body, image, gallery) VALUES
('plaze', 'pasman-plaze', 2, 'hr',
 'Pješčane plaže Pašmana',
 'Cijelom dužinom otoka nižu se pješčane uvale okružene tamarisom i borovinom. Banj, samo par kilometara od Ždrelca, ima plitku vodu i fini pijesak idealan za najmlađe kupače. Lokva u Neviđanama nudi hlad stoljetnog tamarisa i bezbrižnu igru na pijesku. Mrljane se protežu dugom plažom s pogledom na srcoliki Galešnjak — jedini prirodno nastali otok u obliku srca na svijetu.',
 '/api/img/island-sandy-beach',
 '[{"src":"/api/img/island-child-beach","alt":"Dijete na plaži"},{"src":"/api/img/island-beach-entrance","alt":"Put do plaže"},{"src":"/api/img/island-crystal-sea","alt":"Kristalno more"}]');

INSERT INTO ec_editorial (page_key, section_key, sort_order, locale, title, body, image, gallery) VALUES
('plaze', 'ugljan-plaze', 3, 'hr',
 'S Ugljana do tirkiznog',
 'Prijeđite most i otvara se nova obala. Jaz u Preku nosi Plavu zastavu i nudi sve — od suncobrana i ležaljki do tobogana za djecu i odbojke na pijesku. Sabuša u Kukljici, pješčana s pogledom na Dugi Otok, skrivena je petnaest minuta hoda od centra. Mostir u selu Ugljan mami na snorkeling u kristalno čistoj vodi.',
 '/api/img/island-beach-boats',
 '[{"src":"/api/img/island-blue-bay-sailboats","alt":"Jedrilice u uvali"},{"src":"/api/img/island-marina","alt":"Marina"},{"src":"/api/img/island-village-harbor","alt":"Luka sela"}]');

INSERT INTO ec_editorial (page_key, section_key, sort_order, locale, title, body, image, gallery) VALUES
('plaze', 'skrivene-uvale', 4, 'hr',
 'Tajne za one koji traže',
 'Najbolje uvale nemaju ime na Google Maps. Do nekih se dolazi kajakom, do drugih kroz maslinike kojima nitko ne hoda. Južna strana Pašmana je divlja i klifovita — tu more udara u stijene i stvara bazene od tirkiza koji su samo vaši. Prtljug u Lukoranu je šljunčana uvala duga svega 40 metara, bez sadržaja, bez ljudi, bez svega osim mora. Pitajte nas za tajne koordinate.',
 '/api/img/island-dramatic-sunset',
 '[{"src":"/api/img/island-hilltop-seaview","alt":"Pogled na more"},{"src":"/api/img/island-archipelago-panorama","alt":"Panorama arhipelaga"},{"src":"/api/img/island-sunset-coast","alt":"Zalazak na obali"}]');

-- ============================================================
-- ZDRELAC (About the Village) — 4 sections
-- ============================================================

INSERT INTO ec_editorial (page_key, section_key, sort_order, locale, title, body, image, gallery) VALUES
('zdrelac', 'most-i-prolaz', 1, 'hr',
 'Most između dva svijeta',
 'Most Ždrelac je jedini kopneni prijelaz između Pašmana i Ugljana — lučni most dug 210 metara, obnovljen 2009. godine čeličnim lukom raspona 68 metara. Ispod njega, kroz Ždrilo, svakodnevno prolaze stotine brodova. Navečer, kada se sunce spusti iza zadarskog arhipelaga i oboji nebo u ružičasto i narančasto, pogled s mosta je jedan od onih trenutaka zbog kojih se vraćate na otok.',
 '/api/img/island-zdrelac-harbor',
 '[{"src":"/api/img/island-village-harbor","alt":"Luka Ždrelac"},{"src":"/api/img/island-dramatic-sunset","alt":"Zalazak sunca"}]');

INSERT INTO ec_editorial (page_key, section_key, sort_order, locale, title, body, image, gallery) VALUES
('zdrelac', 'selo-i-dusa', 2, 'hr',
 'Selo kamena i soli',
 'Ždrelac je najveće naselje na Pašmanu, ali osjeća se kao da vrijeme ovdje teče sporije. Stari kameni centar s uskim ulicama i tradicionalnom dalmatinskom arhitekturom čuva duh otoka. Crkva sv. Luke iz 13. stoljeća stoji u samom srcu sela, a mala luka u centru i dalje služi ribarima koji izlaze prije zore. Ovdje se susjedi pozdravljaju imenom, djeca se kupaju do mraka, a lavanda i ružmarin rastu iz pukotina kamena.',
 '/api/img/island-pine-chapel',
 '[{"src":"/api/img/island-stone-arches","alt":"Kameni lukovi"},{"src":"/api/img/island-fortress-bay","alt":"Utvrda nad uvalom"}]');

INSERT INTO ec_editorial (page_key, section_key, sort_order, locale, title, body, image, gallery) VALUES
('zdrelac', 'ribari-i-more', 3, 'hr',
 'Ljudi od mora',
 'Ždrelac je oduvijek bio selo ribara. Noću izlaze na Ždrilo i zadarski kanal s lampama za lov na lignje, a ujutro se vraćaju s ulovom koji završi na gradeli ili u brodetu. Ribarska kultura ovdje nije turistička atrakcija — to je način života koji se prenosi s koljena na koljeno. U luci možete kupiti ribu ravno s barke, a miris gradele koji se u sumrak širi selom bolji je od bilo kojeg restoranskog jelovnika.',
 '/api/img/island-beach-boats',
 '[{"src":"/api/img/island-marina","alt":"Marina"},{"src":"/api/img/island-sunset-coast","alt":"Zalazak na obali"}]');

INSERT INTO ec_editorial (page_key, section_key, sort_order, locale, title, body, image, gallery) VALUES
('zdrelac', 'maslinici-i-staze', 4, 'hr',
 'Maslinici, borovi i put do mora',
 'Iza sela počinje drugi Ždrelac: maslinici koji se penju uz brežuljke, borova šuma s mirisom smole i staze koje vode do skrivenih uvala. Rekreacijsko-edukativna staza od 13 kilometara spaja vrh Bokolja s uvalom Soline, prolazeći kroz autohtonu mediteransku vegetaciju. Svaki korak nudi novu perspektivu — pogled na more s jedne strane, maslinike s druge, i tišinu koja se na kopnu ne može čuti.',
 '/api/img/island-hiking-trail',
 '[{"src":"/api/img/island-hilltop-panorama","alt":"Panorama s brda"},{"src":"/api/img/island-hilltop-seaview","alt":"Pogled na more s vrha"}]');

-- ============================================================
-- DOLAZAK (Getting Here) — 3 sections
-- ============================================================

INSERT INTO ec_editorial (page_key, section_key, sort_order, locale, title, body, image, gallery) VALUES
('dolazak', 'autom-i-trajektom', 1, 'hr',
 'Autom do mora — dva trajekta, jedan put',
 'Do Ždrelca vode dva puta. Klasična ruta: autocestom A1 do Biograda na Moru, pa Jadrolinija trajektom do Tkona (25 minuta, polasci svakih 1-2 sata). Iz Tkona vozite 15 km preko cijelog otoka do Ždrelca. Alternativna ruta: autocestom do Zadra, trajektom Zadar-Preko na Ugljanu (25 minuta, česti polasci), pa 15 km preko Ugljana i mosta Ždrelac ravno do nas. Obje rute traju jednako — birajte onu s boljim rasporedom trajekta.',
 '/api/img/island-jadrolinija-ferry',
 '[{"src":"/api/img/island-village-harbor","alt":"Luka"},{"src":"/api/img/island-zdrelac-harbor","alt":"Ždrelac"}]');

INSERT INTO ec_editorial (page_key, section_key, sort_order, locale, title, body, image, gallery) VALUES
('dolazak', 'bez-auta', 2, 'hr',
 'Bez auta — sloboda na otoku',
 'Ne treba vam auto. Iz <a href="https://www.zadar-airport.com" target="_blank" rel="noopener">Zračne luke Zadar</a> (ZAD) do grada je 15 minuta autobusom ili taksijem. Iz Zadra trajekt za Preko polazi svaki sat, a s Preka do mosta Ždrelac je 15 km — lokalni autobus ili dogovoreni prijevoz vas dovede do vrata. Na otoku najam bicikla kreće od 10 EUR/dan s dostavom na adresu.',
 '/api/img/island-beach-entrance',
 '[{"src":"/api/img/island-sandy-beach","alt":"Pješčana plaža"},{"src":"/api/img/island-family-beach","alt":"Obiteljska plaža"}]');

INSERT INTO ec_editorial (page_key, section_key, sort_order, locale, title, body, image, gallery) VALUES
('dolazak', 'savjeti-za-put', 3, 'hr',
 'Prije nego krenete',
 'Raspored trajekta provjerite na <a href="https://www.jadrolinija.hr" target="_blank" rel="noopener">jadrolinija.hr</a> — ljeti su polasci češći, ali vikendima i blagdanima trajekti mogu biti puni pa je pametno doći ranije. Parkiralište na terminalu u Biogradu je prostrano i povoljno. Most Ždrelac je besplatan i otvoren 0-24. Po dolasku u apartman, skinite cipele, otvorite prozor, udahnite — miris soli, borova i lavande reći će vam da ste stigli.',
 '/api/img/island-wide-beach',
 '[{"src":"/api/img/island-crystal-sea","alt":"Kristalno more"},{"src":"/api/img/island-archipelago-panorama","alt":"Panorama arhipelaga"}]');

-- ============================================================
-- VODIC (Island Guide) — 4 sections
-- ============================================================

INSERT INTO ec_editorial (page_key, section_key, sort_order, locale, title, body, image, gallery) VALUES
('vodic', 'pasman-sela', 1, 'hr',
 'Pašman — deset sela, jedna duša',
 'Pašman ima najveću zelenu površinu u cijelom hrvatskom arhipelagu — deset sela raspoređenih duž 60 km otoka, svako s vlastitim karakterom. Ždrelac na vrhu čuva ribarski duh, Dobropoljana leži u podnožju Bokolja s najljepšim zalascima sunca, Neviđane kriju kameni kip sv. Mihovila iz 12. stoljeća. U Tkonu, trajektnoj luci, benediktinski samostan na Ćokovcu živi neprekidno od 1129. godine — jedini aktivni muški benediktinski samostan u Hrvatskoj. Kraj na jugu čuva franjevački samostan sv. Dujma s renesansnim klaustrom.',
 '/api/img/island-hilltop-panorama',
 '[{"src":"/api/img/island-village-harbor","alt":"Luka sela"},{"src":"/api/img/island-pine-chapel","alt":"Kapelica u borovima"},{"src":"/api/img/island-family-beach","alt":"Obiteljska plaža"},{"src":"/api/img/island-sunset-coast","alt":"Zalazak na obali"}]');

INSERT INTO ec_editorial (page_key, section_key, sort_order, locale, title, body, image, gallery) VALUES
('vodic', 'ugljan-sela', 2, 'hr',
 'Ugljan — zeleni otok maslina',
 'Ugljan, spojen s Pašmanom mostom kod Ždrelca, nosi nadimak "Zeleni otok" — više od 200.000 stabala maslina i tradicija duga dva tisućljeća. Preko je administrativni centar s romantičnom rivom i trajektom za Zadar (25 minuta). Iznad Preka, na 265 metara, Tvrđava sv. Mihovila nudi pogled od kojeg zastaje dah. Kali je ribarska prijestolnica s festivalom ribara pod punim mjesecom. Kukljica je gastro centar s Konobom Udica i najljepšim plažama.',
 '/api/img/island-fortress-bay',
 '[{"src":"/api/img/island-stone-arches","alt":"Kameni lukovi"},{"src":"/api/img/island-beach-boats","alt":"Plaža s brodovima"},{"src":"/api/img/island-marina","alt":"Marina"},{"src":"/api/img/island-beach-cove","alt":"Uvala"}]');

INSERT INTO ec_editorial (page_key, section_key, sort_order, locale, title, body, image, gallery) VALUES
('vodic', 'zadar', 3, 'hr',
 'Zadar — grad koji svira moru',
 'Trajektom iz Preka (25 minuta) stižete u grad koji je Alfred Hitchcock 1964. proglasio mjestom najljepšeg zalaska sunca na svijetu. Na zadarskoj rivi, Morske orgulje arhitekta Nikole Bašića pretvaraju valove u glazbu — mramorne stepenice silaze u more, a svaki val pritisne zračne komore koje proizvode nezemaljske zvukove. Tik do njih, Pozdrav Suncu — stakleni krug od 22 metra — noću pretvara energiju sunca u hipnotičku svjetlosnu predstavu. Stari grad, opasan rimskim zidinama, krije Rimski forum, crkvu sv. Donata iz 9. stoljeća i katedralu sv. Stošije.',
 '/api/img/zadar-colorful-rooftops',
 '[{"src":"/api/img/zadar-riva-promenade","alt":"Zadarska riva"},{"src":"/api/img/zadar-old-town-street","alt":"Ulica starog grada"},{"src":"/api/img/zadar-harbor-panorama","alt":"Panorama luke"},{"src":"/api/img/zadar-bell-tower","alt":"Zvonik"}]');

INSERT INTO ec_editorial (page_key, section_key, sort_order, locale, title, body, image, gallery) VALUES
('vodic', 'izleti-s-otoka', 4, 'hr',
 'Jednodnevni izleti — Kornati, Telašćica, Vransko jezero',
 'S Pašmana i Ugljana polaze izleti koji otkrivaju divlju stranu Jadrana. Nacionalni park Kornati — 89 otoka rasutih po moru poput kozmičkog niza — dostupan je jednodnevnim izletom iz Tkona ili Kukljice (od 40-50 EUR s ručkom na brodu). Park prirode Telašćica krije slano jezero Mir i klifove visoke 161 metar. Na kopnu, Vransko jezero — najveće prirodno jezero u Hrvatskoj — raj je za promatrače ptica i bicikliste.',
 '/api/img/island-blue-bay-sailboats',
 '[{"src":"/api/img/island-dramatic-sunset","alt":"Zalazak sunca"},{"src":"/api/img/island-crystal-sea","alt":"Kristalno more"},{"src":"/api/img/island-archipelago-panorama","alt":"Panorama arhipelaga"}]');
