const cloudinary = require('cloudinary').v2;

// إعداد الإتصال بكلاوديناري
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

module.exports = async (req, res) => {
  // للسماح لبلوجر بالاتصال بالسيرفر بدون حظر (CORS)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // إذا تم فتح الرابط من المتصفح مباشرة (للاختبار)
  if (req.method === 'GET') {
    return res.status(200).json({ 
      status: "online", 
      message: "Server is running perfectly!" 
    });
  }

  const { public_id, action } = req.body || {};

  if (!public_id || !action) {
    return res.status(400).json({ error: "Missing public_id or action" });
  }

  try {
    const tag = action === 'approve' ? 'approved' : 'rejected';
    await cloudinary.uploader.replace_tag(tag, [public_id]);
    return res.status(200).json({ success: true, message: `Status updated to ${tag}` });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
