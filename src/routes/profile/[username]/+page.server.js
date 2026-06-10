// Load user profile page with images, comments and block status
import pool from '$lib/server/database';
import { getUser } from '$lib/server/auth';
import { error } from '@sveltejs/kit';

export async function load({ params, cookies }) {
    // Get current logged in user
    const user = await getUser(cookies);

    // Find the profile user by username
    const [users] = await pool.query(
        'SELECT id, username, avatar_url, created_at FROM users WHERE username = ?',
        [params.username]
    );

    // Return 404 if user not found
    if (users.length === 0) throw error(404, 'User not found');

    const profileUser = users[0];

    // Get all images by this user
    const [images] = await pool.query(
        'SELECT * FROM images WHERE author_id = ? ORDER BY created_at DESC',
        [profileUser.id]
    );

    // Get all comments by this user with image info
    const [comments] = await pool.query(`
        SELECT c.*, i.image_url, i.id AS image_id
        FROM comments c
        JOIN images i ON c.image_id = i.id
        WHERE c.user_id = ?
        ORDER BY c.created_at DESC
    `, [profileUser.id]);

    // Check if current user has blocked this profile
    let isBlocked = false;
    if (user) {
        const [blocks] = await pool.query(
            'SELECT id FROM blocks WHERE blocker_id = ? AND blocked_id = ?',
            [user.id, profileUser.id]
        );
        isBlocked = blocks.length > 0;
    }

    return { profileUser, images, comments, user, isBlocked };
}

export const actions = {
    // Toggle block or unblock a user
    block: async ({ cookies, params }) => {
        const user = await getUser(cookies);
        if (!user) return { error: 'Login required' };

        // Get the profile user id by username
        const [users] = await pool.query(
            'SELECT id FROM users WHERE username = ?',
            [params.username]
        );

        if (users.length === 0) return { error: 'User not found' };
        const profileUserId = users[0].id;

        // Check if already blocked
        const [existing] = await pool.query(
            'SELECT id FROM blocks WHERE blocker_id = ? AND blocked_id = ?',
            [user.id, profileUserId]
        );

        if (existing.length > 0) {
            // Unblock user
            await pool.query(
                'DELETE FROM blocks WHERE blocker_id = ? AND blocked_id = ?',
                [user.id, profileUserId]
            );
        } else {
            // Block user
            await pool.query(
                'INSERT INTO blocks (blocker_id, blocked_id) VALUES (?, ?)',
                [user.id, profileUserId]
            );
        }

        return { success: true };
    }
};