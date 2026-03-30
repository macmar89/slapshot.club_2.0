-- SQL MIGRATION FOR CZECH EXTRALIGA (LEAGUE 10)

-- 1. Competition
INSERT INTO competitions (id, slug, sort_order, season_year, credit_cost, status, is_registration_open, start_date, end_date, api_hockey_id, api_hockey_season, created_at, updated_at) VALUES
('nlzjwt1i6kfxfygdhym9elwz', 'extraliga-2025', 100, 2025, 0, 'upcoming', false, '2025-09-09 00:00:00+00', '2026-03-31 23:59:59+00', '10', 2025, NOW(), NOW());

-- 2. Competition Locales
INSERT INTO competitions_locales (id, competition_id, name, description, locale) VALUES
('imj0r27z6p2s7ti48nh2ftqx', 'nlzjwt1i6kfxfygdhym9elwz', 'Česká Extraliga', '', 'sk'),
('h2tuuf0lu4injlzjgvk3lbit', 'nlzjwt1i6kfxfygdhym9elwz', 'Česká Extraliga', '', 'cs'),
('coaw6wq28utjgttscqrjdemf', 'nlzjwt1i6kfxfygdhym9elwz', 'Czech Extraliga', '', 'en');

-- 3. Assets (Logos)
INSERT INTO assets (id, key, alt, url, filename, mime_type, filesize, width, height, created_at, updated_at) VALUES
('mvn9xztnwwy52allgueztjsk', 'teams/team_124.png', 'Ceske Budejovice Logo', '/images/teams/team_124.png', 'team_124.png', 'image/png', 160087, NULL, NULL, NOW(), NOW()),
('a8t2na63fp3zbssl4mz0cvwx', 'teams/team_125.png', 'Karlovy Vary Logo', '/images/teams/team_125.png', 'team_125.png', 'image/png', 76557, NULL, NULL, NOW(), NOW()),
('i3hdbw26fqg038ucpha2apjp', 'teams/team_144.png', 'Kladno Logo', '/images/teams/team_144.png', 'team_144.png', 'image/png', 121022, NULL, NULL, NOW(), NOW()),
('fr6jlc9akqsds0xmgenpt2zw', 'teams/team_126.png', 'Kometa Brno Logo', '/images/teams/team_126.png', 'team_126.png', 'image/png', 152875, NULL, NULL, NOW(), NOW()),
('bdko8rnsnc9ri12q5m53tnch', 'teams/team_127.png', 'Liberec Logo', '/images/teams/team_127.png', 'team_127.png', 'image/png', 90381, NULL, NULL, NOW(), NOW()),
('qb6lbfxdagmzdr6rf0dmlf4a', 'teams/team_128.png', 'Litvinov Logo', '/images/teams/team_128.png', 'team_128.png', 'image/png', 90381, NULL, NULL, NOW(), NOW()),
('ph8ri4e5w612dvshxwmotgac', 'teams/team_129.png', 'Mlada Boleslav Logo', '/images/teams/team_129.png', 'team_129.png', 'image/png', 81357, NULL, NULL, NOW(), NOW()),
('vcp4psiaqnqb2g4ooyv1bl9v', 'teams/team_130.png', 'Mountfield HK Logo', '/images/teams/team_130.png', 'team_130.png', 'image/png', 95781, NULL, NULL, NOW(), NOW()),
('dyifvdkzvd4hreewhjapi13n', 'teams/team_131.png', 'Olomouc Logo', '/images/teams/team_131.png', 'team_131.png', 'image/png', 67545, NULL, NULL, NOW(), NOW()),
('tynnyv6rjw9128xp1ta3qrn0', 'teams/team_132.png', 'Pardubice Logo', '/images/teams/team_132.png', 'team_132.png', 'image/png', 90381, NULL, NULL, NOW(), NOW()),
('igvc8qyc7ci63re8eri6b2ip', 'teams/team_133.png', 'Plzen Logo', '/images/teams/team_133.png', 'team_133.png', 'image/png', 97581, NULL, NULL, NOW(), NOW()),
('h49d1b6fbo8649d9xvahu0nw', 'teams/team_134.png', 'Sparta Prague Logo', '/images/teams/team_134.png', 'team_134.png', 'image/png', 90381, NULL, NULL, NOW(), NOW()),
('c94nrjjpi50voen9mxjfgbbu', 'teams/team_135.png', 'Trinec Logo', '/images/teams/team_135.png', 'team_135.png', 'image/png', 90381, NULL, NULL, NOW(), NOW()),
('gc2oepuj0x38lb7sug3zhjdv', 'teams/team_136.png', 'Vitkovice Logo', '/images/teams/team_136.png', 'team_136.png', 'image/png', 90381, NULL, NULL, NOW(), NOW());

