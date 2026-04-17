const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

module.exports = async (req, res) => {
  // تفعيل CORS للسماح بالطلبات من بلوجر
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { public_id, action, resource_type } = req.body;
    const type = resource_type || 'image';

    if (action === 'approve') {
      // إزالة علامة الانتظار وإضافة علامة الموافقة للنشر في الرئيسية
      await cloudinary.uploader.remove_tag('pending', [public_id], { resource_type: type });
      await cloudinary.uploader.add_tag('approved', [public_id], { resource_type: type });
      return res.status(200).json({ success: true, message: 'Status updated to approved' });
    } 
    
    if (action === 'delete') {
      // حذف الصورة نهائياً من كلاوديناري لتختفي من الموقع
      await cloudinary.uploader.destroy(public_id, { resource_type: type });
      return res.status(200).json({ success: true, message: 'Status updated to rejected' });
    }

    res.status(400).json({ error: 'Invalid action' });
  } catch (error) {
    console.error('Cloudinary Error:', error);
    res.status(500).json({ error: error.message });
  }
};
