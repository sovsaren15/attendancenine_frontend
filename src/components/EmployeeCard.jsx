"use client"

import { useState } from "react"

export default function EmployeeCard({ employee, onDelete }) {
  const [deleting, setDeleting] = useState(false)

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this employee?")) {
      return
    }

    setDeleting(true)
    try {
      const response = await fetch(`http://localhost:5000/api/employees/${employee.id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        onDelete(employee.id)
      } else {
        alert("Failed to delete employee")
      }
    } catch (error) {
      alert("Error deleting employee")
      console.error(error)
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="bg-white border-2 border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
      <div className="mb-4">
        <h3 className="text-xl font-bold text-gray-900">
          {employee.firstName} {employee.lastName}
        </h3>
        <p className="text-sm text-indigo-600 font-semibold">{employee.employeeId}</p>
      </div>

      <div className="space-y-2 text-sm mb-4">
        <div className="flex justify-between">
          <span className="text-gray-600">Email:</span>
          <span className="text-gray-900 font-medium break-all">{employee.email}</span>
        </div>
        {employee.department && (
          <div className="flex justify-between">
            <span className="text-gray-600">Department:</span>
            <span className="text-gray-900 font-medium">{employee.department}</span>
          </div>
        )}
        {employee.position && (
          <div className="flex justify-between">
            <span className="text-gray-600">Position:</span>
            <span className="text-gray-900 font-medium">{employee.position}</span>
          </div>
        )}
        {employee.phone && (
          <div className="flex justify-between">
            <span className="text-gray-600">Phone:</span>
            <span className="text-gray-900 font-medium">{employee.phone}</span>
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="flex-1 px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors font-semibold disabled:opacity-50"
        >
          {deleting ? "Deleting..." : "Delete"}
        </button>
      </div>
    </div>
  )
}
