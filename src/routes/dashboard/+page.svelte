<script>
    // Get user and images from server
    let { data, form } = $props();

    // Track selected file for upload preview
    let preview = $state(null);
    let uploading = $state(false);
    let selectedFilter = $state('none');

    // Avatar preview
    let avatarPreview = $state(null);

    // CSS filter classes for preview
    const filters = {
        none: '',
        grayscale: 'grayscale',
        sepia: 'sepia',
        warm: 'brightness-105 saturate-150',
        cool: 'brightness-95 hue-rotate-30'
    };

    // Show image preview when file is selected
    function handleFile(e) {
        const file = e.target.files?.[0];
        if (file) preview = URL.createObjectURL(file);
    }

    // Show avatar preview when file is selected
    function handleAvatar(e) {
        const file = e.target.files?.[0];
        if (file) avatarPreview = URL.createObjectURL(file);
    }

    // Set uploading state on form submit
    function handleSubmit() {
        uploading = true;
    }
</script>

<!-- Dashboard page -->
<div class="max-w-4xl mx-auto px-6 py-10">

    <!-- Page heading -->
    <h1 class="text-2xl font-semibold text-gray-900 dark:text-white mb-1" style="font-family: 'DM Serif Display', serif;">Dashboard</h1>
    <p class="text-sm text-gray-400 mb-8">Manage and upload your photos.</p>

    <!-- Avatar update section -->
    <div class="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl p-6 mb-6">
        <h2 class="text-base font-semibold text-gray-800 dark:text-white mb-4">Profile photo</h2>

        <!-- Avatar success message -->
        {#if form?.avatarSuccess}
            <div class="mb-4 px-4 py-3 bg-green-50 border border-green-200 rounded-xl text-sm text-green-600">
                Avatar updated successfully!
            </div>
        {/if}

        <!-- Avatar update form -->
        <form method="POST" action="?/updateAvatar" enctype="multipart/form-data" class="flex items-center gap-5">
            <!-- Current or preview avatar -->
            <div class="w-16 h-16 rounded-full bg-gray-100 dark:bg-zinc-800 overflow-hidden flex items-center justify-center flex-shrink-0">
                {#if avatarPreview}
                    <img src={avatarPreview} alt="Preview" class="w-full h-full object-cover"/>
                {:else if data.user.avatar_url}
                    <img src={data.user.avatar_url} alt={data.user.username} class="w-full h-full object-cover"/>
                {:else}
                    <span class="text-xl font-semibold text-gray-400">{data.user.username[0].toUpperCase()}</span>
                {/if}
            </div>
            <div class="flex flex-col gap-2">
                <label class="cursor-pointer text-sm text-gray-600 dark:text-zinc-400 hover:text-black transition underline">
                    Choose new photo
                    <input type="file" name="avatar" accept="image/*" onchange={handleAvatar} class="hidden"/>
                </label>
                <button type="submit" class="text-sm bg-black text-white px-4 py-2 rounded-xl hover:bg-gray-800 transition w-fit">
                    Save avatar
                </button>
            </div>
        </form>
    </div>

    <!-- Upload form card -->
    <div class="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl p-6 mb-10">
        <h2 class="text-base font-semibold text-gray-800 dark:text-white mb-4">Upload new photo</h2>

        <!-- Upload success message -->
        {#if form?.success}
            <div class="mb-4 px-4 py-3 bg-green-50 border border-green-200 rounded-xl text-sm text-green-600">
                Photo uploaded successfully!
            </div>
        {/if}

        <form method="POST" action="?/upload" enctype="multipart/form-data" onsubmit={handleSubmit} class="flex flex-col gap-4">

            <!-- Image file picker with preview -->
            <label class="cursor-pointer border-2 border-dashed border-gray-200 dark:border-zinc-700 rounded-xl p-6 flex flex-col items-center hover:border-black transition">
                {#if preview}
                    <!-- Preview with selected filter applied -->
                    <img src={preview} alt="Preview" class="w-48 h-48 object-cover rounded-xl mb-2 {filters[selectedFilter]}"/>
                {:else}
                    <svg class="w-8 h-8 text-gray-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 4v16m8-8H4"/>
                    </svg>
                {/if}
                <span class="text-sm text-gray-400">Click to select photo</span>
                <input type="file" name="image" accept="image/*" onchange={handleFile} class="hidden" required/>
            </label>

            <!-- Visual filter selector — only show when image is selected -->
            {#if preview}
                <div>
                    <p class="text-sm font-medium text-gray-700 dark:text-zinc-300 mb-3">Choose filter</p>
                    <!-- Hidden input to store selected filter value -->
                    <input type="hidden" name="filter" value={selectedFilter}/>
                    <div class="grid grid-cols-5 gap-2">
                        {#each Object.entries(filters) as [filterName, filterClass]}
                            <button
                                type="button"
                                onclick={() => selectedFilter = filterName}
                                class="flex flex-col items-center gap-1.5">
                                <!-- Thumbnail with filter applied -->
                                <div class="w-full aspect-square rounded-xl overflow-hidden border-2 transition
                                    {selectedFilter === filterName ? 'border-black dark:border-white' : 'border-transparent'}">
                                    <img
                                        src={preview}
                                        alt={filterName}
                                        class="w-full h-full object-cover {filterClass}"
                                    />
                                </div>
                                <!-- Filter name -->
                                <span class="text-xs text-gray-500 dark:text-zinc-400 capitalize
                                    {selectedFilter === filterName ? 'font-medium text-black dark:text-white' : ''}">
                                    {filterName}
                                </span>
                            </button>
                        {/each}
                    </div>
                </div>
            {:else}
                <!-- Default filter value when no image selected -->
                <input type="hidden" name="filter" value="none"/>
            {/if}

            <!-- Description input -->
            <input
                type="text" name="description"
                placeholder="Description (optional)"
                class="w-full px-4 py-3 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:border-black transition"
            />

            <!-- Category select -->
            <select name="category" class="w-full px-4 py-3 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl text-sm text-gray-700 dark:text-zinc-300 focus:outline-none focus:border-black transition">
                <option value="other">Category</option>
                <option value="nature">Nature</option>
                <option value="city">City</option>
                <option value="people">People</option>
                <option value="food">Food</option>
                <option value="art">Art</option>
            </select>

            <!-- Submit button -->
            <button type="submit" disabled={uploading}
                class="w-full bg-black hover:bg-gray-800 text-white text-sm font-medium py-3 rounded-xl transition active:scale-[0.98] disabled:opacity-50">
                {uploading ? 'Uploading...' : 'Upload photo'}
            </button>
        </form>
    </div>

    <!-- User's images grid -->
    <h2 class="text-base font-semibold text-gray-800 dark:text-white mb-4">Your photos ({data.images.length})</h2>

    <!-- Empty state -->
    {#if data.images.length === 0}
        <div class="text-center py-16 border border-dashed border-gray-200 dark:border-zinc-800 rounded-2xl">
            <p class="text-sm text-gray-400">No photos yet. Upload your first one!</p>
        </div>
    {:else}
        <!-- Grid of user's images -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {#each data.images as image (image.id)}
                <div class="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl overflow-hidden">

                    <!-- Image thumbnail -->
                    <div class="aspect-square overflow-hidden bg-gray-50 dark:bg-zinc-800">
                        <img src={image.image_url} alt={image.description ?? 'Photo'} class="w-full h-full object-cover"/>
                    </div>

                    <div class="p-4">
                        {#if image.description}
                            <p class="text-sm text-gray-600 dark:text-zinc-400 mb-3 line-clamp-2">{image.description}</p>
                        {/if}

                        <!-- Edit and delete buttons -->
                        <div class="flex gap-2">
                            <!-- Edit button links to edit page -->
                            <a href="/dashboard/edit/{image.id}"
                                class="flex-1 text-center text-sm text-gray-600 dark:text-zinc-400 border border-gray-200 dark:border-zinc-700 hover:border-black py-2 rounded-xl transition">
                                Edit
                            </a>
                            <!-- Delete form -->
                            <form method="POST" action="?/delete" class="flex-1">
                                <input type="hidden" name="id" value={image.id}/>
                                <button type="submit"
                                    class="w-full text-sm text-red-500 hover:text-red-600 border border-red-100 hover:border-red-200 hover:bg-red-50 py-2 rounded-xl transition">
                                    Delete
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            {/each}
        </div>
    {/if}
</div>