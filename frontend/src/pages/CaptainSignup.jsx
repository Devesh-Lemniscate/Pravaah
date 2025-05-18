import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CaptainDataContext } from '../context/CapatainContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CaptainSignup = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const [vehicleColor, setVehicleColor] = useState('');
  const [vehiclePlate, setVehiclePlate] = useState('');
  const [vehicleCapacity, setVehicleCapacity] = useState('');
  const [vehicleType, setVehicleType] = useState('');

  const { setCaptain } = React.useContext(CaptainDataContext);

  const submitHandler = async (e) => {
    e.preventDefault();
    const captainData = {
      fullname: {
        firstname: firstName,
        lastname: lastName,
      },
      email: email,
      password: password,
      vehicle: {
        color: vehicleColor,
        plate: vehiclePlate,
        capacity: vehicleCapacity,
        vehicleType: vehicleType,
      },
    };

    const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/captains/register`, captainData);

    if (response.status === 201) {
      const data = response.data;
      setCaptain(data.captain);
      localStorage.setItem('token', data.token);
      navigate('/captain-home');
    }

    setEmail('');
    setFirstName('');
    setLastName('');
    setPassword('');
    setVehicleColor('');
    setVehiclePlate('');
    setVehicleCapacity('');
    setVehicleType('');
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

      {/* Signup Form */}
      <form
        onSubmit={submitHandler}
        className="bg-gray-900/50 p-8 rounded-lg shadow-lg w-full max-w-md hover:shadow-2xl hover:scale-105 transition-transform duration-300 focus-within:ring-2 focus-within:ring-blue-500"
      >
        <h2 className="text-2xl font-bold mb-6 text-center hover:text-blue-400 transition-colors duration-300">
          Create Captain Account
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

        {/* Vehicle Information */}
        <h3 className="text-lg font-medium mb-2">Vehicle Information</h3>
        <div className="flex gap-4 mb-6">
          <input
            required
            className="w-1/2 bg-gray-800 text-white rounded-lg px-4 py-2 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
            type="text"
            placeholder="Vehicle Color"
            value={vehicleColor}
            onChange={(e) => setVehicleColor(e.target.value)}
          />
          <input
            required
            className="w-1/2 bg-gray-800 text-white rounded-lg px-4 py-2 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
            type="text"
            placeholder="Vehicle Plate"
            value={vehiclePlate}
            onChange={(e) => setVehiclePlate(e.target.value)}
          />
        </div>
        <div className="flex gap-4 mb-6">
          <input
            required
            className="w-1/2 bg-gray-800 text-white rounded-lg px-4 py-2 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
            type="number"
            placeholder="Vehicle Capacity"
            value={vehicleCapacity}
            onChange={(e) => setVehicleCapacity(e.target.value)}
          />
          <select
            required
            className="w-1/2 bg-gray-800 text-white rounded-lg px-4 py-2 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
            value={vehicleType}
            onChange={(e) => setVehicleType(e.target.value)}
          >
            <option value="" disabled>
              Select Vehicle Type
            </option>
            <option value="car">Car</option>
            <option value="auto">Auto</option>
            <option value="moto">MotorCycle</option>
          </select>
        </div>

        {/* Signup Button */}
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-500 to-teal-500 text-white font-semibold py-3 rounded-lg shadow-lg hover:scale-105 transition-transform duration-300"
        >
          Create Captain Account
        </button>
      </form>

      {/* Login Link */}
      <p className="text-center mt-4 text-gray-400">
        Already have an account?{' '}
        <Link to="/captain-login" className="text-blue-500 hover:underline">
          Login here
        </Link>
      </p>

      {/* Footer */}
      <div className="mt-6 text-xs text-gray-500 text-center">
        This site is protected by reCAPTCHA and the{' '}
        <span className="underline">Google Privacy Policy</span> and{' '}
        <span className="underline">Terms of Service</span> apply.
      </div>
    </div>
  );
};

export default CaptainSignup;