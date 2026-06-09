// Load 25 top images with comment count, excluding blocked users
import pool from '$lib/server/database';
import { getUser } from '$lib/server/auth';

export async function load({ cookies }) {
    // Get current logged in user
    const user = await getUser(cookies);

    let images;

    if (user) {
        // Fetch images excluding blocked users with comment count
        const [rows] = await pool.query(`
            SELECT i.*, u.username, u.avatar_url,
                COUNT(c.id) AS comment_count
            FROM images i
            JOIN users u ON i.author_id = u.id
            LEFT JOIN comments c ON c.image_id = i.id
            WHERE i.author_id NOT IN (
                SELECT blocked_id FROM blocks WHERE blocker_id = ?
            )
            GROUP BY i.id
            ORDER BY i.vote_count DESC, i.created_at DESC
            LIMIT 25
        `, [user.id]);
        images = rows;
    } else {
        // Guest sees all images with comment count
        const [rows] = await pool.query(`
            SELECT i.*, u.username, u.avatar_url,
                COUNT(c.id) AS comment_count
            FROM images i
            JOIN users u ON i.author_id = u.id
            LEFT JOIN comments c ON c.image_id = i.id
            GROUP BY i.id
            ORDER BY i.vote_count DESC, i.created_at DESC
            LIMIT 25
        `);
        images = rows;
    }

    return { images, user };
}