// Load all bookmarked images for current user
import pool from '$lib/server/database';
import { getUser } from '$lib/server/auth';
import { redirect } from '@sveltejs/kit';

export async function load({ cookies }) {
    // Redirect to login if not logged in
    const user = await getUser(cookies);
    if (!user) throw redirect(303, '/auth/login');

    // Fetch all bookmarked images with author info
    const [images] = await pool.query(`
        SELECT i.*, u.username, u.avatar_url
        FROM bookmarks b
        JOIN images i ON b.image_id = i.id
        JOIN users u ON i.author_id = u.id
        WHERE b.user_id = ?
        ORDER BY b.created_at DESC
    `, [user.id]);

    return { images, user };
}