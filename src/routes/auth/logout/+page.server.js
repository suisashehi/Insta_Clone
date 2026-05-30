// Handle user logout by invalidating session and clearing cookie
import { invalidateSession } from '$lib/server/auth';
import { redirect } from '@sveltejs/kit';

export const actions = {
    default: async ({ cookies }) => {
        const sessionId = cookies.get('session_id');

        // Delete session from database if it exists
        if (sessionId) {
            await invalidateSession(sessionId);
        }

        // Clear the session cookie
        cookies.delete('session_id', { path: '/' });

        // Redirect to homepage after logout
        throw redirect(303, '/');
    }
};