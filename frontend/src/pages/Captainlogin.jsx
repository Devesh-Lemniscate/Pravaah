import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CaptainDataContext } from '../context/CapatainContext';

const Captainlogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { setCaptain } = React.useContext(CaptainDataContext);
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    const captain = {
      email: email,
      password,
    };

    const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/captains/login`, captain);

    if (response.status === 200) {
      const data = response.data;

      setCaptain(data.captain);
      localStorage.setItem('token', data.token);
      navigate('/captain-home');
    }

    setEmail('');
    setPassword('');
  };

  return (
    <div className="h-screen w-full bg-gradient-to-br from-black via-gray-900 to-gray-800 flex flex-col justify-center items-center text-white">
      {/* Logo */}
      <div className="mb-10">
        <img
          className="w-20"
          src="https://www.svgrepo.com/show/505031/uber-driver.svg"
          alt="Captain Logo"
        />
      </div>

      {/* Login Form */}
      <form
        onSubmit={submitHandler}
        className="bg-gray-900/50 p-8 rounded-lg shadow-lg w-full max-w-md hover:shadow-2xl hover:scale-105 transition-transform duration-300 focus-within:ring-2 focus-within:ring-blue-500"
      >
        <h2 className="text-2xl font-bold mb-6 text-center hover:text-blue-400 transition-colors duration-300">
          Captain Login
        </h2>

        {/* Email Input */}
        <h3 className="text-lg font-medium mb-2">What's your email?</h3>
        <input
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-gray-800 text-white rounded-lg px-4 py-2 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 mb-6"
          type="email"
          placeholder="email@example.com"
        />

        {/* Password Input */}
        <h3 className="text-lg font-medium mb-2">Enter Password</h3>
        <input
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full bg-gray-800 text-white rounded-lg px-4 py-2 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 mb-6"
          type="password"
          placeholder="Password"
        />

        {/* Login Button */}
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-500 to-teal-500 text-white font-semibold py-3 rounded-lg shadow-lg hover:scale-105 transition-transform duration-300"
        >
          Login
        </button>

        {/* Signup Link */}
        <p className="text-center mt-4 text-gray-400">
          Join a fleet?{' '}
          <Link to="/captain-signup" className="text-blue-500 hover:underline">
            Register as a Captain
          </Link>
        </p>
      </form>

      {/* User Login Button */}
      <div className="mt-6 w-full max-w-md">
        <Link
          to="/login"
          className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold py-3 rounded-lg shadow-lg flex items-center justify-center hover:scale-105 transition-transform duration-300"
        >
          Sign in as User
        </Link>
      </div>
    </div>
  );
};

export default Captainlogin;