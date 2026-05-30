// Load current user session for all pages
import { getUser } from '$lib/server/auth';

export async function load({ cookies }) {
    // Get user from session cookie on every page load
    const user = await getUser(cookies);

    // Return user to all pages (null if not logged in)
    return { user };
}