-- Script untuk seed data lokasi wilayah Jawa Barat
-- Struktur: Provinsi > Kabupaten/Kota > Kecamatan

-- ============================================================
-- PROVINSI
-- ============================================================
INSERT INTO locations (code, name, level, parent_id) VALUES ('32', 'Jawa Barat', 'provinsi', NULL);

-- ============================================================
-- KABUPATEN/KOTA (27 wilayah)
-- ============================================================
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-01', 'Kab. Bogor', 'kabupaten_kota', (SELECT id FROM locations WHERE code = '32'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-02', 'Kab. Sukabumi', 'kabupaten_kota', (SELECT id FROM locations WHERE code = '32'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-03', 'Kab. Cianjur', 'kabupaten_kota', (SELECT id FROM locations WHERE code = '32'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-04', 'Kab. Bandung', 'kabupaten_kota', (SELECT id FROM locations WHERE code = '32'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-05', 'Kab. Garut', 'kabupaten_kota', (SELECT id FROM locations WHERE code = '32'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-06', 'Kab. Tasikmalaya', 'kabupaten_kota', (SELECT id FROM locations WHERE code = '32'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-07', 'Kab. Ciamis', 'kabupaten_kota', (SELECT id FROM locations WHERE code = '32'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-08', 'Kab. Kuningan', 'kabupaten_kota', (SELECT id FROM locations WHERE code = '32'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-09', 'Kab. Cirebon', 'kabupaten_kota', (SELECT id FROM locations WHERE code = '32'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-10', 'Kab. Majalengka', 'kabupaten_kota', (SELECT id FROM locations WHERE code = '32'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-11', 'Kab. Sumedang', 'kabupaten_kota', (SELECT id FROM locations WHERE code = '32'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-12', 'Kab. Indramayu', 'kabupaten_kota', (SELECT id FROM locations WHERE code = '32'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-13', 'Kab. Subang', 'kabupaten_kota', (SELECT id FROM locations WHERE code = '32'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-14', 'Kab. Purwakarta', 'kabupaten_kota', (SELECT id FROM locations WHERE code = '32'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-15', 'Kab. Karawang', 'kabupaten_kota', (SELECT id FROM locations WHERE code = '32'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-16', 'Kab. Bekasi', 'kabupaten_kota', (SELECT id FROM locations WHERE code = '32'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-17', 'Kab. Bandung Barat', 'kabupaten_kota', (SELECT id FROM locations WHERE code = '32'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-18', 'Kab. Pangandaran', 'kabupaten_kota', (SELECT id FROM locations WHERE code = '32'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-71', 'Kota Bogor', 'kabupaten_kota', (SELECT id FROM locations WHERE code = '32'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-72', 'Kota Sukabumi', 'kabupaten_kota', (SELECT id FROM locations WHERE code = '32'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-73', 'Kota Bandung', 'kabupaten_kota', (SELECT id FROM locations WHERE code = '32'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-74', 'Kota Cirebon', 'kabupaten_kota', (SELECT id FROM locations WHERE code = '32'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-75', 'Kota Bekasi', 'kabupaten_kota', (SELECT id FROM locations WHERE code = '32'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-76', 'Kota Depok', 'kabupaten_kota', (SELECT id FROM locations WHERE code = '32'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-77', 'Kota Cimahi', 'kabupaten_kota', (SELECT id FROM locations WHERE code = '32'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-78', 'Kota Tasikmalaya', 'kabupaten_kota', (SELECT id FROM locations WHERE code = '32'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-79', 'Kota Banjar', 'kabupaten_kota', (SELECT id FROM locations WHERE code = '32'));

-- ============================================================
-- KECAMATAN - Kab. Bogor (40 kecamatan)
-- ============================================================
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-01-010', 'Nanggung', 'kecamatan', (SELECT id FROM locations WHERE code = '32-01'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-01-020', 'Leuwiliang', 'kecamatan', (SELECT id FROM locations WHERE code = '32-01'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-01-021', 'Leuwisadeng', 'kecamatan', (SELECT id FROM locations WHERE code = '32-01'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-01-030', 'Pamijahan', 'kecamatan', (SELECT id FROM locations WHERE code = '32-01'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-01-040', 'Cibungbulang', 'kecamatan', (SELECT id FROM locations WHERE code = '32-01'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-01-050', 'Ciampea', 'kecamatan', (SELECT id FROM locations WHERE code = '32-01'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-01-051', 'Tenjolaya', 'kecamatan', (SELECT id FROM locations WHERE code = '32-01'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-01-060', 'Dramaga', 'kecamatan', (SELECT id FROM locations WHERE code = '32-01'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-01-070', 'Ciomas', 'kecamatan', (SELECT id FROM locations WHERE code = '32-01'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-01-071', 'Tamansari', 'kecamatan', (SELECT id FROM locations WHERE code = '32-01'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-01-080', 'Cijeruk', 'kecamatan', (SELECT id FROM locations WHERE code = '32-01'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-01-081', 'Cigombong', 'kecamatan', (SELECT id FROM locations WHERE code = '32-01'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-01-090', 'Caringin', 'kecamatan', (SELECT id FROM locations WHERE code = '32-01'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-01-100', 'Ciawi', 'kecamatan', (SELECT id FROM locations WHERE code = '32-01'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-01-110', 'Cisarua', 'kecamatan', (SELECT id FROM locations WHERE code = '32-01'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-01-120', 'Megamendung', 'kecamatan', (SELECT id FROM locations WHERE code = '32-01'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-01-130', 'Sukaraja', 'kecamatan', (SELECT id FROM locations WHERE code = '32-01'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-01-140', 'Babakan Madang', 'kecamatan', (SELECT id FROM locations WHERE code = '32-01'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-01-150', 'Sukamakmur', 'kecamatan', (SELECT id FROM locations WHERE code = '32-01'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-01-160', 'Cariu', 'kecamatan', (SELECT id FROM locations WHERE code = '32-01'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-01-161', 'Tanjungsari', 'kecamatan', (SELECT id FROM locations WHERE code = '32-01'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-01-170', 'Jonggol', 'kecamatan', (SELECT id FROM locations WHERE code = '32-01'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-01-180', 'Cileungsi', 'kecamatan', (SELECT id FROM locations WHERE code = '32-01'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-01-181', 'Klapanunggal', 'kecamatan', (SELECT id FROM locations WHERE code = '32-01'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-01-190', 'Gunung Putri', 'kecamatan', (SELECT id FROM locations WHERE code = '32-01'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-01-200', 'Citeureup', 'kecamatan', (SELECT id FROM locations WHERE code = '32-01'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-01-210', 'Cibinong', 'kecamatan', (SELECT id FROM locations WHERE code = '32-01'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-01-220', 'Bojong Gede', 'kecamatan', (SELECT id FROM locations WHERE code = '32-01'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-01-221', 'Tajur Halang', 'kecamatan', (SELECT id FROM locations WHERE code = '32-01'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-01-230', 'Kemang', 'kecamatan', (SELECT id FROM locations WHERE code = '32-01'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-01-231', 'Rancabungur', 'kecamatan', (SELECT id FROM locations WHERE code = '32-01'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-01-240', 'Parung', 'kecamatan', (SELECT id FROM locations WHERE code = '32-01'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-01-241', 'Ciseeng', 'kecamatan', (SELECT id FROM locations WHERE code = '32-01'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-01-250', 'Gunung Sindur', 'kecamatan', (SELECT id FROM locations WHERE code = '32-01'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-01-260', 'Rumpin', 'kecamatan', (SELECT id FROM locations WHERE code = '32-01'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-01-270', 'Cigudeg', 'kecamatan', (SELECT id FROM locations WHERE code = '32-01'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-01-271', 'Sukajaya', 'kecamatan', (SELECT id FROM locations WHERE code = '32-01'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-01-280', 'Jasinga', 'kecamatan', (SELECT id FROM locations WHERE code = '32-01'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-01-290', 'Tenjo', 'kecamatan', (SELECT id FROM locations WHERE code = '32-01'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-01-300', 'Parung Panjang', 'kecamatan', (SELECT id FROM locations WHERE code = '32-01'));

-- ============================================================
-- KECAMATAN - Kab. Sukabumi (47 kecamatan)
-- ============================================================
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-02-010', 'Ciemas', 'kecamatan', (SELECT id FROM locations WHERE code = '32-02'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-02-020', 'Ciracap', 'kecamatan', (SELECT id FROM locations WHERE code = '32-02'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-02-021', 'Waluran', 'kecamatan', (SELECT id FROM locations WHERE code = '32-02'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-02-030', 'Surade', 'kecamatan', (SELECT id FROM locations WHERE code = '32-02'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-02-031', 'Cibitung', 'kecamatan', (SELECT id FROM locations WHERE code = '32-02'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-02-040', 'Jampang Kulon', 'kecamatan', (SELECT id FROM locations WHERE code = '32-02'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-02-041', 'Cimanggu', 'kecamatan', (SELECT id FROM locations WHERE code = '32-02'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-02-050', 'Kali Bunder', 'kecamatan', (SELECT id FROM locations WHERE code = '32-02'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-02-060', 'Tegal Buleud', 'kecamatan', (SELECT id FROM locations WHERE code = '32-02'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-02-070', 'Cidolog', 'kecamatan', (SELECT id FROM locations WHERE code = '32-02'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-02-080', 'Sagaranten', 'kecamatan', (SELECT id FROM locations WHERE code = '32-02'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-02-081', 'Cidadap', 'kecamatan', (SELECT id FROM locations WHERE code = '32-02'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-02-082', 'Curugkembar', 'kecamatan', (SELECT id FROM locations WHERE code = '32-02'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-02-090', 'Pabuaran', 'kecamatan', (SELECT id FROM locations WHERE code = '32-02'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-02-100', 'Lengkong', 'kecamatan', (SELECT id FROM locations WHERE code = '32-02'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-02-110', 'Palabuhanratu', 'kecamatan', (SELECT id FROM locations WHERE code = '32-02'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-02-111', 'Simpenan', 'kecamatan', (SELECT id FROM locations WHERE code = '32-02'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-02-120', 'Warung Kiara', 'kecamatan', (SELECT id FROM locations WHERE code = '32-02'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-02-121', 'Bantargadung', 'kecamatan', (SELECT id FROM locations WHERE code = '32-02'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-02-130', 'Jampang Tengah', 'kecamatan', (SELECT id FROM locations WHERE code = '32-02'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-02-131', 'Purabaya', 'kecamatan', (SELECT id FROM locations WHERE code = '32-02'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-02-140', 'Cikembar', 'kecamatan', (SELECT id FROM locations WHERE code = '32-02'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-02-150', 'Nyalindung', 'kecamatan', (SELECT id FROM locations WHERE code = '32-02'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-02-160', 'Geger Bitung', 'kecamatan', (SELECT id FROM locations WHERE code = '32-02'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-02-170', 'Sukaraja', 'kecamatan', (SELECT id FROM locations WHERE code = '32-02'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-02-171', 'Kebonpedes', 'kecamatan', (SELECT id FROM locations WHERE code = '32-02'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-02-172', 'Cireunghas', 'kecamatan', (SELECT id FROM locations WHERE code = '32-02'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-02-173', 'Sukalarang', 'kecamatan', (SELECT id FROM locations WHERE code = '32-02'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-02-180', 'Sukabumi', 'kecamatan', (SELECT id FROM locations WHERE code = '32-02'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-02-190', 'Kadudampit', 'kecamatan', (SELECT id FROM locations WHERE code = '32-02'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-02-200', 'Cisaat', 'kecamatan', (SELECT id FROM locations WHERE code = '32-02'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-02-201', 'Gunungguruh', 'kecamatan', (SELECT id FROM locations WHERE code = '32-02'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-02-210', 'Cibadak', 'kecamatan', (SELECT id FROM locations WHERE code = '32-02'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-02-211', 'Cicantayan', 'kecamatan', (SELECT id FROM locations WHERE code = '32-02'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-02-212', 'Caringin', 'kecamatan', (SELECT id FROM locations WHERE code = '32-02'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-02-220', 'Nagrak', 'kecamatan', (SELECT id FROM locations WHERE code = '32-02'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-02-221', 'Ciambar', 'kecamatan', (SELECT id FROM locations WHERE code = '32-02'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-02-230', 'Cicurug', 'kecamatan', (SELECT id FROM locations WHERE code = '32-02'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-02-240', 'Cidahu', 'kecamatan', (SELECT id FROM locations WHERE code = '32-02'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-02-250', 'Parakan Salak', 'kecamatan', (SELECT id FROM locations WHERE code = '32-02'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-02-260', 'Parung Kuda', 'kecamatan', (SELECT id FROM locations WHERE code = '32-02'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-02-261', 'Bojong Genteng', 'kecamatan', (SELECT id FROM locations WHERE code = '32-02'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-02-270', 'Kalapa Nunggal', 'kecamatan', (SELECT id FROM locations WHERE code = '32-02'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-02-280', 'Cikidang', 'kecamatan', (SELECT id FROM locations WHERE code = '32-02'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-02-290', 'Cisolok', 'kecamatan', (SELECT id FROM locations WHERE code = '32-02'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-02-291', 'Cikakak', 'kecamatan', (SELECT id FROM locations WHERE code = '32-02'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-02-300', 'Kabandungan', 'kecamatan', (SELECT id FROM locations WHERE code = '32-02'));

-- ============================================================
-- KECAMATAN - Kab. Cianjur (32 kecamatan)
-- ============================================================
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-03-010', 'Agrabinta', 'kecamatan', (SELECT id FROM locations WHERE code = '32-03'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-03-011', 'Leles', 'kecamatan', (SELECT id FROM locations WHERE code = '32-03'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-03-020', 'Sindangbarang', 'kecamatan', (SELECT id FROM locations WHERE code = '32-03'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-03-030', 'Cidaun', 'kecamatan', (SELECT id FROM locations WHERE code = '32-03'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-03-040', 'Naringgul', 'kecamatan', (SELECT id FROM locations WHERE code = '32-03'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-03-050', 'Cibinong', 'kecamatan', (SELECT id FROM locations WHERE code = '32-03'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-03-051', 'Cikadu', 'kecamatan', (SELECT id FROM locations WHERE code = '32-03'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-03-060', 'Tanggeung', 'kecamatan', (SELECT id FROM locations WHERE code = '32-03'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-03-061', 'Pasirkuda', 'kecamatan', (SELECT id FROM locations WHERE code = '32-03'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-03-070', 'Kadupandak', 'kecamatan', (SELECT id FROM locations WHERE code = '32-03'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-03-071', 'Cijati', 'kecamatan', (SELECT id FROM locations WHERE code = '32-03'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-03-080', 'Takokak', 'kecamatan', (SELECT id FROM locations WHERE code = '32-03'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-03-090', 'Sukanagara', 'kecamatan', (SELECT id FROM locations WHERE code = '32-03'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-03-100', 'Pagelaran', 'kecamatan', (SELECT id FROM locations WHERE code = '32-03'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-03-110', 'Campaka', 'kecamatan', (SELECT id FROM locations WHERE code = '32-03'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-03-111', 'Campakamulya', 'kecamatan', (SELECT id FROM locations WHERE code = '32-03'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-03-120', 'Cibeber', 'kecamatan', (SELECT id FROM locations WHERE code = '32-03'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-03-130', 'Warungkondang', 'kecamatan', (SELECT id FROM locations WHERE code = '32-03'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-03-131', 'Gekbrong', 'kecamatan', (SELECT id FROM locations WHERE code = '32-03'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-03-140', 'Cilaku', 'kecamatan', (SELECT id FROM locations WHERE code = '32-03'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-03-150', 'Sukaluyu', 'kecamatan', (SELECT id FROM locations WHERE code = '32-03'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-03-160', 'Bojongpicung', 'kecamatan', (SELECT id FROM locations WHERE code = '32-03'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-03-161', 'Haurwangi', 'kecamatan', (SELECT id FROM locations WHERE code = '32-03'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-03-170', 'Ciranjang', 'kecamatan', (SELECT id FROM locations WHERE code = '32-03'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-03-180', 'Mande', 'kecamatan', (SELECT id FROM locations WHERE code = '32-03'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-03-190', 'Karangtengah', 'kecamatan', (SELECT id FROM locations WHERE code = '32-03'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-03-200', 'Cianjur', 'kecamatan', (SELECT id FROM locations WHERE code = '32-03'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-03-210', 'Cugenang', 'kecamatan', (SELECT id FROM locations WHERE code = '32-03'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-03-220', 'Pacet', 'kecamatan', (SELECT id FROM locations WHERE code = '32-03'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-03-221', 'Cipanas', 'kecamatan', (SELECT id FROM locations WHERE code = '32-03'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-03-230', 'Sukaresmi', 'kecamatan', (SELECT id FROM locations WHERE code = '32-03'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-03-240', 'Cikalongkulon', 'kecamatan', (SELECT id FROM locations WHERE code = '32-03'));

-- ============================================================
-- KECAMATAN - Kab. Bandung (31 kecamatan)
-- ============================================================
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-04-010', 'Ciwidey', 'kecamatan', (SELECT id FROM locations WHERE code = '32-04'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-04-011', 'Rancabali', 'kecamatan', (SELECT id FROM locations WHERE code = '32-04'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-04-020', 'Pasirjambu', 'kecamatan', (SELECT id FROM locations WHERE code = '32-04'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-04-030', 'Cimaung', 'kecamatan', (SELECT id FROM locations WHERE code = '32-04'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-04-040', 'Pangalengan', 'kecamatan', (SELECT id FROM locations WHERE code = '32-04'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-04-050', 'Kertasari', 'kecamatan', (SELECT id FROM locations WHERE code = '32-04'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-04-060', 'Pacet', 'kecamatan', (SELECT id FROM locations WHERE code = '32-04'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-04-070', 'Ibun', 'kecamatan', (SELECT id FROM locations WHERE code = '32-04'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-04-080', 'Paseh', 'kecamatan', (SELECT id FROM locations WHERE code = '32-04'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-04-090', 'Cikancung', 'kecamatan', (SELECT id FROM locations WHERE code = '32-04'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-04-100', 'Cicalengka', 'kecamatan', (SELECT id FROM locations WHERE code = '32-04'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-04-101', 'Nagreg', 'kecamatan', (SELECT id FROM locations WHERE code = '32-04'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-04-110', 'Rancaekek', 'kecamatan', (SELECT id FROM locations WHERE code = '32-04'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-04-120', 'Majalaya', 'kecamatan', (SELECT id FROM locations WHERE code = '32-04'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-04-121', 'Solokan Jeruk', 'kecamatan', (SELECT id FROM locations WHERE code = '32-04'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-04-130', 'Ciparay', 'kecamatan', (SELECT id FROM locations WHERE code = '32-04'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-04-140', 'Baleendah', 'kecamatan', (SELECT id FROM locations WHERE code = '32-04'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-04-150', 'Arjasari', 'kecamatan', (SELECT id FROM locations WHERE code = '32-04'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-04-160', 'Banjaran', 'kecamatan', (SELECT id FROM locations WHERE code = '32-04'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-04-161', 'Cangkuang', 'kecamatan', (SELECT id FROM locations WHERE code = '32-04'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-04-170', 'Pameungpeuk', 'kecamatan', (SELECT id FROM locations WHERE code = '32-04'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-04-180', 'Katapang', 'kecamatan', (SELECT id FROM locations WHERE code = '32-04'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-04-190', 'Soreang', 'kecamatan', (SELECT id FROM locations WHERE code = '32-04'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-04-191', 'Kutawaringin', 'kecamatan', (SELECT id FROM locations WHERE code = '32-04'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-04-250', 'Margaasih', 'kecamatan', (SELECT id FROM locations WHERE code = '32-04'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-04-260', 'Margahayu', 'kecamatan', (SELECT id FROM locations WHERE code = '32-04'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-04-270', 'Dayeuhkolot', 'kecamatan', (SELECT id FROM locations WHERE code = '32-04'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-04-280', 'Bojongsoang', 'kecamatan', (SELECT id FROM locations WHERE code = '32-04'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-04-290', 'Cileunyi', 'kecamatan', (SELECT id FROM locations WHERE code = '32-04'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-04-300', 'Cilengkrang', 'kecamatan', (SELECT id FROM locations WHERE code = '32-04'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-04-310', 'Cimenyan', 'kecamatan', (SELECT id FROM locations WHERE code = '32-04'));

-- ============================================================
-- KECAMATAN - Kab. Garut (42 kecamatan)
-- ============================================================
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-05-010', 'Cisewu', 'kecamatan', (SELECT id FROM locations WHERE code = '32-05'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-05-011', 'Caringin', 'kecamatan', (SELECT id FROM locations WHERE code = '32-05'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-05-020', 'Talegong', 'kecamatan', (SELECT id FROM locations WHERE code = '32-05'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-05-030', 'Bungbulang', 'kecamatan', (SELECT id FROM locations WHERE code = '32-05'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-05-031', 'Mekarmukti', 'kecamatan', (SELECT id FROM locations WHERE code = '32-05'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-05-040', 'Pamulihan', 'kecamatan', (SELECT id FROM locations WHERE code = '32-05'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-05-050', 'Pakenjeng', 'kecamatan', (SELECT id FROM locations WHERE code = '32-05'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-05-060', 'Cikelet', 'kecamatan', (SELECT id FROM locations WHERE code = '32-05'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-05-070', 'Pameungpeuk', 'kecamatan', (SELECT id FROM locations WHERE code = '32-05'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-05-080', 'Cibalong', 'kecamatan', (SELECT id FROM locations WHERE code = '32-05'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-05-090', 'Cisompet', 'kecamatan', (SELECT id FROM locations WHERE code = '32-05'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-05-100', 'Peundeuy', 'kecamatan', (SELECT id FROM locations WHERE code = '32-05'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-05-110', 'Singajaya', 'kecamatan', (SELECT id FROM locations WHERE code = '32-05'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-05-111', 'Cihurip', 'kecamatan', (SELECT id FROM locations WHERE code = '32-05'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-05-120', 'Cikajang', 'kecamatan', (SELECT id FROM locations WHERE code = '32-05'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-05-130', 'Banjarwangi', 'kecamatan', (SELECT id FROM locations WHERE code = '32-05'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-05-140', 'Cilawu', 'kecamatan', (SELECT id FROM locations WHERE code = '32-05'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-05-150', 'Bayongbong', 'kecamatan', (SELECT id FROM locations WHERE code = '32-05'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-05-151', 'Cigedug', 'kecamatan', (SELECT id FROM locations WHERE code = '32-05'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-05-160', 'Cisurupan', 'kecamatan', (SELECT id FROM locations WHERE code = '32-05'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-05-161', 'Sukaresmi', 'kecamatan', (SELECT id FROM locations WHERE code = '32-05'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-05-170', 'Samarang', 'kecamatan', (SELECT id FROM locations WHERE code = '32-05'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-05-171', 'Pasirwangi', 'kecamatan', (SELECT id FROM locations WHERE code = '32-05'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-05-181', 'Tarogong Kidul', 'kecamatan', (SELECT id FROM locations WHERE code = '32-05'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-05-182', 'Tarogong Kaler', 'kecamatan', (SELECT id FROM locations WHERE code = '32-05'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-05-190', 'Garut Kota', 'kecamatan', (SELECT id FROM locations WHERE code = '32-05'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-05-200', 'Karangpawitan', 'kecamatan', (SELECT id FROM locations WHERE code = '32-05'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-05-210', 'Wanaraja', 'kecamatan', (SELECT id FROM locations WHERE code = '32-05'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-05-211', 'Sucinaraja', 'kecamatan', (SELECT id FROM locations WHERE code = '32-05'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-05-212', 'Pangatikan', 'kecamatan', (SELECT id FROM locations WHERE code = '32-05'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-05-220', 'Sukawening', 'kecamatan', (SELECT id FROM locations WHERE code = '32-05'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-05-221', 'Karangtengah', 'kecamatan', (SELECT id FROM locations WHERE code = '32-05'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-05-230', 'Banyuresmi', 'kecamatan', (SELECT id FROM locations WHERE code = '32-05'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-05-240', 'Leles', 'kecamatan', (SELECT id FROM locations WHERE code = '32-05'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-05-250', 'Leuwigoong', 'kecamatan', (SELECT id FROM locations WHERE code = '32-05'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-05-260', 'Cibatu', 'kecamatan', (SELECT id FROM locations WHERE code = '32-05'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-05-261', 'Kersamanah', 'kecamatan', (SELECT id FROM locations WHERE code = '32-05'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-05-270', 'Cibiuk', 'kecamatan', (SELECT id FROM locations WHERE code = '32-05'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-05-280', 'Kadungora', 'kecamatan', (SELECT id FROM locations WHERE code = '32-05'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-05-290', 'Blubur Limbangan', 'kecamatan', (SELECT id FROM locations WHERE code = '32-05'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-05-300', 'Selaawi', 'kecamatan', (SELECT id FROM locations WHERE code = '32-05'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-05-310', 'Malangbong', 'kecamatan', (SELECT id FROM locations WHERE code = '32-05'));

-- ============================================================
-- KECAMATAN - Kab. Tasikmalaya (39 kecamatan)
-- ============================================================
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-06-010', 'Cipatujah', 'kecamatan', (SELECT id FROM locations WHERE code = '32-06'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-06-020', 'Karangnunggal', 'kecamatan', (SELECT id FROM locations WHERE code = '32-06'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-06-030', 'Cikalong', 'kecamatan', (SELECT id FROM locations WHERE code = '32-06'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-06-040', 'Pancatengah', 'kecamatan', (SELECT id FROM locations WHERE code = '32-06'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-06-050', 'Cikatomas', 'kecamatan', (SELECT id FROM locations WHERE code = '32-06'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-06-060', 'Cibalong', 'kecamatan', (SELECT id FROM locations WHERE code = '32-06'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-06-061', 'Parungponteng', 'kecamatan', (SELECT id FROM locations WHERE code = '32-06'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-06-070', 'Bantarkalong', 'kecamatan', (SELECT id FROM locations WHERE code = '32-06'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-06-071', 'Bojongasih', 'kecamatan', (SELECT id FROM locations WHERE code = '32-06'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-06-072', 'Culamega', 'kecamatan', (SELECT id FROM locations WHERE code = '32-06'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-06-080', 'Bojonggambir', 'kecamatan', (SELECT id FROM locations WHERE code = '32-06'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-06-090', 'Sodonghilir', 'kecamatan', (SELECT id FROM locations WHERE code = '32-06'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-06-100', 'Taraju', 'kecamatan', (SELECT id FROM locations WHERE code = '32-06'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-06-110', 'Salawu', 'kecamatan', (SELECT id FROM locations WHERE code = '32-06'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-06-111', 'Puspahiang', 'kecamatan', (SELECT id FROM locations WHERE code = '32-06'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-06-120', 'Tanjungjaya', 'kecamatan', (SELECT id FROM locations WHERE code = '32-06'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-06-130', 'Sukaraja', 'kecamatan', (SELECT id FROM locations WHERE code = '32-06'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-06-140', 'Salopa', 'kecamatan', (SELECT id FROM locations WHERE code = '32-06'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-06-141', 'Jatiwaras', 'kecamatan', (SELECT id FROM locations WHERE code = '32-06'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-06-150', 'Cineam', 'kecamatan', (SELECT id FROM locations WHERE code = '32-06'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-06-151', 'Karangjaya', 'kecamatan', (SELECT id FROM locations WHERE code = '32-06'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-06-160', 'Manonjaya', 'kecamatan', (SELECT id FROM locations WHERE code = '32-06'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-06-161', 'Gunungtanjung', 'kecamatan', (SELECT id FROM locations WHERE code = '32-06'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-06-190', 'Singaparna', 'kecamatan', (SELECT id FROM locations WHERE code = '32-06'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-06-191', 'Sukarame', 'kecamatan', (SELECT id FROM locations WHERE code = '32-06'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-06-192', 'Mangunreja', 'kecamatan', (SELECT id FROM locations WHERE code = '32-06'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-06-200', 'Cigalontang', 'kecamatan', (SELECT id FROM locations WHERE code = '32-06'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-06-210', 'Leuwisari', 'kecamatan', (SELECT id FROM locations WHERE code = '32-06'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-06-211', 'Sariwangi', 'kecamatan', (SELECT id FROM locations WHERE code = '32-06'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-06-212', 'Padakembang', 'kecamatan', (SELECT id FROM locations WHERE code = '32-06'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-06-221', 'Sukaratu', 'kecamatan', (SELECT id FROM locations WHERE code = '32-06'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-06-230', 'Cisayong', 'kecamatan', (SELECT id FROM locations WHERE code = '32-06'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-06-231', 'Sukahening', 'kecamatan', (SELECT id FROM locations WHERE code = '32-06'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-06-240', 'Rajapolah', 'kecamatan', (SELECT id FROM locations WHERE code = '32-06'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-06-250', 'Jamanis', 'kecamatan', (SELECT id FROM locations WHERE code = '32-06'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-06-260', 'Ciawi', 'kecamatan', (SELECT id FROM locations WHERE code = '32-06'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-06-261', 'Kadipaten', 'kecamatan', (SELECT id FROM locations WHERE code = '32-06'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-06-270', 'Pagerageung', 'kecamatan', (SELECT id FROM locations WHERE code = '32-06'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-06-271', 'Sukaresik', 'kecamatan', (SELECT id FROM locations WHERE code = '32-06'));

-- ============================================================
-- KECAMATAN - Kab. Ciamis (27 kecamatan)
-- ============================================================
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-07-100', 'Banjarsari', 'kecamatan', (SELECT id FROM locations WHERE code = '32-07'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-07-101', 'Banjaranyar', 'kecamatan', (SELECT id FROM locations WHERE code = '32-07'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-07-110', 'Lakbok', 'kecamatan', (SELECT id FROM locations WHERE code = '32-07'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-07-111', 'Purwadadi', 'kecamatan', (SELECT id FROM locations WHERE code = '32-07'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-07-120', 'Pamarican', 'kecamatan', (SELECT id FROM locations WHERE code = '32-07'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-07-130', 'Cidolog', 'kecamatan', (SELECT id FROM locations WHERE code = '32-07'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-07-140', 'Cimaragas', 'kecamatan', (SELECT id FROM locations WHERE code = '32-07'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-07-150', 'Cijeungjing', 'kecamatan', (SELECT id FROM locations WHERE code = '32-07'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-07-160', 'Cisaga', 'kecamatan', (SELECT id FROM locations WHERE code = '32-07'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-07-170', 'Tambaksari', 'kecamatan', (SELECT id FROM locations WHERE code = '32-07'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-07-180', 'Rancah', 'kecamatan', (SELECT id FROM locations WHERE code = '32-07'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-07-190', 'Rajadesa', 'kecamatan', (SELECT id FROM locations WHERE code = '32-07'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-07-200', 'Sukadana', 'kecamatan', (SELECT id FROM locations WHERE code = '32-07'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-07-210', 'Ciamis', 'kecamatan', (SELECT id FROM locations WHERE code = '32-07'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-07-211', 'Baregbeg', 'kecamatan', (SELECT id FROM locations WHERE code = '32-07'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-07-220', 'Cikoneng', 'kecamatan', (SELECT id FROM locations WHERE code = '32-07'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-07-221', 'Sindangkasih', 'kecamatan', (SELECT id FROM locations WHERE code = '32-07'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-07-230', 'Cihaurbeuti', 'kecamatan', (SELECT id FROM locations WHERE code = '32-07'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-07-240', 'Sadananya', 'kecamatan', (SELECT id FROM locations WHERE code = '32-07'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-07-250', 'Cipaku', 'kecamatan', (SELECT id FROM locations WHERE code = '32-07'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-07-260', 'Jatinagara', 'kecamatan', (SELECT id FROM locations WHERE code = '32-07'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-07-270', 'Panawangan', 'kecamatan', (SELECT id FROM locations WHERE code = '32-07'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-07-280', 'Kawali', 'kecamatan', (SELECT id FROM locations WHERE code = '32-07'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-07-281', 'Lumbung', 'kecamatan', (SELECT id FROM locations WHERE code = '32-07'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-07-290', 'Panjalu', 'kecamatan', (SELECT id FROM locations WHERE code = '32-07'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-07-291', 'Sukamantri', 'kecamatan', (SELECT id FROM locations WHERE code = '32-07'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-07-300', 'Panumbangan', 'kecamatan', (SELECT id FROM locations WHERE code = '32-07'));

-- ============================================================
-- KECAMATAN - Kab. Kuningan (32 kecamatan)
-- ============================================================
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-08-010', 'Darma', 'kecamatan', (SELECT id FROM locations WHERE code = '32-08'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-08-020', 'Kadugede', 'kecamatan', (SELECT id FROM locations WHERE code = '32-08'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-08-021', 'Nusaherang', 'kecamatan', (SELECT id FROM locations WHERE code = '32-08'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-08-030', 'Ciniru', 'kecamatan', (SELECT id FROM locations WHERE code = '32-08'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-08-031', 'Hantara', 'kecamatan', (SELECT id FROM locations WHERE code = '32-08'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-08-040', 'Selajambe', 'kecamatan', (SELECT id FROM locations WHERE code = '32-08'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-08-050', 'Subang', 'kecamatan', (SELECT id FROM locations WHERE code = '32-08'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-08-051', 'Cilebak', 'kecamatan', (SELECT id FROM locations WHERE code = '32-08'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-08-060', 'Ciwaru', 'kecamatan', (SELECT id FROM locations WHERE code = '32-08'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-08-061', 'Karangkancana', 'kecamatan', (SELECT id FROM locations WHERE code = '32-08'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-08-070', 'Cibingbin', 'kecamatan', (SELECT id FROM locations WHERE code = '32-08'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-08-071', 'Cibeureum', 'kecamatan', (SELECT id FROM locations WHERE code = '32-08'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-08-080', 'Luragung', 'kecamatan', (SELECT id FROM locations WHERE code = '32-08'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-08-081', 'Cimahi', 'kecamatan', (SELECT id FROM locations WHERE code = '32-08'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-08-090', 'Cidahu', 'kecamatan', (SELECT id FROM locations WHERE code = '32-08'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-08-091', 'Kalimanggis', 'kecamatan', (SELECT id FROM locations WHERE code = '32-08'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-08-100', 'Ciawigebang', 'kecamatan', (SELECT id FROM locations WHERE code = '32-08'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-08-101', 'Cipicung', 'kecamatan', (SELECT id FROM locations WHERE code = '32-08'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-08-110', 'Lebakwangi', 'kecamatan', (SELECT id FROM locations WHERE code = '32-08'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-08-111', 'Maleber', 'kecamatan', (SELECT id FROM locations WHERE code = '32-08'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-08-120', 'Garawangi', 'kecamatan', (SELECT id FROM locations WHERE code = '32-08'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-08-121', 'Sindangagung', 'kecamatan', (SELECT id FROM locations WHERE code = '32-08'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-08-130', 'Kuningan', 'kecamatan', (SELECT id FROM locations WHERE code = '32-08'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-08-140', 'Cigugur', 'kecamatan', (SELECT id FROM locations WHERE code = '32-08'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-08-150', 'Kramatmulya', 'kecamatan', (SELECT id FROM locations WHERE code = '32-08'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-08-160', 'Jalaksana', 'kecamatan', (SELECT id FROM locations WHERE code = '32-08'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-08-161', 'Japara', 'kecamatan', (SELECT id FROM locations WHERE code = '32-08'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-08-170', 'Cilimus', 'kecamatan', (SELECT id FROM locations WHERE code = '32-08'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-08-171', 'Cigandamekar', 'kecamatan', (SELECT id FROM locations WHERE code = '32-08'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-08-180', 'Mandirancan', 'kecamatan', (SELECT id FROM locations WHERE code = '32-08'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-08-181', 'Pancalang', 'kecamatan', (SELECT id FROM locations WHERE code = '32-08'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-08-190', 'Pasawahan', 'kecamatan', (SELECT id FROM locations WHERE code = '32-08'));

-- ============================================================
-- KECAMATAN - Kab. Cirebon (40 kecamatan)
-- ============================================================
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-09-010', 'Waled', 'kecamatan', (SELECT id FROM locations WHERE code = '32-09'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-09-011', 'Pasaleman', 'kecamatan', (SELECT id FROM locations WHERE code = '32-09'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-09-020', 'Ciledug', 'kecamatan', (SELECT id FROM locations WHERE code = '32-09'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-09-021', 'Pabuaran', 'kecamatan', (SELECT id FROM locations WHERE code = '32-09'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-09-030', 'Losari', 'kecamatan', (SELECT id FROM locations WHERE code = '32-09'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-09-031', 'Pabedilan', 'kecamatan', (SELECT id FROM locations WHERE code = '32-09'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-09-040', 'Babakan', 'kecamatan', (SELECT id FROM locations WHERE code = '32-09'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-09-041', 'Gebang', 'kecamatan', (SELECT id FROM locations WHERE code = '32-09'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-09-050', 'Karangsembung', 'kecamatan', (SELECT id FROM locations WHERE code = '32-09'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-09-051', 'Karangwareng', 'kecamatan', (SELECT id FROM locations WHERE code = '32-09'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-09-060', 'Lemahabang', 'kecamatan', (SELECT id FROM locations WHERE code = '32-09'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-09-061', 'Susukanlebak', 'kecamatan', (SELECT id FROM locations WHERE code = '32-09'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-09-070', 'Sedong', 'kecamatan', (SELECT id FROM locations WHERE code = '32-09'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-09-080', 'Astanajapura', 'kecamatan', (SELECT id FROM locations WHERE code = '32-09'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-09-081', 'Pangenan', 'kecamatan', (SELECT id FROM locations WHERE code = '32-09'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-09-090', 'Mundu', 'kecamatan', (SELECT id FROM locations WHERE code = '32-09'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-09-100', 'Beber', 'kecamatan', (SELECT id FROM locations WHERE code = '32-09'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-09-101', 'Greged', 'kecamatan', (SELECT id FROM locations WHERE code = '32-09'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-09-111', 'Talun', 'kecamatan', (SELECT id FROM locations WHERE code = '32-09'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-09-120', 'Sumber', 'kecamatan', (SELECT id FROM locations WHERE code = '32-09'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-09-121', 'Dukupuntang', 'kecamatan', (SELECT id FROM locations WHERE code = '32-09'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-09-130', 'Palimanan', 'kecamatan', (SELECT id FROM locations WHERE code = '32-09'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-09-140', 'Plumbon', 'kecamatan', (SELECT id FROM locations WHERE code = '32-09'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-09-141', 'Depok', 'kecamatan', (SELECT id FROM locations WHERE code = '32-09'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-09-150', 'Weru', 'kecamatan', (SELECT id FROM locations WHERE code = '32-09'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-09-151', 'Plered', 'kecamatan', (SELECT id FROM locations WHERE code = '32-09'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-09-161', 'Tengah Tani', 'kecamatan', (SELECT id FROM locations WHERE code = '32-09'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-09-162', 'Kedawung', 'kecamatan', (SELECT id FROM locations WHERE code = '32-09'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-09-171', 'Gunungjati', 'kecamatan', (SELECT id FROM locations WHERE code = '32-09'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-09-180', 'Kapetakan', 'kecamatan', (SELECT id FROM locations WHERE code = '32-09'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-09-181', 'Suranenggala', 'kecamatan', (SELECT id FROM locations WHERE code = '32-09'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-09-190', 'Klangenan', 'kecamatan', (SELECT id FROM locations WHERE code = '32-09'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-09-191', 'Jamblang', 'kecamatan', (SELECT id FROM locations WHERE code = '32-09'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-09-200', 'Arjawinangun', 'kecamatan', (SELECT id FROM locations WHERE code = '32-09'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-09-201', 'Panguragan', 'kecamatan', (SELECT id FROM locations WHERE code = '32-09'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-09-210', 'Ciwaringin', 'kecamatan', (SELECT id FROM locations WHERE code = '32-09'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-09-211', 'Gempol', 'kecamatan', (SELECT id FROM locations WHERE code = '32-09'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-09-220', 'Susukan', 'kecamatan', (SELECT id FROM locations WHERE code = '32-09'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-09-230', 'Gegesik', 'kecamatan', (SELECT id FROM locations WHERE code = '32-09'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-09-231', 'Kaliwedi', 'kecamatan', (SELECT id FROM locations WHERE code = '32-09'));

-- ============================================================
-- KECAMATAN - Kab. Majalengka (26 kecamatan)
-- ============================================================
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-10-010', 'Lemahsugih', 'kecamatan', (SELECT id FROM locations WHERE code = '32-10'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-10-020', 'Bantarujeg', 'kecamatan', (SELECT id FROM locations WHERE code = '32-10'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-10-021', 'Malausma', 'kecamatan', (SELECT id FROM locations WHERE code = '32-10'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-10-030', 'Cikijing', 'kecamatan', (SELECT id FROM locations WHERE code = '32-10'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-10-031', 'Cingambul', 'kecamatan', (SELECT id FROM locations WHERE code = '32-10'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-10-040', 'Talaga', 'kecamatan', (SELECT id FROM locations WHERE code = '32-10'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-10-041', 'Banjaran', 'kecamatan', (SELECT id FROM locations WHERE code = '32-10'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-10-050', 'Argapura', 'kecamatan', (SELECT id FROM locations WHERE code = '32-10'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-10-060', 'Maja', 'kecamatan', (SELECT id FROM locations WHERE code = '32-10'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-10-070', 'Majalengka', 'kecamatan', (SELECT id FROM locations WHERE code = '32-10'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-10-080', 'Cigasong', 'kecamatan', (SELECT id FROM locations WHERE code = '32-10'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-10-090', 'Sukahaji', 'kecamatan', (SELECT id FROM locations WHERE code = '32-10'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-10-091', 'Sindang', 'kecamatan', (SELECT id FROM locations WHERE code = '32-10'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-10-100', 'Rajagaluh', 'kecamatan', (SELECT id FROM locations WHERE code = '32-10'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-10-110', 'Sindangwangi', 'kecamatan', (SELECT id FROM locations WHERE code = '32-10'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-10-120', 'Leuwimunding', 'kecamatan', (SELECT id FROM locations WHERE code = '32-10'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-10-130', 'Palasah', 'kecamatan', (SELECT id FROM locations WHERE code = '32-10'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-10-140', 'Jatiwangi', 'kecamatan', (SELECT id FROM locations WHERE code = '32-10'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-10-150', 'Dawuan', 'kecamatan', (SELECT id FROM locations WHERE code = '32-10'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-10-151', 'Kasokandel', 'kecamatan', (SELECT id FROM locations WHERE code = '32-10'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-10-160', 'Panyingkiran', 'kecamatan', (SELECT id FROM locations WHERE code = '32-10'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-10-170', 'Kadipaten', 'kecamatan', (SELECT id FROM locations WHERE code = '32-10'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-10-180', 'Kertajati', 'kecamatan', (SELECT id FROM locations WHERE code = '32-10'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-10-190', 'Jatitujuh', 'kecamatan', (SELECT id FROM locations WHERE code = '32-10'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-10-200', 'Ligung', 'kecamatan', (SELECT id FROM locations WHERE code = '32-10'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-10-210', 'Sumberjaya', 'kecamatan', (SELECT id FROM locations WHERE code = '32-10'));

-- ============================================================
-- KECAMATAN - Kab. Sumedang (26 kecamatan)
-- ============================================================
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-11-010', 'Jatinangor', 'kecamatan', (SELECT id FROM locations WHERE code = '32-11'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-11-020', 'Cimanggung', 'kecamatan', (SELECT id FROM locations WHERE code = '32-11'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-11-030', 'Tanjungsari', 'kecamatan', (SELECT id FROM locations WHERE code = '32-11'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-11-031', 'Sukasari', 'kecamatan', (SELECT id FROM locations WHERE code = '32-11'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-11-032', 'Pamulihan', 'kecamatan', (SELECT id FROM locations WHERE code = '32-11'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-11-040', 'Rancakalong', 'kecamatan', (SELECT id FROM locations WHERE code = '32-11'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-11-050', 'Sumedang Selatan', 'kecamatan', (SELECT id FROM locations WHERE code = '32-11'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-11-060', 'Sumedang Utara', 'kecamatan', (SELECT id FROM locations WHERE code = '32-11'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-11-061', 'Ganeas', 'kecamatan', (SELECT id FROM locations WHERE code = '32-11'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-11-070', 'Situraja', 'kecamatan', (SELECT id FROM locations WHERE code = '32-11'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-11-071', 'Cisitu', 'kecamatan', (SELECT id FROM locations WHERE code = '32-11'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-11-080', 'Darmaraja', 'kecamatan', (SELECT id FROM locations WHERE code = '32-11'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-11-090', 'Cibugel', 'kecamatan', (SELECT id FROM locations WHERE code = '32-11'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-11-100', 'Wado', 'kecamatan', (SELECT id FROM locations WHERE code = '32-11'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-11-101', 'Jatinunggal', 'kecamatan', (SELECT id FROM locations WHERE code = '32-11'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-11-111', 'Jatigede', 'kecamatan', (SELECT id FROM locations WHERE code = '32-11'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-11-120', 'Tomo', 'kecamatan', (SELECT id FROM locations WHERE code = '32-11'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-11-130', 'Ujung Jaya', 'kecamatan', (SELECT id FROM locations WHERE code = '32-11'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-11-140', 'Conggeang', 'kecamatan', (SELECT id FROM locations WHERE code = '32-11'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-11-150', 'Paseh', 'kecamatan', (SELECT id FROM locations WHERE code = '32-11'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-11-160', 'Cimalaka', 'kecamatan', (SELECT id FROM locations WHERE code = '32-11'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-11-161', 'Cisarua', 'kecamatan', (SELECT id FROM locations WHERE code = '32-11'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-11-170', 'Tanjungkerta', 'kecamatan', (SELECT id FROM locations WHERE code = '32-11'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-11-171', 'Tanjungmedar', 'kecamatan', (SELECT id FROM locations WHERE code = '32-11'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-11-180', 'Buahdua', 'kecamatan', (SELECT id FROM locations WHERE code = '32-11'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-11-181', 'Surian', 'kecamatan', (SELECT id FROM locations WHERE code = '32-11'));

-- ============================================================
-- KECAMATAN - Kab. Indramayu (31 kecamatan)
-- ============================================================
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-12-010', 'Haurgeulis', 'kecamatan', (SELECT id FROM locations WHERE code = '32-12'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-12-011', 'Gantar', 'kecamatan', (SELECT id FROM locations WHERE code = '32-12'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-12-020', 'Kroya', 'kecamatan', (SELECT id FROM locations WHERE code = '32-12'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-12-030', 'Gabuswetan', 'kecamatan', (SELECT id FROM locations WHERE code = '32-12'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-12-040', 'Cikedung', 'kecamatan', (SELECT id FROM locations WHERE code = '32-12'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-12-041', 'Terisi', 'kecamatan', (SELECT id FROM locations WHERE code = '32-12'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-12-050', 'Lelea', 'kecamatan', (SELECT id FROM locations WHERE code = '32-12'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-12-060', 'Bangodua', 'kecamatan', (SELECT id FROM locations WHERE code = '32-12'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-12-061', 'Tukdana', 'kecamatan', (SELECT id FROM locations WHERE code = '32-12'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-12-070', 'Widasari', 'kecamatan', (SELECT id FROM locations WHERE code = '32-12'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-12-080', 'Kertasemaya', 'kecamatan', (SELECT id FROM locations WHERE code = '32-12'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-12-081', 'Sukagumiwang', 'kecamatan', (SELECT id FROM locations WHERE code = '32-12'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-12-090', 'Krangkeng', 'kecamatan', (SELECT id FROM locations WHERE code = '32-12'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-12-100', 'Karangampel', 'kecamatan', (SELECT id FROM locations WHERE code = '32-12'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-12-101', 'Kedokan Bunder', 'kecamatan', (SELECT id FROM locations WHERE code = '32-12'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-12-110', 'Juntinyuat', 'kecamatan', (SELECT id FROM locations WHERE code = '32-12'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-12-120', 'Sliyeg', 'kecamatan', (SELECT id FROM locations WHERE code = '32-12'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-12-130', 'Jatibarang', 'kecamatan', (SELECT id FROM locations WHERE code = '32-12'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-12-140', 'Balongan', 'kecamatan', (SELECT id FROM locations WHERE code = '32-12'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-12-150', 'Indramayu', 'kecamatan', (SELECT id FROM locations WHERE code = '32-12'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-12-160', 'Sindang', 'kecamatan', (SELECT id FROM locations WHERE code = '32-12'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-12-161', 'Cantigi', 'kecamatan', (SELECT id FROM locations WHERE code = '32-12'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-12-162', 'Pasekan', 'kecamatan', (SELECT id FROM locations WHERE code = '32-12'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-12-170', 'Lohbener', 'kecamatan', (SELECT id FROM locations WHERE code = '32-12'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-12-171', 'Arahan', 'kecamatan', (SELECT id FROM locations WHERE code = '32-12'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-12-180', 'Losarang', 'kecamatan', (SELECT id FROM locations WHERE code = '32-12'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-12-190', 'Kandanghaur', 'kecamatan', (SELECT id FROM locations WHERE code = '32-12'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-12-200', 'Bongas', 'kecamatan', (SELECT id FROM locations WHERE code = '32-12'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-12-210', 'Anjatan', 'kecamatan', (SELECT id FROM locations WHERE code = '32-12'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-12-220', 'Sukra', 'kecamatan', (SELECT id FROM locations WHERE code = '32-12'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-12-221', 'Patrol', 'kecamatan', (SELECT id FROM locations WHERE code = '32-12'));

-- ============================================================
-- KECAMATAN - Kab. Subang (30 kecamatan)
-- ============================================================
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-13-010', 'Sagalaherang', 'kecamatan', (SELECT id FROM locations WHERE code = '32-13'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-13-011', 'Serangpanjang', 'kecamatan', (SELECT id FROM locations WHERE code = '32-13'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-13-020', 'Jalancagak', 'kecamatan', (SELECT id FROM locations WHERE code = '32-13'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-13-021', 'Ciater', 'kecamatan', (SELECT id FROM locations WHERE code = '32-13'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-13-030', 'Cisalak', 'kecamatan', (SELECT id FROM locations WHERE code = '32-13'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-13-031', 'Kasomalang', 'kecamatan', (SELECT id FROM locations WHERE code = '32-13'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-13-040', 'Tanjungsiang', 'kecamatan', (SELECT id FROM locations WHERE code = '32-13'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-13-050', 'Cijambe', 'kecamatan', (SELECT id FROM locations WHERE code = '32-13'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-13-060', 'Cibogo', 'kecamatan', (SELECT id FROM locations WHERE code = '32-13'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-13-070', 'Subang', 'kecamatan', (SELECT id FROM locations WHERE code = '32-13'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-13-080', 'Kalijati', 'kecamatan', (SELECT id FROM locations WHERE code = '32-13'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-13-081', 'Dawuan', 'kecamatan', (SELECT id FROM locations WHERE code = '32-13'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-13-090', 'Cipeundeuy', 'kecamatan', (SELECT id FROM locations WHERE code = '32-13'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-13-100', 'Pabuaran', 'kecamatan', (SELECT id FROM locations WHERE code = '32-13'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-13-110', 'Patokbeusi', 'kecamatan', (SELECT id FROM locations WHERE code = '32-13'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-13-120', 'Purwadadi', 'kecamatan', (SELECT id FROM locations WHERE code = '32-13'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-13-130', 'Cikaum', 'kecamatan', (SELECT id FROM locations WHERE code = '32-13'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-13-140', 'Pagaden', 'kecamatan', (SELECT id FROM locations WHERE code = '32-13'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-13-141', 'Pagaden Barat', 'kecamatan', (SELECT id FROM locations WHERE code = '32-13'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-13-150', 'Cipunagara', 'kecamatan', (SELECT id FROM locations WHERE code = '32-13'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-13-160', 'Compreng', 'kecamatan', (SELECT id FROM locations WHERE code = '32-13'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-13-170', 'Binong', 'kecamatan', (SELECT id FROM locations WHERE code = '32-13'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-13-171', 'Tambakdahan', 'kecamatan', (SELECT id FROM locations WHERE code = '32-13'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-13-180', 'Ciasem', 'kecamatan', (SELECT id FROM locations WHERE code = '32-13'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-13-190', 'Pamanukan', 'kecamatan', (SELECT id FROM locations WHERE code = '32-13'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-13-191', 'Sukasari', 'kecamatan', (SELECT id FROM locations WHERE code = '32-13'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-13-200', 'Pusakanagara', 'kecamatan', (SELECT id FROM locations WHERE code = '32-13'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-13-201', 'Pusakajaya', 'kecamatan', (SELECT id FROM locations WHERE code = '32-13'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-13-210', 'Legonkulon', 'kecamatan', (SELECT id FROM locations WHERE code = '32-13'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-13-220', 'Blanakan', 'kecamatan', (SELECT id FROM locations WHERE code = '32-13'));

-- ============================================================
-- KECAMATAN - Kab. Purwakarta (17 kecamatan)
-- ============================================================
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-14-010', 'Jatiluhur', 'kecamatan', (SELECT id FROM locations WHERE code = '32-14'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-14-011', 'Sukasari', 'kecamatan', (SELECT id FROM locations WHERE code = '32-14'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-14-020', 'Maniis', 'kecamatan', (SELECT id FROM locations WHERE code = '32-14'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-14-030', 'Tegal Waru', 'kecamatan', (SELECT id FROM locations WHERE code = '32-14'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-14-040', 'Plered', 'kecamatan', (SELECT id FROM locations WHERE code = '32-14'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-14-050', 'Sukatani', 'kecamatan', (SELECT id FROM locations WHERE code = '32-14'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-14-060', 'Darangdan', 'kecamatan', (SELECT id FROM locations WHERE code = '32-14'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-14-070', 'Bojong', 'kecamatan', (SELECT id FROM locations WHERE code = '32-14'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-14-080', 'Wanayasa', 'kecamatan', (SELECT id FROM locations WHERE code = '32-14'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-14-081', 'Kiarapedes', 'kecamatan', (SELECT id FROM locations WHERE code = '32-14'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-14-090', 'Pasawahan', 'kecamatan', (SELECT id FROM locations WHERE code = '32-14'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-14-091', 'Pondok Salam', 'kecamatan', (SELECT id FROM locations WHERE code = '32-14'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-14-100', 'Purwakarta', 'kecamatan', (SELECT id FROM locations WHERE code = '32-14'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-14-101', 'Babakancikao', 'kecamatan', (SELECT id FROM locations WHERE code = '32-14'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-14-110', 'Campaka', 'kecamatan', (SELECT id FROM locations WHERE code = '32-14'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-14-111', 'Cibatu', 'kecamatan', (SELECT id FROM locations WHERE code = '32-14'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-14-112', 'Bungursari', 'kecamatan', (SELECT id FROM locations WHERE code = '32-14'));

-- ============================================================
-- KECAMATAN - Kab. Karawang (30 kecamatan)
-- ============================================================
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-15-010', 'Pangkalan', 'kecamatan', (SELECT id FROM locations WHERE code = '32-15'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-15-011', 'Tegalwaru', 'kecamatan', (SELECT id FROM locations WHERE code = '32-15'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-15-020', 'Ciampel', 'kecamatan', (SELECT id FROM locations WHERE code = '32-15'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-15-031', 'Telukjambe Timur', 'kecamatan', (SELECT id FROM locations WHERE code = '32-15'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-15-032', 'Telukjambe Barat', 'kecamatan', (SELECT id FROM locations WHERE code = '32-15'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-15-040', 'Klari', 'kecamatan', (SELECT id FROM locations WHERE code = '32-15'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-15-050', 'Cikampek', 'kecamatan', (SELECT id FROM locations WHERE code = '32-15'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-15-051', 'Purwasari', 'kecamatan', (SELECT id FROM locations WHERE code = '32-15'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-15-060', 'Tirtamulya', 'kecamatan', (SELECT id FROM locations WHERE code = '32-15'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-15-070', 'Jatisari', 'kecamatan', (SELECT id FROM locations WHERE code = '32-15'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-15-071', 'Banyusari', 'kecamatan', (SELECT id FROM locations WHERE code = '32-15'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-15-072', 'Kotabaru', 'kecamatan', (SELECT id FROM locations WHERE code = '32-15'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-15-081', 'Cilamaya Wetan', 'kecamatan', (SELECT id FROM locations WHERE code = '32-15'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-15-082', 'Cilamaya Kulon', 'kecamatan', (SELECT id FROM locations WHERE code = '32-15'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-15-090', 'Lemahabang', 'kecamatan', (SELECT id FROM locations WHERE code = '32-15'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-15-100', 'Telagasari', 'kecamatan', (SELECT id FROM locations WHERE code = '32-15'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-15-111', 'Majalaya', 'kecamatan', (SELECT id FROM locations WHERE code = '32-15'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-15-112', 'Karawang Timur', 'kecamatan', (SELECT id FROM locations WHERE code = '32-15'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-15-113', 'Karawang Barat', 'kecamatan', (SELECT id FROM locations WHERE code = '32-15'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-15-120', 'Rawamerta', 'kecamatan', (SELECT id FROM locations WHERE code = '32-15'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-15-130', 'Tempuran', 'kecamatan', (SELECT id FROM locations WHERE code = '32-15'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-15-140', 'Kutawaluya', 'kecamatan', (SELECT id FROM locations WHERE code = '32-15'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-15-150', 'Rengasdengklok', 'kecamatan', (SELECT id FROM locations WHERE code = '32-15'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-15-151', 'Jayakerta', 'kecamatan', (SELECT id FROM locations WHERE code = '32-15'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-15-160', 'Pedes', 'kecamatan', (SELECT id FROM locations WHERE code = '32-15'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-15-161', 'Cilebar', 'kecamatan', (SELECT id FROM locations WHERE code = '32-15'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-15-170', 'Cibuaya', 'kecamatan', (SELECT id FROM locations WHERE code = '32-15'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-15-180', 'Tirtajaya', 'kecamatan', (SELECT id FROM locations WHERE code = '32-15'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-15-190', 'Batujaya', 'kecamatan', (SELECT id FROM locations WHERE code = '32-15'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-15-200', 'Pakisjaya', 'kecamatan', (SELECT id FROM locations WHERE code = '32-15'));

-- ============================================================
-- KECAMATAN - Kab. Bekasi (23 kecamatan)
-- ============================================================
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-16-010', 'Setu', 'kecamatan', (SELECT id FROM locations WHERE code = '32-16'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-16-021', 'Serang Baru', 'kecamatan', (SELECT id FROM locations WHERE code = '32-16'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-16-022', 'Cikarang Pusat', 'kecamatan', (SELECT id FROM locations WHERE code = '32-16'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-16-023', 'Cikarang Selatan', 'kecamatan', (SELECT id FROM locations WHERE code = '32-16'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-16-030', 'Cibarusah', 'kecamatan', (SELECT id FROM locations WHERE code = '32-16'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-16-031', 'Bojongmangu', 'kecamatan', (SELECT id FROM locations WHERE code = '32-16'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-16-041', 'Cikarang Timur', 'kecamatan', (SELECT id FROM locations WHERE code = '32-16'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-16-050', 'Kedungwaringin', 'kecamatan', (SELECT id FROM locations WHERE code = '32-16'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-16-061', 'Cikarang Utara', 'kecamatan', (SELECT id FROM locations WHERE code = '32-16'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-16-062', 'Karangbahagia', 'kecamatan', (SELECT id FROM locations WHERE code = '32-16'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-16-070', 'Cibitung', 'kecamatan', (SELECT id FROM locations WHERE code = '32-16'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-16-071', 'Cikarang Barat', 'kecamatan', (SELECT id FROM locations WHERE code = '32-16'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-16-081', 'Tambun Selatan', 'kecamatan', (SELECT id FROM locations WHERE code = '32-16'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-16-082', 'Tambun Utara', 'kecamatan', (SELECT id FROM locations WHERE code = '32-16'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-16-090', 'Babelan', 'kecamatan', (SELECT id FROM locations WHERE code = '32-16'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-16-100', 'Tarumajaya', 'kecamatan', (SELECT id FROM locations WHERE code = '32-16'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-16-110', 'Tambelang', 'kecamatan', (SELECT id FROM locations WHERE code = '32-16'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-16-111', 'Sukawangi', 'kecamatan', (SELECT id FROM locations WHERE code = '32-16'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-16-120', 'Sukatani', 'kecamatan', (SELECT id FROM locations WHERE code = '32-16'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-16-121', 'Sukakarya', 'kecamatan', (SELECT id FROM locations WHERE code = '32-16'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-16-130', 'Pebayuran', 'kecamatan', (SELECT id FROM locations WHERE code = '32-16'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-16-140', 'Cabangbungin', 'kecamatan', (SELECT id FROM locations WHERE code = '32-16'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-16-150', 'Muara Gembong', 'kecamatan', (SELECT id FROM locations WHERE code = '32-16'));

-- ============================================================
-- KECAMATAN - Kab. Bandung Barat (16 kecamatan)
-- ============================================================
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-17-010', 'Rongga', 'kecamatan', (SELECT id FROM locations WHERE code = '32-17'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-17-020', 'Gununghalu', 'kecamatan', (SELECT id FROM locations WHERE code = '32-17'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-17-030', 'Sindangkerta', 'kecamatan', (SELECT id FROM locations WHERE code = '32-17'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-17-040', 'Cililin', 'kecamatan', (SELECT id FROM locations WHERE code = '32-17'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-17-050', 'Cihampelas', 'kecamatan', (SELECT id FROM locations WHERE code = '32-17'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-17-060', 'Cipongkor', 'kecamatan', (SELECT id FROM locations WHERE code = '32-17'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-17-070', 'Batujajar', 'kecamatan', (SELECT id FROM locations WHERE code = '32-17'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-17-071', 'Saguling', 'kecamatan', (SELECT id FROM locations WHERE code = '32-17'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-17-080', 'Cipatat', 'kecamatan', (SELECT id FROM locations WHERE code = '32-17'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-17-090', 'Padalarang', 'kecamatan', (SELECT id FROM locations WHERE code = '32-17'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-17-100', 'Ngamprah', 'kecamatan', (SELECT id FROM locations WHERE code = '32-17'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-17-110', 'Parongpong', 'kecamatan', (SELECT id FROM locations WHERE code = '32-17'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-17-120', 'Lembang', 'kecamatan', (SELECT id FROM locations WHERE code = '32-17'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-17-130', 'Cisarua', 'kecamatan', (SELECT id FROM locations WHERE code = '32-17'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-17-140', 'Cikalong Wetan', 'kecamatan', (SELECT id FROM locations WHERE code = '32-17'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-17-150', 'Cipeundeuy', 'kecamatan', (SELECT id FROM locations WHERE code = '32-17'));

-- ============================================================
-- KECAMATAN - Kab. Pangandaran (10 kecamatan)
-- ============================================================
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-18-010', 'Cimerak', 'kecamatan', (SELECT id FROM locations WHERE code = '32-18'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-18-020', 'Cijulang', 'kecamatan', (SELECT id FROM locations WHERE code = '32-18'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-18-030', 'Cigugur', 'kecamatan', (SELECT id FROM locations WHERE code = '32-18'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-18-040', 'Langkaplancar', 'kecamatan', (SELECT id FROM locations WHERE code = '32-18'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-18-050', 'Parigi', 'kecamatan', (SELECT id FROM locations WHERE code = '32-18'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-18-060', 'Sidamulih', 'kecamatan', (SELECT id FROM locations WHERE code = '32-18'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-18-070', 'Pangandaran', 'kecamatan', (SELECT id FROM locations WHERE code = '32-18'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-18-080', 'Kalipucang', 'kecamatan', (SELECT id FROM locations WHERE code = '32-18'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-18-090', 'Padaherang', 'kecamatan', (SELECT id FROM locations WHERE code = '32-18'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-18-100', 'Mangunjaya', 'kecamatan', (SELECT id FROM locations WHERE code = '32-18'));

-- ============================================================
-- KECAMATAN - Kota Bogor (6 kecamatan)
-- ============================================================
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-71-010', 'Bogor Selatan', 'kecamatan', (SELECT id FROM locations WHERE code = '32-71'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-71-020', 'Bogor Timur', 'kecamatan', (SELECT id FROM locations WHERE code = '32-71'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-71-030', 'Bogor Utara', 'kecamatan', (SELECT id FROM locations WHERE code = '32-71'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-71-040', 'Bogor Tengah', 'kecamatan', (SELECT id FROM locations WHERE code = '32-71'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-71-050', 'Bogor Barat', 'kecamatan', (SELECT id FROM locations WHERE code = '32-71'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-71-060', 'Tanah Sareal', 'kecamatan', (SELECT id FROM locations WHERE code = '32-71'));

-- ============================================================
-- KECAMATAN - Kota Sukabumi (7 kecamatan)
-- ============================================================
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-72-010', 'Baros', 'kecamatan', (SELECT id FROM locations WHERE code = '32-72'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-72-011', 'Lembursitu', 'kecamatan', (SELECT id FROM locations WHERE code = '32-72'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-72-012', 'Cibeureum', 'kecamatan', (SELECT id FROM locations WHERE code = '32-72'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-72-020', 'Citamiang', 'kecamatan', (SELECT id FROM locations WHERE code = '32-72'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-72-030', 'Warudoyong', 'kecamatan', (SELECT id FROM locations WHERE code = '32-72'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-72-040', 'Gunung Puyuh', 'kecamatan', (SELECT id FROM locations WHERE code = '32-72'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-72-050', 'Cikole', 'kecamatan', (SELECT id FROM locations WHERE code = '32-72'));

-- ============================================================
-- KECAMATAN - Kota Bandung (30 kecamatan)
-- ============================================================
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-73-010', 'Bandung Kulon', 'kecamatan', (SELECT id FROM locations WHERE code = '32-73'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-73-020', 'Babakan Ciparay', 'kecamatan', (SELECT id FROM locations WHERE code = '32-73'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-73-030', 'Bojongloa Kaler', 'kecamatan', (SELECT id FROM locations WHERE code = '32-73'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-73-040', 'Bojongloa Kidul', 'kecamatan', (SELECT id FROM locations WHERE code = '32-73'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-73-050', 'Astanaanyar', 'kecamatan', (SELECT id FROM locations WHERE code = '32-73'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-73-060', 'Regol', 'kecamatan', (SELECT id FROM locations WHERE code = '32-73'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-73-070', 'Lengkong', 'kecamatan', (SELECT id FROM locations WHERE code = '32-73'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-73-080', 'Bandung Kidul', 'kecamatan', (SELECT id FROM locations WHERE code = '32-73'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-73-090', 'Buahbatu', 'kecamatan', (SELECT id FROM locations WHERE code = '32-73'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-73-100', 'Rancasari', 'kecamatan', (SELECT id FROM locations WHERE code = '32-73'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-73-101', 'Gedebage', 'kecamatan', (SELECT id FROM locations WHERE code = '32-73'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-73-110', 'Cibiru', 'kecamatan', (SELECT id FROM locations WHERE code = '32-73'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-73-111', 'Panyileukan', 'kecamatan', (SELECT id FROM locations WHERE code = '32-73'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-73-120', 'Ujung Berung', 'kecamatan', (SELECT id FROM locations WHERE code = '32-73'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-73-121', 'Cinambo', 'kecamatan', (SELECT id FROM locations WHERE code = '32-73'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-73-130', 'Arcamanik', 'kecamatan', (SELECT id FROM locations WHERE code = '32-73'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-73-141', 'Antapani', 'kecamatan', (SELECT id FROM locations WHERE code = '32-73'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-73-142', 'Mandalajati', 'kecamatan', (SELECT id FROM locations WHERE code = '32-73'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-73-150', 'Kiaracondong', 'kecamatan', (SELECT id FROM locations WHERE code = '32-73'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-73-160', 'Batununggal', 'kecamatan', (SELECT id FROM locations WHERE code = '32-73'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-73-170', 'Sumur Bandung', 'kecamatan', (SELECT id FROM locations WHERE code = '32-73'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-73-180', 'Andir', 'kecamatan', (SELECT id FROM locations WHERE code = '32-73'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-73-190', 'Cicendo', 'kecamatan', (SELECT id FROM locations WHERE code = '32-73'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-73-200', 'Bandung Wetan', 'kecamatan', (SELECT id FROM locations WHERE code = '32-73'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-73-210', 'Cibeunying Kidul', 'kecamatan', (SELECT id FROM locations WHERE code = '32-73'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-73-220', 'Cibeunying Kaler', 'kecamatan', (SELECT id FROM locations WHERE code = '32-73'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-73-230', 'Coblong', 'kecamatan', (SELECT id FROM locations WHERE code = '32-73'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-73-240', 'Sukajadi', 'kecamatan', (SELECT id FROM locations WHERE code = '32-73'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-73-250', 'Sukasari', 'kecamatan', (SELECT id FROM locations WHERE code = '32-73'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-73-260', 'Cidadap', 'kecamatan', (SELECT id FROM locations WHERE code = '32-73'));

-- ============================================================
-- KECAMATAN - Kota Cirebon (5 kecamatan)
-- ============================================================
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-74-010', 'Harjamukti', 'kecamatan', (SELECT id FROM locations WHERE code = '32-74'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-74-020', 'Lemahwungkuk', 'kecamatan', (SELECT id FROM locations WHERE code = '32-74'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-74-030', 'Pekalipan', 'kecamatan', (SELECT id FROM locations WHERE code = '32-74'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-74-040', 'Kesambi', 'kecamatan', (SELECT id FROM locations WHERE code = '32-74'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-74-050', 'Kejaksan', 'kecamatan', (SELECT id FROM locations WHERE code = '32-74'));

-- ============================================================
-- KECAMATAN - Kota Bekasi (12 kecamatan)
-- ============================================================
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-75-010', 'Pondokgede', 'kecamatan', (SELECT id FROM locations WHERE code = '32-75'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-75-011', 'Jatisampurna', 'kecamatan', (SELECT id FROM locations WHERE code = '32-75'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-75-012', 'Pondokmelati', 'kecamatan', (SELECT id FROM locations WHERE code = '32-75'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-75-020', 'Jatiasih', 'kecamatan', (SELECT id FROM locations WHERE code = '32-75'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-75-030', 'Bantargebang', 'kecamatan', (SELECT id FROM locations WHERE code = '32-75'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-75-031', 'Mustikajaya', 'kecamatan', (SELECT id FROM locations WHERE code = '32-75'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-75-040', 'Bekasi Timur', 'kecamatan', (SELECT id FROM locations WHERE code = '32-75'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-75-041', 'Rawalumbu', 'kecamatan', (SELECT id FROM locations WHERE code = '32-75'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-75-050', 'Bekasi Selatan', 'kecamatan', (SELECT id FROM locations WHERE code = '32-75'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-75-060', 'Bekasi Barat', 'kecamatan', (SELECT id FROM locations WHERE code = '32-75'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-75-061', 'Medan Satria', 'kecamatan', (SELECT id FROM locations WHERE code = '32-75'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-75-070', 'Bekasi Utara', 'kecamatan', (SELECT id FROM locations WHERE code = '32-75'));

-- ============================================================
-- KECAMATAN - Kota Depok (11 kecamatan)
-- ============================================================
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-76-010', 'Sawangan', 'kecamatan', (SELECT id FROM locations WHERE code = '32-76'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-76-011', 'Bojongsari', 'kecamatan', (SELECT id FROM locations WHERE code = '32-76'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-76-020', 'Pancoran Mas', 'kecamatan', (SELECT id FROM locations WHERE code = '32-76'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-76-021', 'Cipayung', 'kecamatan', (SELECT id FROM locations WHERE code = '32-76'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-76-030', 'Sukmajaya', 'kecamatan', (SELECT id FROM locations WHERE code = '32-76'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-76-031', 'Cilodong', 'kecamatan', (SELECT id FROM locations WHERE code = '32-76'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-76-040', 'Cimanggis', 'kecamatan', (SELECT id FROM locations WHERE code = '32-76'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-76-041', 'Tapos', 'kecamatan', (SELECT id FROM locations WHERE code = '32-76'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-76-050', 'Beji', 'kecamatan', (SELECT id FROM locations WHERE code = '32-76'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-76-060', 'Limo', 'kecamatan', (SELECT id FROM locations WHERE code = '32-76'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-76-061', 'Cinere', 'kecamatan', (SELECT id FROM locations WHERE code = '32-76'));

-- ============================================================
-- KECAMATAN - Kota Cimahi (3 kecamatan)
-- ============================================================
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-77-010', 'Cimahi Selatan', 'kecamatan', (SELECT id FROM locations WHERE code = '32-77'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-77-020', 'Cimahi Tengah', 'kecamatan', (SELECT id FROM locations WHERE code = '32-77'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-77-030', 'Cimahi Utara', 'kecamatan', (SELECT id FROM locations WHERE code = '32-77'));

-- ============================================================
-- KECAMATAN - Kota Tasikmalaya (10 kecamatan)
-- ============================================================
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-78-010', 'Kawalu', 'kecamatan', (SELECT id FROM locations WHERE code = '32-78'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-78-020', 'Tamansari', 'kecamatan', (SELECT id FROM locations WHERE code = '32-78'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-78-030', 'Cibeureum', 'kecamatan', (SELECT id FROM locations WHERE code = '32-78'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-78-031', 'Purbaratu', 'kecamatan', (SELECT id FROM locations WHERE code = '32-78'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-78-040', 'Tawang', 'kecamatan', (SELECT id FROM locations WHERE code = '32-78'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-78-050', 'Cihideung', 'kecamatan', (SELECT id FROM locations WHERE code = '32-78'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-78-060', 'Mangkubumi', 'kecamatan', (SELECT id FROM locations WHERE code = '32-78'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-78-070', 'Indihiang', 'kecamatan', (SELECT id FROM locations WHERE code = '32-78'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-78-071', 'Bungursari', 'kecamatan', (SELECT id FROM locations WHERE code = '32-78'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-78-080', 'Cipedes', 'kecamatan', (SELECT id FROM locations WHERE code = '32-78'));

-- ============================================================
-- KECAMATAN - Kota Banjar (4 kecamatan)
-- ============================================================
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-79-010', 'Banjar', 'kecamatan', (SELECT id FROM locations WHERE code = '32-79'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-79-020', 'Purwaharja', 'kecamatan', (SELECT id FROM locations WHERE code = '32-79'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-79-030', 'Pataruman', 'kecamatan', (SELECT id FROM locations WHERE code = '32-79'));
INSERT INTO locations (code, name, level, parent_id) VALUES ('32-79-040', 'Langensari', 'kecamatan', (SELECT id FROM locations WHERE code = '32-79'));
