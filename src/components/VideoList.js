"use client"

import { useState, useEffect } from 'react';

export default function AnimeList() {
  const [animeData, setAnimeData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAnime, setSelectedAnime] = useState(null); // State to store the selected anime

  useEffect(() => {
    const fetchAnimeData = async () => {
      try {
        const res = await fetch('/api/getAnimeData');
        const data = await res.json();
        if (data.success) {
          console.log(data.data)
          setAnimeData(data.data);
        } else {
          console.error('Failed to fetch anime data:', data.message);
        }
      } catch (error) {
        console.error('Error fetching anime data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnimeData();
  }, []);

  // Handle clicking on the cover image
  const handleCoverClick = (animeTitle) => {
    // Toggle visibility of episodes
    setSelectedAnime(animeTitle === selectedAnime ? null : animeTitle);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {animeData.map((anime) => (
        <div key={anime.animeTitle}>
          <button onClick={() => handleCoverClick(anime.animeTitle)}>
            clicking
          </button>
          <h2>{anime.animeTitle}</h2>
          {anime.coverImage ? (
            <img 
              src={anime.coverImage} 
              alt={`${anime.animeTitle} Cover`} 
              width={300} 
              style={{ cursor: 'pointer' }} 
              onClick={() => handleCoverClick(anime.animeTitle)} // Click to toggle episode list
            />
          ) : (
            <p>No cover image available</p>
          )}

          {/* Only show episodes if the anime is selected */}
          {selectedAnime === anime.animeTitle && (
            <>
              <h3>Episodes:</h3>
              <ul>
                {anime.episodes.map((episode) => (
                  <li key={episode.title}>
                    <strong>{episode.title}</strong>
                    {/* Video rendering */}
                    <video src={episode.url} controls width={400} preload="metadata"></video>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      ))}
    </div>
  );
}