const cloudinary = require('cloudinary').v2;

// إعداد الاتصال بـ Cloudinary باستخدام المتغيرات السرية
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export default async function handler(req, res) {
  // إعدادات السماح بالاتصال من موقعك (CORS)
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  // معالجة طلبات التمهيد (Preflight)
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // التأكد من وجود البيانات المطلوبة في الطلب
  const { public_id, action, resource_type } = req.body;
  
  if (!public_id || !action) {
    return res.status(400).json({ error: 'Missing data' });
  }

  try {
    if (action === 'approve') {
      // عند القبول: نقوم بتغيير التاج إلى approved لكي يظهر للجميع
      await cloudinary.uploader.replace_tag('approved', [public_id], { 
        resource_type: resource_type || 'image' 
      });
      return res.status(200).json({ success: true, message: 'Post Approved' });
    } 
    
    if (action === 'delete') {
      // عند الرفض: نقوم بتغيير التاج إلى rejected لكي يختفي من لوحة التحكم
      await cloudinary.uploader.replace_tag('rejected', [public_id], { 
        resource_type: resource_type || 'image' 
      });
      return res.status(200).json({ success: true, message: 'Post Hidden' });
    }

    res.status(400).json({ error: 'Invalid action' });
  } catch (error) {
    // في حالة حدوث خطأ، نرسل تفاصيل الخطأ بدلاً من مجرد 500
    res.status(500).json({ success: false, error: error.message });
  }
}
