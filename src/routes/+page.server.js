// Load 25 top images, excluding images from blocked users
import pool from '$lib/server/database';
import { getUser } from '$lib/server/auth';

export async function load({ cookies }) {
    // Get current logged in user
    const user = await getUser(cookies);

    let images;

    if (user) {
        // Fetch images excluding blocked users
        const [rows] = await pool.query(`
            SELECT i.*, u.username, u.avatar_url
            FROM images i
            JOIN users u ON i.author_id = u.id
            WHERE i.author_id NOT IN (
                SELECT blocked_id FROM blocks WHERE blocker_id = ?
            )
            ORDER BY i.vote_count DESC, i.created_at DESC
            LIMIT 25
        `, [user.id]);
        images = rows;
    } else {
        // Guest sees all images
        const [rows] = await pool.query(`
            SELECT i.*, u.username, u.avatar_url
            FROM images i
            JOIN users u ON i.author_id = u.id
            ORDER BY i.vote_count DESC, i.created_at DESC
            LIMIT 25
        `);
        images = rows;
    }

    return { images, user };
}