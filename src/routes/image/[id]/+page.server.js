// Load image detail page with comments, vote and bookmark status
import pool from '$lib/server/database';
import { getUser } from '$lib/server/auth';
import { error } from '@sveltejs/kit';

export async function load({ params, cookies }) {
    // Get current user
    const user = await getUser(cookies);

    // Fetch image with author info
    const [images] = await pool.query(`
        SELECT i.*, u.username, u.avatar_url
        FROM images i
        JOIN users u ON i.author_id = u.id
        WHERE i.id = ?
    `, [params.id]);

    // Return 404 if image not found
    if (images.length === 0) throw error(404, 'Image not found');

    // Increment view counter
    await pool.query('UPDATE images SET views = views + 1 WHERE id = ?', [params.id]);

    // Fetch comments for this image
    const [comments] = await pool.query(`
        SELECT c.*, u.username, u.avatar_url
        FROM comments c
        JOIN users u ON c.user_id = u.id
        WHERE c.image_id = ?
        ORDER BY c.created_at DESC
    `, [params.id]);

    // Check if current user already voted
    let hasVoted = false;
    if (user) {
        const [votes] = await pool.query(
            'SELECT id FROM votes WHERE image_id = ? AND user_id = ?',
            [params.id, user.id]
        );
        hasVoted = votes.length > 0;
    }

    // Check if current user has bookmarked this image
    let hasBookmarked = false;
    if (user) {
        const [bookmarks] = await pool.query(
            'SELECT id FROM bookmarks WHERE image_id = ? AND user_id = ?',
            [params.id, user.id]
        );
        hasBookmarked = bookmarks.length > 0;
    }

    return { image: images[0], comments, user, hasVoted, hasBookmarked };
}

export const actions = {
    // Add a comment to the image
    comment: async ({ request, cookies, params }) => {
        const user = await getUser(cookies);
        if (!user) return { error: 'Login required' };

        const formData = await request.formData();
        const content = formData.get('content');

        if (!content) return { error: 'Comment cannot be empty' };

        // Insert comment into database
        await pool.query(
            'INSERT INTO comments (image_id, user_id, content) VALUES (?, ?, ?)',
            [params.id, user.id, content]
        );

        return { success: true };
    },

    // Upvote or remove vote from an image
    vote: async ({ cookies, params }) => {
        const user = await getUser(cookies);
        if (!user) return { error: 'Login required' };

        // Check if user already voted
        const [existing] = await pool.query(
            'SELECT id FROM votes WHERE image_id = ? AND user_id = ?',
            [params.id, user.id]
        );

        if (existing.length > 0) {
            // Remove vote if already voted
            await pool.query('DELETE FROM votes WHERE image_id = ? AND user_id = ?', [params.id, user.id]);
            await pool.query('UPDATE images SET vote_count = vote_count - 1 WHERE id = ?', [params.id]);
        } else {
            // Add new vote
            await pool.query('INSERT INTO votes (image_id, user_id) VALUES (?, ?)', [params.id, user.id]);
            await pool.query('UPDATE images SET vote_count = vote_count + 1 WHERE id = ?', [params.id]);
        }

        return { success: true };
    },

    // Toggle bookmark for this image
    bookmark: async ({ cookies, params }) => {
        const user = await getUser(cookies);
        if (!user) return { error: 'Login required' };

        // Check if already bookmarked
        const [existing] = await pool.query(
            'SELECT id FROM bookmarks WHERE image_id = ? AND user_id = ?',
            [params.id, user.id]
        );

        if (existing.length > 0) {
            // Remove bookmark
            await pool.query(
                'DELETE FROM bookmarks WHERE image_id = ? AND user_id = ?',
                [params.id, user.id]
            );
        } else {
            // Add bookmark
            await pool.query(
                'INSERT INTO bookmarks (image_id, user_id) VALUES (?, ?)',
                [params.id, user.id]
            );
        }

        return { success: true };
    },

    // Report a comment as inappropriate
    report: async ({ request, cookies }) => {
        const user = await getUser(cookies);
        if (!user) return { error: 'Login required' };

        const formData = await request.formData();
        const comment_id = formData.get('comment_id');
        const reason = formData.get('reason');

        // Check if user already reported this comment
        const [existing] = await pool.query(
            'SELECT id FROM reports WHERE comment_id = ? AND reported_by = ?',
            [comment_id, user.id]
        );

        if (existing.length > 0) return { error: 'Already reported' };

        // Insert report into database
        await pool.query(
            'INSERT INTO reports (comment_id, reported_by, reason) VALUES (?, ?, ?)',
            [comment_id, user.id, reason ?? 'other']
        );

        return { success: true };
    }
};