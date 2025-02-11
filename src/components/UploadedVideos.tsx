import React, { useState, useEffect } from 'react';

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
      setLoading(true);
      setError('');
      try {
        // Directly access files from the 'videos' public directory
        const videoFiles = [
          'Simulator.mp4',
          'Banner_T03.mp4'
          // Add more video file names as needed, or dynamically fetch them if possible
        ];

        const videosData = videoFiles.map(name => ({
          name: name,
          url: `/videos/${name}` // URL to access the video via 'serve'
        }));
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
        <p className="text-gray-300">No videos uploaded yet. Please place video files in the "videos" folder in the project root.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {videos.map((video) => (
            <div key={video.name} className="bg-gray-700 rounded-lg overflow-hidden shadow-md">
              <video controls className="w-full aspect-video">
                <source src={video.url} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              <div className="p-4">
                <h4 className="text-lg font-semibold text-white">{video.name}</h4>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
