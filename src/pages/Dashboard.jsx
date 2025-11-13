
import { useState, useEffect } from "react"
import { attendanceAPI, employeeAPI } from "../services/api"

function Dashboard() {
  const [todayAttendance, setTodayAttendance] = useState([])
  const [employeeCount, setEmployeeCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [employeeMap, setEmployeeMap] = useState({})

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const [attendanceRes, employeesRes] = await Promise.all([
        attendanceAPI.getTodayAttendance(),
        employeeAPI.getAll(),
      ])

      if (attendanceRes.success) {
        setTodayAttendance(attendanceRes.attendance || [])
      }

      if (employeesRes.success) {
        setEmployeeCount(employeesRes.employees.length)
        const map = {}
        employeesRes.employees.forEach((emp) => {
          map[emp.id] = emp
        })
        setEmployeeMap(map)
      }

      setLoading(false)
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen  flex justify-center items-center p-4">
        <div className="text-center bg-white rounded-3xl p-12 shadow-xl">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="bg-[#3e6268]/10 rounded-full p-6 animate-pulse">
                <svg className="w-16 h-16 text-[#3e6268]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div className="absolute inset-0 border-4 border-[#3e6268]/20 border-t-[#3e6268] rounded-full animate-spin"></div>
            </div>
          </div>
          <p className="text-xl font-semibold text-gray-800">Loading Dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen  md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Total Employees */}
          <div className="bg-white rounded-3xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-gradient-to-br from-[#3e6268] to-[#4a7680] rounded-2xl p-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
            </div>
            <h3 className="text-gray-600 text-sm font-semibold mb-2 uppercase tracking-wide">Total Employees</h3>
            <p className="text-5xl font-bold text-[#3e6268]">{employeeCount}</p>
          </div>

          {/* Present Today */}
          <div className="bg-white rounded-3xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <h3 className="text-gray-600 text-sm font-semibold mb-2 uppercase tracking-wide">Present Today</h3>
            <p className="text-5xl font-bold text-emerald-600">{todayAttendance.length}</p>
          </div>

          {/* Attendance Rate */}
          <div className="bg-white rounded-3xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
            <h3 className="text-gray-600 text-sm font-semibold mb-2 uppercase tracking-wide">Attendance Rate</h3>
            <p className="text-5xl font-bold text-blue-600">
              {employeeCount > 0 ? Math.round((todayAttendance.length / employeeCount) * 100) : 0}%
            </p>
          </div>
        </div>

        {/* Today's Attendance Table */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-[#3e6268] to-[#4a7680] px-8 py-6">
            <h2 className="text-3xl font-bold text-white">Today's Attendance</h2>
            <p className="text-white/80 mt-1">Overview of employee check-ins and check-outs</p>
          </div>

          <div className="p-8">
            {todayAttendance.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-gray-200">
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Employee</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Check In</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Check Out</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Time Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {todayAttendance.map((record) => (
                      <tr key={record.id} className="hover:bg-gray-50 transition-colors duration-150">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#3e6268] to-[#4a7680] flex items-center justify-center text-white font-bold text-sm">
                              {(employeeMap[record.employeeId]?.name || "U").charAt(0).toUpperCase()}
                            </div>
                            <span className="font-semibold text-gray-800">{employeeMap[record.employeeId]?.name || "Unknown"}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-gray-700 font-medium">
                            {record.checkIn ? new Date(record.checkIn).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : "N/A"}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-gray-700 font-medium">
                            {record.checkOut ? new Date(record.checkOut).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : "Pending"}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold ${
                              record.status === "completed" 
                                ? "bg-blue-100 text-blue-700" 
                                : "bg-green-100 text-green-700"
                            }`}
                          >
                            {record.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {record.timeStatus && (
                            <span
                              className={`inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold ${
                                record.timeStatus === "Late"
                                  ? "bg-red-100 text-red-700"
                                  : record.timeStatus === "Good"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-yellow-100 text-yellow-700"
                              }`}
                            >
                              {record.timeStatus}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="bg-gray-50 rounded-2xl p-8 inline-block">
                  <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="text-gray-500 text-lg font-medium">No attendance records for today</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard