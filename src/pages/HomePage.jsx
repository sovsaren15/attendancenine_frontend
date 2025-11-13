import React from 'react'
import { Camera, BarChart3 } from 'lucide-react'
import { Link } from 'react-router-dom'

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2c4448] via-[#4a7680] to-[#7c9da2] flex items-center justify-center p-4">
      <div className="max-w-6xl w-full">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="flex justify-center items-center gap-2 mb-1">
            <img src="attendance_logo.png" alt="Logo" style={{height: 150}} />
          </div>
          <p className="text-lg text-white/80 max-w-2xl mx-auto">
            Revolutionize your workplace with AI-powered attendance tracking.
          </p>
          <p className="text-lg text-white/80">
            Fast, accurate, and completely automated.
          </p>
        </div>

        {/* Cards Section */}
        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {/* Take Attendance Card */}
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 shadow-xl">
            <div className="flex justify-center mb-6">
              <div className="bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl p-5 shadow-lg">
                <Camera className="w-10 h-10 text-white" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
              Take Attendance
            </h2>
            <p className="text-gray-600 text-center mb-8 leading-relaxed">
              Capture attendance with instant facial recognition. Fast, contactless, and completely automated.
            </p>
            <div className="flex justify-center">
              <Link to="/AttendanceScanner" className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold py-3 px-8 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center gap-2">
                <Camera className="w-5 h-5" />
                Start Attendance
              </Link>
            </div>
          </div>

          {/* View Records Card */}
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 shadow-xl">
            <div className="flex justify-center mb-6">
              <div className="bg-gradient-to-br from-[#5a8a98] to-[#3e6268] rounded-2xl p-5 shadow-lg">
                <BarChart3 className="w-10 h-10 text-white" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
              View Records
            </h2>
            <p className="text-gray-600 text-center mb-8 leading-relaxed">
              Access detailed attendance reports and analytics. Track patterns and generate insights.
            </p>
            <div className="flex justify-center">
              <Link to="/records" className="bg-gradient-to-r from-[#3e6268] to-[#5a8a98] hover:from-[#2d4a4e] hover:to-[#4a7680] text-white font-semibold py-3 px-8 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                View Attendance
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomePage