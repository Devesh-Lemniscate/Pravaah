import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

const Start = () => {

  useEffect(() => {
    const handleMouseMove = (e) => {
      const glow = document.getElementById('cursor-glow');
      if (glow) {
        glow.style.left = `${e.clientX}px`;
        glow.style.top = `${e.clientY}px`;
      }
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className="h-screen w-full bg-gradient-to-br from-black via-gray-900 to-gray-800 flex flex-col justify-between items-center text-white relative overflow-hidden">
      {/* Cursor Glow */}
      <div
        id="cursor-glow"
        className="pointer-events-none absolute w-52 h-52 bg-white/10 rounded-full blur-3xl transition-all duration-100"
      ></div>

      {/* Animated Vehicle */}
      <div className="absolute bottom-20 left-0 w-full h-60 overflow-visible">
        <svg
          className="animate-drive"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="200 20 200 100"
          fill="none"
          stroke="white"
          strokeWidth="2"
          width="400"
          height="400"
        >
          {/* Car Body with Roof Bump */}
          <path
            d="M210 60 Q230 40 270 40 Q300 20 330 40 H370 Q390 40 390 60 L380 70 H220 L210 60 Z"
            fill="#C0C0C0" /* Metallic Silver */
            stroke="white"
          />
          {/* Windows with Roof Bump */}
          <path
            d="M240 50 Q260 45 280 50 Q300 35 320 50 H340 Q360 45 360 50 L350 60 H250 L240 50 Z"
            fill="black"
            stroke="white"
          />
          {/* Front Wheel */}
          <circle cx="240" cy="70" r="25" fill="black" stroke="white" />
          <circle cx="240" cy="70" r="15" fill="white" />
          {/* Rear Wheel */}
          <circle cx="360" cy="70" r="25" fill="black" stroke="white" />
          <circle cx="360" cy="70" r="15" fill="white" />
        </svg>
      </div>

      {/* Logo Section */}
      <div className="w-full flex justify-start p-6">
        <a
          href="https://github.com/Devesh-Lemniscate/Pravaah-An-optimal-path-finding-solution"
          target="_blank"
          rel="noopener noreferrer"
          className="text-4xl mt-4 ml-4 font-semibold tracking-wide text-gray-100 hover:text-blue-900 transition-colors"
        >
          Pravaah
        </a>
      </div>

      {/* Main Content */}
      <div className="flex flex-col items-center text-center px-6 pb-28">
        <h1 className="text-5xl font-bold tracking-tight leading-tight text-gray-100">
          Your Journey, Redefined
        </h1>
        <p className="text-lg mt-4 text-gray-400">
          Find the most efficient and shortest paths with ease.
        </p>
        <Link to="/login">
          <button className="relative inline-flex items-center justify-center p-0.5 mt-4 mb-2 overflow-hidden text-lg font-medium text-white rounded-lg group bg-gradient-to-br from-gray-700 via-gray-800 to-black group-hover:from-gray-600 group-hover:via-gray-700 group-hover:to-gray-900 hover:text-white focus:ring-4 focus:outline-none focus:ring-gray-500">
            <span className="relative px-5 py-2.5 transition-all ease-in duration-300 bg-black rounded-md group-hover:bg-transparent">
              Get Started
            </span>
          </button>
        </Link>
        </div>

      {/* Footer Section */}
      <div className="w-full text-center pb-6 text-lg text-gray-500 hover:text-white hover:transition-all hover:duration-300">
        <p>© 2025 Pravaah. All rights reserved.</p>
        <p>
          Made by <span className='font-semibold'>The Cartographers</span>
        </p>
      </div>
    </div>
  );
};

export default Start;