const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: 'du7xhf1no',
  api_key: '646797828691535',
  api_secret: 'Z_rA0K16O4VlYI08D-vAun2m5_M'
});

export default async function handler(req, res) {
  // تفعيل الـ CORS للسماح لبلوجر بالاتصال
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { public_id, action, resource_type } = req.body;
  
  // التأكد من نوع الملف (صورة أو فيديو) لأن كلاوديناري تتطلب ذلك
  const rType = resource_type || 'image';

  try {
    if (action === 'approve') {
      // 1. إضافة تاغ approved
      await cloudinary.uploader.add_tag('approved', [public_id], { resource_type: rType });
      // 2. إزالة تاغ pending
      await cloudinary.uploader.remove_tag('pending', [public_id], { resource_type: rType });
      
      return res.status(200).json({ success: true, message: 'Status updated to approved' });
    } 
    
    if (action === 'delete') {
      // حذف الملف نهائياً من السيرفر
      const result = await cloudinary.uploader.destroy(public_id, { resource_type: rType });
      return res.status(200).json({ success: true, message: 'Deleted successfully', result });
    }

    return res.status(400).json({ error: 'Invalid action' });

  } catch (error) {
    console.error('Cloudinary Error:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
}
