const User = require('../models/User');

// GET /api/profile/personal-info
exports.getProfileInfo = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    const userObj = user.toObject();
    if (userObj.avatar && !userObj.avatar.startsWith('http')) {
      userObj.avatar = `${req.protocol}://${req.get('host')}${userObj.avatar}`;
    }
    res.json(userObj);

  } catch (err) {
    next(err);
  }
};
// PUT /api/profile/personal-info
exports.updateUserInfo = async (req, res) => {
  try {
    const userId = req.user.id;
    const updateData = {};

    if (req.body.name) updateData.name = req.body.name;
    if (req.body.phone) updateData.phone = req.body.phone;


    if (req.file) {
      const avatarPath = `${req.protocol}://${req.get('host')}/uploads/avatars/${req.file.filename}`;
      updateData.avatar = avatarPath;
    }


    const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true });

    if (!updatedUser) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    }

    res.json({
      message: 'Cập nhật thành công',
      user: {
        name: updatedUser.name,
        phone: updatedUser.phone,
        email: updatedUser.email,
        avatar: updatedUser.avatar,
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
};