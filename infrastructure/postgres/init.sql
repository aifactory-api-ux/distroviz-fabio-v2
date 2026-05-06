CREATE TABLE IF NOT EXISTS ordenes (
    id SERIAL PRIMARY KEY,
    fecha TEXT NOT NULL,
    planta TEXT NOT NULL,
    centroDistribucion TEXT NOT NULL,
    producto TEXT NOT NULL,
    cantidad INTEGER NOT NULL CHECK (cantidad >= 0),
    estado TEXT NOT NULL CHECK (estado IN ('pendiente', 'despachado', 'entregado'))
);

INSERT INTO ordenes (fecha, planta, centroDistribucion, producto, cantidad, estado)
SELECT '2024-06-01', 'Planta Norte', 'CD Central', 'Producto A', 100, 'pendiente'
WHERE NOT EXISTS (SELECT 1 FROM ordenes WHERE fecha = '2024-06-01' AND planta = 'Planta Norte');

INSERT INTO ordenes (fecha, planta, centroDistribucion, producto, cantidad, estado)
SELECT '2024-06-02', 'Planta Sur', 'CD Sur', 'Producto B', 200, 'despachado'
WHERE NOT EXISTS (SELECT 1 FROM ordenes WHERE fecha = '2024-06-02' AND planta = 'Planta Sur');

INSERT INTO ordenes (fecha, planta, centroDistribucion, producto, cantidad, estado)
SELECT '2024-06-03', 'Planta Este', 'CD Este', 'Producto C', 150, 'entregado'
WHERE NOT EXISTS (SELECT 1 FROM ordenes WHERE fecha = '2024-06-03' AND planta = 'Planta Este');

INSERT INTO ordenes (fecha, planta, centroDistribucion, producto, cantidad, estado)
SELECT '2024-06-04', 'Planta Oeste', 'CD Oeste', 'Producto D', 300, 'pendiente'
WHERE NOT EXISTS (SELECT 1 FROM ordenes WHERE fecha = '2024-06-04' AND planta = 'Planta Oeste');

INSERT INTO ordenes (fecha, planta, centroDistribucion, producto, cantidad, estado)
SELECT '2024-06-05', 'Planta Norte', 'CD Central', 'Producto A', 250, 'despachado'
WHERE NOT EXISTS (SELECT 1 FROM ordenes WHERE fecha = '2024-06-05' AND planta = 'Planta Norte');