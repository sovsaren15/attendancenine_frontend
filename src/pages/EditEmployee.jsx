import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { employeeAPI } from "../services/api.js";
// Using the same lucide-react icons
import { User, Mail, Briefcase, Calendar, Users, ArrowRight, ChevronDown } from "lucide-react"; 

const EditEmployee = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employeeData, setEmployeeData] = useState({
    name: "",
    email: "",
    dob: "",
    department: "",
    startWorkingDate: "",
    sex: "", 
  });
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState({ type: '', text: '' });
  const [isUpdating, setIsUpdating] = useState(false);
  const [originalName, setOriginalName] = useState(""); 

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        setLoading(true);
        const response = await employeeAPI.getById(id); 
        if (response.success) {
          const { name, email, dob, department, startWorkingDate, sex } = response.employee;
          setEmployeeData({
            name,
            email,
            dob: dob ? new Date(dob).toISOString().split("T")[0] : "",
            department: department || "",
            startWorkingDate: startWorkingDate ? new Date(startWorkingDate).toISOString().split("T")[0] : "",
            sex: sex || "", 
          });
          setOriginalName(name); 
        } else {
          setNotification({ type: 'error', text: "Failed to fetch employee data." });
        }
      } catch (err) {
        setNotification({ type: 'error', text: err.message || "An error occurred." });
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployee();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmployeeData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setNotification({ type: '', text: '' }); 
    setIsUpdating(true);
    try {
      const response = await employeeAPI.update(id, employeeData);
      if (response.success) {
        setNotification({ type: 'success', text: "Employee updated successfully! Redirecting..." });
        setTimeout(() => navigate("/employees"), 2000); 
      } else {
        setNotification({ type: 'error', text: response.message || "Failed to update employee." });
      }
    } catch (err) {
      setNotification({ type: 'error', text: err.message || "An error occurred." });
      console.error(err);
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen  flex justify-center items-center p-4">
        <div className="text-center bg-white rounded-3xl p-12 shadow-xl">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="bg-[#3e6268]/10 rounded-full p-6 animate-pulse">
                <User className="w-16 h-16 text-[#3e6268]" />
              </div>
              <div className="absolute inset-0 border-4 border-[#3e6268]/20 border-t-[#3e6268] rounded-full animate-spin"></div>
            </div>
          </div>
          <p className="text-xl font-semibold text-gray-800">Loading Employee Data...</p>
        </div>
      </div>
    );
  }

  if (notification.type === 'error' && !employeeData.name) { 
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex justify-center items-center p-4">
         <div className="text-center bg-white rounded-3xl p-12 shadow-xl">
           <h3 className="text-2xl font-bold text-red-700 mb-4">Error</h3>
           <p className="text-xl font-semibold text-red-600">{notification.text}</p>
         </div>
      </div>
    );
  }

  return (
    // UPDATED: Kept light gradient background for the page
    <div className="min-h-screen  p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Form Card - UPDATED: max-w-5xl for two-column layout */}
        <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-xl p-8 md:p-12">
          <h3 className="text-xl font-bold text-gray-800 mb-8 flex items-center gap-2">
            <User className="w-6 h-6 text-[#3e6268]" />
            Update Employee 
          </h3>

          {/* Styled Notification Area */}
          {notification.text && (
            <div className={`mb-6 p-4 rounded-xl text-center font-semibold shadow-lg ${
              notification.type === 'success' ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-700' :
              notification.type === 'error' ? 'bg-gradient-to-r from-red-100 to-rose-100 text-red-700' :
              'bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700'
            }`}>
              {notification.text}
            </div>
          )}

          {/* UPDATED: Form layout with 2-column grid */}
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
              
              {/* --- Left Column --- */}
              <div className="space-y-8">
                {/* Full Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-2 flex items-center gap-2">
                    <User className="w-4 h-4 text-[#3e6268]" />
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={employeeData.name}
                    onChange={handleChange}
                    required
                    // UPDATED: Minimalist input style
                    className="w-full px-1 py-2 bg-transparent border-b-2 border-gray-200 focus:outline-none focus:ring-0 focus:border-[#3e6268] transition-all"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-2 flex items-center gap-2">
                    <Mail className="w-4 h-4 text-[#3e6268]" />
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={employeeData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-1 py-2 bg-transparent border-b-2 border-gray-200 focus:outline-none focus:ring-0 focus:border-[#3e6268] transition-all"
                  />
                </div>

                {/* Department */}
                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-2 flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-[#3e6268]" />
                    Department
                  </label>
                  <input
                    type="text"
                    name="department"
                    value={employeeData.department}
                    onChange={handleChange}
                    className="w-full px-1 py-2 bg-transparent border-b-2 border-gray-200 focus:outline-none focus:ring-0 focus:border-[#3e6268] transition-all"
                  />
                </div>
              </div>

              {/* --- Right Column --- */}
              <div className="space-y-8">
                {/* Date of Birth */}
                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-2 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[#3e6268]" />
                    Date of Birth
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      name="dob"
                      value={employeeData.dob}
                      onChange={handleChange}
                      className="w-full px-1 py-2 bg-transparent border-b-2 border-gray-200 focus:outline-none focus:ring-0 focus:border-[#3e6268] transition-all pr-8"
                    />
                    
                  </div>
                </div>

                {/* Gender */}
                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-2 flex items-center gap-2">
                    <Users className="w-4 h-4 text-[#3e6268]" />
                    Gender
                  </label>
                  <div className="relative">
                    <select
                      name="sex"
                      value={employeeData.sex}
                      onChange={handleChange}
                      className="w-full px-1 py-2 bg-transparent border-b-2 border-gray-200 focus:outline-none focus:ring-0 focus:border-[#3e6268] transition-all appearance-none"
                    >
                      <option value="">Select...</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                    <ChevronDown className="absolute right-1 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                {/* Start Working Date */}
                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-2 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[#3e6268]" />
                    Start Working Date
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      name="startWorkingDate"
                      value={employeeData.startWorkingDate}
                      onChange={handleChange}
                      className="w-full px-1 py-2 bg-transparent border-b-2 border-gray-200 focus:outline-none focus:ring-0 focus:border-[#3e6268] transition-all pr-8"
                    />
                    
                  </div>
                </div>
              </div>
            </div>

            {/* --- Button Row --- */}
            <div className="flex justify-end gap-4 pt-8">
              <button
                type="button"
                onClick={() => navigate("/employees")} // Cancel button
                className="py-3 px-8 rounded-lg font-bold text-white text-base transition-all duration-200 flex items-center justify-center gap-2 shadow-lg bg-gray-500 hover:bg-gray-600 transform hover:scale-105"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isUpdating}
                className={`py-3 px-8 rounded-lg font-bold text-white text-base transition-all duration-200 flex items-center justify-center gap-2 shadow-lg ${
                  isUpdating
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-[#3e6268] hover:bg-[#2d4a4e] hover:shadow-xl transform hover:scale-105"
                }`}
              >
                {isUpdating && (
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                )}
                {isUpdating ? "Updating..." : "Update Employee"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditEmployee;