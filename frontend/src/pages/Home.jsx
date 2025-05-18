import React, { useRef, useState, useEffect } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import axios from 'axios';
import { LoadScript, GoogleMap, Marker, Polyline } from '@react-google-maps/api';
import 'remixicon/fonts/remixicon.css';
import LocationSearchPanel from '../components/LocationSearchPanel';

const containerStyle = {
  width: '100%',
  height: '100%',
};

const defaultCenter = { lat: 28.6139, lng: 77.2090 }; // Example: Delhi

const Home = () => {
  const [pickup, setPickup] = useState('');
  const [destination, setDestination] = useState('');
  const [panelOpen, setPanelOpen] = useState(false);
  const [pickupSuggestions, setPickupSuggestions] = useState([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState([]);
  const [activeField, setActiveField] = useState(null);
  const [paths, setPaths] = useState([]);
  const [mapCenter, setMapCenter] = useState(defaultCenter);

  const panelRef = useRef(null);
  const panelCloseRef = useRef(null);
  const mapRef = useRef(null);

  // Animate panel open/close
  useGSAP(() => {
    if (panelOpen) {
      gsap.to(panelRef.current, {
        height: '70%',
        padding: 24,
      });
      gsap.to(panelCloseRef.current, {
        opacity: 1,
      });
    } else {
      gsap.to(panelRef.current, {
        height: '0%',
        padding: 0,
      });
      gsap.to(panelCloseRef.current, {
        opacity: 0,
      });
    }
  }, [panelOpen]);

  // Fit map bounds when paths change
  useEffect(() => {
    if (mapRef.current && paths.length > 0) {
      const bounds = new window.google.maps.LatLngBounds();
      paths.forEach(path => {
        path.coordinates.forEach(coord => bounds.extend(coord));
      });
      mapRef.current.fitBounds(bounds);
    }
  }, [paths]);

  // Handle input changes and suggestions
  const handlePickupChange = async (e) => {
    setPickup(e.target.value);
    if (e.target.value.length >= 3) {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/maps/get-suggestions`, {
          params: { input: e.target.value },
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setPickupSuggestions(response.data);
      } catch {
        setPickupSuggestions([]);
      }
    } else {
      setPickupSuggestions([]);
    }
  };

  const handleDestinationChange = async (e) => {
    setDestination(e.target.value);
    if (e.target.value.length >= 3) {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/maps/get-suggestions`, {
          params: { input: e.target.value },
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setDestinationSuggestions(response.data);
      } catch {
        setDestinationSuggestions([]);
      }
    } else {
      setDestinationSuggestions([]);
    }
  };

  // Find shortest paths
  const findShortestPaths = async () => {
    console.log('Finding shortest paths:', pickup, destination); // Add this line
    if (!pickup || !destination) return;
    try {
      const res = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/shortest-paths`, {
        source: pickup,
        destination: destination,
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setPaths(res.data.paths || []);
      if (res.data.center) setMapCenter(res.data.center);
    } catch (err) {
      alert('Could not find paths. Please try again.');
    }
  };

  // Find best metrics
  const fastest = paths.reduce((min, p) => (p.time < min.time ? p : min), paths[0] || {});
  const cheapest = paths.reduce((min, p) => (p.fuel < min.fuel ? p : min), paths[0] || {});
  const shortest = paths.reduce((min, p) => (p.distance < min.distance ? p : min), paths[0] || {});

  // Helper to find which metrics share the same path
  const getSharedMetrics = () => {
    if (paths.length === 2) {
      const [a, b] = paths;
      const metrics = [
        { name: 'Shortest Distance', path: shortest },
        { name: 'Least Fuel', path: cheapest },
        { name: 'Shortest Time', path: fastest },
      ];
      // Group metrics by path
      const groups = {};
      metrics.forEach(m => {
        const key = JSON.stringify(m.path.coordinates);
        if (!groups[key]) groups[key] = [];
        groups[key].push(m.name);
      });
      // Find which two metrics share a path
      const shared = Object.values(groups).find(arr => arr.length === 2);
      if (shared) {
        return `${shared.join(' and ')} share the same route.`;
      }
    }
    return null;
  };

  return (
    <div className="h-screen relative overflow-hidden bg-gradient-to-br from-black via-gray-900 to-gray-800 text-white">
      {/* Header */}
      <div className="absolute top-5 left-5 z-10">
        <a
          target="_blank"
          rel="noopener noreferrer"
          className="text-4xl mt-4 ml-4 font-semibold tracking-wide text-black hover:text-blue-900 transition-colors"
        >
          Pravaah
        </a>
      </div>

      {/* Legend or Notification */}
      {paths.length === 1 ? (
        <div className="absolute top-24 left-1/2 -translate-x-1/2 z-20 bg-yellow-900/90 rounded-lg p-4 shadow-lg text-sm">
          Only one route available for these locations.
        </div>
      ) : paths.length === 2 ? (
        <div className="absolute top-5 left-1/2 -translate-x-1/2 z-20 bg-gray-900/90 rounded-lg p-4 shadow-lg flex flex-col gap-2 text-sm text-center">
          <div className="flex justify-center gap-4 mb-1">
            {paths.map((path, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="inline-block w-4 h-4 rounded-full" style={{ background: path.color }}></span>
                {path.label}
              </div>
            ))}
          </div>
          <div className="text-yellow-300">{getSharedMetrics()}</div>
        </div>
      ) : paths.length >= 3 ? (
        <div className="absolute top-5 left-1/2 -translate-x-1/2 z-20 bg-gray-900/90 rounded-lg p-4 shadow-lg flex flex-row gap-6 text-sm">
          <div className="flex items-center gap-2">
            <span className="inline-block w-4 h-4 rounded-full" style={{ background: '#00f' }}></span>
            Shortest Distance
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-block w-4 h-4 rounded-full" style={{ background: '#0f0' }}></span>
            Least Fuel
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-block w-4 h-4 rounded-full" style={{ background: '#f00' }}></span>
            Shortest Time
          </div>
        </div>
      ) : null}

      {/* Route Metrics */}
      {paths.length > 0 && (
        <div className="absolute bottom-5 right-5 z-20 bg-gray-900/90 rounded-lg p-4 shadow-lg flex flex-col gap-2 text-sm min-w-[220px]">
          <div>
            <span className="font-semibold text-blue-400">Fastest Route:</span>
            <span className="ml-2">{fastest.time} min</span>
          </div>
          <div>
            <span className="font-semibold text-green-400">Cheapest Route:</span>
            <span className="ml-2">{cheapest.fuel} L</span>
          </div>
          <div>
            <span className="font-semibold text-cyan-400">Shortest Route:</span>
            <span className="ml-2">{shortest.distance} km</span>
          </div>
        </div>
      )}

      {/* Map with polylines */}
      <div className="h-screen w-screen">
        <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={mapCenter}
            zoom={12}
            options={{
              draggable: true,
              gestureHandling: 'greedy',
              disableDefaultUI: false,
            }}
            onLoad={map => { mapRef.current = map; }}
          >
            {/* Draw all returned paths */}
            {paths.map((path, idx) => (
              <Polyline
                key={idx}
                path={path.coordinates}
                options={{
                  strokeColor: path.color,
                  strokeOpacity: 0.8,
                  strokeWeight: 5,
                }}
              />
            ))}
            {/* Markers for start/end */}
            {paths[0] && (
              <>
                <Marker position={paths[0].coordinates[0]} label="A" />
                <Marker position={paths[0].coordinates[paths[0].coordinates.length - 1]} label="B" />
              </>
            )}
          </GoogleMap>
        </LoadScript>
      </div>

      {/* Bottom Panel */}
      <div
        className="flex flex-col justify-end h-screen absolute top-0 w-full"
        style={{ pointerEvents: 'none' }} // <-- Add this
      >
        <div
          className="h-[30%] p-6 bg-gray-900/80 rounded-t-3xl shadow-lg"
          style={{ pointerEvents: 'auto' }} // <-- Add this
        >
          <h5
            ref={panelCloseRef}
            onClick={() => setPanelOpen(false)}
            className="absolute opacity-0 right-6 top-6 text-2xl cursor-pointer"
          >
            <i className="ri-arrow-down-wide-line"></i>
          </h5>
          <h4 className="text-2xl font-semibold">Find Shortest Path</h4>
          <form className="relative py-3" onSubmit={e => { e.preventDefault(); findShortestPaths(); }}>
            <div className="line absolute h-16 w-1 top-[50%] -translate-y-1/2 left-5 bg-gray-700 rounded-full"></div>
            <input
              onClick={() => {
                setPanelOpen(true);
                setActiveField('pickup');
              }}
              value={pickup}
              onChange={handlePickupChange}
              className="bg-gray-800 px-12 py-2 text-lg rounded-lg w-full text-white placeholder-gray-400"
              type="text"
              placeholder="Add a source location"
            />
            <input
              onClick={() => {
                setPanelOpen(true);
                setActiveField('destination');
              }}
              value={destination}
              onChange={handleDestinationChange}
              className="bg-gray-800 px-12 py-2 text-lg rounded-lg w-full mt-3 text-white placeholder-gray-400"
              type="text"
              placeholder="Enter your destination"
            />
            <button
              type="submit"
              className="bg-gradient-to-r from-blue-500 to-teal-500 text-white px-4 py-2 rounded-lg mt-3 w-full shadow-lg hover:scale-105 transition-transform duration-300"
            >
              Find Shortest Path
            </button>
          </form>
        </div>
        <div
          ref={panelRef}
          className="bg-gray-900/90 h-0"
          style={{ pointerEvents: 'auto' }} // <-- Add this
        >
          <LocationSearchPanel
            suggestions={activeField === 'pickup' ? pickupSuggestions : destinationSuggestions}
            setPanelOpen={setPanelOpen}
            setPickup={setPickup}
            setDestination={setDestination}
            activeField={activeField}
          />
        </div>
      </div>
    </div>
  );
};

export default Home;