# Personnel Leave & Equipment Request Management System

## 📋 Project Versions

This repository contains multiple implementations of the same Personnel Leave & Equipment Request Management System:

- **🟢 [React Frontend](https://github.com/ahmetkale35/leave-equipment-requests-react)** - Modern React SPA with Material UI & Tailwind CSS
- **🔵 [ASP.NET MVC](https://github.com/ahmetkale35/Personnel-Leave-and-Equipment-Request-Management-System)** - Traditional MVC application with Razor views
- **🟡 [ASP.NET Web API](https://github.com/ahmetkale35/Personnel-Equipment-Leave-WebAPI)** - RESTful API backend with separate frontend

### 🎯 Choose Your Version

| Version | Best For | Technology Stack |
|---------|----------|------------------|
| **React Frontend** | Modern web apps, SPA lovers | React, Vite, Redux, Material UI |
| **MVC** | Traditional web apps, server-side rendering | ASP.NET MVC, Razor, Bootstrap |
| **Web API** | Microservices, mobile apps, multiple clients | ASP.NET Web API, JWT, REST |

---

## 🚀 React Frontend Version

This is the **React Frontend** implementation of the Personnel Leave & Equipment Request Management System.

## Overview

This project is a modern web application that enables employees to easily create and track **leave** and **equipment requests**, while allowing administrators to manage all requests from a central dashboard. The system provides different interfaces and permissions based on user roles (Employee, IT, Admin).

---

## Features

- **JWT-based authentication** and role-based authorization
- For Employees:
  - Create leave requests and view their own leave history
  - Create equipment requests and view their own equipment request history
- For IT and Admin:
  - View and manage (approve/reject) all leave and equipment requests
- Modern, responsive, and user-friendly UI
- Advanced filtering, search, and pagination for requests
- Dark mode and light mode support

---

## Technologies Used

- **React** (with Vite for fast development)
- **React Router** for client-side routing
- **Redux Toolkit** for state management
- **Axios** for API requests
- **Material UI** and **Tailwind CSS** for styling
- **ESLint** for code quality
- **JWT** for authentication (token stored in localStorage)

---

## Project Structure

```
src/
  components/         # Reusable UI components (e.g., Navbar)
  pages/              # Main pages (Home, Login, Requests, etc.)
  services/           # API service layer (Axios)
  redux/              # Redux store and slices
  utils/              # Utility functions (e.g., auth helpers)
  assets/             # Static assets
  config/             # Configuration files
```

---

## User Roles & Permissions

- **Employee**: Can create and view their own leave/equipment requests.
- **IT**: Can create/view their own requests and manage all equipment requests.
- **Admin**: Can manage all leave and equipment requests.

Role is determined from the JWT token and controls both UI and backend access.

---

## Authentication & Authorization

- Users log in with their credentials.
- On successful login, a JWT token is received and stored in `localStorage`.
- The token is decoded to determine the user's role.
- Protected routes/components check for a valid token and role before granting access.

---

## Main Pages & Flows

- **Login**: Authenticates user and stores JWT.
- **Home**: Shows dashboard cards based on user role.
- **Create Leave Request**: Form to submit a new leave request.
- **My Leave Requests**: List, filter, and search personal leave requests.
- **Create Equipment Request**: Form to submit a new equipment request.
- **My Equipment Requests**: List, filter, and search personal equipment requests.
- **Manage Leaves/Equipments**: (Admin/IT) Approve or reject pending requests.

---

## 🔗 Backend API Integration

This React frontend connects to an **ASP.NET Core Web API** backend. The backend API provides all the business logic, database operations, and authentication services.

### 🔗 Backend Repository
- **Backend API**: [Personnel-Equipment-Leave-WebAPI](https://github.com/ahmetkale35/Personnel-Equipment-Leave-WebAPI)

### 📡 API Endpoints (Sample)

- `POST /api/authentication/Login` — User login
- `POST /api/Leaves/CreateOneLeave` — Create leave request
- `GET /api/Leaves/MyRequests` — Get user's leave requests
- `GET /api/Leaves/Pending` — Get all pending leave requests (admin)
- `PUT /api/Leaves/{id}/approve` — Approve leave request
- `PUT /api/Leaves/{id}/reject` — Reject leave request
- Similar endpoints for equipment requests

---

## Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone <repo-url>
   cd <project-folder>
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Build for production:**
   ```bash
   npm run build
   ```

5. **Lint the code:**
   ```bash
   npm run lint
   ```

> **⚠️ Important:** This React frontend requires the **ASP.NET Core Web API backend** to be running. 
> 
> 1. **Clone and run the backend API first**: [Personnel-Equipment-Leave-WebAPI](https://github.com/ahmetkale35/Personnel-Equipment-Leave-WebAPI)
> 2. **Ensure the API is running** at the configured base URL (default: `https://localhost:7012/api`)
> 3. **Then start this React frontend**

---

## Customization

- **Styling:** Uses both Tailwind CSS and Material UI. You can customize themes and components as needed.
- **Environment:** Update API base URLs and other configs in the `src/services/ApiService.jsx` or a `.env` file.
- **Roles:** Add or modify roles and permissions in the authentication utility and route guards.

---


## Screenshots

<img width="2532" height="1331" alt="1" src="https://github.com/user-attachments/assets/5b7211a3-b1ee-4033-9d0b-ff21eb2fbc72" />

<img width="2528" height="1333" alt="q1" src="https://github.com/user-attachments/assets/538c2ae5-f552-4a3f-b98c-11f9a296ffd9" />

<img width="2532" height="1250" alt="3" src="https://github.com/user-attachments/assets/7d33ead4-fe50-4a8f-b379-0f56bf586d45" />
<img width="2533" height="1246" alt="8" src="https://github.com/user-attachments/assets/be5689cb-a6bf-4219-b559-9dcde8db2f5c" />
<img width="2518" height="1295" alt="12" src="https://github.com/user-attachments/assets/29795a02-1761-4cce-88ef-2683100c8b65" />
<img width="2514" height="1255" alt="Ekran görüntüsü 2025-07-30 163107" src="https://github.com/user-attachments/assets/b23cf192-5e8f-4bb5-849f-cfff80781848" />
<img width="2537" height="1227" alt="6" src="https://github.com/user-attachments/assets/6be6c7dd-69ad-4b72-b09b-adcf40041289" />

---


## 📊 Version Comparison

| Feature | React Frontend | MVC | Web API |
|---------|----------------|-----|---------|
| **Frontend** | React SPA | Razor Views | Any (React, Angular, Mobile) |
| **State Management** | Redux Toolkit | Server-side | Client-side |
| **Routing** | React Router | MVC Routing | Client-side |
| **Styling** | Material UI + Tailwind | Bootstrap | Flexible |
| **API Calls** | Axios | Direct DB | REST Endpoints |
| **Authentication** | JWT (Client) | Session-based | JWT |
| **Performance** | Fast (SPA) | Server-rendered | API-focused |
| **Mobile** | Responsive | Responsive | Native apps possible |

### 🔄 Migration Path

- **MVC → React**: Extract business logic to Web API, build React frontend
- **React → MVC**: Convert components to Razor views, move logic to controllers
- **Web API → Full Stack**: Add MVC controllers and views for server-side rendering
