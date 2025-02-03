import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

function EditMemberPage({ apiUrl }) {
  const navigate = useNavigate();
  const token = sessionStorage.getItem("token");
  const { id, memberId } = useParams();
  const [role, setRole] = useState("viewer");

  useEffect(() => {
    fetch(`${apiUrl}/folders/${id}/members/${memberId}`, {
      headers: { "Authorization": `Bearer ${token}` },
    })
      .then((response) => response.json())
      .then((data) => {
        setRole(data.role);
      })
      .catch((error) =>
        console.error("Error fetching member data:", error)
      );
  }, [id, memberId, apiUrl, token]);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `${apiUrl}/folders/${id}/members/${memberId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify({ role:role }),
        }
      );
      if (!response.ok) {
        throw new Error("Error updating member");
      }
      navigate(`/folders/${id}`);
    } catch (error) {
      console.error("Error updating member:", error);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to remove this member?")) {
      try {
        const response = await fetch(
          `${apiUrl}/folders/${id}/members/${memberId}`,
          {
            method: "DELETE",
            headers: {
              "Authorization": `Bearer ${token}`,
            },
          }
        );
        
        if (!response.ok) throw new Error("Error deleting member");
        navigate(`/folders/${id}`);
      } catch (error) {
        console.error("Error deleting member:", error);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
          Edit Member Role
        </h1>
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Member Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#48A6A7] focus:outline-none"
            >
              <option value="editor">Editor</option>
              <option value="viewer">Viewer</option>
            </select>
          </div>
          <div className="grid grid-cols-3 gap-4 mt-6">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="py-3 bg-gray-400 text-white font-semibold rounded-lg shadow-md hover:bg-gray-500"
            >
              Back
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="py-3 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600"
            >
              Remove
            </button>
            <button
              type="submit"
              className="py-3 bg-[#48A6A7] text-white font-semibold rounded-lg shadow-md hover:bg-[#3e8e8f]"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditMemberPage;
