import { Route, Routes } from "react-router-dom";
import EmployeeRegistration from "./pages/EmployeeRegistration.jsx";
import EmployeeList from "./pages/EmployeeList.jsx";

function App() {
  return (
    <Routes>
      {/* You can add a layout component here if you have one */}
      <Route path="/register" element={<EmployeeRegistration />} />
      <Route path="/employees" element={<EmployeeList />} />
      <Route path="/" element={<EmployeeList />} />
    </Routes>
  );
}

export default App;
