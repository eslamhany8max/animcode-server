const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

module.exports = async (req, res) => {
  // إعدادات CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { public_id, action } = req.body || {};

  if (!public_id || !action) {
    return res.status(200).json({ status: "server_online", message: "Send data to work" });
  }

  try {
    const tag = action === 'approve' ? 'approved' : 'rejected';
    await cloudinary.uploader.replace_tag(tag, [public_id]);
    res.status(200).json({ success: true, message: `Post ${tag}` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
