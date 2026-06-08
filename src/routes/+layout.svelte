<script>
    // Import global styles and favicon
    import './layout.css';
    import favicon from '$lib/assets/favicon.svg';

    // Get user and children from layout server
    let { data, children } = $props();
    let user = $derived(data.user);

    // Track mobile menu state
    let menuOpen = $state(false);

    // Dark mode state - read from localStorage on load
    let darkMode = $state(false);

    // Toggle dark mode and save to localStorage
    function toggleDark() {
        darkMode = !darkMode;
        localStorage.setItem('darkMode', darkMode ? '1' : '0');
        document.documentElement.classList.toggle('dark', darkMode);
    }

    // Apply dark mode on page load from localStorage
    if (typeof window !== 'undefined') {
        darkMode = localStorage.getItem('darkMode') === '1';
        document.documentElement.classList.toggle('dark', darkMode);
    }
</script>

<svelte:head>
    <link rel="icon" href={favicon} />
    <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=DM+Serif+Display&display=swap" rel="stylesheet">
</svelte:head>

<!-- Dark mode wrapper -->
<div class="min-h-screen flex flex-col bg-white dark:bg-zinc-950 transition-colors duration-200">

    <!-- Header -->
    <header class="border-b border-gray-100 dark:border-zinc-800 sticky top-0 z-50 bg-white dark:bg-zinc-950">
        <div class="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">

            <!-- Logo -->
            <a href="/" class="flex items-center gap-2">
                <div class="w-8 h-8 bg-black dark:bg-white rounded-xl flex items-center justify-center">
                    <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                        <circle cx="10" cy="10" r="5" stroke="white" class="dark:stroke-black" stroke-width="2" fill="none"/>
                        <circle cx="15" cy="5" r="1.5" fill="white" class="dark:fill-black"/>
                    </svg>
                </div>
                <span class="text-lg text-black dark:text-white" style="font-family: 'DM Serif Display', serif;">Pixelle</span>
            </a>

            <!-- Desktop nav -->
            <nav class="hidden sm:flex items-center gap-6">
                {#if user}
                    <!-- Main navigation links -->
                    <a href="/" class="text-sm text-gray-500 hover:text-black dark:text-zinc-400 dark:hover:text-white transition">Home</a>
                    <a href="/dashboard" class="text-sm text-gray-500 hover:text-black dark:text-zinc-400 dark:hover:text-white transition">Dashboard</a>
                    <!-- Saved/bookmarks link -->
                    <a href="/dashboard/bookmarks" class="text-sm text-gray-500 hover:text-black dark:text-zinc-400 dark:hover:text-white transition">Saved</a>
                    <a href="/profile/{user.username}" class="text-sm text-gray-500 hover:text-black dark:text-zinc-400 dark:hover:text-white transition">Profile</a>

                    <!-- Admin link only for admins -->
                    {#if user.role === 'admin'}
                        <a href="/admin" class="text-sm text-gray-500 hover:text-black dark:text-zinc-400 dark:hover:text-white transition">Admin</a>
                    {/if}

                    <!-- Avatar, dark mode toggle and logout -->
                    <div class="flex items-center gap-3 pl-4 border-l border-gray-100 dark:border-zinc-800">

                        <!-- Dark mode toggle button -->
                        <button onclick={toggleDark} class="text-gray-400 hover:text-black dark:text-zinc-400 dark:hover:text-white transition">
                            {#if darkMode}
                                <!-- Sun icon for light mode -->
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M17.657 17.657l-.707-.707M6.343 6.343l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z"/>
                                </svg>
                            {:else}
                                <!-- Moon icon for dark mode -->
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/>
                                </svg>
                            {/if}
                        </button>

                        <!-- User avatar -->
                        <div class="w-8 h-8 rounded-full bg-gray-100 dark:bg-zinc-800 overflow-hidden flex items-center justify-center">
                            {#if user.avatar_url}
                                <img src={user.avatar_url} alt={user.username} class="w-full h-full object-cover"/>
                            {:else}
                                <span class="text-xs font-semibold text-gray-500 dark:text-zinc-400">{user.username[0].toUpperCase()}</span>
                            {/if}
                        </div>

                        <!-- Logout form -->
                        <form method="POST" action="/auth/logout">
                            <button type="submit" class="text-sm text-gray-500 hover:text-black dark:text-zinc-400 dark:hover:text-white transition">
                                Logout
                            </button>
                        </form>
                    </div>
                {:else}
                    <!-- Dark mode toggle for guests -->
                    <button onclick={toggleDark} class="text-gray-400 hover:text-black dark:text-zinc-400 dark:hover:text-white transition">
                        {#if darkMode}
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M17.657 17.657l-.707-.707M6.343 6.343l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z"/>
                            </svg>
                        {:else}
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/>
                            </svg>
                        {/if}
                    </button>
                    <!-- Guest links -->
                    <a href="/auth/login" class="text-sm text-gray-500 hover:text-black dark:text-zinc-400 dark:hover:text-white transition">Sign in</a>
                    <a href="/auth/register" class="text-sm font-medium text-white bg-black dark:bg-white dark:text-black px-4 py-2 rounded-xl hover:bg-gray-800 transition">
                        Register
                    </a>
                {/if}
            </nav>

            <!-- Mobile menu button -->
            <button class="sm:hidden" onclick={() => menuOpen = !menuOpen}>
                <svg class="w-6 h-6 text-gray-700 dark:text-zinc-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {#if menuOpen}
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                    {:else}
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
                    {/if}
                </svg>
            </button>
        </div>

        <!-- Mobile menu dropdown -->
        {#if menuOpen}
            <div class="sm:hidden border-t border-gray-100 dark:border-zinc-800 px-6 py-4 flex flex-col gap-3 bg-white dark:bg-zinc-950">
                {#if user}
                    <a href="/" class="text-sm text-gray-600 dark:text-zinc-400">Home</a>
                    <a href="/dashboard" class="text-sm text-gray-600 dark:text-zinc-400">Dashboard</a>
                    <!-- Saved link in mobile menu -->
                    <a href="/dashboard/bookmarks" class="text-sm text-gray-600 dark:text-zinc-400">Saved</a>
                    <a href="/profile/{user.username}" class="text-sm text-gray-600 dark:text-zinc-400">Profile</a>
                    {#if user.role === 'admin'}
                        <a href="/admin" class="text-sm text-gray-600 dark:text-zinc-400">Admin</a>
                    {/if}
                    <!-- Mobile dark mode toggle -->
                    <button onclick={toggleDark} class="text-left text-sm text-gray-600 dark:text-zinc-400">
                        {darkMode ? '☀️ Light mode' : '🌙 Dark mode'}
                    </button>
                    <form method="POST" action="/auth/logout">
                        <button type="submit" class="text-sm text-gray-600 dark:text-zinc-400">Logout</button>
                    </form>
                {:else}
                    <a href="/auth/login" class="text-sm text-gray-600 dark:text-zinc-400">Sign in</a>
                    <a href="/auth/register" class="text-sm text-gray-600 dark:text-zinc-400">Register</a>
                    <button onclick={toggleDark} class="text-left text-sm text-gray-600 dark:text-zinc-400">
                        {darkMode ? '☀️ Light mode' : '🌙 Dark mode'}
                    </button>
                {/if}
            </div>
        {/if}
    </header>

    <!-- Page content -->
    <main class="flex-1">
        {@render children()}
    </main>

    <!-- Footer -->
    <footer class="border-t border-gray-100 dark:border-zinc-800 py-8 mt-auto bg-white dark:bg-zinc-950">
        <div class="max-w-4xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-2">
            <span class="text-sm text-gray-400 dark:text-zinc-500" style="font-family: 'DM Serif Display', serif;">Pixelle</span>
            <p class="text-xs text-gray-300 dark:text-zinc-600">© 2026 Pixelle. All rights reserved.</p>
        </div>
    </footer>

</div>