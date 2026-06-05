<script>
    // Get user and images from server
    let { data, form } = $props();

    // Track selected file name for upload preview
    let preview = $state(null);
    let uploading = $state(false);

    // Show image preview when file is selected
    function handleFile(e) {
        const file = e.target.files?.[0];
        if (file) preview = URL.createObjectURL(file);
    }

    // Set uploading state on form submit
    function handleSubmit() {
        uploading = true;
    }
</script>

<!-- Dashboard page -->
<div class="max-w-4xl mx-auto px-6 py-10">

    <!-- Page heading -->
    <h1 class="text-2xl font-semibold text-gray-900 mb-1" style="font-family: 'DM Serif Display', serif;">Dashboard</h1>
    <p class="text-sm text-gray-400 mb-8">Manage and upload your photos.</p>

    <!-- Upload form card -->
    <div class="bg-white border border-gray-100 rounded-2xl p-6 mb-10">
        <h2 class="text-base font-semibold text-gray-800 mb-4">Upload new photo</h2>

        <!-- Success message -->
        {#if form?.success}
            <div class="mb-4 px-4 py-3 bg-green-50 border border-green-200 rounded-xl text-sm text-green-600">
                Photo uploaded successfully!
            </div>
        {/if}

        <!-- Upload form with multipart for file -->
        <form method="POST" action="?/upload" enctype="multipart/form-data" onsubmit={handleSubmit} class="flex flex-col gap-4">

            <!-- Image file picker -->
            <label class="cursor-pointer border-2 border-dashed border-gray-200 rounded-xl p-6 flex flex-col items-center hover:border-black transition">
                {#if preview}
                    <!-- Preview selected image -->
                    <img src={preview} alt="Preview" class="w-32 h-32 object-cover rounded-xl mb-2"/>
                {:else}
                    <!-- Upload placeholder icon -->
                    <svg class="w-8 h-8 text-gray-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 4v16m8-8H4"/>
                    </svg>
                {/if}
                <span class="text-sm text-gray-400">Click to select photo</span>
                <input type="file" name="image" accept="image/*" onchange={handleFile} class="hidden" required/>
            </label>

            <!-- Description input -->
            <input
                type="text" name="description"
                placeholder="Description (optional)"
                class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-black transition"
            />

            <!-- Category select -->
            <select name="category" class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:border-black transition">
                <option value="other">Category</option>
                <option value="nature">Nature</option>
                <option value="city">City</option>
                <option value="people">People</option>
                <option value="food">Food</option>
                <option value="art">Art</option>
            </select>

            <!-- CSS Filter select -->
            <select name="filter" class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:border-black transition">
                <option value="none">No filter</option>
                <option value="grayscale">Grayscale</option>
                <option value="sepia">Sepia</option>
                <option value="warm">Warm</option>
                <option value="cool">Cool</option>
            </select>

            <!-- Submit button -->
            <button type="submit" disabled={uploading}
                class="w-full bg-black hover:bg-gray-800 text-white text-sm font-medium py-3 rounded-xl transition active:scale-[0.98] disabled:opacity-50">
                {uploading ? 'Uploading...' : 'Upload photo'}
            </button>
        </form>
    </div>

    <!-- User's images grid -->
    <h2 class="text-base font-semibold text-gray-800 mb-4">Your photos ({data.images.length})</h2>

    <!-- Empty state -->
    {#if data.images.length === 0}
        <div class="text-center py-16 border border-dashed border-gray-200 rounded-2xl">
            <p class="text-sm text-gray-400">No photos yet. Upload your first one!</p>
        </div>
    {:else}
        <!-- Grid of user's images -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {#each data.images as image (image.id)}
                <div class="bg-white border border-gray-100 rounded-2xl overflow-hidden">

                    <!-- Image thumbnail -->
                    <div class="aspect-square overflow-hidden bg-gray-50">
                        <img src={image.image_url} alt={image.description ?? 'Photo'} class="w-full h-full object-cover"/>
                    </div>

                    <!-- Image info and delete button -->
                    <div class="p-4">
                        {#if image.description}
                            <p class="text-sm text-gray-600 mb-3 line-clamp-2">{image.description}</p>
                        {/if}

                        <!-- Delete form -->
                        <form method="POST" action="?/delete">
                            <input type="hidden" name="id" value={image.id}/>
                            <button type="submit"
                                class="w-full text-sm text-red-500 hover:text-red-600 border border-red-100 hover:border-red-200 hover:bg-red-50 py-2 rounded-xl transition">
                                Delete
                            </button>
                        </form>
                    </div>
                </div>
            {/each}
        </div>
    {/if}
</div>