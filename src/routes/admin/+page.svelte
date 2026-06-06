<script>
    // Get all data from server
    let { data } = $props();

    // Track which tab is active
    let activeTab = $state('users');
</script>

<!-- Admin panel wrapper -->
<div class="max-w-5xl mx-auto px-6 py-10">

    <!-- Page heading -->
    <h1 class="text-2xl font-semibold text-gray-900 mb-1" style="font-family: 'DM Serif Display', serif;">Admin Panel</h1>
    <p class="text-sm text-gray-400 mb-8">Manage users, images and reports.</p>

    <!-- Tab navigation -->
    <div class="flex gap-2 mb-8 border-b border-gray-100">
        <button
            onclick={() => activeTab = 'users'}
            class="px-4 py-2 text-sm font-medium transition border-b-2 {activeTab === 'users' ? 'border-black text-black' : 'border-transparent text-gray-400 hover:text-black'}">
            Users ({data.users.length})
        </button>
        <button
            onclick={() => activeTab = 'images'}
            class="px-4 py-2 text-sm font-medium transition border-b-2 {activeTab === 'images' ? 'border-black text-black' : 'border-transparent text-gray-400 hover:text-black'}">
            Images ({data.images.length})
        </button>
        <button
            onclick={() => activeTab = 'reports'}
            class="px-4 py-2 text-sm font-medium transition border-b-2 {activeTab === 'reports' ? 'border-black text-black' : 'border-transparent text-gray-400 hover:text-black'}">
            Reports ({data.reports.length})
        </button>
    </div>

    <!-- Users tab -->
    {#if activeTab === 'users'}
        <div class="flex flex-col gap-3">
            {#each data.users as u (u.id)}
                <div class="flex items-center justify-between bg-white border border-gray-100 rounded-2xl px-5 py-4">
                    <div>
                        <!-- Username and role -->
                        <p class="text-sm font-medium text-gray-900">{u.username}</p>
                        <p class="text-xs text-gray-400">{u.email} · {u.role}</p>
                    </div>
                    <!-- Delete user button — cannot delete yourself -->
                    {#if u.id !== data.user.id}
                        <form method="POST" action="?/deleteUser">
                            <input type="hidden" name="id" value={u.id}/>
                            <button type="submit" class="text-xs text-red-500 hover:text-red-600 border border-red-100 hover:bg-red-50 px-3 py-1.5 rounded-lg transition">
                                Delete
                            </button>
                        </form>
                    {/if}
                </div>
            {/each}
        </div>

    <!-- Images tab -->
    {:else if activeTab === 'images'}
        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {#each data.images as image (image.id)}
                <div class="bg-white border border-gray-100 rounded-2xl overflow-hidden">
                    <!-- Image thumbnail -->
                    <div class="aspect-square overflow-hidden bg-gray-50">
                        <img src={image.image_url} alt="Photo" class="w-full h-full object-cover"/>
                    </div>
                    <div class="p-3">
                        <!-- Author name -->
                        <p class="text-xs text-gray-400 mb-2">by {image.username}</p>
                        <!-- Delete image button -->
                        <form method="POST" action="?/deleteImage">
                            <input type="hidden" name="id" value={image.id}/>
                            <button type="submit" class="w-full text-xs text-red-500 border border-red-100 hover:bg-red-50 py-1.5 rounded-lg transition">
                                Delete
                            </button>
                        </form>
                    </div>
                </div>
            {/each}
        </div>

    <!-- Reports tab -->
    {:else if activeTab === 'reports'}
        {#if data.reports.length === 0}
            <p class="text-sm text-gray-400 text-center py-16">No pending reports.</p>
        {:else}
            <div class="flex flex-col gap-3">
                {#each data.reports as report (report.id)}
                    <div class="bg-white border border-gray-100 rounded-2xl px-5 py-4">
                        <!-- Report info -->
                        <p class="text-sm text-gray-900 mb-1">"{report.content}"</p>
                        <p class="text-xs text-gray-400 mb-3">
                            Reported by {report.reporter} · by {report.commenter} · {report.reason}
                        </p>
                        <!-- Dismiss report button -->
                        <form method="POST" action="?/dismissReport">
                            <input type="hidden" name="id" value={report.id}/>
                            <button type="submit" class="text-xs text-gray-500 border border-gray-200 hover:bg-gray-50 px-3 py-1.5 rounded-lg transition">
                                Dismiss
                            </button>
                        </form>
                    </div>
                {/each}
            </div>
        {/if}
    {/if}

</div>