-- 4. Teams
INSERT INTO teams (id, slug, type, logo_id, colors_primary, colors_secondary, api_hockey_id, created_at, updated_at) VALUES
('sc6hvolm38slnor898a3me9b', 'ceske-budejovice', 'club', 'mvn9xztnwwy52allgueztjsk', '#000000', '#ffffff', '124', NOW(), NOW()),
('cbptd2x799vazea850rowo1v', 'karlovy-vary', 'club', 'a8t2na63fp3zbssl4mz0cvwx', '#000000', '#ffffff', '125', NOW(), NOW()),
('pz64iyn8tot36yysdvygtbfk', 'kladno', 'club', 'i3hdbw26fqg038ucpha2apjp', '#000000', '#ffffff', '144', NOW(), NOW()),
('a699h5yxcj0ilvq0v60w9jrt', 'kometa-brno', 'club', 'fr6jlc9akqsds0xmgenpt2zw', '#0000FF', '#FFFFFF', '126', NOW(), NOW()),
('hvadafjfc0x0jn62mswswf5l', 'liberec', 'club', 'bdko8rnsnc9ri12q5m53tnch', '#000000', '#ffffff', '127', NOW(), NOW()),
('r5mvvaqgmmlss8d5y6urd8dr', 'litvinov', 'club', 'qb6lbfxdagmzdr6rf0dmlf4a', '#000000', '#ffffff', '128', NOW(), NOW()),
('rjuo3cpcyl62c296nqqereua', 'mlada-boleslav', 'club', 'ph8ri4e5w612dvshxwmotgac', '#000000', '#ffffff', '129', NOW(), NOW()),
('q7gwi1isvcwc6iini0fa7kom', 'mountfield-hk', 'club', 'vcp4psiaqnqb2g4ooyv1bl9v', '#FF0000', '#FFFFFF', '130', NOW(), NOW()),
('uya4wr119rjndbo3b70f2mcr', 'olomouc', 'club', 'dyifvdkzvd4hreewhjapi13n', '#000000', '#ffffff', '131', NOW(), NOW()),
('q4q51860s7ne44lmpi11iv89', 'pardubice', 'club', 'tynnyv6rjw9128xp1ta3qrn0', '#000000', '#ffffff', '132', NOW(), NOW()),
('jeznleqi1zs5mppji0mn19ay', 'plzen', 'club', 'igvc8qyc7ci63re8eri6b2ip', '#000000', '#ffffff', '133', NOW(), NOW()),
('a3zz3nv4ljzszopjxhxekgxl', 'sparta-prague', 'club', 'h49d1b6fbo8649d9xvahu0nw', '#0000FF', '#FFFF00', '134', NOW(), NOW()),
('tgy1yn4jtvhxrhpiayonqgos', 'trinec', 'club', 'c94nrjjpi50voen9mxjfgbbu', '#FF0000', '#FFFFFF', '135', NOW(), NOW()),
('tn5i4it8c5lrtu0o5y3fh7mh', 'vitkovice', 'club', 'gc2oepuj0x38lb7sug3zhjdv', '#000000', '#ffffff', '136', NOW(), NOW());

