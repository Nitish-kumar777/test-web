import cloudinary from 'cloudinary';

cloudinary.config({
  cloud_name: 'dne38mnjz',
  api_key: '412794596396593',
  api_secret: 'SyoRXUsUvEs1tEc4O4U2hrJGovc',
});

export const GET = async () => {
  try {
    // Get list of all anime folders in Cloudinary
    const folders = await cloudinary.v2.api.sub_folders('anime'); // Assuming 'anime' is the root folder

    // Fetch anime data for each folder
    const animeDataPromises = folders.folders.map(async (folder) => {
      const animeTitle = folder.name;

      // Fetch cover image separately using a search with folder and public_id 'cover'
      const coverImageRes = await cloudinary.v2.api.resources({
        type: 'upload',
        prefix: `anime/${animeTitle}/cover`, // Fetch only the cover image from the cover subfolder
        resource_type: 'image', // Cover image should be of type 'image'
      });

      const coverImage = coverImageRes.resources[0]?.secure_url || ''; // Use the first image in the folder as the cover

      // Fetch all videos (episodes) inside the folder
      const resources = await cloudinary.v2.api.resources({
        type: 'upload',
        prefix: `anime/${animeTitle}`, // Get all resources in the specific anime folder
        resource_type: 'video', // Fetch only videos
      });

      // Map episodes, excluding any files named 'cover' (which should be handled separately)
      const episodes = resources.resources
        .filter((ep) => !ep.public_id.includes('cover')) // Ensure we exclude the cover image from episode list
        .map((ep) => ({
          title: ep.public_id.split('/').pop(), // Extract episode title from public_id
          url: ep.secure_url, // Use secure_url to get the full URL of the video
        }));

      return {
        animeTitle,
        coverImage, // Use the cover image URL
        episodes,
      };
    });

    const animeData = await Promise.all(animeDataPromises);

    return new Response(JSON.stringify({ success: true, data: animeData }), {
      status: 200,
    });
  } catch (error) {
    console.error('Error fetching anime data:', error);
    return new Response(
      JSON.stringify({ success: false, message: 'Failed to fetch anime data' }),
      { status: 500 }
    );
  }
};
