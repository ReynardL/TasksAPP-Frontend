import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function AddMemberPage({ apiUrl }) {
  const navigate = useNavigate();
  const token = sessionStorage.getItem("token");
  const { id } = useParams();
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("viewer");
  const [error, setError] = useState("");

  const handleAddMember = async (e) => {
    e.preventDefault();
    setError("");
    
    try {
      const userResponse = await fetch(`${apiUrl}/users/by-email?email=${encodeURIComponent(email)}`, {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
      
      if (!userResponse.ok) {
        throw new Error("User not found");
      }
      
      const userData = await userResponse.json();
      
      const addResponse = await fetch(`${apiUrl}/folders/${id}/members`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ user_id: userData.id, role }),
      });
      
      if (!addResponse.ok) {
        throw new Error("Error adding member");
      }
      
      navigate(`/folders/${id}`);
    } catch (error) {
      console.error("Error adding member:", error);
      setError(error.message.includes("not found") 
        ? "User with this email not found" 
        : "Failed to add member");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
          Add Member
        </h1>
        <form onSubmit={handleAddMember} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#48A6A7] focus:outline-none"
              placeholder="Enter user's email"
              required
            />
          </div>
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
          {error && (
            <div className="text-red-500 text-sm text-center">{error}</div>
          )}
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
              Add Member
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddMemberPage;