import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

(async () => {
    const db = await open({
        filename: path.join(__dirname, 'database.db'),
        driver: sqlite3.Database
    });

    await db.exec(`
        CREATE TABLE IF NOT EXISTS price_plan_totals (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            plan_name TEXT,
            total_spent REAL
        );
    `);

    console.log('Table price_plan_totals created or already exists.');
    await db.close();
})();