-- 5. Team Locales
INSERT INTO teams_locales (id, parent_id, locale, name, short_name) VALUES
('wyelif2qeyk1zzt0hpjd0d9s', 'sc6hvolm38slnor898a3me9b', 'sk', 'Ceske Budejovice', 'CEB'),
('yg4hhsihgzefvgjdx2d5umn7', 'sc6hvolm38slnor898a3me9b', 'cs', 'Ceske Budejovice', 'CEB'),
('wlss4rbwuvis4p9jjneuk0m2', 'sc6hvolm38slnor898a3me9b', 'en', 'Ceske Budejovice', 'CEB'),
('bxwbqpji64vm73pk225bcoh7', 'cbptd2x799vazea850rowo1v', 'sk', 'Karlovy Vary', 'KVA'),
('i0qslob4xrx6r0dgozj8q8z2', 'cbptd2x799vazea850rowo1v', 'cs', 'Karlovy Vary', 'KVA'),
('dff09dxgv68qo42wwypod1ax', 'cbptd2x799vazea850rowo1v', 'en', 'Karlovy Vary', 'KVA'),
('a0l8rhl21kw5httd1xzmwr0f', 'pz64iyn8tot36yysdvygtbfk', 'sk', 'Kladno', 'KLA'),
('ztovesc78gnn6vjab1zatglz', 'pz64iyn8tot36yysdvygtbfk', 'cs', 'Kladno', 'KLA'),
('pwcw438kd41ndve6uqo66q6k', 'pz64iyn8tot36yysdvygtbfk', 'en', 'Kladno', 'KLA'),
('elum8v53dve094l09qqr65kx', 'a699h5yxcj0ilvq0v60w9jrt', 'sk', 'Kometa Brno', 'KOM'),
('kaj2x72jjqey9yad41i5ovof', 'a699h5yxcj0ilvq0v60w9jrt', 'cs', 'Kometa Brno', 'KOM'),
('w7cj2d95xtk7rxgn2h8qcfnt', 'a699h5yxcj0ilvq0v60w9jrt', 'en', 'Kometa Brno', 'KOM'),
('f6s77veoc1hlktm0dv2fso61', 'hvadafjfc0x0jn62mswswf5l', 'sk', 'Liberec', 'LIB'),
('gqmpb7ms6919vemlz5ngmyh6', 'hvadafjfc0x0jn62mswswf5l', 'cs', 'Liberec', 'LIB'),
('q69d3eo16srwjaqhnhr55210', 'hvadafjfc0x0jn62mswswf5l', 'en', 'Liberec', 'LIB'),
('j54cbq7yve78wpwpjpxxt2ff', 'r5mvvaqgmmlss8d5y6urd8dr', 'sk', 'Litvinov', 'LIT'),
('mde49aw72julo6bm8onvgrbn', 'r5mvvaqgmmlss8d5y6urd8dr', 'cs', 'Litvinov', 'LIT'),
('ni9s7wrkv1x62sjdhberdzh4', 'r5mvvaqgmmlss8d5y6urd8dr', 'en', 'Litvinov', 'LIT'),
('nzha0itg7fa9ez7qb3lg7ige', 'rjuo3cpcyl62c296nqqereua', 'sk', 'Mlada Boleslav', 'MBL'),
('cvxwyjab764lx43hhqdihl0f', 'rjuo3cpcyl62c296nqqereua', 'cs', 'Mlada Boleslav', 'MBL'),
('o6rnq147hcjwoh4d0oib6bj8', 'rjuo3cpcyl62c296nqqereua', 'en', 'Mlada Boleslav', 'MBL'),
('p4vak2gtoyhu61mgq47enwl1', 'q7gwi1isvcwc6iini0fa7kom', 'sk', 'Mountfield HK', 'MHK'),
('lc27mq0qomzrrh6e65hualnw', 'q7gwi1isvcwc6iini0fa7kom', 'cs', 'Mountfield HK', 'MHK'),
('ibpoz4pvo3nz0p7dnsb0bnr6', 'q7gwi1isvcwc6iini0fa7kom', 'en', 'Mountfield HK', 'MHK'),
('led3ktepgxsq8mij8jol6862', 'uya4wr119rjndbo3b70f2mcr', 'sk', 'Olomouc', 'OLO'),
('fm4qxmied6ak1ifb6yhf1c3r', 'uya4wr119rjndbo3b70f2mcr', 'cs', 'Olomouc', 'OLO'),
('n26s3r7m8iqga973i8vca6rk', 'uya4wr119rjndbo3b70f2mcr', 'en', 'Olomouc', 'OLO'),
('ule9jy0ucny1q5ymvki4yq1y', 'q4q51860s7ne44lmpi11iv89', 'sk', 'Pardubice', 'PCE'),
('ioltpqbxg5oe7j0utx3mghtf', 'q4q51860s7ne44lmpi11iv89', 'cs', 'Pardubice', 'PCE'),
('hkpkylr1ewjrhk4dpbarl6vj', 'q4q51860s7ne44lmpi11iv89', 'en', 'Pardubice', 'PCE'),
('urx5fdnqbpf6epa5zfi6kj3m', 'jeznleqi1zs5mppji0mn19ay', 'sk', 'Plzen', 'PLZ'),
('wpm1xyzsh3f5sh1j8szehraf', 'jeznleqi1zs5mppji0mn19ay', 'cs', 'Plzen', 'PLZ'),
('h3idccze2kyfet924x0rhu43', 'jeznleqi1zs5mppji0mn19ay', 'en', 'Plzen', 'PLZ'),
('i0f6xzu11mxt3uhq3k33t2mm', 'a3zz3nv4ljzszopjxhxekgxl', 'sk', 'Sparta Prague', 'SPA'),
('eml6gbb7u2uym3sfxrh2zimo', 'a3zz3nv4ljzszopjxhxekgxl', 'cs', 'Sparta Prague', 'SPA'),
('hv3ey4kb8oti5oejx925vfxz', 'a3zz3nv4ljzszopjxhxekgxl', 'en', 'Sparta Prague', 'SPA'),
('q9iemh2a0i7qhvthtsg5ki0o', 'tgy1yn4jtvhxrhpiayonqgos', 'sk', 'Trinec', 'TRI'),
('f66i01d5thi2zqn1o54cw65q', 'tgy1yn4jtvhxrhpiayonqgos', 'cs', 'Trinec', 'TRI'),
('j01hvlex5xs5ly7etnnjy4vc', 'tgy1yn4jtvhxrhpiayonqgos', 'en', 'Trinec', 'TRI'),
('e7sg549zsi59l6uoqa8xllfh', 'tn5i4it8c5lrtu0o5y3fh7mh', 'sk', 'Vitkovice', 'VIT'),
('dvefro4exonxczwi9n3pro3l', 'tn5i4it8c5lrtu0o5y3fh7mh', 'cs', 'Vitkovice', 'VIT'),
('ydzssirecpwp6d8a4phppn4n', 'tn5i4it8c5lrtu0o5y3fh7mh', 'en', 'Vitkovice', 'VIT');