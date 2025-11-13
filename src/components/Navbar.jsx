import React, { useState, useRef, useEffect } from 'react'
import { NavLink } from 'react-router-dom' // Use NavLink

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const navRef = useRef(null)

  const toggleMobileMenu = () => setIsMobileMenuOpen((s) => !s)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setIsMobileMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Helper function for NavLink active classes
  const getNavLinkClass = ({ isActive }) => {
    // UPDATED: font-medium -> font-semibold, text-sm -> text-base, px-4 py-2 -> px-5 py-3
    const commonClasses = "px-5 py-3 rounded-xl transition-all duration-200 font-semibold text-base"
    return isActive
      ? `${commonClasses} text-white bg-gradient-to-r from-[#3e6268] to-[#4a7680] shadow-md` // Active style
      : `${commonClasses} text-gray-600 hover:text-[#3e6268] hover:bg-gray-50` // Inactive style
  }

  return (
    <nav ref={navRef} className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-gray-200/50">
      {/* UPDATED: Removed inline style, added md:ml-[200px] */}
      <div className="max-w-7xl px-4 sm:px-6 lg:px-12 md:ml-[200px]" >
        {/* UPDATED: h-16 -> h-20 */}
        {/* UPDATED: justify-between on mobile, md:justify-center on desktop */}
        <div className="relative flex justify-between md:justify-center items-center h-20">
          
          {/* Left: Logo */}
          {/* UPDATED: Absolute positioning only on md: screens and up */}
          <div className="flex-shrink-0 flex items-center md:absolute md:left-1">
            <NavLink to="/" className="flex items-center gap-6 group">
              {/* UPDATED: h-11 -> h-14, added leading slash to image src */}
              <img src="/attendancenine-color.png" alt="Logo" className="h-14 w-auto transition-transform group-hover:scale-105" />
            </NavLink>
          </div>

          {/* Center: Links */}
          <div className="hidden md:flex ">
            {/* UPDATED: p-1.5 -> p-2 */}
            <div className="flex items-center gap-2 bg-gray-50/50 rounded-2xl p-2">
              <NavLink to="/" className={getNavLinkClass}>
                <div className="flex items-center gap-2">
                  {/* UPDATED: w-4 h-4 -> w-5 h-5 */}
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  <span>Dashboard</span>
                </div>
              </NavLink>
              <NavLink to="/employees" className={getNavLinkClass}>
                <div className="flex items-center gap-2">
                  {/* UPDATED: w-4 h-4 -> w-5 h-5 */}
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  <span>Employees</span>
                </div>
              </NavLink>
              <NavLink to="/attendance" className={getNavLinkClass}>
                <div className="flex items-center gap-2">
                  {/* UPDATED: w-4 h-4 -> w-5 h-5 */}
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                  <span>Attendance</span>
                </div>
              </NavLink>
              <NavLink to="/register" className={getNavLinkClass}>
                <div className="flex items-center gap-2">
                  {/* UPDATED: w-4 h-4 -> w-5 h-5 */}
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                  <span>Add Employee</span>
                </div>
              </NavLink>
              <NavLink to="/home" className={getNavLinkClass}>
                <div className="flex items-center gap-2">
                  {/* UPDATED: w-4 h-4 -> w-5 h-5 */}
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>Scanner</span>
                </div>
              </NavLink>
            </div>
          </div>

          {/* Right: Mobile Button */}
          {/* UPDATED: Absolute positioning only on md: screens and up */}
          <div className="flex items-center md:absolute md:right-4">
            <div className="md:hidden">
              <button
                onClick={toggleMobileMenu}
                // UPDATED: p-2.5 -> p-3.5
                className="p-3.5 rounded-xl text-gray-600 hover:text-[#3e6268] hover:bg-gray-50 focus:outline-none transition-all duration-200"
                aria-label="Toggle menu"
              >
                {/* UPDATED: h-6 w-6 -> h-7 w-7 */}
                <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  {isMobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden absolute w-full bg-white/95 backdrop-blur-lg shadow-xl border-t border-gray-200/50 transform transition-all duration-300 ease-out ${
          isMobileMenuOpen ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'
        }`}
      >
        <div className="px-4 pt-3 pb-4 space-y-2">
          <NavLink
            to="/"
            className={({ isActive }) => 
              // UPDATED: text-base -> text-lg, px-4 py-3 -> px-5 py-4
              `block px-5 py-4 text-lg font-medium rounded-xl transition-all duration-200 ${
                isActive 
                  ? 'text-white bg-gradient-to-r from-[#3e6268] to-[#4a7680] shadow-md' 
                  : 'text-gray-600 hover:text-[#3e6268] hover:bg-gray-50'
              }`
            }
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <div className="flex items-center gap-3">
              {/* UPDATED: w-5 h-5 -> w-6 h-6 */}
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span>Dashboard</span>
            </div>
          </NavLink>
          <NavLink
            to="/employees"
            className={({ isActive }) => 
              `block px-5 py-4 text-lg font-medium rounded-xl transition-all duration-200 ${
                isActive 
                  ? 'text-white bg-gradient-to-r from-[#3e6268] to-[#4a7680] shadow-md' 
                  : 'text-gray-600 hover:text-[#3e6268] hover:bg-gray-50'
              }`
            }
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <div className="flex items-center gap-3">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <span>Employees</span>
            </div>
          </NavLink>
          <NavLink
            to="/attendance"
            className={({ isActive }) => 
              `block px-5 py-4 text-lg font-medium rounded-xl transition-all duration-200 ${
                isActive 
                  ? 'text-white bg-gradient-to-r from-[#3e6268] to-[#4a7680] shadow-md' 
                  : 'text-gray-600 hover:text-[#3e6268] hover:bg-gray-50'
              }`
            }
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <div className="flex items-center gap-3">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
              <span>Attendance</span>
            </div>
          </NavLink>
          <NavLink
            to="/register"
            className={({ isActive }) => 
              `block px-5 py-4 text-lg font-medium rounded-xl transition-all duration-200 ${
                isActive 
                  ? 'text-white bg-gradient-to-r from-[#3e6268] to-[#4a7680] shadow-md' 
                  : 'text-white bg-gradient-to-r from-[#3e6268] to-[#4a7680] hover:from-[#2d4a4e] hover:to-[#3e6268] shadow-md'
              }`
            }
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <div className="flex items-center gap-3">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
              <span>Add Employee</span>
            </div>
          </NavLink>
          <NavLink
            // UPDATED: /AttendanceScanner -> /home
            to="/home"
            className={({ isActive }) => 
              `block px-5 py-4 text-lg font-medium rounded-xl transition-all duration-200 ${
                isActive 
                  ? 'text-white bg-gradient-to-r from-[#3e6268] to-[#4a7680] shadow-md' 
                  : 'text-gray-600 hover:text-[#3e6268] hover:bg-gray-50'
              }`
            }
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <div className="flex items-center gap-3">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>Scanner</span>
            </div>
          </NavLink>
        </div>
      </div>
    </nav>
  )
}

export default Navbar