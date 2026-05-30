// Load 25 top images for homepage ordered by votes
import pool from '$lib/server/database';
import { getUser } from '$lib/server/auth';

export async function load({ cookies }) {
    // Get current logged in user from session
    const user = await getUser(cookies);

    // Fetch 25 most voted images with author info
    const [images] = await pool.query(`
        SELECT i.*, u.username, u.avatar_url
        FROM images i
        JOIN users u ON i.author_id = u.id
        ORDER BY i.vote_count DESC, i.created_at DESC
        LIMIT 25
    `);

    // Return images and user to page
    return { images, user };
}