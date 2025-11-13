import React, { Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import Layout from "./components/Layout.jsx";

const HomePage = React.lazy(() => import("./pages/HomePage.jsx"));
const AttendanceScanner = React.lazy(() => import("./pages/AttendanceScanner.jsx"));
const AttendanceRecord = React.lazy(() => import("./pages/AttendanceRecord.jsx"));
const EmployeeRegistration = React.lazy(() => import("./pages/EmployeeRegistration.jsx"));
const EmployeeList = React.lazy(() => import("./pages/EmployeeList.jsx"));
const Dashboard = React.lazy(() => import("./pages/Dashboard.jsx"));
const TopPerformers = React.lazy(() => import("./pages/TopPerformers.jsx"));
const AttendancePage = React.lazy(() => import("./pages/AttendancePage.jsx"));

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        {/* Routes without Navbar */}
        <Route path="/home" element={<HomePage />} />
        <Route path="/AttendanceScanner" element={<AttendanceScanner />} />
        <Route path="/records" element={<AttendanceRecord />} />
        {/* Routes with Navbar */}
        <Route element={<Layout />}>
        <Route path="/" element={<Dashboard />} />
          <Route path="/register" element={<EmployeeRegistration />} />
          <Route path="/employees" element={<EmployeeList />} />
          <Route path="/top" element={<TopPerformers />} />
          <Route path="/attendance" element={<AttendancePage />} />
        </Route>
      </Routes>
    </Suspense>
  );
}

export default App;