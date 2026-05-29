// Handle user registration with password hashing and session creation
import { hashPassword, createSession } from '$lib/server/auth';
import pool from '$lib/server/database';
import { fail, redirect } from '@sveltejs/kit';

export const actions = {
    default: async ({ request, cookies }) => {
        const formData = await request.formData();
        const username = formData.get('username');
        const email = formData.get('email');
        const password = formData.get('password');

        // Basic validation
        if (!username || !email || !password) {
            return fail(400, { error: 'All fields are required' });
        }

        // Check if username or email already exists
        const [existing] = await pool.query(
            'SELECT id FROM users WHERE username = ? OR email = ?',
            [username, email]
        );

        if (existing.length > 0) {
            return fail(400, { error: 'Username or email already taken' });
        }

        // Hash password and insert new user
        const password_hash = await hashPassword(password);
        const [result] = await pool.query(
            'INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)',
            [username, email, password_hash]
        );

        // Create session in DB and set cookie
        const sessionId = await createSession(result.insertId);
        cookies.set('session_id', sessionId, {
            path: '/',
            httpOnly: true,
            maxAge: 60 * 60 * 24 * 30
        });

        throw redirect(303, '/dashboard');
    }
};