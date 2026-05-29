<script>
    // Get form errors back from server
    let { form } = $props();

    // Track selected avatar file name for preview
    let avatarPreview = $state(null);

    // Show image preview when user selects a file
    function handleAvatarChange(e) {
        const file = e.target.files?.[0];
        if (file) {
            avatarPreview = URL.createObjectURL(file);
        }
    }
</script>

<svelte:head>
    <!-- Google Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Serif+Display&display=swap" rel="stylesheet">
</svelte:head>

<!-- Full screen layout: stacked on mobile, side by side on desktop -->
<div class="min-h-screen flex flex-col md:flex-row">

    <!-- Left side: registration form -->
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

        <!-- Page heading -->
        <h1 class="text-2xl font-semibold text-gray-900 tracking-tight mb-1">Create your account</h1>
        <p class="text-sm text-gray-400 mb-8">Share moments, discover inspiration.</p>

        <!-- Error message from server -->
        {#if form?.error}
            <div class="mb-5 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-500">
                {form.error}
            </div>
        {/if}

        <!-- Registration form with multipart for file upload -->
        <form method="POST" enctype="multipart/form-data" class="flex flex-col gap-4">

            <!-- Avatar upload -->
            <div class="flex flex-col items-center gap-3 mb-2">
                <label for="avatar" class="cursor-pointer group">
                    <!-- Avatar preview or placeholder -->
                    {#if avatarPreview}
                        <img
                            src={avatarPreview}
                            alt="Avatar preview"
                            class="w-20 h-20 rounded-full object-cover border-2 border-black"
                        />
                    {:else}
                        <!-- Default placeholder circle -->
                        <div class="w-20 h-20 rounded-full bg-gray-100 border-2 border-dashed border-gray-300 flex flex-col items-center justify-center group-hover:border-black transition">
                            <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                            </svg>
                            <span class="text-xs text-gray-400 mt-1">Photo</span>
                        </div>
                    {/if}
                </label>
                <!-- Hidden file input -->
                <input
                    type="file" id="avatar" name="avatar"
                    accept="image/*"
                    onchange={handleAvatarChange}
                    class="hidden"
                />
                <span class="text-xs text-gray-400">Profile photo (optional)</span>
            </div>

            <!-- Username input -->
            <input
                type="text" id="username" name="username"
                placeholder="Username" required
                class="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-black focus:bg-white transition"
            />

            <!-- Email input -->
            <input
                type="email" id="email" name="email"
                placeholder="Email" required
                class="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-black focus:bg-white transition"
            />

            <!-- Password input -->
            <input
                type="password" id="password" name="password"
                placeholder="Password" required
                class="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-black focus:bg-white transition"
            />

            <!-- Submit button -->
            <button type="submit"
                class="w-full bg-black hover:bg-gray-800 text-white text-sm font-medium py-3.5 rounded-xl transition active:scale-[0.98] mt-1">
                Create account
            </button>
        </form>

        <!-- Divider -->
        <div class="flex items-center gap-3 my-6">
            <div class="flex-1 h-px bg-gray-100"></div>
            <span class="text-xs text-gray-300">or</span>
            <div class="flex-1 h-px bg-gray-100"></div>
        </div>

        <!-- Link to login -->
        <p class="text-center text-sm text-gray-400">
            Already have an account?
            <a href="/auth/login" class="text-black font-medium hover:underline">Sign in</a>
        </p>
    </div>

    <!-- Right side: decorative black panel, hidden on mobile -->
    <div class="hidden md:flex flex-1 bg-black items-center justify-center relative overflow-hidden">

        <!-- Decorative background circles -->
        <div class="absolute w-96 h-96 rounded-full bg-white/5 -top-20 -right-20"></div>
        <div class="absolute w-64 h-64 rounded-full bg-white/5 -bottom-10 -left-10"></div>

        <!-- Quote -->
        <div class="relative z-10 text-center px-12">
            <p class="text-white text-4xl leading-snug mb-8" style="font-family: 'DM Serif Display', serif;">
                "Every picture<br>tells a story."
            </p>
            <!-- Indicator dots -->
            <div class="flex gap-2 justify-center">
                <span class="w-2 h-2 rounded-full bg-white"></span>
                <span class="w-2 h-2 rounded-full bg-white/30"></span>
                <span class="w-2 h-2 rounded-full bg-white/30"></span>
            </div>
        </div>
    </div>

    <!-- Mobile only: black bottom bar -->
    <div class="md:hidden bg-black py-10 px-8 text-center">
        <p class="text-white text-2xl leading-snug" style="font-family: 'DM Serif Display', serif;">
            "Every picture tells a story."
        </p>
    </div>

</div>