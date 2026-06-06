<script>
    // Get image, comments, user and vote status from server
    let { data, form } = $props();
    let image = data.image;

    // CSS filter classes for image display
    const filters = {
        none: '',
        grayscale: 'grayscale',
        sepia: 'sepia',
        warm: 'brightness-105 saturate-150',
        cool: 'brightness-95 hue-rotate-30'
    };
</script>

<!-- Detail page wrapper -->
<div class="max-w-3xl mx-auto px-6 py-10">

    <!-- Image -->
    <div class="rounded-2xl overflow-hidden bg-gray-50 mb-6">
        <img
            src={image.image_url}
            alt={image.description ?? 'Photo'}
            class="w-full object-cover {filters[image.filter] ?? ''}"
        />
    </div>

    <!-- Image info row -->
    <div class="flex items-center justify-between mb-4">

        <!-- Author info -->
        <div class="flex items-center gap-2">
            <div class="w-8 h-8 rounded-full bg-gray-100 overflow-hidden flex items-center justify-center">
                {#if image.avatar_url}
                    <img src={image.avatar_url} alt={image.username} class="w-full h-full object-cover"/>
                {:else}
                    <span class="text-xs font-semibold text-gray-500">{image.username[0].toUpperCase()}</span>
                {/if}
            </div>
            <a href="/profile/{image.username}" class="text-sm font-medium text-gray-800 hover:underline">
                {image.username}
            </a>
        </div>

        <!-- Vote button -->
        <form method="POST" action="?/vote">
            <button type="submit" class="flex items-center gap-2 px-4 py-2 rounded-xl border transition
                {data.hasVoted ? 'bg-black text-white border-black' : 'bg-white text-gray-600 border-gray-200 hover:border-black'}">
                <span>♥</span>
                <span class="text-sm font-medium">{image.vote_count}</span>
            </button>
        </form>
    </div>

    <!-- Description -->
    {#if image.description}
        <p class="text-gray-700 mb-8">{image.description}</p>
    {/if}

    <!-- Comments section -->
    <div class="border-t border-gray-100 pt-8">
        <h2 class="text-base font-semibold text-gray-800 mb-4">Comments ({data.comments.length})</h2>

        <!-- Comment form only for logged in users -->
        {#if data.user}
            <form method="POST" action="?/comment" class="flex gap-3 mb-6">
                <input
                    type="text" name="content"
                    placeholder="Write a comment..."
                    required
                    class="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-black transition"
                />
                <button type="submit"
                    class="px-4 py-2.5 bg-black text-white text-sm rounded-xl hover:bg-gray-800 transition">
                    Post
                </button>
            </form>
        {:else}
            <!-- Prompt guest to login -->
            <p class="text-sm text-gray-400 mb-6">
                <a href="/auth/login" class="text-black font-medium hover:underline">Sign in</a> to comment.
            </p>
        {/if}

        <!-- Comments list -->
        {#if data.comments.length === 0}
            <p class="text-sm text-gray-400">No comments yet.</p>
        {:else}
            <div class="flex flex-col gap-4">
                {#each data.comments as comment (comment.id)}
                    <div class="flex gap-3">

                        <!-- Commenter avatar -->
                        <div class="w-7 h-7 rounded-full bg-gray-100 overflow-hidden flex items-center justify-center flex-shrink-0">
                            {#if comment.avatar_url}
                                <img src={comment.avatar_url} alt={comment.username} class="w-full h-full object-cover"/>
                            {:else}
                                <span class="text-xs font-semibold text-gray-500">{comment.username[0].toUpperCase()}</span>
                            {/if}
                        </div>

                        <div class="flex-1">
                            <!-- Commenter name -->
                            <span class="text-sm font-medium text-gray-800">{comment.username}</span>
                            <!-- Comment text -->
                            <p class="text-sm text-gray-600">{comment.content}</p>

                            <!-- Report button only for other users comments -->
                            {#if data.user && data.user.id !== comment.user_id}
                                <form method="POST" action="?/report" class="mt-1">
                                    <input type="hidden" name="comment_id" value={comment.id}/>
                                    <input type="hidden" name="reason" value="inappropriate"/>
                                    <button type="submit" class="text-xs text-gray-300 hover:text-red-400 transition">
                                        Report
                                    </button>
                                </form>
                            {/if}
                        </div>
                    </div>
                {/each}
            </div>
        {/if}
    </div>
</div>