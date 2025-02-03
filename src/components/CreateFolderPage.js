import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CreateFolderPage = ({ apiUrl }) => {
  const [folderName, setFolderName] = useState('');
  const token = sessionStorage.getItem("token");
  const navigate = useNavigate();

  const handleCreateFolder = async (e) => {
    e.preventDefault();

    const response = await fetch(`${apiUrl}/folders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({
        name: folderName,
      }),
    });

    if (response.ok) {
      const folderData = await response.json();
      sessionStorage.setItem("selectedFolder", folderData.id)
      navigate('/');
    } else {
      console.error('Error creating folder');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Create Folder</h1>
        <form onSubmit={handleCreateFolder} className="space-y-4">
          {/* Folder Name Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Folder Name</label>
            <input
              type="text"
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#48A6A7] focus:outline-none"
              placeholder="Enter folder name"
              required
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-between gap-4 mt-6">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="w-1/2 py-3 bg-gray-400 text-white font-semibold rounded-lg shadow-md hover:bg-gray-500"
            >
              Back
            </button>
            <button
              type="submit"
              className="w-1/2 py-3 bg-[#48A6A7] text-white font-semibold rounded-lg shadow-md hover:bg-[#3e8e8f]"
            >
              Create Folder
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateFolderPage;
