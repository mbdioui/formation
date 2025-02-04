import React from 'react';
import { UploadedVideos } from './UploadedVideos';

export function Dashboard() {
  return (
    <div className="container mx-auto px-4 py-16 text-white">
      <h2 className="text-3xl font-bold mb-8">Dashboard</h2>
      <UploadedVideos />
    </div>
  );
}
