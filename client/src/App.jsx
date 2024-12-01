import { Routes, Route } from "react-router-dom";
import "./App.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "primereact/resources/themes/saga-blue/theme.css";

// Pages
import PersonalInfo from "./pages/PersonalInfo";
import LoginPage from "./pages/LoginPage";
import Courses from "./pages/Courses";
import CourseList from "./pages/CourseList";
import Messages from "./pages/Messages";
import Graduation from "./pages/Graduation";
import Calculator from "./pages/Calculator";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<PersonalInfo />} />
        <Route path="/calculator" element={<Calculator />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/course-list" element={<CourseList />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/graduation" element={<Graduation />} />
        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
    </div>
  );
}

export default App;
