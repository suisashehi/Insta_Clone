<script>
    // Get images and user from server load function
    let { data } = $props();

    // Format date to readable string
    function formatDate(date) {
        return new Date(date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    }
</script>

<!-- Homepage wrapper -->
<div class="max-w-4xl mx-auto px-6 py-10">

    <!-- Page heading -->
    <h1 class="text-2xl font-semibold text-gray-900 dark:text-white mb-2" style="font-family: 'DM Serif Display', serif;">Latest photos</h1>
    <p class="text-sm text-gray-400 mb-8">Discover the best moments from our community.</p>

    <!-- Empty state when no images exist -->
    {#if data.images.length === 0}
        <div class="text-center py-24 border border-dashed border-gray-200 dark:border-zinc-800 rounded-2xl">
            <p class="text-gray-400 text-sm">No photos yet. Be the first to share!</p>
            <a href="/auth/register" class="inline-block mt-4 px-5 py-2.5 bg-black text-white text-sm rounded-xl hover:bg-gray-800 transition">
                Get started
            </a>
        </div>

    {:else}
        <!-- Image grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {#each data.images as image (image.id)}

                <!-- Image card -->
                <a href="/image/{image.id}" class="group bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">

                    <!-- Image thumbnail -->
                    <div class="aspect-square overflow-hidden bg-gray-50 dark:bg-zinc-800">
                        <img
                            src={image.image_url}
                            alt={image.description ?? 'Photo'}
                            loading="lazy"
                            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                    </div>

                    <!-- Card info -->
                    <div class="p-4">

                        <!-- Author row -->
                        <div class="flex items-center gap-2 mb-2">
                            <div class="w-6 h-6 rounded-full bg-gray-100 dark:bg-zinc-700 overflow-hidden flex items-center justify-center flex-shrink-0">
                                {#if image.avatar_url}
                                    <img src={image.avatar_url} alt={image.username} class="w-full h-full object-cover"/>
                                {:else}
                                    <!-- First letter fallback -->
                                    <span class="text-xs font-semibold text-gray-500 dark:text-zinc-400">{image.username[0].toUpperCase()}</span>
                                {/if}
                            </div>
                            <span class="text-sm font-medium text-gray-700 dark:text-zinc-300">{image.username}</span>

                            <!-- Category badge -->
                            {#if image.category && image.category !== 'other'}
                                <span class="ml-auto text-xs text-gray-400 capitalize">{image.category}</span>
                            {/if}
                        </div>

                        <!-- Description preview -->
                        {#if image.description}
                            <p class="text-sm text-gray-500 dark:text-zinc-400 line-clamp-2 mb-3">{image.description}</p>
                        {/if}

                        <!-- Stats row: votes, comments, date -->
                        <div class="flex items-center gap-3 text-xs text-gray-400">
                            <!-- Vote count -->
                            <span>♥ {image.vote_count}</span>
                            <!-- Comment count -->
                            <span>💬 {image.comment_count}</span>
                            <!-- Date -->
                            <span class="ml-auto">{formatDate(image.created_at)}</span>
                        </div>
                    </div>
                </a>
            {/each}
        </div>
    {/if}
</div>