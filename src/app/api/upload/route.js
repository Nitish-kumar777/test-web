import cloudinary from 'cloudinary';

cloudinary.config({
  cloud_name: 'dne38mnjz',
  api_key: '412794596396593',
  api_secret: 'SyoRXUsUvEs1tEc4O4U2hrJGovc',
});

export const POST = async (req) => {
  try {
    const formData = await req.formData();
    const videoFile = formData.get('video'); // This is a Blob
    const coverImage = formData.get('coverImage'); // Cover image as a Blob
    const animeTitle = formData.get('animeTitle').trim(); // Trim whitespaces from animeTitle
    const episodeTitle = formData.get('episodeTitle').trim(); // Trim episode title
    const description = formData.get('description').trim(); // Trim description

    // Convert the Blob to Buffer for both video and cover image
    const videoBuffer = await videoFile.arrayBuffer();
    const coverBuffer = coverImage ? await coverImage.arrayBuffer() : null;

    // Create folder based on anime title
    const folderPath = `anime/${animeTitle}`; // Ensures that all episodes and the cover go in the same folder

    // Upload the cover image (if it hasn't been uploaded already)
    if (coverBuffer) {
      await new Promise((resolve, reject) => {
        cloudinary.v2.uploader.upload_stream(
          {
            resource_type: 'image',
            folder: folderPath,
            public_id: 'cover', // Save the cover image as 'cover' in the anime folder
          },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        ).end(Buffer.from(coverBuffer));
      });
    }

    // Upload the video to Cloudinary
    const result = await new Promise((resolve, reject) => {
      cloudinary.v2.uploader.upload_stream(
        {
          resource_type: 'video',
          folder: folderPath,
          public_id: episodeTitle, // Episode number or title as public ID (filename)
          context: `description=${description}`, // Add description as metadata
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      ).end(Buffer.from(videoBuffer)); // Send video buffer to Cloudinary
    });

    return new Response(JSON.stringify({ success: true, data: result }), {
      status: 200,
    });
  } catch (error) {
    console.error('Error uploading video:', error);
    return new Response(
      JSON.stringify({ success: false, message: 'Video upload failed' }),
      { status: 500 }
    );
  }
};
