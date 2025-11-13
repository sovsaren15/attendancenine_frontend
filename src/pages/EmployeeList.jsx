import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { employeeAPI } from "../services/api.js";
import { FaTrash, FaEdit, FaUserPlus } from "react-icons/fa";

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const response = await employeeAPI.getAll();
      if (response.success) {
        setEmployees(response.employees);
      } else {
        setError("Failed to fetch employees.");
      }
    } catch (err) {
      setError(err.message || "An error occurred while fetching employees.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (employeeId) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      try {
        const response = await employeeAPI.delete(employeeId);
        if (response.success) {
          fetchEmployees();
        } else {
          alert("Failed to delete employee.");
        }
      } catch (err) {
        alert("An error occurred while deleting the employee.");
        console.error(err);
      }
    }
  };

  // Get initials from name
  const getInitials = (name) => {
    if (!name) return "NA";
    const parts = name.split(" ");
    return parts.length > 1
      ? `${parts[0][0]}${parts[1][0]}`.toUpperCase()
      : name.substring(0, 2).toUpperCase();
  };

  // Calculate age from date of birth
  const calculateAge = (dobString) => {
    if (!dobString) return "?";
    const birthDate = new Date(dobString);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  // Calculate working duration from start date
  const calculateWorkingDate = (startDateString) => {
    if (!startDateString) return "?";

    const startDate = new Date(startDateString);
    const today = new Date();

    // To avoid issues with time of day, set hours to 0 for comparison
    startDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    if (startDate > today) return "Future start";

    let years = today.getFullYear() - startDate.getFullYear();
    let months = today.getMonth() - startDate.getMonth();
    let days = today.getDate() - startDate.getDate();

    if (days < 0) {
      months--;
      const lastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
      days += lastMonth.getDate();
    }

    if (months < 0) {
      years--;
      months += 12;
    }

    const parts = [];
    if (years > 0) parts.push(`${years} year${years > 1 ? 's' : ''}`);
    if (months > 0) parts.push(`${months} month${months > 1 ? 's' : ''}`);
    if (days > 0) parts.push(`${days} day${days > 1 ? 's' : ''}`);

    return parts.length > 0 ? parts.join(', ') : "Today";
  };

  if (loading) {
    return (
      <div className="min-h-screen  flex justify-center items-center p-4">
        <div className="text-center bg-white rounded-3xl p-12 shadow-xl">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="bg-[#3e6268]/10 rounded-full p-6 animate-pulse">
                <svg
                  className="w-16 h-16 text-[#3e6268]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              </div>
              <div className="absolute inset-0 border-4 border-[#3e6268]/20 border-t-[#3e6268] rounded-full animate-spin"></div>
            </div>
          </div>
          <p className="text-xl font-semibold text-gray-800">
            Loading Employees...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex justify-center items-center p-4">
        <div className="text-center bg-white rounded-3xl p-12 shadow-xl">
          <div className="bg-red-100 rounded-2xl p-6 mb-6">
            <svg
              className="w-16 h-16 text-red-500 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <p className="text-xl font-semibold text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen  p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className=" rounded-3xl shadow-xl overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-[#3e6268] to-[#4a7680] px-8 py-6 flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <h2 className="text-3xl font-bold text-white mb-1">
                Employee Management
              </h2>
              <p className="text-white/80">Manage your team members</p>
            </div>
            <Link
              to="/register"
              className="bg-white hover:bg-gray-50 text-[#3e6268] font-bold py-3 px-6 rounded-xl flex items-center gap-2 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <FaUserPlus className="text-lg" />
              <span>Add Employee</span>
            </Link>
          </div>

          {/* Stats Bar */}
          <div className="px-8 py-4 bg-gray-50 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <svg
                className="w-5 h-5 text-[#3e6268]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              <span className="text-gray-600 font-medium">
                Total Employees:{" "}
              </span>
              <span className="font-bold text-[#3e6268] text-lg">
                {employees.length}
              </span>
            </div>
          </div>
        </div>

        {/* Employee Cards/Table */}
        {employees.length > 0 ? (
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gray-50 border-b-2 border-gray-200">
                    <th className="text-left py-4 px-6 text-xs font-bold text-gray-600 uppercase tracking-wider">
                      Employee
                    </th>
                    <th className="text-left py-4 px-6 text-xs font-bold text-gray-600 uppercase tracking-wider">
                      Date Of Birth
                    </th>
                                        <th className="text-left py-4 px-6 text-xs font-bold text-gray-600 uppercase tracking-wider">
                      Start Working 
                    </th>
                    <th className="text-left py-4 px-6 text-xs font-bold text-gray-600 uppercase tracking-wider">
                      Department
                    </th>
                    <th className="text-left py-4 px-6 text-xs font-bold text-gray-600 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {employees.map((employee) => (
                    <tr
                      key={employee.id}
                      className="hover:bg-gray-50 transition-colors duration-150"
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#3e6268] to-[#4a7680] flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                            {getInitials(employee.name)}
                          </div>
                          <div>
                            <div className="font-semibold text-gray-800 text-base">
                              {employee.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {employee.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <div>
                            <div className="font-semibold text-gray-800 text-base">
                              {employee.dob}
                            </div>
                            <div className="text-sm text-gray-500">
                              {calculateAge(employee.dob)} years old
                            </div>
                          </div>
                        </div>
                      </td>
                                            <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <div>
                            <div className="font-semibold text-gray-800 text-base">
                              {employee.startWorkingDate}
                            </div>
                            <div className="text-sm text-gray-500">
                              {calculateWorkingDate(employee.startWorkingDate)}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-[#3e6268]/10 text-[#3e6268]">
                          {employee.department}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <Link
                            to={`/edit/${employee.id}`}
                            className="p-2.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-all duration-200 hover:scale-110"
                            title="Edit Employee"
                          >
                            <FaEdit className="text-lg" />
                          </Link>
                          <button
                            onClick={() => handleDelete(employee.id)}
                            className="p-2.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-all duration-200 hover:scale-110"
                            title="Delete Employee"
                          >
                            <FaTrash className="text-lg" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-3xl shadow-xl p-16">
            <div className="text-center">
              <div className="bg-gray-50 rounded-2xl p-8 inline-block mb-6">
                <svg
                  className="w-24 h-24 text-gray-300 mx-auto"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                No Employees Found
              </h3>
              <p className="text-gray-500 mb-6">
                Get started by adding your first employee
              </p>
              <Link
                to="/register"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-[#3e6268] to-[#4a7680] hover:from-[#2d4a4e] hover:to-[#3e6268] text-white font-bold py-3 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <FaUserPlus className="text-lg" />
                <span>Add Your First Employee</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeList;
