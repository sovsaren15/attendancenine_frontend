"use client"

import { useState } from "react"
import EmployeeForm from "../components/EmployeeForm"
import EmployeeList from "../components/EmployeeList"

export default function AddEmployee() {
  const [refreshList, setRefreshList] = useState(false)
  const [activeTab, setActiveTab] = useState("add")

  const handleEmployeeAdded = () => {
    setRefreshList(!refreshList)
    setActiveTab("list")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Employee Management</h1>
        <p className="text-gray-600 mb-8">Add and manage employees for face recognition attendance</p>

        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab("add")}
            className={`px-6 py-2 rounded-lg font-semibold transition-all ${
              activeTab === "add"
                ? "bg-indigo-600 text-white shadow-lg"
                : "bg-white text-gray-700 border-2 border-gray-200 hover:border-indigo-300"
            }`}
          >
            Add Employee
          </button>
          <button
            onClick={() => setActiveTab("list")}
            className={`px-6 py-2 rounded-lg font-semibold transition-all ${
              activeTab === "list"
                ? "bg-indigo-600 text-white shadow-lg"
                : "bg-white text-gray-700 border-2 border-gray-200 hover:border-indigo-300"
            }`}
          >
            View Employees
          </button>
        </div>

        {activeTab === "add" && <EmployeeForm onEmployeeAdded={handleEmployeeAdded} />}
        {activeTab === "list" && <EmployeeList key={refreshList} />}
      </div>
    </div>
  )
}
