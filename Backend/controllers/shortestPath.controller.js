const axios = require('axios');
const polyline = require('@mapbox/polyline'); // decode polyline to lat, long
const Heap = require('heap');

// Haversine distance in meters (Do points ke beech ka distance nikalne ka formula)
function haversine(a, b) {
  const toRad = x => (x * Math.PI) / 180;
  const R = 6371000;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const aVal = Math.sin(dLat / 2) ** 2 + Math.sin(dLng / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);
  return R * 2 * Math.atan2(Math.sqrt(aVal), Math.sqrt(1 - aVal));
}

//Dijkstra's algorithm 

function dijkstra(nodes, edges, startIdx, endIdx) {
  const dist = Array(nodes.length).fill(Infinity);
  const prev = Array(nodes.length).fill(null);
  const visited = Array(nodes.length).fill(false);
  dist[startIdx] = 0;

  for (let i = 0; i < nodes.length; i++) {
    let u = -1;
    for (let j = 0; j < nodes.length; j++) {
      if (!visited[j] && (u === -1 || dist[j] < dist[u])) u = j;
    }
    if (u === -1 || dist[u] === Infinity) break;
    visited[u] = true;
    for (const { to, weight } of edges[u]) {
      if (dist[u] + weight < dist[to]) {
        dist[to] = dist[u] + weight;
        prev[to] = u;
      }
    }
  }
  // Path ko reconstruct kar rahe hain
  const path = [];
  for (let at = endIdx; at !== null; at = prev[at]) path.push(at);
  path.reverse();
  return { path, distance: dist[endIdx] };
}

// function dijkstra(nodes, edges, startIdx, endIdx) {
//   const dist = Array(nodes.length).fill(Infinity);
//   const prev = Array(nodes.length).fill(null);
//   const visited = Array(nodes.length).fill(false);
//   dist[startIdx] = 0;

//   // Min-heap: [distance, node index]
//   const pq = new Heap((a, b) => a[0] - b[0]);
//   pq.push([0, startIdx]);

//   while (!pq.empty()) {
//     const [currDist, u] = pq.pop();
//     if (visited[u]) continue;
//     visited[u] = true;
//     if (u === endIdx) break;
//     for (const { to, weight } of edges[u]) {
//       if (dist[u] + weight < dist[to]) {
//         dist[to] = dist[u] + weight;
//         prev[to] = u;
//         pq.push([dist[to], to]);
//       }
//     }
//   }
//   // Path reconstruction
//   const path = [];
//   for (let at = endIdx; at !== null; at = prev[at]) path.push(at);
//   path.reverse();
//   return { path, distance: dist[endIdx] };
// }

// A* algorithm (Heuristic)
function astar(nodes, edges, startIdx, endIdx) {
  const dist = Array(nodes.length).fill(Infinity);
  const prev = Array(nodes.length).fill(null);
  const visited = Array(nodes.length).fill(false);
  const heuristic = idx => haversine(nodes[idx], nodes[endIdx]);
  dist[startIdx] = 0;

  for (let iter = 0; iter < nodes.length; iter++) {
    let u = -1;
    for (let j = 0; j < nodes.length; j++) {
      if (!visited[j] && (u === -1 || dist[j] + heuristic(j) < dist[u] + heuristic(u))) u = j;
    }
    if (u === -1 || dist[u] === Infinity) break;
    visited[u] = true;
    for (const { to, weight } of edges[u]) {
      if (dist[u] + weight < dist[to]) {
        dist[to] = dist[u] + weight;
        prev[to] = u;
      }
    }
  }
  // Path reconstruct kar re h
  const path = [];
  for (let at = endIdx; at !== null; at = prev[at]) path.push(at);
  path.reverse();
  return { path, distance: dist[endIdx] };
}

