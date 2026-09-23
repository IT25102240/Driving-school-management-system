const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const path = require('path');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 8080;
const JWT_SECRET = 'drivesafe_super_secret_key'; // In a real app, use environment variables

app.use(cors());
app.use(express.json());

// Serve static files from the current directory
app.use(express.static(__dirname));

// ==========================================
// Authentication Middleware
// ==========================================
const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1];
        jwt.verify(token, JWT_SECRET, (err, user) => {
            if (err) return res.sendStatus(403);
            req.user = user;
            next();
        });
    } else {
        res.sendStatus(401);
    }
};

// ==========================================
// Auth APIs
// ==========================================
app.post('/api/auth/login', (req, res) => {
    const { username, password, role } = req.body;
    db.get("SELECT * FROM users WHERE username = ? AND password = ? AND role = ?", [username, password, role], (err, user) => {
        if (err) return res.status(500).json({ error: err.message });
        if (user) {
            const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: '2h' });
            res.json({ token, role: user.role });
        } else {
            res.status(401).json({ error: "Invalid credentials or role" });
        }
    });
});

// ==========================================
// Dashboard Stats APIs
// ==========================================
app.get('/api/dashboard/stats', authenticate, (req, res) => {
    const stats = {};
    const queries = [
        new Promise((resolve, reject) => db.get("SELECT count(*) as count FROM students", (err, row) => err ? reject(err) : resolve({ key: 'students', val: row.count }))),
        new Promise((resolve, reject) => db.get("SELECT count(*) as count FROM instructors", (err, row) => err ? reject(err) : resolve({ key: 'instructors', val: row.count }))),
        new Promise((resolve, reject) => db.get("SELECT count(*) as count FROM vehicles", (err, row) => err ? reject(err) : resolve({ key: 'vehicles', val: row.count }))),
        new Promise((resolve, reject) => db.get("SELECT count(*) as count FROM lessons", (err, row) => err ? reject(err) : resolve({ key: 'lessons', val: row.count }))),
        new Promise((resolve, reject) => db.get("SELECT sum(amount) as total FROM payments", (err, row) => err ? reject(err) : resolve({ key: 'revenue', val: row.total || 0 })))
    ];

    Promise.all(queries).then(results => {
        results.forEach(r => stats[r.key] = r.val);
        res.json(stats);
    }).catch(err => res.status(500).json({ error: err.message }));
});

// ==========================================
// Generic CRUD Generator
// ==========================================
const createCrudApis = (tableName, fields) => {
    // GET all
    app.get(`/api/${tableName}`, authenticate, (req, res) => {
        db.all(`SELECT * FROM ${tableName}`, (err, rows) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(rows);
        });
    });

    // GET one
    app.get(`/api/${tableName}/:id`, authenticate, (req, res) => {
        db.get(`SELECT * FROM ${tableName} WHERE id = ?`, [req.params.id], (err, row) => {
            if (err) return res.status(500).json({ error: err.message });
            if (!row) return res.status(404).json({ error: 'Not found' });
            res.json(row);
        });
    });

    // POST (Create)
    app.post(`/api/${tableName}`, authenticate, (req, res) => {
        const placeholders = fields.map(() => '?').join(',');
        const values = fields.map(f => req.body[f]);
        const sql = `INSERT INTO ${tableName} (${fields.join(',')}) VALUES (${placeholders})`;
        
        db.run(sql, values, function(err) {
            if (err) return res.status(500).json({ error: err.message });
            res.status(201).json({ id: this.lastID, ...req.body });
        });
    });

    // PUT (Update)
    app.put(`/api/${tableName}/:id`, authenticate, (req, res) => {
        const setClause = fields.map(f => `${f} = ?`).join(',');
        const values = fields.map(f => req.body[f]);
        values.push(req.params.id);
        const sql = `UPDATE ${tableName} SET ${setClause} WHERE id = ?`;

        db.run(sql, values, function(err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ id: req.params.id, ...req.body });
        });
    });

    // DELETE
    app.delete(`/api/${tableName}/:id`, authenticate, (req, res) => {
        db.run(`DELETE FROM ${tableName} WHERE id = ?`, [req.params.id], function(err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ deleted: this.changes });
        });
    });
};

// Generate CRUD endpoints for all entities
createCrudApis('students', ['name', 'email', 'phone', 'package', 'status']);
createCrudApis('instructors', ['name', 'license', 'phone', 'specialization', 'availability']);
createCrudApis('vehicles', ['model', 'plate', 'transmission', 'status', 'serviceDate']);
createCrudApis('lessons', ['student', 'instructor', 'vehicle', 'dateTime', 'status']);
createCrudApis('payments', ['student', 'amount', 'method', 'date']);

// Fallback to index.html for any other route (SPA behavior)
app.use((req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start Server
app.listen(PORT, () => {
    console.log(`DriveSafe Pro API server running on http://localhost:${PORT}`);
});
