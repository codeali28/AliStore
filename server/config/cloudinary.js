const cloudinary = require('cloudinary').v2;

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'ns6ax25y', 
  api_key: process.env.CLOUDINARY_API_KEY || '534266697845143', 
  api_secret: process.env.CLOUDINARY_API_SECRET || 'LJdbGhHiaCaaNeCyfpc52YRskPU'
});

module.exports = { cloudinary }


