import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UserDataContext } from '../context/UserContext';

const UserSignup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const navigate = useNavigate();
  const { setUser } = useContext(UserDataContext);

  const submitHandler = async (e) => {
    e.preventDefault();
    const newUser = {
      fullname: {
        firstname: firstName,
        lastname: lastName,
      },
      email: email,
      password: password,
    };

    const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/users/register`, newUser);

    if (response.status === 201) {
      const data = response.data;
      setUser(data.user);
      localStorage.setItem('token', data.token);
      navigate('/home');
    }

    setEmail('');
    setFirstName('');
    setLastName('');
    setPassword('');
  };

  return (
    <div className="h-screen w-full bg-gradient-to-br from-black via-gray-900 to-gray-800 flex flex-col justify-center items-center text-white">
      {/* Logo */}
      <div className="mb-10 text-6xl font-semibold tracking-wide text-gray-200 hover:text-white transition-all ease-in duration-500 hover:[text-shadow:_0_0_10px_rgba(255,255,255,0.8),_0_0_20px_rgba(255,255,255,0.5)]">
        Pravaah
      </div>

      {/* Signup Form */}
      <form
        onSubmit={submitHandler}
        className="bg-gray-900/50 p-8 rounded-lg shadow-lg w-full max-w-md hover:shadow-2xl hover:scale-105 transition-transform duration-300 focus-within:ring-2 focus-within:ring-blue-500"
      >
        <h2 className="text-2xl font-bold mb-6 text-center hover:text-blue-400 transition-colors duration-300">
          Create Your Account
        </h2>

        {/* Name Inputs */}
        <h3 className="text-lg font-medium mb-2">What's your name?</h3>
        <div className="flex gap-4 mb-6">
          <input
            required
            className="w-1/2 bg-gray-800 text-white rounded-lg px-4 py-2 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
            type="text"
            placeholder="First name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          <input
            required
            className="w-1/2 bg-gray-800 text-white rounded-lg px-4 py-2 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
            type="text"
            placeholder="Last name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>

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

        {/* Signup Button */}
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-500 to-teal-500 text-white font-semibold py-3 rounded-lg shadow-lg hover:scale-105 transition-transform duration-300"
        >
          Create Account
        </button>
      </form>

      {/* Login Link */}
      <p className="text-center mt-4 text-gray-400">
        Already have an account?{' '}
        <Link to="/login" className="text-blue-500 hover:underline">
          Login here
        </Link>
      </p>

      
    </div>
  );
};

export default UserSignup;