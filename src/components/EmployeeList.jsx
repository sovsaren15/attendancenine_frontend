"use client"

import { useState, useEffect } from "react"
import EmployeeCard from "./EmployeeCard"

export default function EmployeeList() {
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchEmployees()
  }, [])

  const fetchEmployees = async () => {
    try {
      setLoading(true)
      const response = await fetch("http://localhost:5000/api/employees")
      if (!response.ok) {
        // throw an error to be caught by the catch block
        const errorData = await response.json().catch(() => ({})) // Gracefully handle non-JSON error responses
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      setEmployees(data)
      setError("")
    } catch (err) {
      setError(err.message || "Failed to fetch employees")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = (employeeId) => {
    setEmployees(employees.filter((emp) => emp.id !== employeeId))
  }

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8 text-center">
        <p className="text-gray-600">Loading employees...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8">
        <p className="text-red-600">{error}</p>
      </div>
    )
  }

  if (employees.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8 text-center">
        <p className="text-gray-600 text-lg">No employees added yet</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <p className="text-gray-600">
          Total Employees: <span className="font-bold text-indigo-600">{employees.length}</span>
        </p>
        <button
          onClick={fetchEmployees}
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
        >
          Refresh
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {employees.map((employee) => (
          <EmployeeCard key={employee.id} employee={employee} onDelete={handleDelete} />
        ))}
      </div>
    </div>
  )
}
