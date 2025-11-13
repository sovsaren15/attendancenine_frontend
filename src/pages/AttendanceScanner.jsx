import { useRef, useState, useEffect } from "react"
import { loadFaceApiModels, detectFaces, compareFaces } from "../services/faceRecognition"
import { employeeAPI, attendanceAPI } from "../services/api"
import { Link } from "react-router-dom"
import { MapPin } from "lucide-react"

// --- Location Configuration ---
const OFFICE_LOCATION = {
  latitude: 13.374875305258593,
  longitude: 103.84243927547642,
};
const MAX_DISTANCE_METERS = 100; // 100-meter radius

// --- Helper function to calculate distance between two GPS coordinates ---
function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // in meters
}

function AttendanceScanner() {
  const videoRef = useRef(null)
  const scanIntervalRef = useRef(null)
  const [scanning, setScanning] = useState(false)
  const [scanType, setScanType] = useState(null) // 'check-in' or 'check-out'
  const [employees, setEmployees] = useState([])
  const [lastScanned, setLastScanned] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isCameraOpen, setIsCameraOpen] = useState(false)
  const [isLocationValid, setIsLocationValid] = useState(false)
  const [locationMessage, setLocationMessage] = useState("")
  const [message, setMessage] = useState("")

  useEffect(() => {
    const initializeScanner = async () => {
      try {
        const loaded = await loadFaceApiModels()
        if (!loaded) throw new Error("Failed to load face models")

        const response = await employeeAPI.getAll()
        if (response.success) {
          setEmployees(response.employees)
        }

        setLoading(false)
      } catch (error) {
        console.error("Initialization error:", error)
        setMessage("Failed to initialize scanner")
        setLoading(false)
      }
    }

    initializeScanner()

    return () => {
      clearInterval(scanIntervalRef.current) // Clear interval on component unmount
      stopCamera()
    }
  }, [])

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480 },
      })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        setIsCameraOpen(true)
        checkLocation() // Check location when camera opens
      }
    } catch (error) {
      console.error("Camera access denied:", error)
      setMessage("Camera access denied")
    }
  }

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach((track) => track.stop())
      videoRef.current.srcObject = null
      setIsCameraOpen(false)
      setIsLocationValid(false)
      setLocationMessage("")
      setScanning(false) // Stop scanning if camera is closed
    }
  }

  const checkLocation = () => {
    if (!navigator.geolocation) {
      setLocationMessage("Geolocation is not supported by your browser.")
      setIsLocationValid(false)
      return
    }

    setLocationMessage("Checking your location...")
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        const distance = getDistance(latitude, longitude, OFFICE_LOCATION.latitude, OFFICE_LOCATION.longitude)

        if (distance <= MAX_DISTANCE_METERS) {
          setLocationMessage("Location verified. You can now check in/out.")
          setIsLocationValid(true)
        } else {
          setLocationMessage(`You are too far from the office. Distance: ${distance.toFixed(0)} meters.`)
          setIsLocationValid(false)
        }
      },
      () => {
        setLocationMessage("Unable to retrieve your location. Please enable location services.")
        setIsLocationValid(false)
      }
    )
  }

  const startScanning = (type) => {
    if (!isLocationValid) {
      setMessage("Cannot scan: You are not at the required location.");
      return;
    }
    setScanType(type)
    setScanning(true)
    setMessage(`Scanning for ${type}...`);

    const scan = async () => {
      if (!videoRef.current) return;

      try {
        const detections = await detectFaces(videoRef.current);

        if (detections.length > 0) {
          // Stop scanning once a face is detected
          clearInterval(scanIntervalRef.current);
          setScanning(false);

          const detection = detections[0];
          const faceDescriptor = detection.descriptor;

          let matchedEmployee = null;
          for (const employee of employees) {
            if (!employee.faceDescriptor || typeof employee.faceDescriptor !== 'object') continue;
            const descriptorValues = Object.values(employee.faceDescriptor);
            const empDescriptor = new Float32Array(descriptorValues);

            if (compareFaces(faceDescriptor, empDescriptor, 0.55)) {
              matchedEmployee = employee;
              break;
            }
          }

          if (matchedEmployee) {
            try {
              const response = await attendanceAPI.markAttendance(matchedEmployee.id, type);
              setLastScanned({
                name: matchedEmployee.name,
                time: new Date().toLocaleTimeString(),
                type: type,
              });
              setMessage(`${type === 'check-in' ? 'Welcome' : 'Goodbye'}, ${matchedEmployee.name}! ${response.message}`);
              setTimeout(() => setMessage(""), 3000);
            } catch (error) {
              console.error("Error marking attendance:", error);
              if (error.response) {
                const errorData = await error.response.json();
                setMessage(errorData.error || "Error marking attendance");
              } else {
                setMessage("Error marking attendance");
              }
            }
          } else {
            setMessage("Face not recognized. Please try again.");
          }
        } else if (scanning) { // Only continue scanning if no face was found and we are still in scanning mode
          requestAnimationFrame(scan);
        }
      } catch (error) {
        console.error("Error during scan:", error);
        setMessage("An error occurred during scanning.");
        clearInterval(scanIntervalRef.current);
        setScanning(false);
      }
    };

    scan(); // Start the scan loop
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#3e6268] via-[#4a7680] to-[#5a8a98] flex justify-center items-center p-4">
        <div className="text-center bg-white/95 backdrop-blur-sm rounded-3xl p-12 shadow-2xl max-w-md w-full">
          {/* Icon Circle */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="bg-[#3e6268]/10 rounded-full p-6 animate-pulse">
                <svg className="w-16 h-16 text-[#3e6268]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              {/* Spinning ring around icon */}
              <div className="absolute inset-0 border-4 border-[#3e6268]/20 border-t-[#3e6268] rounded-full animate-spin"></div>
            </div>
          </div>

          {/* Loading Text */}
          <div className="mb-2">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Attendance Scanner</h2>
            <div className="flex items-center justify-center gap-2 text-gray-600">
              <svg className="w-5 h-5 text-[#3e6268]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="text-sm font-medium">Checking Your Location</span>
            </div>
          </div>

          {/* Bouncing Dots Animation */}
          <div className="flex justify-center items-center space-x-2 h-16">
            <div className="w-3 h-3 bg-[#3e6268] rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
            <div className="w-3 h-3 bg-[#4a7680] rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-3 h-3 bg-[#5a8a98] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-[#3e6268] to-[#5a8a98] rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#3e6268] via-[#4a7680] to-[#5a8a98] p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-1">
            <Link to="/home" className="">
              <img src="/attendance_logo.png" alt="Logo" className="w-28 h-auto" />
            </Link>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-2">Take Attendance</h2>
          <p className="text-white/80 text-lg">Position yourself in front of the camera for instant recognition</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Video Feed - 2 columns on Desktop */}
          <div className="lg:col-span-2">
            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6">
              <div className="flex flex-col gap-4">
                <div className="bg-black rounded-2xl overflow-hidden relative border-4 border-[#3e6268]/30">
                  <video ref={videoRef} autoPlay playsInline className="w-full h-80 object-cover" />
                  {isCameraOpen && (
                    <div className="absolute top-4 right-4 flex items-center gap-2 bg-[#3e6268] text-white px-3 py-2 rounded-full text-sm font-semibold">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      Camera Active
                    </div>
                  )}
                  {/* Corner borders */}
                  <svg className="absolute top-4 left-4 w-12 h-12 text-[#3e6268]" viewBox="0 0 100 100" fill="none">
                    <path d="M0 20 L0 0 L20 0" stroke="currentColor" strokeWidth="8" strokeLinecap="round"/>
                  </svg>
                  <svg className="absolute top-4 right-4 w-12 h-12 text-[#3e6268]" viewBox="0 0 100 100" fill="none">
                    <path d="M100 20 L100 0 L80 0" stroke="currentColor" strokeWidth="8" strokeLinecap="round"/>
                  </svg>
                  <svg className="absolute bottom-4 left-4 w-12 h-12 text-[#3e6268]" viewBox="0 0 100 100" fill="none">
                    <path d="M0 80 L0 100 L20 100" stroke="currentColor" strokeWidth="8" strokeLinecap="round"/>
                  </svg>
                  <svg className="absolute bottom-4 right-4 w-12 h-12 text-[#3e6268]" viewBox="0 0 100 100" fill="none">
                    <path d="M100 80 L100 100 L80 100" stroke="currentColor" strokeWidth="8" strokeLinecap="round"/>
                  </svg>
                </div>

                {locationMessage && (
                  <div
                    className={`p-3 rounded-lg text-white text-center font-semibold text-sm flex items-center justify-center gap-2 ${
                      isLocationValid ? "bg-green-500" : "bg-red-500"
                    }`}
                  >
                    <MapPin className="w-4 h-4" />
                    <span>{locationMessage}</span>
                  </div>
                )}

                <div className="text-center text-white/60 text-sm flex items-center justify-center gap-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  Look directly at the camera for best results
                </div>

                {message && (
                  <div
                    className={`p-4 rounded-lg text-white text-center font-semibold ${
                      message.includes("Welcome") ? "bg-green-500" : "bg-blue-500"
                    }`}
                  >
                    {message}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Sidebar - Action Cards */}
          {/* UPDATED: 'grid-cols-2' allows side-by-side on mobile. 'lg:grid-cols-1' stacks them on desktop */}
          <div className="grid grid-cols-2 lg:grid-cols-1 gap-4 lg:gap-6 content-start">
            
            {/* Check In Card */}
            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-4 md:p-6 text-center">
              <h3 className="text-xl md:text-2xl font-bold text-white mb-2">Check In</h3>
              <p className="text-white/70 text-xs md:text-sm mb-4 md:mb-6">Start your work day</p>
              {!isCameraOpen ? (
                <button
                  onClick={startCamera}
                  className="w-full py-3 px-2 rounded-full font-semibold text-white text-sm md:text-base transition bg-[#3e6268] hover:bg-[#2d4a4e]"
                >
                  Camera
                </button>
              ) : (
                <button
                  onClick={() => startScanning("check-in")}
                  disabled={scanning || !isCameraOpen || !isLocationValid}
                  className={`w-full py-3 px-2 rounded-full font-semibold text-white text-sm md:text-base transition flex items-center justify-center gap-2 ${
                    scanning || !isCameraOpen || !isLocationValid ? "bg-gray-400 cursor-not-allowed" : "bg-emerald-500 hover:bg-emerald-600"
                  }`}
                >
                  {scanning && scanType === 'check-in' ? "Scan..." : "Check In"}
                </button>
              )}
            </div>

            {/* Check Out Card */}
            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-4 md:p-6 text-center">
              <h3 className="text-xl md:text-2xl font-bold text-white mb-2">Check Out</h3>
              <p className="text-white/70 text-xs md:text-sm mb-4 md:mb-6">End your work day</p>
              {!isCameraOpen ? (
                <button
                  onClick={startCamera}
                  className="w-full py-3 px-2 rounded-full font-semibold text-white text-sm md:text-base transition bg-[#3e6268] hover:bg-[#2d4a4e]"
                >
                  Camera
                </button>
              ) : (
                <button
                  onClick={() => startScanning("check-out")}
                  disabled={scanning || !isCameraOpen || !isLocationValid}
                  className={`w-full py-3 px-2 rounded-full font-semibold text-white text-sm md:text-base transition flex items-center justify-center gap-2 ${
                    scanning || !isCameraOpen || !isLocationValid ? "bg-gray-400 cursor-not-allowed" : "bg-red-500 hover:bg-red-600"
                  }`}
                >
                  {scanning && scanType === 'check-out' ? "Scan..." : "Check Out"}
                </button>
              )}
            </div>

            {/* Close Camera Button - Spans full width (2 cols) on mobile */}
            {isCameraOpen && (
              <button
                onClick={stopCamera}
                className="w-full py-3 px-6 rounded-full font-semibold text-white transition bg-gray-600 hover:bg-gray-700 col-span-2 lg:col-span-1"
              >
                Close Camera
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AttendanceScanner