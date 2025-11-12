import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { employeeAPI } from "../services/api.js"
import { FaTrash, FaEdit, FaUserPlus } from "react-icons/fa"

const EmployeeList = () => {
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchEmployees()
  }, [])

  const fetchEmployees = async () => {
    try {
      setLoading(true)
      const response = await employeeAPI.getAll()
      if (response.success) {
        setEmployees(response.employees)
      } else {
        setError("Failed to fetch employees.")
      }
    } catch (err) {
      setError(err.message || "An error occurred while fetching employees.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (employeeId) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      try {
        const response = await employeeAPI.delete(employeeId)
        if (response.success) {
          // Refetch employees to update the list
          fetchEmployees()
        } else {
          alert("Failed to delete employee.")
        }
      } catch (err) {
        alert("An error occurred while deleting the employee.")
        console.error(err)
      }
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  if (error) {
    return <div className="text-center text-red-500 mt-8">{error}</div>
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800">Employee List</h2>
        <Link
          to="/register"
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg flex items-center transition"
        >
          <FaUserPlus className="mr-2" /> Add Employee
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left py-3 px-4 uppercase font-semibold text-sm text-gray-600">Name</th>
              <th className="text-left py-3 px-4 uppercase font-semibold text-sm text-gray-600">Email</th>
              <th className="text-left py-3 px-4 uppercase font-semibold text-sm text-gray-600">Department</th>
              <th className="text-left py-3 px-4 uppercase font-semibold text-sm text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {employees.map((employee) => (
              <tr key={employee.id} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="py-3 px-4">{employee.name}</td>
                <td className="py-3 px-4">{employee.email}</td>
                <td className="py-3 px-4">{employee.department}</td>
                <td className="py-3 px-4 flex items-center gap-4">
                  <button className="text-blue-500 hover:text-blue-700 transition">
                    <FaEdit />
                  </button>
                  <button onClick={() => handleDelete(employee.id)} className="text-red-500 hover:text-red-700 transition">
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default EmployeeList
