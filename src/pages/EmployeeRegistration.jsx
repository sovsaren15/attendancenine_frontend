"use client"

import { useRef, useState, useEffect } from "react"
import { ArrowRight } from "lucide-react"

function EmployeeRegistration() {
  const videoRef = useRef(null)
  const imageRef = useRef(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    department: "",
    dob: "",
    startWorkingDate: "",
    sex: "",
  })
  const [capturing, setCapturing] = useState(false)
  const [faceData, setFaceData] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [notification, setNotification] = useState({ type: '', text: '' })
  const [loading, setLoading] = useState(true)
  const [uploadedImage, setUploadedImage] = useState(null)

  useEffect(() => {
    // Simulate loading
    setTimeout(() => setLoading(false), 1500)
  }, [])

  const captureFace = async () => {
    setCapturing(true)
    setNotification({ type: 'info', text: 'Capturing... Please look at the camera.' })
    
    // Simulate face capture
    setTimeout(() => {
      setFaceData([1, 2, 3, 4, 5])
      setNotification({ type: 'success', text: "Face captured successfully!" })
      setCapturing(false)
    }, 1500)
  }

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    const imageUrl = URL.createObjectURL(file)
    setUploadedImage(imageUrl)
    setFaceData(null)
    
    setCapturing(true)
    setNotification({ type: 'info', text: "Detecting face from image..." })
    
    // Simulate face detection
    setTimeout(() => {
      setFaceData([1, 2, 3, 4, 5])
      setNotification({ type: 'success', text: "Face captured successfully from image!" })
      setCapturing(false)
    }, 1500)
    
    e.target.value = ""
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!faceData || !formData.name || !formData.email) {
      setNotification({ type: 'error', text: "Please fill all required fields and capture a face" })
      return
    }

    setIsSubmitting(true)
    
    // Simulate registration
    setTimeout(() => {
      setNotification({ type: 'success', text: "Employee registered successfully! Redirecting..." })
      setIsSubmitting(false)
    }, 2000)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center p-4">
        <div className="text-center bg-white rounded-3xl p-12 shadow-xl">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="bg-[#3e6268]/10 rounded-full p-6 animate-pulse">
                <svg className="w-16 h-16 text-[#3e6268]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              </div>
              <div className="absolute inset-0 border-4 border-[#3e6268]/20 border-t-[#3e6268] rounded-full animate-spin"></div>
            </div>
          </div>
          <p className="text-xl font-semibold text-gray-800">Loading Face Models...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen  p-4 md:p-8">
  

      <div className="bg-white rounded-3xl shadow-xl p-6 md:p-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Employee Registration</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Video Feed */}
          <div className="flex flex-col gap-4">
            <div className="bg-black rounded-lg overflow-hidden relative  flex items-center justify-center" style={{height:457}}>
              {uploadedImage ? (
                <img ref={imageRef} src={uploadedImage} alt="Uploaded preview" className="h-full w-full object-contain" />
              ) : (
                <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
              )}
              {!uploadedImage && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
                  <p className="text-gray-400 text-lg">Camera feed will appear here</p>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={captureFace}
                disabled={capturing || !!uploadedImage}
                className={`w-full py-3 px-6 rounded-lg font-semibold text-white transition ${
                  capturing || uploadedImage
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700"
                }`}
              >
                {capturing ? "Capturing..." : "Capture from Camera"}
              </button>

              <label
                htmlFor="imageUpload"
                className={`w-full py-3 px-6 rounded-lg font-semibold text-white text-center transition cursor-pointer ${
                  capturing ? "bg-gray-400 cursor-not-allowed" : "bg-[#3e6268] hover:bg-[#2d4a4f]"
                }`}
              >
                Upload Image
              </label>
              <input id="imageUpload" type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            </div>

            {uploadedImage && (
              <button
                onClick={() => {
                  setUploadedImage(null)
                  setFaceData(null)
                  setNotification({ type: '', text: '' })
                  if (uploadedImage) URL.revokeObjectURL(uploadedImage)
                }}
                className="w-full py-2 px-4 rounded-lg font-semibold text-white bg-gray-600 hover:bg-gray-700 transition"
              >
                Switch to Camera
              </button>
            )}

            {notification.text && (
              <div className={`p-4 rounded-lg text-center font-semibold ${
                notification.type === 'success' ? 'bg-green-100 text-green-700' :
                notification.type === 'error'   ? 'bg-red-100 text-red-700' :
                'bg-blue-100 text-blue-700'
              }`}>
                {notification.text}
              </div>
            )}
          </div>

          {/* Registration Form */}
          <div className="flex flex-col gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3e6268]"
                placeholder=""
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3e6268]"
                placeholder=""
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Department</label>
              <input
                type="text"
                name="department"
                value={formData.department}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3e6268]"
                placeholder=""
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Date of Birth</label>
                <input
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3e6268]"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Gender</label>
                <select
                  name="sex"
                  value={formData.sex}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3e6268] bg-white"
                >
                  <option value="">Select...</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Start Working Date</label>
              <input
                type="date"
                name="startWorkingDate"
                value={formData.startWorkingDate}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3e6268]"
              />
            </div>

            <button
              onClick={handleSubmit}
              disabled={!faceData || !formData.name || !formData.email || isSubmitting}
              className={`w-full py-3 px-6 rounded-lg font-semibold text-white transition ${
                !faceData || !formData.name || !formData.email || isSubmitting
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-[#3e6268] hover:bg-[#2d4a4f]"
              } flex items-center justify-center`}
            >
              {isSubmitting && (
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              {isSubmitting ? "Registering..." : "Register Employee"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EmployeeRegistration