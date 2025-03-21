// Login.js
import React from 'react'
//import Navbar from '../components/Navbar'; // This is for a navbar if I knew how Michael was making his
const Login = () => {
 // This is some boiler plate for the login page

  return (
    <div className="flex justify-center items-center h-screen bg-[#d8eafe]">
      <div className="w-full max-w-sm">
        {/* Logo Section */}
        {/* Logo is currently not aligned properly and I'll fix it later */}
        <div className="bg-blue-600 text-white text-lg font-bold p-3 pl-6 rounded-t-lg w-fit">
          Smart Eatz
        </div>

        {/* Login Form */}
        <div className="bg-transparent p-8 rounded-lg flex flex-col items-center">
          {/* Username Input */}
          <div className="mb-4 w-full">
            <div className="flex items-center border border-gray-500 rounded-md p-2 bg-white">
              <span className="mr-2">📷</span>
              <input
                type="text"
                placeholder="USERNAME"
                className="w-full outline-none bg-white text-gray-700 placeholder-gray-500"
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="mb-4 w-full">
            <div className="flex items-center border border-gray-500 rounded-md p-2 bg-white">
              <span className="mr-2">🔒</span>
              <input
                type="password"
                placeholder="PASSWORD"
                className="w-full outline-none bg-white text-gray-700 placeholder-gray-500"
              />
            </div>
          </div>

          {/* Login Button */}
          <button className="w-full bg-white text-blue-600 font-semibold py-2 rounded-md shadow-md border border-gray-300 hover:bg-gray-100 transition">
            LOGIN
          </button>

          {/* Forgot Password Link */}
          <p className="text-sm text-black mt-4 cursor-pointer hover:underline">
            Forgot password?
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login