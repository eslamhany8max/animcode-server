const cloudinary = require('cloudinary').v2;
cloudinary.config({
cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
api_key: process.env.CLOUDINARY_API_KEY,
api_secret: process.env.CLOUDINARY_API_SECRET
});
export default async function handler(req, res) {
if (req.method !== 'POST') {
return res.status(405).json({ error: 'Method not allowed' });
}
const { public_id, action, resource_type } = req.body;
try {
if (action === 'approve') {
const result = await cloudinary.uploader.add_tag('approved', [public_id], {
resource_type: resource_type || 'image'
});
await cloudinary.uploader.remove_tag('pending', [public_id], {
resource_type: resource_type || 'image'
});
return res.status(200).json({ success: true, result });
} else if (action === 'delete') {
const result = await cloudinary.uploader.destroy(public_id, {
resource_type: resource_type || 'image'
});
return res.status(200).json({ success: true, result });
} else {
return res.status(400).json({ error: 'Invalid action' });
}
} catch (error) {
return res.status(500).json({ success: false, error: error.message });
}
}
