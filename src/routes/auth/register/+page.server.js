// Handle user registration with optional profile image upload
import { hashPassword, createSession } from '$lib/server/auth';
import pool from '$lib/server/database';
import { fail, redirect } from '@sveltejs/kit';
import { put } from '@vercel/blob';
import { BLOB_READ_WRITE_TOKEN } from '$env/static/private';

export const actions = {
    default: async ({ request, cookies }) => {
        const formData = await request.formData();
        const username = formData.get('username');
        const email = formData.get('email');
        const password = formData.get('password');
        const avatar = formData.get('avatar');

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

        // Upload avatar to Vercel Blob if provided
        let avatar_url = null;
        if (avatar && avatar.size > 0) {
            const blob = await put(`avatars/${username}-${Date.now()}`, avatar, {
                access: 'public',
                token: BLOB_READ_WRITE_TOKEN
            });
            avatar_url = blob.url;
        }

        // Hash password and insert new user with avatar
        const password_hash = await hashPassword(password);
        const [result] = await pool.query(
            'INSERT INTO users (username, email, password_hash, avatar_url) VALUES (?, ?, ?, ?)',
            [username, email, password_hash, avatar_url]
        );

        // Create session and set cookie
        const sessionId = await createSession(result.insertId);
        cookies.set('session_id', sessionId, {
            path: '/',
            httpOnly: true,
            maxAge: 60 * 60 * 24 * 30
        });

        throw redirect(303, '/dashboard');
    }
};