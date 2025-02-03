# Task Management Frontend

![License](https://img.shields.io/badge/license-MIT-green)

This is the frontend for a task management application designed to provide a modern and intuitive interface for creating and managing tasks. It supports collaboration through shared folders, allowing users to work with classmates, friends, or colleagues in a seamless environment.

---

## Table of Contents

1. [Overview](#overview)
2. [Features](#features)
3. [Technologies Used](#technologies-used)
4. [Installation and Setup](#installation-and-setup)
5. [Folder Structure](#folder-structure)
6. [Deployment](#deployment)
7. [License](#license)
8. [Contact](#contact)
9. [Future Plans](#future-plans)

---

## Overview

The Task Management Frontend is a React-based web application that provides a user-friendly interface for interacting with the backend API. It allows users to:
- Create, edit, and delete tasks.
- Organize tasks into folders and share them with others.
- Collaborate with other users via role-based permissions (owner, editor, viewer).
- Search and filter tasks based on various criteria (e.g., title, priority, due date).

This application is ideal for students, teams, and businesses looking for an efficient way to manage tasks and collaborate with others.

---

## Features

- **Task Management**: Create, update, delete, and view tasks with due dates, priorities, and repeat functionality.
- **Folder Sharing**: Share folders with other users and assign roles (owner, editor, viewer).
- **Search and Filter**: Advanced search and filter capabilities for tasks based on title, description, priority, due date, and more.
- **User Authentication**: Secure login and registration with JWT tokens.
- **Responsive Design**: Modern UI built with Tailwind CSS for a seamless experience across devices.
- **Asynchronous Operations**: Optimized performance using asynchronous programming for API calls and state updates.

---

## Technologies Used

- **Frontend Framework**: [React](https://reactjs.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) and [PostCSS](https://postcss.org/)
- **State Management**: `useState` for local state management
- **Routing**: React Router for navigation between pages
- **API Integration**: Asynchronous API calls to interact with the backend hosted on Google Cloud Platform (GCP)
- **Build Tool**: Webpack for bundling and optimizing assets
- **Hosting**: Firebase for deployment
- **Session Storage**: `sessionStorage` for persisting temporary data like search parameters and folder selections

---

## Installation and Setup

### Prerequisites

- Node.js (v16 or higher)
- npm (v8 or higher)

### Environment Variables

Create a `.env` file in the root directory with the following variable:

```env
REACT_APP_API_URL=<your-backend-api-url>
```

### Steps to Run Locally

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd <repository-directory>
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Access the application at:
   - Local: `http://localhost:3001`
   - Production: `https://tasksapp-389b4.web.app/`

5. Build the application for production:
   ```bash
   npm run build
   ```

---

## Folder Structure

```plaintext
.
├── public/                  # Static assets and index.html
│   └── index.html           # Main HTML file
├── src/                     # Source code
│   ├── components/          # React components
│   │   ├── ui/              # Reusable UI components (e.g., Button, Card, Badge)
│   │   ├── AddMemberPage.js # Page for adding members to a folder
│   │   ├── CreateFolderPage.js # Page for creating new folders
│   │   ├── CreateTaskPage.js   # Page for creating new tasks
│   │   ├── DisplayFolderPage.js # Page for viewing folder details
│   │   ├── DisplayTaskPage.js   # Page for viewing task details
│   │   ├── EditFolderPage.js    # Page for editing folders
│   │   ├── EditMemberPage.js    # Page for editing folder members
│   │   ├── EditTaskPage.js      # Page for editing tasks
│   │   ├── FilterPage.js        # Page for filtering tasks
│   │   ├── LoginPage.js         # Login page
│   │   ├── MainPage.js          # Main dashboard page
│   │   ├── RegisterPage.js      # Registration page
│   │   └── SearchPage.js        # Page for searching tasks
│   ├── App.js                  # Main application file with routing logic
│   ├── index.css               # Global styles
│   └── index.js                # Entry point for the application
├── .env                       # Environment variables
├── .firebaserc                # Firebase configuration
├── firebase.json              # Firebase hosting configuration
├── package.json               # Project dependencies and scripts
├── postcss.config.js          # PostCSS configuration
├── tailwind.config.js         # Tailwind CSS configuration
└── webpack.config.js          # Webpack configuration
```

---

## Deployment

### Build Process

To build the application for production:

```bash
npm run build
```

### Firebase Deployment

1. Initialize Firebase in the project:
   ```bash
   firebase init
   ```

2. Link the project to your Firebase account and select the appropriate options (e.g., hosting).

3. Deploy the application:
   ```bash
   firebase deploy
   ```

### Environment Configuration

Environment variables are handled automatically during deployment. The `REACT_APP_API_URL` is embedded into the build process, so no additional configuration is required.

---

## License

This project is licensed under the [MIT License](LICENSE).

---

## Contact

For questions, feedback, or collaboration, feel free to reach out:

- Email: [reynardlin1810@gmail.com](mailto:reynardlin1810@gmail.com)

---

## Future Plans

- Improve error messages for a better user experience.
- Add a calendar feature to visualize tasks in a grid format by date.
- Explore additional integrations (e.g., email notifications for task deadlines).
