<script>
    // Import global styles and favicon
    import './layout.css';
    import favicon from '$lib/assets/favicon.svg';

    // Get user and children from layout server
    let { data, children } = $props();
    let user = $derived(data.user);

    // Track mobile menu state
    let menuOpen = $state(false);
</script>

<svelte:head>
    <link rel="icon" href={favicon} />
    <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=DM+Serif+Display&display=swap" rel="stylesheet">
</svelte:head>

<div class="min-h-screen bg-white flex flex-col">

    <!-- Header -->
    <header class="border-b border-gray-100 sticky top-0 z-50 bg-white">
        <div class="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">

            <!-- Logo -->
            <a href="/" class="flex items-center gap-2">
                <div class="w-8 h-8 bg-black rounded-xl flex items-center justify-center">
                    <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                        <circle cx="10" cy="10" r="5" stroke="white" stroke-width="2" fill="none"/>
                        <circle cx="15" cy="5" r="1.5" fill="white"/>
                    </svg>
                </div>
                <span class="text-lg text-black" style="font-family: 'DM Serif Display', serif;">Pixelle</span>
            </a>

            <!-- Desktop nav -->
            <nav class="hidden sm:flex items-center gap-6">
                {#if user}
                    <a href="/" class="text-sm text-gray-500 hover:text-black transition">Home</a>
                    <a href="/dashboard" class="text-sm text-gray-500 hover:text-black transition">Dashboard</a>
                    <a href="/profile/{user.username}" class="text-sm text-gray-500 hover:text-black transition">Profile</a>
                    {#if user.role === 'admin'}
                        <a href="/admin" class="text-sm text-gray-500 hover:text-black transition">Admin</a>
                    {/if}

                    <!-- Avatar + logout -->
                    <div class="flex items-center gap-3 pl-4 border-l border-gray-100">
                        <div class="w-8 h-8 rounded-full bg-gray-100 overflow-hidden flex items-center justify-center">
                            {#if user.avatar_url}
                                <img src={user.avatar_url} alt={user.username} class="w-full h-full object-cover"/>
                            {:else}
                                <span class="text-xs font-semibold text-gray-500">{user.username[0].toUpperCase()}</span>
                            {/if}
                        </div>
                        <form method="POST" action="/auth/logout">
                            <button type="submit" class="text-sm text-gray-500 hover:text-black transition">
                                Logout
                            </button>
                        </form>
                    </div>
                {:else}
                    <a href="/auth/login" class="text-sm text-gray-500 hover:text-black transition">Sign in</a>
                    <a href="/auth/register" class="text-sm font-medium text-white bg-black px-4 py-2 rounded-xl hover:bg-gray-800 transition">
                        Register
                    </a>
                {/if}
            </nav>

            <!-- Mobile menu button -->
            <button class="sm:hidden" onclick={() => menuOpen = !menuOpen}>
                <svg class="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {#if menuOpen}
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                    {:else}
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
                    {/if}
                </svg>
            </button>
        </div>

        <!-- Mobile menu -->
        {#if menuOpen}
            <div class="sm:hidden border-t border-gray-100 px-6 py-4 flex flex-col gap-3">
                {#if user}
                    <a href="/" class="text-sm text-gray-600">Home</a>
                    <a href="/dashboard" class="text-sm text-gray-600">Dashboard</a>
                    <a href="/profile/{user.username}" class="text-sm text-gray-600">Profile</a>
                    {#if user.role === 'admin'}
                        <a href="/admin" class="text-sm text-gray-600">Admin</a>
                    {/if}
                    <form method="POST" action="/auth/logout">
                        <button type="submit" class="text-sm text-gray-600">Logout</button>
                    </form>
                {:else}
                    <a href="/auth/login" class="text-sm text-gray-600">Sign in</a>
                    <a href="/auth/register" class="text-sm text-gray-600">Register</a>
                {/if}
            </div>
        {/if}
    </header>

    <!-- Page content -->
    <main class="flex-1">
        {@render children()}
    </main>

    <!-- Footer -->
    <footer class="border-t border-gray-100 py-8 mt-auto">
        <div class="max-w-4xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-2">
            <span class="text-sm text-gray-400" style="font-family: 'DM Serif Display', serif;">Pixelle</span>
            <p class="text-xs text-gray-300">© 2026 Pixelle. All rights reserved.</p>
        </div>
    </footer>

</div>