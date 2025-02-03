import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

function EditFolderPage({ apiUrl }) {
  const navigate = useNavigate();
  const token = sessionStorage.getItem("token");
  const { id } = useParams();
  const [folderName, setFolderName] = useState("");

  useEffect(() => {
    fetch(`${apiUrl}/folders/${id}`, {
      headers: { "Authorization": `Bearer ${token}` },
    })
      .then((response) => response.json())
      .then((data) => {
        setFolderName(data.name);
      })
      .catch((error) => console.error("Error fetching folder data:", error));
  }, [id, apiUrl, token]);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${apiUrl}/folders/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ name: folderName }),
      });
      if (!response.ok) {
        throw new Error("Error updating folder");
      }
      navigate(`/folders/${id}`);
    } catch (error) {
      console.error("Error saving folder:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
          Edit Folder
        </h1>
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Folder Name
            </label>
            <input
              type="text"
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#48A6A7] focus:outline-none"
              required
            />
          </div>
          <div className="flex justify-between gap-4 mt-6">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="w-1/2 py-3 bg-gray-400 text-white font-semibold rounded-lg shadow-md hover:bg-gray-500"
            >
              Back
            </button>
            <button
              type="submit"
              className="w-1/2 py-3 bg-[#48A6A7] text-white font-semibold rounded-lg shadow-md hover:bg-[#3e8e8f]"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditFolderPage;
