-- ============================================================================
-- GOBIERNO AUTÓNOMO MUNICIPAL DE EL ALTO — GAMEA
-- Semilla de Datos de las 14 Subalcaldías y Dependencias Piloto
-- ============================================================================

-- Oficinas Centrales / Secretarías
INSERT INTO dependencias (id, codigo, nombre, tipo, es_subalcaldia, distrito_municipal) VALUES
('11111111-1111-1111-1111-111111111111', 'DESPACHO-ALCALDESA', 'Despacho de la Alcaldesa Municipal', 'DESPACHO', FALSE, NULL),
('22222222-2222-2222-2222-222222222222', 'SEC-ADMIN-FINANZAS', 'Secretaría Municipal de Administración y Finanzas', 'SECRETARIA', FALSE, NULL),
('33333333-3333-3333-3333-333333333333', 'DIR-TECNOLOGIAS-INF', 'Dirección General de Tecnologías e Información', 'DIRECCION', FALSE, NULL),
('44444444-4444-4444-4444-444444444444', 'DIR-INFRAESTRUCTURA', 'Dirección de Infraestructura Pública', 'DIRECCION', FALSE, NULL),
('55555555-5555-5555-5555-555555555555', 'DIR-JURIDICA', 'Dirección General de Asesoría Jurídica', 'DIRECCION', FALSE, NULL);

-- Las 14 Subalcaldías de El Alto (Ciudadanos Organizacionales de Primer Nivel)
INSERT INTO dependencias (codigo, nombre, tipo, es_subalcaldia, distrito_municipal) VALUES
('SUBALCALDIA-D1', 'Subalcaldía Distrito Municipal 1 (Villa Dolores / Santa Rosa)', 'SUBALCALDIA', TRUE, 1),
('SUBALCALDIA-D2', 'Subalcaldía Distrito Municipal 2 (Bolívar / Senkata)', 'SUBALCALDIA', TRUE, 2),
('SUBALCALDIA-D3', 'Subalcaldía Distrito Municipal 3 (Pacajes / Villa Adela)', 'SUBALCALDIA', TRUE, 3),
('SUBALCALDIA-D4', 'Subalcaldía Distrito Municipal 4 (Río Seco / Cosmos 79)', 'SUBALCALDIA', TRUE, 4),
('SUBALCALDIA-D5', 'Subalcaldía Distrito Municipal 5 (Huayna Potosí / Villa Ingenio)', 'SUBALCALDIA', TRUE, 5),
('SUBALCALDIA-D6', 'Subalcaldía Distrito Municipal 6 (Alto Lima / Ballivián)', 'SUBALCALDIA', TRUE, 6),
('SUBALCALDIA-D7', 'Subalcaldía Distrito Municipal 7 (San Roque / Lagunas)', 'SUBALCALDIA', TRUE, 7),
('SUBALCALDIA-D8', 'Subalcaldía Distrito Municipal 8 (Senkata / Mercedes)', 'SUBALCALDIA', TRUE, 8),
('SUBALCALDIA-D9', 'Subalcaldía Distrito Municipal 9 (Distrito Rural Pomamaya)', 'SUBALCALDIA', TRUE, 9),
('SUBALCALDIA-D10', 'Subalcaldía Distrito Municipal 10 (Distrito Rural Amachuma)', 'SUBALCALDIA', TRUE, 10),
('SUBALCALDIA-D11', 'Subalcaldía Distrito Municipal 11 (Distrito Rural Santa Ana)', 'SUBALCALDIA', TRUE, 11),
('SUBALCALDIA-D12', 'Subalcaldía Distrito Municipal 12 (Alto de la Alianza)', 'SUBALCALDIA', TRUE, 12),
('SUBALCALDIA-D13', 'Subalcaldía Distrito Municipal 13 (Distrito Rural El Ingenio)', 'SUBALCALDIA', TRUE, 13),
('SUBALCALDIA-D14', 'Subalcaldía Distrito Municipal 14 (Bautista Saavedra)', 'SUBALCALDIA', TRUE, 14);
