'use client'; // Next.js App Router-এর জন্য জরুরি

import React, { useState } from 'react';
import { Card } from '@heroui/react';
import { motion } from 'framer-motion';
import { FiLock, FiEye, FiEyeOff, FiPhone } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc'; 
import { useRouter } from 'next/navigation'; 
import { FaPhoneAlt } from 'react-icons/fa';
import { PiFlowerTulip } from 'react-icons/pi';
import { RiLockPasswordFill } from 'react-icons/ri';

const LoginPage = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  const [formData, setFormData] = useState({
    phone: '',
    password: '',
    rememberMe: false,
  });

  const DEFAULT_PHONE = '01724166864';
  const DEFAULT_PASSWORD = 'wl166864';

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage(''); 

    if (formData.phone === DEFAULT_PHONE && formData.password === DEFAULT_PASSWORD) {
      
      document.cookie = "isLoggedIn=true; path=/; max-age=86400"; 

      router.push('/dashboard');
    } else {
      setErrorMessage('Wrong Mobile Number or Password! Use the demo credentials.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50/50 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 100, damping: 15 }}
        className="w-full max-w-md"
      >
        <Card shadow="md" className="p-8 bg-white border border-gray-100/80 rounded-3xl">
      
          <div className="text-center mb-6">
            <h2 className="text-3xl  flex justify-center items-center font-extrabold text-gray-900 tracking-tight">
             <span className='text-orange-500'><PiFlowerTulip /> </span>Welcome Back
            </h2>
            <p className="text-sm text-gray-500 font-medium mt-2">
              Login to access your sports dashboard
            </p>
          </div>


          {errorMessage && (
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="mb-4 p-3 bg-red-50 text-red-600 text-xs font-semibold rounded-xl border border-red-100 text-center"
            >
              {errorMessage}
            </motion.div>
          )}
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                        
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-gray-700 flex gap-1 uppercase tracking-wider"><FaPhoneAlt className='text-orange-500'/> Mobile Number</label>
              <div className="relative flex items-center">
                <FiPhone className="absolute left-4 text-gray-400 text-lg" />
                <input
                  type="tel"
                  name="phone"
                  required
                  placeholder="017XXXXXXXX"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:bg-white transition-all duration-200 font-medium text-gray-800"
                />
              </div>
            </div>

    
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider flex gap-1"> <span className='text-orange-500'><RiLockPasswordFill /></span> Password</label>
              <div className="relative flex items-center">
                <FiLock className="absolute left-4 text-gray-400 text-lg" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  required
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-11 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:bg-white transition-all duration-200 font-medium text-gray-800"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 text-gray-400 hover:text-gray-600 focus:outline-none transition-colors"
                >
                  {showPassword ? <FiEyeOff className="text-lg" /> : <FiEye className="text-lg" />}
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between my-1">
              <div className="flex items-center gap-2.5">
                <input
                  type="checkbox"
                  name="rememberMe"
                  id="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer accent-blue-600"
                />
                <label htmlFor="rememberMe" className="text-xs text-gray-500 font-semibold select-none cursor-pointer">
                  Remember me
                </label>
              </div>
              <a href="#" className="text-xs text-blue-600 hover:underline font-bold">
                Forgot Password?
              </a>
            </div>

            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl transition-colors duration-200 shadow-md shadow-blue-500/20 mt-2"
            >
              Sign In
            </motion.button>
          </form>

          <div className="relative flex items-center justify-center my-6">
            <div className="w-full border-t border-gray-200"></div>
            <span className="absolute bg-white px-3 text-xs font-bold text-gray-400 uppercase">Or connect with</span>
          </div>

          <motion.button
            type="button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-3 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold text-sm rounded-xl flex items-center justify-center gap-3 transition-colors duration-200 shadow-sm"
          >
            <FcGoogle className="text-xl" />
            Sign in with Google
          </motion.button>

          <p className="text-center text-sm font-medium text-gray-500 mt-6">
            Dont have an account?{' '}
            <a href="#" className="text-blue-600 hover:underline font-bold">
              Register Now
            </a>
          </p>
        </Card>
      </motion.div>
    </div>
  );
};

export default LoginPage;