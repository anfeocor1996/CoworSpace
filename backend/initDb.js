// backend/initDb.js
const { dbConnection } = require('./db/database');

const initializeTables = () => {
    dbConnection.serialize(() => {
        // Habilitar foreign keys
        dbConnection.run('PRAGMA foreign_keys = ON');

        // Crear tabla de tipos de membresía
        dbConnection.run(`
            CREATE TABLE IF NOT EXISTS membership_types (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                description TEXT,
                price DECIMAL(10,2) NOT NULL,
                max_hours_month INTEGER,
                can_book_events BOOLEAN DEFAULT true,
                can_use_resources BOOLEAN DEFAULT true,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Crear tabla de miembros
        dbConnection.run(`
            CREATE TABLE IF NOT EXISTS members (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                email TEXT UNIQUE NOT NULL,
                phone TEXT,
                membership_type_id INTEGER,
                status TEXT DEFAULT 'active',
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (membership_type_id) REFERENCES membership_types(id)
            )
        `);

        // Crear tabla de espacios
        dbConnection.run(`
            CREATE TABLE IF NOT EXISTS spaces (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                description TEXT,
                type TEXT NOT NULL,
                max_capacity INTEGER NOT NULL,
                hourly_rate DECIMAL(10,2),
                is_available BOOLEAN DEFAULT true,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Crear tabla de recursos
        dbConnection.run(`
            CREATE TABLE IF NOT EXISTS resources (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                description TEXT,
                type TEXT NOT NULL,
                quantity INTEGER DEFAULT 1,
                is_available BOOLEAN DEFAULT true,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Crear tabla de relación entre espacios y recursos
        dbConnection.run(`
            CREATE TABLE IF NOT EXISTS space_resources (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                space_id INTEGER,
                resource_id INTEGER,
                quantity INTEGER DEFAULT 1,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (space_id) REFERENCES spaces(id) ON DELETE CASCADE,
                FOREIGN KEY (resource_id) REFERENCES resources(id) ON DELETE CASCADE
            )
        `);

        // Crear tabla de reservas
        dbConnection.run(`
            CREATE TABLE IF NOT EXISTS reservations (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                member_id INTEGER,
                space_id INTEGER,
                start_time DATETIME NOT NULL,
                end_time DATETIME NOT NULL,
                status TEXT DEFAULT 'pending',
                total_price DECIMAL(10,2),
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (member_id) REFERENCES members(id),
                FOREIGN KEY (space_id) REFERENCES spaces(id)
            )
        `);

        // Crear tabla de recursos reservados
        dbConnection.run(`
            CREATE TABLE IF NOT EXISTS reservation_resources (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                reservation_id INTEGER,
                resource_id INTEGER,
                quantity INTEGER DEFAULT 1,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (reservation_id) REFERENCES reservations(id) ON DELETE CASCADE,
                FOREIGN KEY (resource_id) REFERENCES resources(id)
            )
        `);

        // Crear tabla de eventos
        dbConnection.run(`
            CREATE TABLE IF NOT EXISTS events (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                description TEXT,
                space_id INTEGER,
                start_time DATETIME NOT NULL,
                end_time DATETIME NOT NULL,
                max_participants INTEGER NOT NULL,
                status TEXT DEFAULT 'scheduled',
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (space_id) REFERENCES spaces(id)
            )
        `);

        // Crear tabla de registro de eventos
        dbConnection.run(`
            CREATE TABLE IF NOT EXISTS event_registrations (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                event_id INTEGER,
                member_id INTEGER,
                status TEXT DEFAULT 'registered',
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
                FOREIGN KEY (member_id) REFERENCES members(id)
            )
        `);

        // Insertar datos de prueba
        insertSampleData();
    });
};

const insertSampleData = () => {
    // Insertar tipos de membresía
    const membershipTypes = [
        ['Básica', 'Acceso básico a espacios compartidos', 99.99, 40],
        ['Premium', 'Acceso completo a todos los espacios', 199.99, 80],
        ['Empresarial', 'Acceso ilimitado para equipos', 499.99, null]
    ];

    membershipTypes.forEach(([name, description, price, maxHours]) => {
        dbConnection.run(
            'INSERT OR IGNORE INTO membership_types (name, description, price, max_hours_month) VALUES (?, ?, ?, ?)',
            [name, description, price, maxHours]
        );
    });

    // Insertar espacios de prueba
    const spaces = [
        ['Sala de Reuniones A', 'Sala equipada para 10 personas', 'meeting_room', 10, 50.00],
        ['Oficina Privada 1', 'Oficina para 4 personas', 'private_office', 4, 30.00],
        ['Área de Coworking', 'Espacio compartido', 'coworking', 20, 15.00],
        ['Sala de Eventos', 'Espacio para eventos y workshops', 'event_space', 50, 100.00]
    ];

    spaces.forEach(([name, description, type, maxCapacity, hourlyRate]) => {
        dbConnection.run(
            'INSERT OR IGNORE INTO spaces (name, description, type, max_capacity, hourly_rate) VALUES (?, ?, ?, ?, ?)',
            [name, description, type, maxCapacity, hourlyRate]
        );
    });

    // Insertar recursos de prueba
    const resources = [
        ['Proyector 4K', 'Proyector de alta definición', 'projector', 2],
        ['Impresora Láser', 'Impresora a color', 'printer', 3],
        ['Sistema de Videoconferencia', 'Sistema completo', 'video_conference', 2],
        ['Cafetera Premium', 'Máquina de café profesional', 'coffee', 1]
    ];

    resources.forEach(([name, description, type, quantity]) => {
        dbConnection.run(
            'INSERT OR IGNORE INTO resources (name, description, type, quantity) VALUES (?, ?, ?, ?)',
            [name, description, type, quantity]
        );
    });

    console.log('Datos de prueba insertados correctamente');
};

// Ejecutar la inicialización
initializeTables();

// Manejar el cierre de la conexión
process.on('SIGINT', () => {
    dbConnection.close((err) => {
        if (err) {
            console.error('Error al cerrar la base de datos:', err.message);
        } else {
            console.log('Conexión a la base de datos cerrada');
        }
        process.exit(0);
    });
});