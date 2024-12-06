import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "primereact/resources/themes/saga-blue/theme.css";
import { useAuthStore } from "./store/authStore";
// Pages
import PersonalInfo from "./pages/PersonalInfo";
import LoginPage from "./pages/LoginPage";
import Courses from "./pages/Courses";
import CourseList from "./pages/CourseList";
import Messages from "./pages/Messages";
import Graduation from "./pages/Graduation";
import Calculator from "./pages/Calculator";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();
  if (!isAuthenticated && !user) {
    return <LoginPage />;
  }
  return children;
}
const AuthenticatedRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();
  if (isAuthenticated && user) {
    return <PersonalInfo />;
  } else {
    return children;
  }
}
const StudentRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();
  if (isAuthenticated && user && user.RoleID === 1) {
    return children;
  } else {
    return <PersonalInfo />;
  }
}
const InstructorRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();
  if (isAuthenticated && user && user.RoleID === 2) {
    return children;
  } else {
    return <PersonalInfo />;
  }
}

function App() {
  const { checkAuth, isAuthenticated, isCheckingAuth, user } = useAuthStore();
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);
  console.log("isAuthenticated:", isAuthenticated, "isCheckingAuth:", isCheckingAuth, "user:", user);
  return (
    <div className="bg-gray-100 min-h-screen">
      <Routes>
        {/* Auth routes */}
        <Route path="/login" element={<AuthenticatedRoute><LoginPage /></AuthenticatedRoute>} />
        {/* Student routes */}
        <Route path="/calculator" element={<StudentRoute><Calculator /></StudentRoute>} />
        <Route path="/courses" element={<StudentRoute><Courses /></StudentRoute>} />
        <Route path="/course-list" element={<StudentRoute><CourseList /></StudentRoute>} />
        <Route path="/graduation" element={<StudentRoute><Graduation /></StudentRoute>} />
        {/* Instructor routes */}
        {/* Admin routes */}
        {/* Common routes*/}
        <Route path="/" element={<ProtectedRoute><PersonalInfo /></ProtectedRoute>} />
        <Route path="/info" element={<ProtectedRoute><PersonalInfo /></ProtectedRoute>} />
        <Route path="/messages" element={<ProtectedRoute><Messages /></ProtectedRoute>} />
        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
    </div>
  );
}

export default App;
