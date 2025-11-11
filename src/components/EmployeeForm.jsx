"use client"

import { useState } from "react"

export default function EmployeeForm({ onEmployeeAdded }) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    employeeId: "",
    department: "",
    position: "",
    phone: "",
  })

  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ type: "", text: "" })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage({ type: "", text: "" })

    try {
      const response = await fetch("http://localhost:5000/api/employees", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        setMessage({
          type: "error",
          text: data.error || "Failed to add employee",
        })
        return
      }

      setMessage({
        type: "success",
        text: "Employee added successfully!",
      })

      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        employeeId: "",
        department: "",
        position: "",
        phone: "",
      })

      setTimeout(() => {
        onEmployeeAdded()
      }, 1500)
    } catch (error) {
      setMessage({
        type: "error",
        text: "Network error. Please try again.",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Add New Employee</h2>

      {message.text && (
        <div
          className={`mb-6 p-4 rounded-lg ${
            message.type === "success"
              ? "bg-green-50 border border-green-200 text-green-800"
              : "bg-red-50 border border-red-200 text-red-800"
          }`}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* First Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">First Name *</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-indigo-600 transition-colors"
              placeholder="John"
            />
          </div>

          {/* Last Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Last Name *</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-indigo-600 transition-colors"
              placeholder="Doe"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Email *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-indigo-600 transition-colors"
              placeholder="john.doe@company.com"
            />
          </div>

          {/* Employee ID */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Employee ID *</label>
            <input
              type="text"
              name="employeeId"
              value={formData.employeeId}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-indigo-600 transition-colors"
              placeholder="EMP001"
            />
          </div>

          {/* Department */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Department</label>
            <input
              type="text"
              name="department"
              value={formData.department}
              onChange={handleChange}
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-indigo-600 transition-colors"
              placeholder="Engineering"
            />
          </div>

          {/* Position */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Position</label>
            <input
              type="text"
              name="position"
              value={formData.position}
              onChange={handleChange}
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-indigo-600 transition-colors"
              placeholder="Software Engineer"
            />
          </div>

          {/* Phone */}
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Phone</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-indigo-600 transition-colors"
              placeholder="+1 (555) 123-4567"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 text-white font-semibold py-3 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Adding Employee..." : "Add Employee"}
        </button>
      </form>
    </div>
  )
}
