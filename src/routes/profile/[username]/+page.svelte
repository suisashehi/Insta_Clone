<script>
    // Get profile data from server
    let { data } = $props();
    let profileUser = data.profileUser;

    // Track active tab — photos or comments
    let activeTab = $state('photos');
</script>

<!-- Profile page -->
<div class="max-w-4xl mx-auto px-6 py-10">

    <!-- Profile header -->
    <div class="flex items-center justify-between mb-8">
        <div class="flex items-center gap-4">

            <!-- Profile avatar -->
            <div class="w-16 h-16 rounded-full bg-gray-100 dark:bg-zinc-800 overflow-hidden flex items-center justify-center">
                {#if profileUser.avatar_url}
                    <img src={profileUser.avatar_url} alt={profileUser.username} class="w-full h-full object-cover"/>
                {:else}
                    <!-- First letter fallback -->
                    <span class="text-2xl font-semibold text-gray-400">{profileUser.username[0].toUpperCase()}</span>
                {/if}
            </div>

            <div>
                <!-- Username -->
                <h1 class="text-xl font-semibold text-gray-900 dark:text-white">{profileUser.username}</h1>
                <!-- Stats -->
                <p class="text-sm text-gray-400">{data.images.length} photos · {data.comments.length} comments</p>
            </div>
        </div>

        <!-- Block button only if logged in and not own profile -->
        {#if data.user && data.user.username !== profileUser.username}
            <form method="POST" action="?/block">
                <button type="submit"
                    class="text-sm px-4 py-2 rounded-xl border transition
                    {data.isBlocked ? 'bg-black text-white border-black' : 'border-gray-200 dark:border-zinc-700 text-gray-600 dark:text-zinc-400 hover:border-black'}">
                    {data.isBlocked ? 'Unblock' : 'Block'}
                </button>
            </form>
        {/if}
    </div>

    <!-- Tab navigation -->
    <div class="flex gap-2 mb-6 border-b border-gray-100 dark:border-zinc-800">
        <!-- Photos tab -->
        <button
            onclick={() => activeTab = 'photos'}
            class="px-4 py-2 text-sm font-medium transition border-b-2
            {activeTab === 'photos' ? 'border-black dark:border-white text-black dark:text-white' : 'border-transparent text-gray-400 hover:text-black dark:hover:text-white'}">
            Photos ({data.images.length})
        </button>
        <!-- Comments tab -->
        <button
            onclick={() => activeTab = 'comments'}
            class="px-4 py-2 text-sm font-medium transition border-b-2
            {activeTab === 'comments' ? 'border-black dark:border-white text-black dark:text-white' : 'border-transparent text-gray-400 hover:text-black dark:hover:text-white'}">
            Comments ({data.comments.length})
        </button>
    </div>

    <!-- Photos tab -->
    {#if activeTab === 'photos'}
        {#if data.images.length === 0}
            <div class="text-center py-16 border border-dashed border-gray-200 dark:border-zinc-800 rounded-2xl">
                <p class="text-sm text-gray-400">No photos yet.</p>
            </div>
        {:else}
            <!-- 4 column grid like Instagram -->
            <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {#each data.images as image (image.id)}
                    <!-- Link to image detail page -->
                    <a href="/image/{image.id}" class="group aspect-square overflow-hidden rounded-xl bg-gray-50 dark:bg-zinc-800">
                        <img
                            src={image.image_url}
                            alt={image.description ?? 'Photo'}
                            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                    </a>
                {/each}
            </div>
        {/if}

    <!-- Comments tab -->
    {:else if activeTab === 'comments'}
        {#if data.comments.length === 0}
            <div class="text-center py-16 border border-dashed border-gray-200 dark:border-zinc-800 rounded-2xl">
                <p class="text-sm text-gray-400">No comments yet.</p>
            </div>
        {:else}
            <div class="flex flex-col gap-3">
                {#each data.comments as comment (comment.id)}
                    <!-- Comment card linking to the image -->
                    <a href="/image/{comment.image_id}" class="flex gap-4 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl p-4 hover:border-gray-300 dark:hover:border-zinc-600 transition">

                        <!-- Image thumbnail -->
                        <div class="w-12 h-12 rounded-xl overflow-hidden bg-gray-50 dark:bg-zinc-800 flex-shrink-0">
                            <img src={comment.image_url} alt="Photo" class="w-full h-full object-cover"/>
                        </div>

                        <div>
                            <!-- Comment text -->
                            <p class="text-sm text-gray-800 dark:text-zinc-200">{comment.content}</p>
                            <!-- Comment date -->
                            <p class="text-xs text-gray-400 mt-1">
                                {new Date(comment.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </p>
                        </div>
                    </a>
                {/each}
            </div>
        {/if}
    {/if}

</div>