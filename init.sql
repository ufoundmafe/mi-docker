-- =====================================================================
-- UNIVERSIDAD DEL VALLE - LABORATORIO DE SISTEMAS OPERATIVOS
-- SCRIPT DE INICIALIZACIÓN Y CARGA MASIVA (init.sql)
-- =====================================================================

-- 1. Limpieza previa por si acaso deseas reiniciar el laboratorio
DROP TABLE IF EXISTS logs;
DROP TABLE IF EXISTS users;

-- 2. Creación de la tabla de Usuarios
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Creación de la tabla de Logs (Historial de acciones)
-- NOTA: No le ponemos índice a 'user_id' a propósito para que las búsquedas sean pesadas
CREATE TABLE logs (
    id SERIAL PRIMARY KEY,
    user_id INT,
    accion VARCHAR(250),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Inserción Masiva Automatizada usando PL/pgSQL (Bloque anónimo)
-- Esto llenará la base de datos con miles de registros en segundos
DO $$
BEGIN
    -- Insertar 50,000 usuarios de prueba
    INSERT INTO users (nombre, email)
    SELECT 
        'Estudiante_Univalle_' || i,
        'usuario.' || i || '@correounivalle.edu.co'
    FROM generate_series(1, 50000) AS i;

    -- Insertar 150,000 registros de logs asociados aleatoriamente a los usuarios
    INSERT INTO logs (user_id, accion)
    SELECT 
        floor(random() * 50000 + 1)::int,
        'El usuario ejecutó una operación en el contenedor Linux número ' || i
    FROM generate_series(1, 150000) AS i;
END $$;

-- 5. Función Especial para generar Estrés y Sobrecarga en la CPU de la BD
-- Esta función hace cruces de tablas masivos (Cross Joins) de forma repetitiva
CREATE OR REPLACE FUNCTION generate_stress(iteraciones INT)
RETURNS VOID AS $$
DECLARE
    contador INT := 0;
    record_aux RECORD;
BEGIN
    WHILE contador < iteraciones LOOP
        -- Forzar al motor de Postgres a hacer un Join gigantesco sin índices
        -- Esto pondrá a trabajar al procesador de tu contenedor al 100%
        PERFORM u.id, l.id 
        FROM users u 
        CROSS JOIN logs l 
        WHERE u.id <= 150 AND l.id <= 1500;
        
        contador := contador + 1;
    END LOOP;
END;
$$ LANGUAGE plpgsql;
