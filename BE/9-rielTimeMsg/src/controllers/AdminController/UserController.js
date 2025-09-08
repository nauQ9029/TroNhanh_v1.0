const User = require('../../models/User');
const AuditLog = require('../../models/AuditLog');
const Payment = require('../../models/Payment');

// Helper function to log admin actions
const logAdminAction = async (adminId, action, targetUserId, description, oldData = null, newData = null, req = null) => {
  try {
    const logData = {
      adminId,
      action,
      targetUserId,
      description,
      oldData,
      newData
    };

    if (req) {
      logData.ipAddress = req.ip || req.connection.remoteAddress;
      logData.userAgent = req.get('User-Agent');
    }

    await AuditLog.create(logData);
  } catch (error) {
    console.error('Error logging admin action:', error);
  }
};

// UC-Admin-01: View User List
// Business Rules: BR-VUL-01 to BR-VUL-05
const getAllUsers = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20, // BR-VUL-01: Default 20 users per page
      role,
      status,
      gender,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      search
    } = req.query;

    // BR-VUL-02: Role Filter Rule
    const filter = {};
    if (role) {
      const validRoles = ['admin', 'owner', 'customer'];
      if (validRoles.includes(role.toLowerCase())) {
        filter.role = role.toLowerCase();
      }
    }

    if (status) filter.status = status;
    if (gender) filter.gender = gender;

    // Add membership filter
    if (req.query.membership) {
      const validMemberships = ['active', 'inactive', 'none'];
      if (validMemberships.includes(req.query.membership.toLowerCase())) {
        filter.isMembership = req.query.membership.toLowerCase();
      }
    }

    // BR-VUL-03: Search Capability Rule (name, email, phone)
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }

    // BR-VUL-01: Pagination Limit Rule
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit))); // Max 50 per page
    const skip = (pageNum - 1) * limitNum;

    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // BR-VUL-04: Account Status Display Rule (show locked users)
    const users = await User.find(filter)
      .select('-password')
      .sort(sort)
      .skip(skip)
      .limit(limitNum)
      .lean();

    const totalUsers = await User.countDocuments(filter);
    const totalPages = Math.ceil(totalUsers / limitNum);

    const stats = await getUserStats();

    // Log admin action
    await logAdminAction(
      req.user?.id,
      'VIEW_USER_LIST',
      null,
      `Viewed user list with filters: ${JSON.stringify(filter)}`,
      null,
      null,
      req
    );

    res.status(200).json({
      success: true,
      message: 'Users retrieved successfully',
      data: {
        users,
        pagination: {
          currentPage: pageNum,
          totalPages,
          totalUsers,
          limit: limitNum,
          hasNextPage: pageNum < totalPages,
          hasPrevPage: pageNum > 1
        },
        statistics: stats,
        filters: {
          role,
          status,
          gender,
          membership: req.query.membership,
          search
        }
      }
    });

  } catch (error) {
    console.error('Error getting all users:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Get user statistics
const getUserStats = async () => {
  try {
    // Tổng số User
    const totalUsers = await User.countDocuments();

    // Tổng số Owner
    const totalOwners = await User.countDocuments({
      role: { $regex: /^owner$/i }
    });

    // Tổng số Customer (case-insensitive)
    const totalCustomers = await User.countDocuments({
      role: { $regex: /^customer$/i }
    });

    // Tổng số Membership (users có membership active)
    const totalMembership = await User.countDocuments({ isMembership: 'active' });

    // Tổng số tài khoản bị lock (status = banned)
    const totalLockedAccounts = await User.countDocuments({ status: 'banned' });

    return {
      totalUsers,
      totalOwners,
      totalCustomers,
      totalMembership,
      totalLockedAccounts
    };

  } catch (error) {
    console.error('Error getting user stats:', error);
    return {
      totalUsers: 0,
      totalOwners: 0,
      totalCustomers: 0,
      totalMembership: 0,
      totalLockedAccounts: 0
    };
  }
};

// Get user statistics endpoint
const getUserStatsEndpoint = async (req, res) => {
  try {
    console.log('getUserStatsEndpoint called');
    const stats = await getUserStats();

    res.status(200).json({
      success: true,
      message: 'User statistics retrieved successfully',
      data: stats
    });
  } catch (error) {
    console.error('Error in getUserStatsEndpoint:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'User retrieved successfully',
      data: user
    });

  } catch (error) {
    console.error('Error getting user by ID:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// UC-Admin-02: Lock/Unlock User
// Business Rules: BR-LOA-01 to BR-LOA-05
const lockUnlockUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { action } = req.body; // 'lock' or 'unlock'
    const adminId = req.user?.id;

    // BR-LOA-01: Admin Authorization Rule
    if (!adminId) {
      return res.status(401).json({
        success: false,
        message: 'Admin authorization required'
      });
    }

    // Validate action
    if (!['lock', 'unlock'].includes(action)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid action. Must be "lock" or "unlock"'
      });
    }

    const targetUser = await User.findById(id);
    if (!targetUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // BR-LOA-02: Self-lock Prevention Rule
    if (targetUser._id.toString() === adminId && action === 'lock') {
      return res.status(400).json({
        success: false,
        message: 'Cannot lock your own admin account'
      });
    }

    const oldStatus = targetUser.status;
    const newStatus = action === 'lock' ? 'inactive' : 'active';

    // BR-LOA-04: Lock Retains User Data Rule (no data deletion)
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { status: newStatus },
      { new: true, runValidators: true }
    ).select('-password');

    // BR-LOA-05: Lock Action Logging Rule
    await logAdminAction(
      adminId,
      action === 'lock' ? 'LOCK_USER' : 'UNLOCK_USER',
      id,
      `${action === 'lock' ? 'Locked' : 'Unlocked'} user: ${targetUser.email}`,
      { status: oldStatus },
      { status: newStatus },
      req
    );

    res.status(200).json({
      success: true,
      message: `User ${action === 'lock' ? 'locked' : 'unlocked'} successfully`,
      data: updatedUser
    });

  } catch (error) {
    console.error('Error locking/unlocking user:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// UC-Admin-03: Edit User Information
// Business Rules: BR-EAI-01 to BR-EAI-05
const editUserInfo = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, gender, role } = req.body;
    const adminId = req.user?.id;

    // BR-EAI-01: Edit Authorization Rule
    if (!adminId) {
      return res.status(401).json({
        success: false,
        message: 'Admin authorization required'
      });
    }

    const targetUser = await User.findById(id);
    if (!targetUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Store old data for logging
    const oldData = {
      name: targetUser.name,
      email: targetUser.email,
      phone: targetUser.phone,
      gender: targetUser.gender,
      role: targetUser.role,
    };

    // BR-EAI-02: Input Validation Rule
    const updateData = {};

    if (name !== undefined) {
      if (!name || name.trim().length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Name cannot be empty'
        });
      }
      updateData.name = name.trim();
    }

    if (email !== undefined) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid email format'
        });
      }

      // BR-EAI-03: Unique Information Rule
      const existingUser = await User.findOne({
        email: email.toLowerCase(),
        _id: { $ne: id }
      });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Email already exists'
        });
      }
      updateData.email = email.toLowerCase();
    }

    if (phone !== undefined) {
      if (!phone || phone.trim().length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Phone cannot be empty'
        });
      }

      // BR-EAI-03: Unique Information Rule
      const existingUser = await User.findOne({
        phone: phone.trim(),
        _id: { $ne: id }
      });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Phone number already exists'
        });
      }
      updateData.phone = phone.trim();
    }

    if (gender !== undefined) {
      if (!['male', 'female', 'other'].includes(gender.toLowerCase())) {
        return res.status(400).json({
          success: false,
          message: 'Invalid gender. Must be male, female, or other'
        });
      }
      updateData.gender = gender.toLowerCase();
    }

    if (role !== undefined) {
      if (!['admin', 'owner', 'customer'].includes(role.toLowerCase())) {
        return res.status(400).json({
          success: false,
          message: 'Invalid role. Must be admin, owner, or customer'
        });
      }
      updateData.role = role.toLowerCase();
    }

    // Check if there are actual changes
    const hasChanges = Object.keys(updateData).some(key =>
      updateData[key] !== oldData[key]
    );

    if (!hasChanges) {
      return res.status(400).json({
        success: false,
        message: 'No changes detected'
      });
    }

    // BR-EAI-04: Real-time Sync Rule - Update immediately
    const updatedUser = await User.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    // BR-EAI-05: Edit Action Logging Rule
    await logAdminAction(
      adminId,
      'EDIT_USER',
      id,
      `Edited user information: ${targetUser.email}`,
      oldData,
      updateData,
      req
    );

    res.status(200).json({
      success: true,
      message: 'User information updated successfully',
      data: updatedUser
    });

  } catch (error) {
    console.error('Error editing user info:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// UC-Admin-04: Delete User Account
// Business Rules: BR-DUA-01 to BR-DUA-05
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { confirm } = req.body;
    const adminId = req.user?.id;

    // BR-DUA-02: Delete Confirmation Rule
    if (!confirm || confirm !== 'DELETE') {
      return res.status(400).json({
        success: false,
        message: 'Delete confirmation required. Send { "confirm": "DELETE" } in request body'
      });
    }

    const targetUser = await User.findById(id);
    if (!targetUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Store user data for logging
    const userData = {
      name: targetUser.name,
      email: targetUser.email,
      phone: targetUser.phone,
      role: targetUser.role,
      isMembership: targetUser.isMembership
    };

    // BR-DUA-03: Soft Delete Rule
    const deletedUser = await User.findByIdAndUpdate(
      id,
      {
        status: 'inactive',
        deletedAt: new Date(),
        // Keep original data but mark as deleted
        isDeleted: true
      },
      { new: true }
    ).select('-password');

    // BR-DUA-05: Delete Action Logging Rule
    await logAdminAction(
      adminId,
      'DELETE_USER',
      id,
      `Deleted user account: ${targetUser.email}`,
      userData,
      { status: 'inactive', isDeleted: true },
      req
    );

    res.status(200).json({
      success: true,
      message: 'User account deleted successfully (soft delete)',
      data: deletedUser
    });

  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Get audit logs for admin actions
const getAuditLogs = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      action,
      adminId,
      targetUserId,
      startDate,
      endDate
    } = req.query;

    const filter = {};

    if (action) filter.action = action;
    if (adminId) filter.adminId = adminId;
    if (targetUserId) filter.targetUserId = targetUserId;

    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const logs = await AuditLog.find(filter)
      .populate('adminId', 'name email role')
      .populate('targetUserId', 'name email role')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const totalLogs = await AuditLog.countDocuments(filter);
    const totalPages = Math.ceil(totalLogs / parseInt(limit));

    res.status(200).json({
      success: true,
      message: 'Audit logs retrieved successfully',
      data: {
        logs,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalLogs,
          hasNextPage: parseInt(page) < totalPages,
          hasPrevPage: parseInt(page) > 1
        }
      }
    });

  } catch (error) {
    console.error('Error getting audit logs:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Export all functions
module.exports = {
  getAllUsers,
  getUserStats,
  getUserStatsEndpoint,
  getUserById,
  lockUnlockUser,
  editUserInfo,
  deleteUser,
  getAuditLogs
};