// Dashboard - only accessible for logged in users
import { getUser } from '$lib/server/auth';
import { redirect } from '@sveltejs/kit';
import pool from '$lib/server/database';
import { put, del } from '@vercel/blob';
import { BLOB_READ_WRITE_TOKEN } from '$env/static/private';

export async function load({ cookies }) {
    // Redirect to login if not logged in
    const user = await getUser(cookies);
    if (!user) throw redirect(303, '/auth/login');

    // Fetch only the logged in user's images
    const [images] = await pool.query(
        'SELECT * FROM images WHERE author_id = ? ORDER BY created_at DESC',
        [user.id]
    );

    return { user, images };
}

export const actions = {
    // Upload a new image to Vercel Blob and save to DB
    upload: async ({ request, cookies }) => {
        const user = await getUser(cookies);
        if (!user) throw redirect(303, '/auth/login');

        const formData = await request.formData();
        const file = formData.get('image');
        const description = formData.get('description');
        const category = formData.get('category');
        const filter = formData.get('filter');

        // Upload image file to Vercel Blob
        const blob = await put(`images/${Date.now()}-${file.name}`, file, {
            access: 'public',
            token: BLOB_READ_WRITE_TOKEN
        });

        // Save image record to database
        await pool.query(
            'INSERT INTO images (image_url, description, author_id, category, filter) VALUES (?, ?, ?, ?, ?)',
            [blob.url, description, user.id, category, filter]
        );

        return { success: true };
    },

    // Delete image from Vercel Blob and database
    delete: async ({ request, cookies }) => {
        const user = await getUser(cookies);
        if (!user) throw redirect(303, '/auth/login');

        const formData = await request.formData();
        const id = formData.get('id');

        // Get image url before deleting
        const [rows] = await pool.query(
            'SELECT * FROM images WHERE id = ? AND author_id = ?',
            [id, user.id]
        );

        if (rows.length === 0) return { error: 'Image not found' };

        // Delete from Vercel Blob
        await del(rows[0].image_url, { token: BLOB_READ_WRITE_TOKEN });

        // Delete from database
        await pool.query('DELETE FROM images WHERE id = ?', [id]);

        return { success: true };
    },
    
    // Toggle bookmark for an image
bookmark: async ({ request, cookies }) => {
    const user = await getUser(cookies);
    if (!user) throw redirect(303, '/auth/login');

    const formData = await request.formData();
    const image_id = formData.get('image_id');

    // Check if already bookmarked
    const [existing] = await pool.query(
        'SELECT id FROM bookmarks WHERE image_id = ? AND user_id = ?',
        [image_id, user.id]
    );

    if (existing.length > 0) {
        // Remove bookmark
        await pool.query(
            'DELETE FROM bookmarks WHERE image_id = ? AND user_id = ?',
            [image_id, user.id]
        );
    } else {
        // Add bookmark
        await pool.query(
            'INSERT INTO bookmarks (image_id, user_id) VALUES (?, ?)',
            [image_id, user.id]
        );
    }

    return { success: true };
}
};