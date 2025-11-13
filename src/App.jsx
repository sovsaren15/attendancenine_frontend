import { Route, Routes } from "react-router-dom";
import EmployeeRegistration from "./pages/EmployeeRegistration.jsx";
import EmployeeList from "./pages/EmployeeList.jsx";
import AttendanceScanner from "./pages/AttendanceScanner.jsx";
import AttendanceRecord from "./pages/AttendanceRecord.jsx";
import AttendancePage from "./pages/AttendancePage.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import TopPerformers from "./pages/TopPerformers.jsx";
import Layout from "./components/Layout.jsx";
import HomePage from "./pages/HomePage.jsx";

function App() {
  return (
    <Routes>
      {/* Routes without Navbar */}
      <Route path="/" element={<HomePage />} />
      <Route path="/AttendanceScanner" element={<AttendanceScanner />} />
      <Route path="/records" element={<AttendanceRecord />} />
      {/* Routes with Navbar */}
      <Route element={<Layout />}>
        <Route path="/register" element={<EmployeeRegistration />} />
        <Route path="/employees" element={<EmployeeList />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/top" element={<TopPerformers />} />
        <Route path="/attendance" element={<AttendancePage />} />
      </Route>
    </Routes>
  );
}

export default App;