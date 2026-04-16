const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { public_id, action, resource_type } = req.body;

  try {
    if (action === 'approve') {
      await cloudinary.uploader.replace_tag('approved', [public_id], { resource_type: resource_type });
      return res.status(200).json({ success: true, message: 'Published' });
    } 
    
    if (action === 'delete') {
      await cloudinary.uploader.replace_tag('rejected', [public_id], { resource_type: resource_type });
      return res.status(200).json({ success: true, message: 'Hidden' });
    }

    res.status(400).json({ error: 'Invalid action' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}
        
