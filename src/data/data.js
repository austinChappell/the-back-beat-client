const devAPI = 'http://localhost:6001';
const prodAPI = 'https://back-beat-server.herokuapp.com';
const apiURL = process.env.NODE_ENV === 'development' ? devAPI : prodAPI;
// const apiURL = prodAPI;

const data = {
  apiURL,
  defaultProfilePhoto:
    'http://res.cloudinary.com/dsjyqaulz/image/upload/v1509814626/profile_image_placeholder_kn7eon.png',
  dfwCoords: {
    maxLat: 33.5,
    minLat: 32.35,
    maxLong: -96.35,
    minLong: -97.7,
  },
};

export default data;
