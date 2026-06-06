// Admin panel - only accessible for admin users
import pool from '$lib/server/database';
import { getUser } from '$lib/server/auth';
import { redirect, error } from '@sveltejs/kit';

export async function load({ cookies }) {
    // Get current user and check admin role
    const user = await getUser(cookies);
    if (!user) throw redirect(303, '/auth/login');
    if (user.role !== 'admin') throw error(403, 'Access denied');

    // Fetch all users
    const [users] = await pool.query(
        'SELECT id, username, email, role, created_at FROM users ORDER BY created_at DESC'
    );

    // Fetch all images with author info
    const [images] = await pool.query(`
        SELECT i.*, u.username
        FROM images i
        JOIN users u ON i.author_id = u.id
        ORDER BY i.created_at DESC
    `);

    // Fetch all pending reports with comment and reporter info
    const [reports] = await pool.query(`
        SELECT r.*, c.content, c.id AS comment_id, u.username AS reporter, u2.username AS commenter
        FROM reports r
        JOIN comments c ON r.comment_id = c.id
        JOIN users u ON r.reported_by = u.id
        JOIN users u2 ON c.user_id = u2.id
        WHERE r.status = 'pending'
        ORDER BY r.created_at DESC
    `);

    return { users, images, reports, user };
}

export const actions = {
    // Delete a user by id
    deleteUser: async ({ request, cookies }) => {
        const user = await getUser(cookies);
        if (!user || user.role !== 'admin') throw error(403, 'Access denied');

        const formData = await request.formData();
        const id = formData.get('id');

        // Delete user from database
        await pool.query('DELETE FROM users WHERE id = ?', [id]);
        return { success: true };
    },

    // Delete an image by id
    deleteImage: async ({ request, cookies }) => {
        const user = await getUser(cookies);
        if (!user || user.role !== 'admin') throw error(403, 'Access denied');

        const formData = await request.formData();
        const id = formData.get('id');

        // Delete image from database
        await pool.query('DELETE FROM images WHERE id = ?', [id]);
        return { success: true };
    },

    // Delete a reported comment and mark report as reviewed
    deleteComment: async ({ request, cookies }) => {
        const user = await getUser(cookies);
        if (!user || user.role !== 'admin') throw error(403, 'Access denied');

        const formData = await request.formData();
        const comment_id = formData.get('comment_id');
        const report_id = formData.get('report_id');

        // Delete comment from database
        await pool.query('DELETE FROM comments WHERE id = ?', [comment_id]);

        // Mark report as reviewed
        await pool.query('UPDATE reports SET status = ? WHERE id = ?', ['reviewed', report_id]);

        return { success: true };
    },

    // Dismiss a report without deleting comment
    dismissReport: async ({ request, cookies }) => {
        const user = await getUser(cookies);
        if (!user || user.role !== 'admin') throw error(403, 'Access denied');

        const formData = await request.formData();
        const id = formData.get('id');

        // Mark report as dismissed
        await pool.query('UPDATE reports SET status = ? WHERE id = ?', ['dismissed', id]);
        return { success: true };
    }
};