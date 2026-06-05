<script>
    // Get profile data from server
    let { data } = $props();
    let profileUser = data.profileUser;
</script>

<!-- Profile page -->
<div class="max-w-4xl mx-auto px-6 py-10">

    <!-- Profile header -->
    <div class="flex items-center justify-between mb-10">
        <div class="flex items-center gap-4">

            <!-- Profile avatar -->
            <div class="w-16 h-16 rounded-full bg-gray-100 overflow-hidden flex items-center justify-center">
                {#if profileUser.avatar_url}
                    <img src={profileUser.avatar_url} alt={profileUser.username} class="w-full h-full object-cover"/>
                {:else}
                    <!-- First letter fallback -->
                    <span class="text-2xl font-semibold text-gray-400">{profileUser.username[0].toUpperCase()}</span>
                {/if}
            </div>

            <div>
                <!-- Username -->
                <h1 class="text-xl font-semibold text-gray-900">{profileUser.username}</h1>
                <!-- Photo count -->
                <p class="text-sm text-gray-400">{data.images.length} photos</p>
            </div>
        </div>

        <!-- Block button only if logged in and not own profile -->
        {#if data.user && data.user.username !== profileUser.username}
            <form method="POST" action="?/block">
                <button type="submit"
                    class="text-sm px-4 py-2 rounded-xl border transition
                    {data.isBlocked ? 'bg-black text-white border-black' : 'border-gray-200 text-gray-600 hover:border-black'}">
                    {data.isBlocked ? 'Unblock' : 'Block'}
                </button>
            </form>
        {/if}
    </div>

    <!-- Images grid -->
    {#if data.images.length === 0}
        <div class="text-center py-16 border border-dashed border-gray-200 rounded-2xl">
            <p class="text-sm text-gray-400">No photos yet.</p>
        </div>
    {:else}
        <!-- 4 column grid like Instagram -->
        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {#each data.images as image (image.id)}
                <!-- Link to image detail page -->
                <a href="/image/{image.id}" class="group aspect-square overflow-hidden rounded-xl bg-gray-50">
                    <img
                        src={image.image_url}
                        alt={image.description ?? 'Photo'}
                        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                </a>
            {/each}
        </div>
    {/if}
</div>