import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

const app = express();
const port = 3000;

// Determine the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Database setup
async function setupDatabase() {
    const db = await open({
        filename: './database.db',
        driver: sqlite3.Database
    });
    
    // Create price_plan table if it doesn't exist
    await db.exec(`
        CREATE TABLE IF NOT EXISTS price_plan (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            plan_name TEXT NOT NULL,
            sms_price REAL NOT NULL,
            call_price REAL NOT NULL
        )
    `);

    // Insert default price plans if not already present
    const count = await db.get('SELECT COUNT(*) as count FROM price_plan');
    if (count.count === 0) {
        await db.exec(`
            INSERT INTO price_plan (plan_name, sms_price, call_price) 
            VALUES 
            ('sms 101', 2.35, 0.37),
            ('call 101', 1.75, 0.65),
            ('call 201', 1.85, 0.85)
        `);
    }
}

// Fetch all price plans
app.get('/api/price_plans', async (req, res) => {
    try {
        const db = await open({
            filename: './database.db',
            driver: sqlite3.Database
        });
        const pricePlans = await db.all('SELECT * FROM price_plan');
        res.json({ pricePlans });
    } catch (err) {
        console.error('Error fetching price plans:', err);
        res.status(500).json({ error: 'Error fetching price plans' });
    }
});

// Calculate total bill
app.post('/api/calculate_total', async (req, res) => {
    try {
        const { planId, actions } = req.body;

        if (!planId || !actions) {
            return res.status(400).json({ error: 'Missing planId or actions' });
        }

        const db = await open({
            filename: './database.db',
            driver: sqlite3.Database
        });

        const plan = await db.get('SELECT * FROM price_plan WHERE id = ?', [planId]);

        if (!plan) {
            return res.status(404).json({ error: 'Plan not found' });
        }

        const actionsList = actions.split(',').map(action => action.trim().toLowerCase());

        let totalBill = 0;

        actionsList.forEach(action => {
            if (action === 'call') {
                totalBill += plan.call_price;
            } else if (action === 'sms') {
                totalBill += plan.sms_price;
            } else {
                return res.status(400).json({ error: `Invalid action "${action}". Valid actions are "call" and "sms".` });
            }
        });

        res.json({ totalBill: totalBill.toFixed(2) });
    } catch (err) {
        console.error('Error calculating total bill:', err);
        res.status(500).json({ error: 'Error calculating total bill' });
    }
});

// Start server and setup database
setupDatabase().then(() => {
    app.listen(port, () => {
        console.log(`Server running on http://localhost:${port}`);
    });
});
