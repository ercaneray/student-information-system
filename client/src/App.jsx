import { Routes, Route } from "react-router-dom";
import "./App.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "primereact/resources/themes/saga-blue/theme.css";

// Auth Pages
import LoginPage from "./pages/LoginPage";
// Admin Pages
import StudentList from "./pages/admin/StudentList";
import InstructorList from "./pages/admin/InstructorList";
import CourseList from "./pages/admin/CourseList";
// Student & Instructor Pages
import PersonalInfo from "./pages/PersonalInfo";
import Messages from "./pages/Messages";
import Dashboard from "./pages/Dashboard";
// Student Pages
import RequestCourses from "./pages/student/RequestCourses";
import Mycourses from "./pages/student/MyCourses";
import Calculator from "./pages/student/Calculator";
import Grades from "./pages/student/Grades";
// Instructor Pages
import SetGrades from "./pages/instructor/SetGrades";
// Advisor Pages
import CourseRequests from "./pages/advisor/CourseRequests";


function App() {
// Sayfalarımın yönlendirme işlemlerini yapabilmem için Routes ve Route componentleri
// 
  return (
    <div className="bg-gray-100 min-h-screen">
      <Routes>
        {/* Auth routes */}
        <Route path="/login" element={<LoginPage />} />
        {/* Student routes */}
        <Route path="/calculator" element={<Calculator />} />
        <Route path="/request-courses" element={<RequestCourses />} />
        <Route path="/my-courses" element={<Mycourses />} />
        <Route path="/grades" element={<Grades />} />
        {/* Instructor routes */}
        <Route path="/set-grades" element={<SetGrades />} />
        {/* Advisor routes */}
        <Route path="/course-requests" element={<CourseRequests />} />
        {/* Admin routes */}
        <Route path="/students" element={<StudentList />} />
        <Route path="/instructors" element={<InstructorList />} />
        <Route path="/course-list" element={<CourseList />} />
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
