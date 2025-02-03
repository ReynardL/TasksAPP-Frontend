import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainPage from "./components/MainPage";
import CreateTaskPage from "./components/CreateTaskPage";
import EditTaskPage from "./components/EditTaskPage";
import SearchPage from "./components/SearchPage";
import FilterPage from "./components/FilterPage";
import DisplayTaskPage from "./components/DisplayTaskPage";
import CreateFolderPage from "./components/CreateFolderPage";
import DisplayFolderPage from "./components/DisplayFolderPage";
import LoginPage from "./components/LoginPage";
import RegisterPage from "./components/RegisterPage";
import EditFolderPage from "./components/EditFolderPage";
import AddMemberPage from "./components/AddMemberPage";
import EditMemberPage from "./components/EditMemberPage";

const apiUrl = process.env.REACT_APP_API_URL;

const App = () => {
  const searchTasks = async (searchParams) => {
    const finalParams = {
      title: searchParams.title === "" ? null : searchParams.title,
      description: searchParams.description === "" ? null : searchParams.description,
      completed: searchParams.completed === "" ? null : searchParams.completed,
      priority: searchParams.priority === "" ? null : searchParams.priority,
      repeat_type: searchParams.repeat_type === "" ? null : searchParams.repeat_type,
      due: searchParams.due === "" ? null : searchParams.due,
      created: searchParams.created === "" ? null : searchParams.created,
    };
    const token = sessionStorage.getItem("token");

    try {
      const response = await fetch(`${apiUrl}/tasks/search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(finalParams),
      });
      if (!response.ok) {
        throw new Error("Failed to fetch tasks");
      }
      return await response.json();
    } catch (error) {
      console.error("Error in searchTasks:", error);
      throw error;
    }
  };

  const apiRequest = async (endpoint) => {
    try {
      const token = sessionStorage.getItem("token");
      const response = await fetch(`${apiUrl}/${endpoint}`, {headers: {"Authorization": `Bearer ${token}`}});
      if (!response.ok) {
        throw new Error(`Failed to fetch ${endpoint}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Error in apiRequest for ${endpoint}:`, error);
      throw error;
    }
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={<MainPage 
            searchTasks={searchTasks} 
            apiRequest={apiRequest}
          />}
        />
        <Route
          path="/create"
          element={<CreateTaskPage apiUrl={apiUrl} />}
        />
        <Route
          path="/tasks/:id"
          element={<DisplayTaskPage apiUrl={apiUrl} />}
        />
        <Route
          path="/edit/:id"
          element={<EditTaskPage apiUrl={apiUrl} />}
        />
        <Route
          path="/search"
          element={<SearchPage />}
        />
        <Route
          path="/filter"
          element={<FilterPage />}
        />
        <Route
          path="/folders/create"
          element={<CreateFolderPage apiUrl={apiUrl} />}
        />
        <Route
          path="/folders/:id"
          element={<DisplayFolderPage apiUrl={apiUrl} />}
        />
        <Route
          path="/folders/:id/edit"
          element={<EditFolderPage apiUrl={apiUrl} />}
        />
        <Route
          path="/folders/:id/members/add"
          element={<AddMemberPage apiUrl={apiUrl} />}
        />
        <Route
          path="/folders/:id/members/:memberId/edit"
          element={<EditMemberPage apiUrl={apiUrl} />}
        />
        <Route
          path="/login"
          element={<LoginPage apiUrl={apiUrl} />}
        />
        <Route
          path="/register"
          element={<RegisterPage apiUrl={apiUrl} />}
        />
      </Routes>
    </Router>
  );
};

export default App;

