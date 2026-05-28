// Auth helpers: password hashing, session creation and validation
import pool from './database.js';
import bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';

// Hash a plain text password
export async function hashPassword(password) {
    return await bcrypt.hash(password, 10);
}

// Compare plain text password with stored hash
export async function verifyPassword(password, hash) {
    return await bcrypt.compare(password, hash);
}

// Create a new session in DB and return the session id
export async function createSession(userId) {
    const sessionId = randomUUID();
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

    await pool.execute(
        'INSERT INTO sessions (id, user_id, expires_at) VALUES (?, ?, ?)',
        [sessionId, userId, expiresAt]
    );

    return sessionId;
}

// Validate session and return user if session is still active
export async function validateSession(sessionId) {
    const [rows] = await pool.execute(
        `SELECT u.id, u.username, u.email, u.role 
         FROM sessions s 
         JOIN users u ON s.user_id = u.id 
         WHERE s.id = ? AND s.expires_at > NOW()`,
        [sessionId]
    );

    return rows[0] ?? null;
}

// Delete session from DB on logout
export async function invalidateSession(sessionId) {
    await pool.execute('DELETE FROM sessions WHERE id = ?', [sessionId]);
}

// Get current user from cookie
export async function getUser(cookies) {
    const sessionId = cookies.get('session_id');
    if (!sessionId) return null;
    return await validateSession(sessionId);
}