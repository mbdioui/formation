import React, { useState, useEffect } from 'react';
import { getStorage, ref, listAll, getDownloadURL } from 'firebase/storage';

interface Video {
  name: string;
  url: string;
}

export function UploadedVideos() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const storage = getStorage();
        const videosRef = ref(storage, 'videos/');
        const listResult = await listAll(videosRef);

        const videoPromises = listResult.items.map(async (itemRef) => {
          const url = await getDownloadURL(itemRef);
          return { name: itemRef.name, url };
        });

        const videosData = await Promise.all(videoPromises);
        setVideos(videosData);
      } catch (error: any) {
        console.error('Error fetching videos:', error);
        setError('Failed to load videos.');
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  if (loading) {
    return <div className="text-gray-300">Loading videos...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div>
      <h3 className="text-xl font-bold mb-4">Uploaded Videos</h3>
      {videos.length === 0 ? (
        <p className="text-gray-300">No videos uploaded yet.</p>
      ) : (
        <ul className="space-y-4">
          {videos.map((video) => (
            <li key={video.name} className="bg-gray-700 p-4 rounded-lg">
              <a href={video.url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                {video.name}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
