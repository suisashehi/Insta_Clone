// Handle user login with session creation
import { verifyPassword, createSession } from '$lib/server/auth';
import pool from '$lib/server/database';
import { fail, redirect } from '@sveltejs/kit';

export const actions = {
    default: async ({ request, cookies }) => {
        const formData = await request.formData();
        const email = formData.get('email');
        const password = formData.get('password');

        // Basic validation
        if (!email || !password) {
            return fail(400, { error: 'All fields are required' });
        }

        // Find user by email
        const [rows] = await pool.query(
            'SELECT * FROM users WHERE email = ?',
            [email]
        );

        // Return same error for both wrong email and wrong password (security)
        if (rows.length === 0) {
            return fail(400, { error: 'Invalid email or password' });
        }

        // Verify password against stored hash
        const user = rows[0];
        const valid = await verifyPassword(password, user.password_hash);

        if (!valid) {
            return fail(400, { error: 'Invalid email or password' });
        }

        // Create session in DB and set cookie
        const sessionId = await createSession(user.id);
        cookies.set('session_id', sessionId, {
            path: '/',
            httpOnly: true,
            maxAge: 60 * 60 * 24 * 30 // 30 days
        });

        // Redirect to dashboard after successful login
        throw redirect(303, '/dashboard');
    }
};