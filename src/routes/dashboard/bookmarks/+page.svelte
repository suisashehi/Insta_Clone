<script>
    // Get bookmarked images from server
    let { data } = $props();
</script>

<!-- Bookmarks page -->
<div class="max-w-4xl mx-auto px-6 py-10">

    <!-- Page heading -->
    <h1 class="text-2xl font-semibold text-gray-900 mb-1" style="font-family: 'DM Serif Display', serif;">Saved photos</h1>
    <p class="text-sm text-gray-400 mb-8">Photos you have bookmarked.</p>

    <!-- Empty state -->
    {#if data.images.length === 0}
        <div class="text-center py-16 border border-dashed border-gray-200 rounded-2xl">
            <p class="text-sm text-gray-400">No saved photos yet.</p>
            <a href="/" class="inline-block mt-4 px-5 py-2.5 bg-black text-white text-sm rounded-xl hover:bg-gray-800 transition">
                Browse photos
            </a>
        </div>
    {:else}
        <!-- Grid of bookmarked images -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {#each data.images as image (image.id)}
                <a href="/image/{image.id}" class="group bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">

                    <!-- Image thumbnail -->
                    <div class="aspect-square overflow-hidden bg-gray-50">
                        <img
                            src={image.image_url}
                            alt={image.description ?? 'Photo'}
                            loading="lazy"
                            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                    </div>

                    <!-- Card info -->
                    <div class="p-4">
                        <!-- Author -->
                        <div class="flex items-center gap-2 mb-2">
                            <div class="w-6 h-6 rounded-full bg-gray-100 overflow-hidden flex items-center justify-center">
                                {#if image.avatar_url}
                                    <img src={image.avatar_url} alt={image.username} class="w-full h-full object-cover"/>
                                {:else}
                                    <span class="text-xs font-semibold text-gray-500">{image.username[0].toUpperCase()}</span>
                                {/if}
                            </div>
                            <span class="text-sm font-medium text-gray-700">{image.username}</span>
                        </div>
                        <!-- Vote count -->
                        <span class="text-xs text-gray-400">♥ {image.vote_count} likes</span>
                    </div>
                </a>
            {/each}
        </div>
    {/if}
</div>