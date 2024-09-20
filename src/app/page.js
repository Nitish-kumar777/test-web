"use client";

import AnimeList from '@/components/VideoList';
import { useState } from 'react';

export default function VideoUpload() {
  const [video, setVideo] = useState(null);
  const [coverImage, setCoverImage] = useState(null); // Add state for cover image
  const [preview, setPreview] = useState('');
  const [title, setTitle] = useState('');
  const [episodeTitle, setEpisodeTitle] = useState(''); // Add state for episode title
  const [description, setDescription] = useState(''); // Add state for description
  const [isLoading, setIsLoading] = useState(false);

  // Handle file input change for video
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setVideo(file);
      setPreview(URL.createObjectURL(file)); // Generate a preview URL for the video
    }
  };

  // Handle file input change for cover image
  const handleCoverChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverImage(file); // Set the cover image
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!video || !title || !episodeTitle || !description) {
      alert('Please provide all required fields.');
      return;
    }

    setIsLoading(true); // Show loading state

    const formData = new FormData();
    formData.append('video', video);
    formData.append('coverImage', coverImage); // Add cover image to the form data
    formData.append('animeTitle', title); // Add the anime title
    formData.append('episodeTitle', episodeTitle); // Add the episode title
    formData.append('description', description); // Add the description

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (data.success) {
        alert('Video and cover uploaded successfully');
        setVideo(null); // Clear the video input
        setCoverImage(null); // Clear the cover image input
        setPreview(''); // Clear the preview
        setTitle(''); // Clear the title input
        setEpisodeTitle(''); // Clear the episode title input
        setDescription(''); // Clear the description input
      } else {
        alert(`Upload failed: ${data.message}`);
      }
    } catch (error) {
      alert('An error occurred during the upload');
    } finally {
      setIsLoading(false); // Hide loading state
    }
  };

  return (
    <><div>
      <h2>Upload Anime Episode</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Anime Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)} />
        <input
          type="text"
          placeholder="Episode Title"
          value={episodeTitle}
          onChange={(e) => setEpisodeTitle(e.target.value)} />
        <input
          type="text"
          placeholder="Episode Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)} />
        <input
          type="file"
          onChange={handleCoverChange}
          accept="image/*" // Accept only image files for the cover
          placeholder='image' />
        <input
          type="file"
          onChange={handleFileChange}
          accept="video/*" // Accept only video files for the episode
        />
        {preview && <video src={preview} controls width={400} />}
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Uploading...' : 'Upload Episode'}
        </button>
      </form>
    </div>
    <AnimeList/>
    </>
  );
}