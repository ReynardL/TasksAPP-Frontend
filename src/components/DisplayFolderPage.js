import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Badge from "./ui/badge";

function DisplayFolderPage({ apiUrl }) {
  const navigate = useNavigate();
  const token = sessionStorage.getItem("token");
  const { id } = useParams();
  
  const [folderData, setFolderData] = useState({ id: "", name: "" });
  const [members, setMembers] = useState([]);

  const groupedMembers = members.reduce((acc, member) => {
    const role = member.role.toLowerCase();
    if (!acc[role]) acc[role] = [];
    acc[role].push(member);
    return acc;
  }, {});

  const roleConfig = {
    owner: { title: "Owner", color: "bg-gray-800" },
    editor: { title: "Editors", color: "bg-gray-600" },
    viewer: { title: "Viewers", color: "bg-gray-400" }
  };

  useEffect(() => {
    fetch(`${apiUrl}/folders/${id}`, {
      headers: { "Authorization": `Bearer ${token}` },
    })
      .then((response) => response.json())
      .then((data) => {
        setFolderData({
          id: data.id,
          name: data.name,
        });
      })
      .catch((error) => console.error("Error fetching folder data:", error));

    fetch(`${apiUrl}/folders/${id}/members`, {
      headers: { "Authorization": `Bearer ${token}` },
    })
      .then((response) => response.json())
      .then((data) => setMembers(data))
      .catch((error) => console.error("Error fetching folder members:", error));
  }, [id, apiUrl, token]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-xl bg-white p-6 rounded-lg shadow-lg min-h-[500px] flex flex-col">
        {/* Folder Header */}
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={() => navigate(`/folders/${id}/edit`)}
            className="text-2xl font-bold text-gray-800 hover:bg-gray-100 px-2 rounded truncate max-w-[70%]"
          >
            {folderData.name}
          </button>
          <Badge className="bg-gray-400 text-white ml-2">{`#${folderData.id}`}</Badge>
        </div>

        {/* Members Section */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Members</h2>
            <button
              onClick={() => navigate(`/folders/${id}/members/add`)}
              className="text-[#48A6A7] px-3 py-1 rounded text-sm font-semibold hover:bg-gray-100"
            >
              Add Member
            </button>
          </div>

          {/* Members List */}
          <div className="space-y-2">
            {['owner', 'editor', 'viewer'].map((role) => (
              groupedMembers[role]?.length > 0 && (
                <div key={role} className="space-y-1">
                  <div className="flex items-center gap-2 ml-1">
                    <span className={`w-2 h-2 rounded-full ${roleConfig[role].color}`} />
                    <h3 className="text-sm font-medium text-gray-700">
                      {roleConfig[role].title}
                    </h3>
                  </div>
                  <div className="ml-4">
                    {groupedMembers[role].map((member) => (
                      <div
                        key={member.user_id}
                        className="group flex items-center justify-between py-1 px-2 hover:bg-gray-50 rounded"
                      >
                        <span className="text-gray-900 text-sm">
                          {member.email || `User ${member.user_id}`}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/folders/${id}/members/${member.user_id}/edit`);
                          }}
                          className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-200 rounded-full"
                        >
                          <svg 
                            className="w-4 h-4 text-black"
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path 
                              strokeLinecap="round" 
                              strokeLinejoin="round" 
                              strokeWidth={2} 
                              d="M5 12h.01M12 12h.01M19 12h.01" 
                            />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between gap-4 mt-6">
          <button
            onClick={() => navigate("/")}
            className="w-1/2 py-3 bg-gray-400 text-white font-semibold rounded-lg shadow-md hover:bg-gray-500"
          >
            Back
          </button>
          <button
            onClick={() => {
              if (window.confirm("Are you sure you want to delete this folder?")) {
                fetch(`${apiUrl}/folders/${id}`, {
                  headers: { "Authorization": `Bearer ${token}` },
                  method: "DELETE",
                })
                  .then(() => navigate("/"))
                  .catch((error) => console.error("Error deleting folder:", error));
              }
            }}
            className="w-1/2 py-3 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default DisplayFolderPage;