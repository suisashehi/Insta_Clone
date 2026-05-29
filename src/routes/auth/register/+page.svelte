<script>
    let { form } = $props();
</script>

<svelte:head>
    <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Serif+Display&display=swap" rel="stylesheet">
</svelte:head>

<div class="min-h-screen flex flex-col md:flex-row">

    <!-- Left: Form -->
    <div class="w-full md:max-w-md bg-white flex flex-col justify-center px-8 sm:px-12 py-16">

        <!-- Logo -->
        <div class="flex items-center gap-3 mb-10">
            <div class="w-9 h-9 bg-black rounded-xl flex items-center justify-center flex-shrink-0">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <circle cx="10" cy="10" r="5" stroke="white" stroke-width="1.8" fill="none"/>
                    <circle cx="15" cy="5" r="1.5" fill="white"/>
                </svg>
            </div>
            <span class="text-xl text-black" style="font-family: 'DM Serif Display', serif;">Pixelle</span>
        </div>

        <h1 class="text-2xl font-semibold text-gray-900 tracking-tight mb-1">Create your account</h1>
        <p class="text-sm text-gray-400 mb-8">Share moments, discover inspiration.</p>

        {#if form?.error}
            <div class="mb-5 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-500">
                {form.error}
            </div>
        {/if}

        <form method="POST" class="flex flex-col gap-4">
            <input
                type="text" id="username" name="username"
                placeholder="Username" required
                class="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-black focus:bg-white transition"
            />
            <input
                type="email" id="email" name="email"
                placeholder="Email" required
                class="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-black focus:bg-white transition"
            />
            <input
                type="password" id="password" name="password"
                placeholder="Password" required
                class="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-black focus:bg-white transition"
            />

            <button type="submit"
                class="w-full bg-black hover:bg-gray-800 text-white text-sm font-medium py-3.5 rounded-xl transition active:scale-[0.98] mt-1">
                Create account
            </button>
        </form>

        <div class="flex items-center gap-3 my-6">
            <div class="flex-1 h-px bg-gray-100"></div>
            <span class="text-xs text-gray-300">or</span>
            <div class="flex-1 h-px bg-gray-100"></div>
        </div>

        <p class="text-center text-sm text-gray-400">
            Already have an account?
            <a href="/auth/login" class="text-black font-medium hover:underline">Sign in</a>
        </p>
    </div>

    <!-- Right: Dark panel — hidden on mobile, visible md+ -->
    <div class="hidden md:flex flex-1 bg-black items-center justify-center relative overflow-hidden">
        <div class="absolute w-96 h-96 rounded-full bg-white/5 -top-20 -right-20"></div>
        <div class="absolute w-64 h-64 rounded-full bg-white/5 -bottom-10 -left-10"></div>

        <div class="relative z-10 text-center px-12">
            <p class="text-white text-4xl leading-snug mb-8" style="font-family: 'DM Serif Display', serif;">
                "Every picture<br>tells a story."
            </p>
            <div class="flex gap-2 justify-center">
                <span class="w-2 h-2 rounded-full bg-white"></span>
                <span class="w-2 h-2 rounded-full bg-white/30"></span>
                <span class="w-2 h-2 rounded-full bg-white/30"></span>
            </div>
        </div>
    </div>

    <!-- Mobile bottom decoration -->
    <div class="md:hidden bg-black py-10 px-8 text-center">
        <p class="text-white text-2xl leading-snug" style="font-family: 'DM Serif Display', serif;">
            "Every picture tells a story."
        </p>
    </div>

</div>