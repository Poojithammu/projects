import { Routes, Route, useLocation, Router, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import AdminDashboard from "./pages/admin/AdminDashboard";
import FacultyDashboard from "./pages/faculty/FacultyDashboard";
import StudentDashboard from "./pages/student/StudentDashboard";
import Unauthorized from "./pages/Unauthorized";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";  // Import Navbar
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import Profile from "./pages/Profile";
import FacultyList from "./pages/student/FacultyList";
import FeedbackForm from "./pages/student/FeedbackForm";
import FacultyPerformance from "./pages/faculty/FacultyPerformance";
import MyFeedbackPage from "./pages/faculty/MyFeedbackPage";
import ApplyLeavePage from "./pages/faculty/ApplyLeavePage";
import MyLeaveStatusPage from "./pages/faculty/MyLeaveStatusPage";
import LeaveApprovalDashboard from "./pages/admin/LeaveApprovalDashboard";
import AdminFacultyPage from './pages/admin/AdminFacultyPage';
import AdminStudentPage from "./pages/admin/AdminStudentPage";
import AdminFeedbackPage from "./pages/admin/AdminFeedbackPage";
import CreateTimetableForm from "./pages/admin/CreateTimetableForm";

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css'

import ContactUs from "./pages/ContactUs";
import ViewTimetable from "./pages/admin/ViewTimetable";
import FacultyMyClasses from "./pages/faculty/FacultyMyClasses";
import StudentViewTimetable from "./pages/student/StudentViewTimetable";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import RootRedirect from "./pages/RootRedirect";


export default function App() {
  const location = useLocation();

  // Hide navbar only on /login page (you can add more routes if needed)
  const hideNavbar = ["/login", "/forgot-password"].includes(location.pathname) || location.pathname.startsWith("/reset-password");


  return (
    <>
      {!hideNavbar && <Navbar />}
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="main-app-container">
        <Routes>

          <Route path="/" element={<RootRedirect />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />



          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/faculty"
            element={
              <ProtectedRoute allowedRoles={["faculty"]}>
                <FacultyDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/contact"
            element={
              <ProtectedRoute allowedRoles={["faculty", "admin", "student"]}>
                <ContactUs />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student"
            element={
              <ProtectedRoute allowedRoles={["student"]}>
                <StudentDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/student/feedback"
            element={
              <ProtectedRoute allowedRoles={["student"]}>
                <FacultyList />
              </ProtectedRoute>
            }
          />

          <Route
            path="/faculty/performance"
            element={
              <ProtectedRoute allowedRoles={["faculty"]}>
                <FacultyPerformance />
              </ProtectedRoute>
            }
          />

          <Route
            path="/faculty/feedback"
            element={
              <ProtectedRoute allowedRoles={["faculty"]}>
                <MyFeedbackPage />
              </ProtectedRoute>
            }
          />


          <Route
            path="/faculty/apply-leave"
            element={
              <ProtectedRoute allowedRoles={["faculty"]}>
                <ApplyLeavePage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/faculty/my-leaves"
            element={
              <ProtectedRoute allowedRoles={["faculty"]}>
                <MyLeaveStatusPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/faculties"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminFacultyPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/student/feedback/form/:facultyId"
            element={
              <ProtectedRoute allowedRoles={["student"]}>
                <FeedbackForm />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute allowedRoles={["admin", "faculty", "student"]}>
                <Profile />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/leave-requests"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <LeaveApprovalDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/student/classes"
            element={
              <ProtectedRoute allowedRoles={["student"]}>
                <StudentViewTimetable />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/students"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminStudentPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/feedbacks"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminFeedbackPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/timetable/create"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <CreateTimetableForm />
              </ProtectedRoute>
            }
          />

          <Route
            path="/faculty/classes"
            element={
              <ProtectedRoute allowedRoles={["faculty"]}>
                <FacultyMyClasses />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/timetable/"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <ViewTimetable />
              </ProtectedRoute>
            }
          />



          <Route path="/unauthorized" element={<Unauthorized />} />
        </Routes>
      </div>
    </>
  );
}
