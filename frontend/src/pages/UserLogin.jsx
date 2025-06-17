import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { UserDataContext } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const UserLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { setUser } = useContext(UserDataContext);
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();

    const userData = {
      email: email,
      password: password,
    };

    const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/users/login`, userData);

    if (response.status === 200) {
      const data = response.data;
      setUser(data.user);
      localStorage.setItem('token', data.token);
      navigate('/home');
    }

    setEmail('');
    setPassword('');
  };

  return (
    <div className="h-screen w-full bg-gradient-to-br from-black via-gray-900 to-gray-800 flex flex-col gap-10 justify-center items-center text-white">
      {/* Logo */}
      <div className="mb-10 text-6xl font-semibold tracking-wide text-gray-200 hover:text-white transition-all ease-in duration-500 hover:[text-shadow:_0_0_10px_rgba(255,255,255,0.8),_0_0_20px_rgba(255,255,255,0.5)]">
        Pravaah
      </div>

      {/* Login Form */}
        <form
          onSubmit={submitHandler}
          className="relative bg-gray-900 p-8 rounded-lg shadow-lg w-full max-w-md hover:shadow-2xl hover:scale-100 transition-all duration-500 focus-within:ring-2 focus-within:ring-indigo-600
           border border-gray-800 hover:border-gray-700
           hover:before:absolute hover:before:-inset-[2px] hover:before:rounded-lg hover:before:bg-gradient-to-r hover:before:from-gray-800 hover:before:via-indigo-800 hover:before:to-purple-900 hover:before:z-[-1] hover:before:transition-all hover:before:duration-100"
        >
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-300 hover:text-indigo-400 transition-colors duration-500">
            Welcome Back
          </h2>

          {/* Email Input */}
        <div className="mb-6">
          <label className="block text-lg font-medium mb-2 text-gray-300">Email</label>
          <input
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-gray-900 text-white rounded-lg px-4 py-2 border border-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300"
            type="email"
            placeholder="email@example.com"
          />
        </div>

        {/* Password Input */}
        <div className="mb-6">
          <label className="block text-lg font-medium mb-2 text-gray-300">Password</label>
          <input
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-gray-900 text-white rounded-lg px-4 py-2 border border-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300"
            type="password"
            placeholder="Enter your password"
          />
        </div>

        {/* Login Button */}
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white font-semibold py-3 rounded-lg shadow-lg hover:scale-105 hover:shadow-2xl transition-transform duration-300"
        >
          Login
        </button>

        {/* Signup Link */}
        <p className="text-center mt-4 text-gray-400">
          New here?{' '}
          <Link to="/signup" className="text-indigo-400 hover:underline">
            Create an account
          </Link>
        </p>
      </form>
    </div>
  );
};

export default UserLogin;