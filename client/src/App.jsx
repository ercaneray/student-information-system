import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "primereact/resources/themes/saga-blue/theme.css";
import { useAuthStore } from "./store/authStore";
// Pages
import Dashboard from "./pages/Dashboard";
import PersonalInfo from "./pages/PersonalInfo";
import LoginPage from "./pages/LoginPage";
import Courses from "./pages/Courses";
import CourseList from "./pages/CourseList";
import Messages from "./pages/Messages";
import Graduation from "./pages/Graduation";
import Calculator from "./pages/Calculator";



function App() {
  
  return (
    <div className="bg-gray-100 min-h-screen">
      <Routes>
        {/* Auth routes */}
        <Route path="/login" element={<LoginPage />} />
        {/* Student routes */}
        <Route path="/calculator" element={<Calculator />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/course-list" element={<CourseList />} />
        <Route path="/graduation" element={<Graduation />} />
        {/* Instructor routes */}
        {/* Admin routes */}
        {/* Common routes*/}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/" element={<PersonalInfo />} />
        <Route path="/info" element={<PersonalInfo />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
    </div>
  );
}

export default App;
