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

    // Update user avatar photo
    updateAvatar: async ({ request, cookies }) => {
        const user = await getUser(cookies);
        if (!user) throw redirect(303, '/auth/login');

        const formData = await request.formData();
        const avatar = formData.get('avatar');

        if (!avatar || avatar.size === 0) return { error: 'No file selected' };

        // Delete old avatar from Vercel Blob if exists
        if (user.avatar_url) {
            await del(user.avatar_url, { token: BLOB_READ_WRITE_TOKEN });
        }

        // Upload new avatar to Vercel Blob
        const blob = await put(`avatars/${user.username}-${Date.now()}`, avatar, {
            access: 'public',
            token: BLOB_READ_WRITE_TOKEN
        });

        // Update avatar url in database
        await pool.query(
            'UPDATE users SET avatar_url = ? WHERE id = ?',
            [blob.url, user.id]
        );

        return { avatarSuccess: true };
    }
};