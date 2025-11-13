import { useLocation, Outlet } from "react-router-dom"
import Navbar from "./Navbar"

const Layout = () => {
  const location = useLocation()
  const noNavbarPaths = ["/", "/records"];
  const showNavbar = !noNavbarPaths.includes(location.pathname);

  return (
    <div className="App min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {showNavbar && <Navbar />}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet /> {/* Child routes will render here */}
      </main>
    </div>
  )
}

export default Layout