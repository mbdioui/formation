import React, { useState } from 'react';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

export function AdminDashboard() {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const storage = getStorage();
    const storageRef = ref(storage, `videos/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on('state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(progress);
        setUploadSuccess(false);
        setUploadError('');
      },
      (error) => {
        console.error('Upload failed:', error);
        setUploadError('Upload failed: ' + error.message);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log('File available at', downloadURL);
          setUploadSuccess(true);
        });
      }
    );
  };

  return (
    <div className="container mx-auto px-4 py-16 text-white">
      <h2 className="text-3xl font-bold mb-8">Admin Dashboard</h2>
      <div className="mb-4">
        <label htmlFor="video-upload" className="block mb-2 text-sm font-medium text-gray-300">
          Upload Video
        </label>
        <input
          type="file"
          id="video-upload"
          accept="video/*"
          onChange={handleFileChange}
          className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-gray-300"
        />
      </div>
      {uploadProgress > 0 && (
        <div className="mb-4">
          <progress value={uploadProgress} max="100" className="w-full h-2 bg-gray-600 rounded-full overflow-hidden">
            <div className="bg-blue-500 h-full" style={{ width: `${uploadProgress}%` }}></div>
          </progress>
          <p className="text-sm text-gray-400">{uploadProgress.toFixed(2)}% uploaded</p>
        </div>
      )}
      {uploadSuccess && (
        <div className="bg-green-500 text-white p-4 rounded-md mb-4">
          Video uploaded successfully!
        </div>
      )}
      {uploadError && (
        <div className="bg-red-500 text-white p-4 rounded-md mb-4">
          {uploadError}
        </div>
      )}
    </div>
  );
}
