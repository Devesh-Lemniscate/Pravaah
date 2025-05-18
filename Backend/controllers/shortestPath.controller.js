const axios = require('axios');
const polyline = require('@mapbox/polyline');

exports.getShortestPaths = async (req, res) => {
  const { source, destination } = req.body;
  const apiKey = process.env.GOOGLE_MAPS_API;

  try {
    // Request alternatives from Google Directions API
    const directionsRes = await axios.get(
      `https://maps.googleapis.com/maps/api/directions/json`,
      {
        params: {
          origin: source,
          destination: destination,
          key: apiKey,
          alternatives: true,
        },
      }
    );

    if (
      directionsRes.data.status !== 'OK' ||
      !directionsRes.data.routes.length
    ) {
      return res.status(400).json({ error: 'No route found' });
    }

    // Map each route to a path object
    const routes = directionsRes.data.routes.slice(0, 3).map((route) => {
      const overviewPolyline = route.overview_polyline.points;
      const coordinates = polyline.decode(overviewPolyline).map(([lat, lng]) => ({ lat, lng }));
      const leg = route.legs[0];
      const distance = parseFloat(leg.distance.text.replace(/[^\d.]/g, '')) || 0;
      const time = parseFloat(leg.duration.text.replace(/[^\d.]/g, '')) || 0;
      const fuel = (distance / 15).toFixed(2);
      return { coordinates, distance, time, fuel, leg };
    });

    // Find shortest distance, shortest time, least fuel
    const shortest = [...routes].sort((a, b) => a.distance - b.distance)[0];
    const fastest = [...routes].sort((a, b) => a.time - b.time)[0];
    const cheapest = [...routes].sort((a, b) => a.fuel - b.fuel)[0];

    // Remove duplicates (in case two metrics pick the same route)
    const uniqueRoutes = [];
    const added = new Set();
    for (const r of [shortest, cheapest, fastest]) {
      const key = JSON.stringify(r.coordinates);
      if (!added.has(key)) {
        uniqueRoutes.push(r);
        added.add(key);
      }
    }

    // Assign labels/colors
    const labels = ['Shortest Distance', 'Least Fuel', 'Shortest Time'];
    const colors = ['#00f', '#0f0', '#f00'];
    const paths = uniqueRoutes.map((route, idx) => ({
      label: labels[idx],
      color: colors[idx],
      coordinates: route.coordinates,
      distance: route.distance,
      time: route.time,
      fuel: route.fuel,
    }));

    res.json({
      center: paths[0]?.coordinates[0] || { lat: 0, lng: 0 },
      paths,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch directions' });
  }
};