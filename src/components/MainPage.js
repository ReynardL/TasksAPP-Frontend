import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Card, { CardContent } from "./ui/card";
import Button from "./ui/button";
import Badge from "./ui/badge";

const MainPage = ({
  searchTasks,
  apiRequest
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [filterBy, setFilterBy] = useState("due");
  const [order, setOrder] = useState("asc");
  const [folders, setFolders] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState(sessionStorage.getItem("selectedFolder") || "all");
  const [showUserOptions, setShowUserOptions] = useState(false);
  const [showLoginMessage, setShowLoginMessage] = useState(false);
  const token = sessionStorage.getItem("token");

  const checkToken = () => {
    if (!token) {
      setShowLoginMessage(true);
    } else {
      setShowLoginMessage(false);
    }
  };

  useEffect(() => {
    checkToken();
  }, [token]);

  const loadTasks = async () => {
    try {
      let taskData;
      const searchParams = sessionStorage.getItem("searchParams")
        ? JSON.parse(sessionStorage.getItem("searchParams"))
        : null;
      
      if (!token) {return;}

      if (searchParams) {
        taskData = await searchTasks(searchParams);
      } else {
        if (selectedFolder === "all") {
          taskData = await apiRequest("tasks");
        } else {
          taskData = await apiRequest(`folders/${selectedFolder}/tasks`);
        }
      }
      
      setTasks(taskData);
      filterTasks(taskData);
    } catch (error) {
      console.error("Error loading tasks:", error);
    }
  };

  const filterTasks = (tasksToFilter = tasks) => {
    const priorityOrder = { low: 0, medium: 1, high: 2 };
    const statusOrder = { false: 0, "in progress": 1, true: 2 };

    const sortedTasks = [...tasksToFilter].sort((a, b) => {
      if (filterBy === "priority") {
        const pa = priorityOrder[a.priority] ?? -1;
        const pb = priorityOrder[b.priority] ?? -1;
        return order === "asc" ? pa - pb : pb - pa;
      } else if (filterBy === "title") {
        return order === "asc"
          ? a.title.localeCompare(b.title)
          : b.title.localeCompare(a.title);
      } else if (filterBy === "due" || filterBy === "created") {
        const dateA = a[filterBy]
          ? new Date(a[filterBy]).getTime()
          : order === "asc"
          ? Number.MAX_SAFE_INTEGER
          : Number.MIN_SAFE_INTEGER;
        const dateB = b[filterBy]
          ? new Date(b[filterBy]).getTime()
          : order === "asc"
          ? Number.MAX_SAFE_INTEGER
          : Number.MIN_SAFE_INTEGER;
        return order === "asc" ? dateA - dateB : dateB - dateA;
      } else if (filterBy === "completed") {
        const sa = statusOrder[a.completed] ?? -1;
        const sb = statusOrder[b.completed] ?? -1;
        return order === "asc" ? sa - sb : sb - sa;
      }
      return 0;
    });
    setFilteredTasks(sortedTasks);
  };

  useEffect(() => {
    const storedFilterBy = sessionStorage.getItem("filterBy");
    const storedOrder = sessionStorage.getItem("order");
    if (storedFilterBy) setFilterBy(storedFilterBy);
    if (storedOrder) setOrder(storedOrder);

    loadTasks();
  }, [location.state, selectedFolder]);

  useEffect(() => {
    const fetchUserData = async () => {
      const userData = await apiRequest("user");
      if (userData?.email) {
        setUser(userData);
      }
    };

    if (!token) {return;}

    fetchUserData();
  }, [apiRequest]);

  useEffect(() => {
    filterTasks();
  }, [filterBy, order, tasks]);

  useEffect(() => {
    const loadFolders = async () => {
      try {
        const foldersData = await apiRequest("folders");
        setFolders(foldersData);
      } catch (error) {
        console.error("Error loading folders:", error);
      }
    };

    if (!token) {return;}

    loadFolders();
  }, []);

  const handleTaskClick = (task) => {
    navigate(`/tasks/${task.id}`);
  };

  const handleUserButtonClick = () => {
    setShowUserOptions(!showUserOptions);
  };

  const handleUserAction = async (action) => {
    setShowUserOptions(false);

    switch (action) {
      case "login": {
        navigate(`/login`);
        break;
      }
      case "logout": {
        sessionStorage.removeItem("token");
        window.location.reload();
        return { message: "Logged out successfully" };
      }
      case "register": {
        navigate(`/register`);
        break;
      }
      default:
        throw new Error(`Unknown action: ${action}`);
    }
  };

  const handleFolderClick = (folderId) => {
    setSelectedFolder(folderId);
    sessionStorage.setItem('selectedFolder', folderId);
    sessionStorage.removeItem("searchParams");
  };

  const handleFolderRightClick = (folderId, e) => {
    e.preventDefault();
    navigate(`/folders/${folderId}`);
  };

  return (
    <div className="flex min-h-screen">
      {showLoginMessage && (
        <div className="fixed inset-0 bg-gray-100 bg-opacity-40 flex items-center justify-center text-black text-xl font-bold">
          Please login before using features.
        </div>
      )}
      {/* Sidebar */}
      <aside className="w-80 bg-gray-50 p-4">
        {/* User Info Button */}
        <div className="relative">
          <button
            onClick={handleUserButtonClick}
            className="w-full text-left p-2 border rounded hover:bg-gray-200"
          >
            <div className="font-medium text-black">
              {user?.email || "Guest"}
            </div>
            {user && (
              <div className="text-xs text-gray-500">{user.id}</div>
            )}
          </button>
          {showUserOptions && (
            <div className="absolute left-0 mt-2 w-full bg-white border rounded shadow-lg z-10">
              {!user ? (
                <>
                  <button
                    onClick={() => handleUserAction("login")}
                    className="w-full text-left p-2 hover:bg-gray-100"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => handleUserAction("register")}
                    className="w-full text-left p-2 hover:bg-gray-100"
                  >
                    Register
                  </button>
                </>
              ) : (
                <button
                  onClick={() => handleUserAction("logout")}
                  className="w-full text-left p-2 hover:bg-gray-100"
                >
                  Logout
                </button>
              )}
            </div>
          )}
        </div>

        {/* Folders Section */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-2">
            <span className="font-semibold text-black">Your Folders</span>
            <button
              onClick={() => navigate("/folders/create")}
              className="text-[#48A6A7] px-2 py-1 rounded text-xl font-bold"
            >
              +
            </button>
          </div>

          <button
            onClick={() => handleFolderClick("all")}
            className={`w-full text-left p-2 mb-1 rounded ${
              selectedFolder === "all" ? "bg-gray-300" : "hover:bg-gray-200"
            }`}
          >
            All Tasks
          </button>

          {folders.map((folder) => (
            <div
              key={folder.id}
              className={`group flex items-center justify-between py-1 px-2 mb-1 rounded ${
                String(selectedFolder) === String(folder.id)
                  ? "bg-gray-300 selected"
                  : "hover:bg-gray-200"
              }`}
            >
              <div className="flex-1 min-w-0">
                <button
                  onClick={() => handleFolderClick(folder.id)}
                  className="w-full text-left relative overflow-hidden"
                  style={{ 
                    maxWidth: 'calc(100% - 32px)',
                    background: 'none',
                    border: 'none',
                    outline: 'none'
                  }}
                >
                  <span 
                    className="block truncate relative after:content-[''] after:absolute after:inset-y-0 after:right-0 after:w-8 after:bg-gradient-to-l after:from-gray-50 after:to-transparent group-hover:after:content-none group-[.selected]:after:content-none"
                    style={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {folder.name}
                  </span>
                </button>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/folders/${folder.id}`);
                }}
                className="opacity-0 group-hover:opacity-100 group-[.selected]:opacity-100 transition-opacity p-1 hover:bg-gray-300 rounded-full"
                title="Folder settings"
              >
                <svg 
                  className="w-5 h-5 text-black"
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={3} 
                    d="M5 12h.01M12 12h.01M19 12h.01" 
                  />
                </svg>
              </button>
            </div>
          ))}
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 bg-white">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-black">Tasks</h1>
          <div className="flex gap-4">
            <Button
              variant="outline"
              onClick={() =>
                navigate("/search", { state: { currentTasks: tasks } })
              }
              className="border-[#48A6A7] text-[#48A6A7]"
            >
              Search
            </Button>
            <Button
              variant="outline"
              onClick={() =>
                navigate("/filter", { state: { filterBy, order } })
              }
              className="border-[#48A6A7] text-[#48A6A7]"
            >
              Filter by
            </Button>
            {selectedFolder !== "all" && (
              <Button
                onClick={() => navigate("/create")}
                className="bg-[#48A6A7] text-white"
              >
                Create New
              </Button>
            )}
          </div>
        </div>

        {/* Tasks Grid (displayed in two columns on medium+ screens) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredTasks.length > 0 ? (
            filteredTasks.map((task) => (
              <Card
                key={task.id}
                onClick={() => handleTaskClick(task)}
                className="cursor-pointer hover:shadow-lg transition-shadow relative p-4"
              >
                <CardContent className="flex flex-col h-full justify-between">
                  {/* Top row: Task title, repeat info and priority badge */}
                  <div className="flex justify-between items-start w-full">
                    <h2 className="text-xl font-bold text-black">
                      {task.title}
                    </h2>
                    <div className="flex items-center space-x-2">
                      {task.repeat_type !== "never" && (
                        <div className="text-xs text-gray-500 flex items-center">
                          🔁 {task.repeat_amount} {task.repeat_type}
                        </div>
                      )}
                      <Badge priority={task.priority}>
                        {task.priority}
                      </Badge>
                    </div>
                  </div>

                  {/* Task Description */}
                  {task.description && (
                    <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                      {task.description}
                    </p>
                  )}

                  {/* Due Date */}
                  <div className="text-sm text-gray-500 mt-4">
                    {task.due
                      ? new Date(task.due).toLocaleString()
                      : "No due date"}
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <p className="text-gray-500">No tasks found.</p>
          )}
        </div>
      </main>
    </div>
  );
};

export default MainPage;
