const axios = require("axios");

exports.getOptimizedRoute = async (req, res) => {
  try {
    const { coordinates } = req.body;
    // coordinates = [[lng1, lat1], [lng2, lat2], [lng3, lat3]]

    const url = "https://api.openrouteservice.org/v2/directions/driving-car/geojson";

    const response = await axios.post(
      url,
      {
        coordinates,
      },
      {
        headers: {
          Authorization: process.env.ORS_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    const route = response.data;

    res.json({
      distance: route.features[0].properties.segments[0].distance, // meters
      duration: route.features[0].properties.segments[0].duration, // seconds
      geometry: route.features[0].geometry, // GeoJSON
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};