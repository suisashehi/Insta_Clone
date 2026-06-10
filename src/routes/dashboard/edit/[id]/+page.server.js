// Edit image description and category
import pool from '$lib/server/database';
import { getUser } from '$lib/server/auth';
import { redirect, error } from '@sveltejs/kit';

export async function load({ params, cookies }) {
    // Redirect to login if not logged in
    const user = await getUser(cookies);
    if (!user) throw redirect(303, '/auth/login');

    // Fetch image and check ownership
    const [rows] = await pool.query(
        'SELECT * FROM images WHERE id = ? AND author_id = ?',
        [params.id, user.id]
    );

    // Return 404 if image not found or not owned by user
    if (rows.length === 0) throw error(404, 'Image not found');

    return { image: rows[0], user };
}

export const actions = {
    // Update image description and category
    default: async ({ request, cookies, params }) => {
        const user = await getUser(cookies);
        if (!user) throw redirect(303, '/auth/login');

        const formData = await request.formData();
        const description = formData.get('description');
        const category = formData.get('category');

        // Update image in database
        await pool.query(
            'UPDATE images SET description = ?, category = ? WHERE id = ? AND author_id = ?',
            [description, category, params.id, user.id]
        );

        // Redirect back to dashboard after saving
        throw redirect(303, '/dashboard');
    }
};