import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

// Path to the database file
const dbPath = './database.db';

async function setupDatabase() {
    try {
        const db = await open({
            filename: dbPath,
            driver: sqlite3.Database
        });

        // Create the table if it does not exist
        await db.exec(`
            CREATE TABLE IF NOT EXISTS price_plan (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                plan_name TEXT NOT NULL,
                sms_price REAL,
                call_price REAL
            )
        `);

        // Insert initial data
        await db.exec(`
            INSERT INTO price_plan (plan_name, sms_price, call_price) VALUES 
            ('sms 101', 2.35, 0.37),
            ('call 101', 1.75, 0.65),
            ('call 201', 1.85, 0.85)
        `);

        console.log('Database setup complete.');
    } catch (err) {
        console.error('Error setting up database', err);
    }
}

setupDatabase();
