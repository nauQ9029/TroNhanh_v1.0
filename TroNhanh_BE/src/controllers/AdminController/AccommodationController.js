// UC-Admin-07: Admin soft delete (mark as deleted) an offending post
const AuditLog = require('../../models/AuditLog');
exports.deleteAccommodationAdmin = async (req, res) => {
  try {
    const { reason } = req.body;
    if (!reason) {
      return res.status(400).json({ message: 'Reason for deletion is required.' });
    }
    // Only allow delete if not already deleted
    const acc = await Accommodation.findById(req.params.id);
    if (!acc) {
      return res.status(404).json({ message: 'Post no longer exists.' });
    }
    if (acc.approvedStatus === 'deleted') {
      return res.status(400).json({ message: 'Post has already been deleted.' });
    }
    
    // Check if accommodation has a customer (is currently rented/booked)
    if (acc.customerId) {
      return res.status(400).json({ 
        message: 'Cannot delete accommodation that is currently rented by a customer. Please wait until the rental period ends.' 
      });
    }
    
    acc.approvedStatus = 'deleted';
    acc.deletedReason = reason;
    acc.status = 'Unavailable'; // Set status to valid enum value when deleting
    await acc.save();
    // Log the action (BR-DOP-03)
    await AuditLog.create({
      adminId: req.user?._id, // assuming req.user is set by adminAuth
      action: 'delete_accommodation',
      targetAccommodationId: acc._id,
      description: `Deleted by admin. Reason: ${reason}`,
      timestamp: new Date()
    });
    res.status(200).json({ message: 'Accommodation post deleted (soft delete).', data: acc });
  } catch (err) {
    console.error('[ADMIN DELETE ACCOMMODATION ERROR]', err);
    res.status(500).json({ message: 'Server error' });
  }
};
// UC-Admin-Approve: Admin approve/reject accommodation post
exports.approveAccommodationAdmin = async (req, res) => {
  try {
    const { approvedStatus, rejectedReason } = req.body;
    if (!['approved', 'rejected'].includes(approvedStatus)) {
      return res.status(400).json({ message: 'Invalid approvedStatus. Must be "approved" or "rejected".' });
    }
    const update = {
      approvedStatus,
      isApproved: approvedStatus === 'approved',
      approvedAt: approvedStatus === 'approved' ? new Date() : null,
      rejectedReason: approvedStatus === 'rejected' ? (rejectedReason || '') : '',
    };
    const acc = await Accommodation.findByIdAndUpdate(
      req.params.id,
      update,
      { new: true }
    ).populate('ownerId', 'name email address');
    if (!acc) {
      return res.status(404).json({ message: 'Post no longer exists.' });
    }
    res.status(200).json({ message: 'Accommodation post updated.', data: acc });
  } catch (err) {
    console.error('[ADMIN APPROVE ACCOMMODATION ERROR]', err);
    res.status(500).json({ message: 'Server error' });
  }
};
// UC-Admin-06: Admin view accommodation post details
exports.getAccommodationDetailAdmin = async (req, res) => {
  try {
    const acc = await Accommodation.findById(req.params.id)
      .populate('ownerId', 'name email address') // add address if present in User model
      .populate('customerId', 'name email');
    if (!acc) {
      return res.status(404).json({ message: 'Post no longer exists.' });
    }
    // Optionally, check if acc.location matches acc.ownerId.address here (BR-BP-02)
    res.status(200).json(acc);
  } catch (err) {
    console.error('[ADMIN GET ACCOMMODATION DETAIL ERROR]', err);
    res.status(500).json({ message: 'Server error' });
  }
};
const Accommodation = require('../../models/Accommodation');
const User = require('../../models/User');

// UC-Admin-05: Admin view all accommodation posts with filters and pagination
exports.getAllAccommodationsAdmin = async (req, res) => {
  try {
    let {
      page = 1,
      limit = 20,
      owner,
      status,
      fromDate,
      toDate,
      search
    } = req.query;

    page = parseInt(page);
    limit = Math.min(parseInt(limit), 20); // Max 20 per page

    const filter = {};
    if (owner) {
      // Allow search by owner name or id
      const ownerRegex = new RegExp(owner, 'i');
      const owners = await User.find({ $or: [
        { _id: owner },
        { name: ownerRegex },
        { email: ownerRegex }
      ] }, '_id');
      filter.ownerId = { $in: owners.map(u => u._id) };
    }
    if (status) {
      filter.status = status;
    }
    if (fromDate || toDate) {
      filter.createdAt = {};
      if (fromDate) filter.createdAt.$gte = new Date(fromDate);
      if (toDate) filter.createdAt.$lte = new Date(toDate);
    }
    if (search) {
      filter.title = { $regex: search, $options: 'i' };
    }

    const total = await Accommodation.countDocuments(filter);
    const accommodations = await Accommodation.find(filter)
      .populate('ownerId', 'name email')
      .populate('customerId', 'name email')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .select('title ownerId status isApproved approvedStatus approvedAt rejectedReason deletedReason price customerId location photos createdAt updatedAt');

    res.status(200).json({
      total,
      page,
      pageSize: accommodations.length,
      accommodations: accommodations.map(acc => ({
        _id: acc._id,
        title: acc.title,
        owner: acc.ownerId ? {
          _id: acc.ownerId._id,
          name: acc.ownerId.name,
          email: acc.ownerId.email
        } : null,
        status: acc.status,
        isApproved: acc.isApproved,
        approvedStatus: acc.approvedStatus,
        approvedAt: acc.approvedAt,
        rejectedReason: acc.rejectedReason,
        deletedReason: acc.deletedReason,
        price: acc.price,
        customer: acc.customerId ? {
          _id: acc.customerId._id,
          name: acc.customerId.name,
          email: acc.customerId.email
        } : null,
        location: acc.location,
        photos: acc.photos,
        createdAt: acc.createdAt,
        updatedAt: acc.updatedAt,
      }))
    });
  } catch (err) {
    console.error('[ADMIN GET ACCOMMODATIONS ERROR]', err);
    res.status(500).json({ message: 'Server error' });
  }
};