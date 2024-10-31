// controllers/profileController.js
const Profile = require('../model/profile');
  
exports.getProfile = async (req, res) => {
  try {
    const profile = await Profile.findById(req.user.id);
    if (!profile) return res.status(404).json({ message: 'Profile not found' });
    res.status(200).json({ fullName: profile.fullName, email: profile.email, role: profile.role });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
