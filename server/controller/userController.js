import User from '../models/User.js';

export const getAllUsersExceptCurrent = async (req, res) => {
  try {
    const users = await User.find({ _id: { $ne: req.user._id } }).select('username email');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};