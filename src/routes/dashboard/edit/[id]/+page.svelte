<script>
    // Get image data from server
    let { data } = $props();
</script>

<!-- Edit image page -->
<div class="max-w-2xl mx-auto px-6 py-10">

    <!-- Page heading -->
    <h1 class="text-2xl font-semibold text-gray-900 dark:text-white mb-1" style="font-family: 'DM Serif Display', serif;">Edit photo</h1>
    <p class="text-sm text-gray-400 mb-8">Update your photo details.</p>

    <div class="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl p-6">

        <!-- Current image preview -->
        <div class="aspect-square w-full max-w-xs mx-auto overflow-hidden rounded-xl bg-gray-50 dark:bg-zinc-800 mb-6">
            <img src={data.image.image_url} alt="Photo" class="w-full h-full object-cover"/>
        </div>

        <!-- Edit form -->
        <form method="POST" class="flex flex-col gap-4">

            <!-- Description input with current value -->
            <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">Description</label>
                <input
                    type="text" name="description"
                    value={data.image.description ?? ''}
                    placeholder="Description (optional)"
                    class="w-full px-4 py-3 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:border-black transition"
                />
            </div>

            <!-- Category select with current value -->
            <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">Category</label>
                <select name="category" class="w-full px-4 py-3 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl text-sm text-gray-700 dark:text-zinc-300 focus:outline-none focus:border-black transition">
                    <option value="other" selected={data.image.category === 'other'}>Other</option>
                    <option value="nature" selected={data.image.category === 'nature'}>Nature</option>
                    <option value="city" selected={data.image.category === 'city'}>City</option>
                    <option value="people" selected={data.image.category === 'people'}>People</option>
                    <option value="food" selected={data.image.category === 'food'}>Food</option>
                    <option value="art" selected={data.image.category === 'art'}>Art</option>
                </select>
            </div>

            <!-- Action buttons -->
            <div class="flex gap-3 mt-2">
                <!-- Save button -->
                <button type="submit"
                    class="flex-1 bg-black hover:bg-gray-800 text-white text-sm font-medium py-3 rounded-xl transition active:scale-[0.98]">
                    Save changes
                </button>
                <!-- Cancel button -->
                <a href="/dashboard"
                    class="flex-1 text-center bg-gray-50 dark:bg-zinc-800 hover:bg-gray-100 text-gray-700 dark:text-zinc-300 text-sm font-medium py-3 rounded-xl transition">
                    Cancel
                </a>
            </div>
        </form>
    </div>
</div>