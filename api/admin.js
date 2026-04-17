const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: 'du7xhf1no',
  api_key: '646797828691535',
  api_secret: 'Z_rA0K16O4VlYI08D-vAun2m5_M'
});

module.exports = async (req, res) => {
  // إعدادات الوصول (CORS) لضمان اتصال الـ Html بالسيرفر
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
      // نقل الصورة من قائمة الانتظار للموافقة (approved)
      await cloudinary.uploader.add_tag('approved', [public_id], { resource_type: type });
      await cloudinary.uploader.remove_tag('pending', [public_id], { resource_type: type });
      return res.status(200).json({ success: true, message: 'تمت الموافقة بنجاح' });
    } 
    
    if (action === 'delete') {
      // حذف الصورة/الفيديو نهائياً من Cloudinary
      const result = await cloudinary.uploader.destroy(public_id, { resource_type: type });
      return res.status(200).json({ success: true, message: 'تم الحذف نهائياً', result });
    }

    res.status(400).json({ error: 'Action غير صالح' });
  } catch (error) {
    console.error('Cloudinary Error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};
