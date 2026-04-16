const express = require('express');
const router = express.Router();
const cloudinary = require('cloudinary').v2;

// إعدادات كلاوديناري كما هي في مشروعك
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// وظيفة الموافقة ونقله للصفحة الرئيسية
router.post('/approve/:id', async (req, res) => {
  try {
    const itemId = req.params.id;
    // تحديث الحالة في قاعدة البيانات لتصبح معتمدة وتظهر في الرئيسية
    const updatedItem = await Item.findByIdAndUpdate(
      itemId,
      { status: 'approved', isVisible: true },
      { new: true }
    );

    if (!updatedItem) {
      return res.status(404).json({ success: false, message: "Item not found" });
    }

    res.json({ success: true, message: "Status updated to approved" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// وظيفة الحذف النهائي من الموقع
router.delete('/delete/:id', async (req, res) => {
  try {
    const itemId = req.params.id;
    const item = await Item.findById(itemId);

    if (!item) {
      return res.status(404).json({ success: false, message: "Item not found" });
    }

    // إذا كان هناك ملف مرفوع على كلاوديناري يتم حذفه أولاً
    if (item.cloudinary_id) {
      await cloudinary.uploader.destroy(item.cloudinary_id);
    }

    // حذف السجل نهائياً من قاعدة البيانات
    await Item.findByIdAndDelete(itemId);

    res.json({ success: true, message: "Status updated to rejected" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
