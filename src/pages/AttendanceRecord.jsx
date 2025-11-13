import React, { useState, useEffect } from "react"
import { attendanceAPI } from "../services/api"
import { Link } from "react-router-dom"

const AttendanceRecord = () => {
  const [attendanceRecords, setAttendanceRecords] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchTodayAttendance()
  }, [])

  const fetchTodayAttendance = async () => {
    try {
      const data = await attendanceAPI.getTodayAttendance()
      if (data.success) {
        setAttendanceRecords(data.attendance || [])
      } else {
        throw new Error("Failed to fetch attendance data")
      }
    } catch (error) {
      console.error("Error fetching attendance:", error)
      setError(error.message)
      setAttendanceRecords([])
    } finally {
      setLoading(false)
    }
  }

  // Get initials from name
  const getInitials = (name) => {
    if (!name) return "NA"
    const parts = name.split(" ")
    return parts.length > 1 
      ? `${parts[0][0]}${parts[1][0]}`.toUpperCase()
      : name.substring(0, 2).toUpperCase()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2d3e50] via-[#34495e] to-[#3e6268] p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-3">
            <Link to="/home" className="">
              <img src="/attendance_logo.png" alt="Logo" className="w-28 h-auto" />
            </Link>
            </div>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-2">Attendance Records</h2>
          <p className="text-white/70 text-lg">Real-time employee tracking dashboard</p>
        </div>

        {/* Main Content */}
        <div className="bg-white/5 backdrop-blur-md rounded-3xl shadow-2xl overflow-hidden">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#3e6268] border-t-transparent mx-auto mb-4"></div>
                <p className="text-white text-lg">Loading records...</p>
              </div>
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <div className="bg-red-500/20 backdrop-blur-sm rounded-2xl p-6 inline-block">
                <svg className="w-12 h-12 text-red-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-red-400 font-semibold">{error}</p>
              </div>
            </div>
          ) : attendanceRecords && attendanceRecords.length > 0 ? (
            <div className="overflow-x-auto">
              {/* Table Header */}
              <div className="bg-gradient-to-r from-[#3e6268] to-[#4a7680] px-6 py-4">
                <div className="grid grid-cols-6 gap-4 text-white font-semibold text-sm">
                  <div>Employee Name</div>
                  <div>Check In</div>
                  <div>Check Out</div>
                  <div>Time Status</div>
                  <div>Status</div>
                </div>
              </div>

              {/* Table Body */}
              <div className="divide-y divide-white/10">
                {attendanceRecords.map((record, index) => (
                  <div 
                    key={record.id || index}
                    className="px-6 py-4 hover:bg-white/5 transition-colors duration-200"
                  >
                    <div className="grid grid-cols-6 gap-4 items-center">
                      {/* Employee Name with Avatar */}
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                          {getInitials(record.employeeName)}
                        </div>
                        <div>
                          <div className="text-white font-semibold text-sm">{record.employeeName || 'N/A'}</div>
                          <div className="text-white/50 text-xs">ID: #{record.id || 'N/A'}</div>
                        </div>
                      </div>

                      {/* Check In */}
                      <div>
                        <div className={`text-sm font-semibold ${record.checkIn ? 'text-emerald-400' : 'text-white/50'}`}>
                          {record.checkIn ? new Date(record.checkIn).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : "N/A"}
                        </div>
                        <div className="text-white/40 text-xs">
                          {record.checkIn ? new Date(record.checkIn).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : ""}
                        </div>
                        {record.timeStatus && (
                          <span className={`inline-block mt-1 px-2 py-0.5 text-xs font-semibold rounded-full ${
                            record.timeStatus === "Late" 
                              ? "bg-red-500/20 text-red-400" 
                              : "bg-green-500/20 text-green-400"
                          }`}>
                          </span>
                        )}
                      </div>

                      {/* Check Out */}
                      <div>
                        <div className={`text-sm font-semibold ${record.checkOut ? 'text-orange-400' : 'text-white/50'}`}>
                          {record.checkOut ? new Date(record.checkOut).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : "Active"}
                        </div>
                        <div className="text-white/40 text-xs">
                          {record.checkOut ? new Date(record.checkOut).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : "Null"}
                        </div>
                      </div>
                      {/* Time Status */}
                      <div>
                        <div className={`px-3 py-1 text-xs font-semibold rounded-full ${
                          record.timeStatus === "On Time"
                            ? "bg-green-500/80 text-white"
                            : record.timeStatus === "Late"
                            ? "bg-red-500/80 text-white"
                            : "bg-gray-500/80 text-white"
                        }`}>
                          {record.timeStatus || "N/A"}
                        </div>
                      </div>

                      {/* Status */}
                      <div>
                        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                          record.checkOut
                            ? "bg-gray-500/80 text-white"
                            : "bg-green-500/80 text-white"
                        }`}>
                          {record.checkOut ? "Offline" : "Online"}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 inline-block">
                <svg className="w-16 h-16 text-white/30 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-white/60 text-lg">No attendance records for today</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AttendanceRecord