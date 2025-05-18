import React, { useState } from 'react';
import { LoadScript, GoogleMap, Marker, Polyline } from '@react-google-maps/api';
import axios from 'axios';

const containerStyle = { width: '100%', height: '100vh' };

const ShortestPath = () => {
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [paths, setPaths] = useState([]);
  const [center, setCenter] = useState({ lat: 28.6139, lng: 77.2090 }); // Default to Delhi

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/shortest-paths`, {
      source,
      destination,
    });
    setPaths(res.data.paths);
    if (res.data.center) setCenter(res.data.center);
  };

  return (
    <div className="h-screen w-full bg-gradient-to-br from-black via-gray-900 to-gray-800 flex flex-col items-center">
      <form onSubmit={handleSubmit} className="p-6 bg-gray-900 rounded-lg shadow-lg mt-8 flex flex-col gap-4 w-full max-w-xl">
        <input
          className="bg-gray-800 text-white rounded-lg px-4 py-2 border border-gray-700"
          placeholder="Source"
          value={source}
          onChange={e => setSource(e.target.value)}
        />
        <input
          className="bg-gray-800 text-white rounded-lg px-4 py-2 border border-gray-700"
          placeholder="Destination"
          value={destination}
          onChange={e => setDestination(e.target.value)}
        />
        <button
          type="submit"
          className="bg-gradient-to-r from-blue-500 to-teal-500 text-white font-semibold py-3 rounded-lg shadow-lg hover:scale-105 transition-transform duration-300"
        >
          Find Shortest Paths
        </button>
      </form>
      <div className="w-full h-full flex-1">
        <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={12}
            options={{
              draggable: true,
              gestureHandling: 'auto',
              disableDefaultUI: false,
            }}
          >
            {paths.map((path, idx) => (
              <Polyline
                key={idx}
                path={path.coordinates}
                options={{
                  strokeColor: path.color,
                  strokeOpacity: 0.8,
                  strokeWeight: 5,
                  label: path.label,
                }}
              />
            ))}
            {paths.length > 0 && (
              <>
                <Marker position={paths[0].coordinates[0]} label="A" />
                <Marker position={paths[0].coordinates[paths[0].coordinates.length - 1]} label="B" />
              </>
            )}
          </GoogleMap>
        </LoadScript>
      </div>
    </div>
  );
};

export default ShortestPath;