// Bellman-Ford algorithm (Negative weights ke liye bhi kaam karta hai)
function bellmanFord(nodes, edges, startIdx, endIdx) {
  const dist = Array(nodes.length).fill(Infinity);
  const prev = Array(nodes.length).fill(null);
  dist[startIdx] = 0;

  for (let i = 0; i < nodes.length - 1; i++) {
    for (let u = 0; u < nodes.length; u++) {
      for (const { to, weight } of edges[u]) {
        if (dist[u] + weight < dist[to]) {
          dist[to] = dist[u] + weight;
          prev[to] = u;
        }
      }
    }
  }
  // Path ko reconstruct kar rahe hain
  const path = [];
  for (let at = endIdx; at !== null; at = prev[at]) path.push(at);
  path.reverse();
  return { path, distance: dist[endIdx] };
}

exports.getShortestPaths = async (req, res) => {
  const { source, destination } = req.body;
  const apiKey = process.env.GOOGLE_MAPS_API;

  try {
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

    // first route ko graph banane ke liye use kar rahe hain
    const route = directionsRes.data.routes[0];
    const coordinates = polyline.decode(route.overview_polyline.points).map(([lat, lng]) => ({ lat, lng }));
    const nodes = coordinates;
    // Har node ke liye uske adjacent nodes aur unka distance 
    const edges = nodes.map((_, i) => {
      const adj = [];
      if (i > 0) adj.push({ to: i - 1, weight: haversine(nodes[i], nodes[i - 1]) });
      if (i < nodes.length - 1) adj.push({ to: i + 1, weight: haversine(nodes[i], nodes[i + 1]) });
      return adj;
    });

    // saare algorithms ko run kar re
    const dijkstraResult = dijkstra(nodes, edges, 0, nodes.length - 1);
    const astarResult = astar(nodes, edges, 0, nodes.length - 1);
    const bellmanResult = bellmanFord(nodes, edges, 0, nodes.length - 1);

    // saare result compare kar re
    const allResults = [
      { ...dijkstraResult, algo: 'Dijkstra' },
      { ...astarResult, algo: 'A*' },
      { ...bellmanResult, algo: 'Bellman-Ford' },
    ];
    const best = allResults.reduce((min, r) => (r.distance < min.distance ? r : min), allResults[0]);

    // Frontend ke liye path ko ready kar rahe hain
    const bestPath = best.path.map(idx => nodes[idx]);
    const totalDistance = best.distance;
    const AVG_SPEED = 40 * 1000 / 3600; // Average speed (m/s)
    const totalTime = totalDistance / AVG_SPEED;
    const totalFuel = totalDistance / 15000; // Fuel estimate

    let paths = [
      {
        label: `Best Path (${best.algo})`,
        color: '#00f',
        coordinates: bestPath,
        distance: (totalDistance / 1000).toFixed(2), // km
        time: (totalTime / 60).toFixed(1), // minutes
        fuel: totalFuel.toFixed(2),
        algorithm: best.algo,
      },
    ];

    // Agar sirf ek hi path hai toh ek fake alternate bhi bana rahe hain (visual difference ke liye)
    if (paths.length === 1) {
      const original = paths[0];
      const offset = 0.001; // ~100m ka offset
      const offsetCoordinates = original.coordinates.map((coord, idx, arr) => {
        if (idx === 0 || idx === arr.length - 1) {
          return {
            lat: coord.lat + offset,
            lng: coord.lng,
          };
        } else {
          const prev = arr[idx - 1];
          const next = arr[idx + 1];
          const dx = next.lng - prev.lng;
          const dy = next.lat - prev.lat;
          const perpLat = -dx;
          const perpLng = dy;
          const length = Math.sqrt(perpLat * perpLat + perpLng * perpLng);
          return {
            lat: coord.lat + (offset * perpLat) / length,
            lng: coord.lng + (offset * perpLng) / length,
          };
        }
      });
      paths.push({
        label: 'Alternate Route',
        color: '#FFA500',
        coordinates: offsetCoordinates,
        distance: original.distance,
        time: original.time,
        fuel: original.fuel,
        algorithm: 'Fake Alternate',
      });
    }

    res.json({
      center: bestPath[0] || { lat: 0, lng: 0 },
      paths,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch or process directions' });
  }
};