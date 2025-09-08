// file TroNhanh_BE/src/controllers/AdminController/MembershipController.js
const MembershipPackage = require('../../models/MembershipPackage');
const AuditLog = require('../../models/AuditLog');

//Create Membership Package
exports.createMembershipPackage = async (req, res) => {
  try {
    // Check if req.body exists
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ message: 'Request body is required' });
    }

    const { packageName, price, duration, description, postsAllowed, features } = req.body;

    // Validation
    if (!packageName || !price || !duration || !description || !postsAllowed) {
      return res.status(400).json({
        message: 'Missing required fields: packageName, price, duration, description, postsAllowed'
      });
    }

    // BR-CMP-02: Valid Price Range
    if (price <= 0) {
      return res.status(400).json({ message: 'Price must be greater than 0' });
    }

    if (price > 999999) {
      return res.status(400).json({ message: 'Price exceeds maximum limit' });
    }

    // Additional validations
    if (duration < 1) {
      return res.status(400).json({ message: 'Duration must be at least 1 day' });
    }

    if (postsAllowed < 1) {
      return res.status(400).json({ message: 'Posts allowed must be at least 1' });
    }

    // Check for duplicate package name (BR-CMP-01)
    const existingPackage = await MembershipPackage.findOne({
      packageName: { $regex: new RegExp(`^${packageName}$`, 'i') }
    });

    if (existingPackage) {
      return res.status(400).json({ message: 'Package name already exists' });
    }

    // Create new membership package
    const newPackage = new MembershipPackage({
      packageName: packageName.trim(),
      price,
      duration,
      description: description.trim(),
      postsAllowed,
      features: features || [],
      createdBy: req.user._id
    });

    await newPackage.save();

    // Log the action
    await AuditLog.create({
      adminId: req.user._id,
      action: 'CREATE_MEMBERSHIP_PACKAGE',
      description: `Created membership package: ${packageName}`,
      newData: {
        packageName: newPackage.packageName,
        price: newPackage.price,
        duration: newPackage.duration,
        postsAllowed: newPackage.postsAllowed
      }
    });

    res.status(201).json({
      message: 'Membership package created successfully',
      data: newPackage
    });

  } catch (err) {
    console.error('[CREATE MEMBERSHIP PACKAGE ERROR]', err);

    // Handle duplicate key error
    if (err.code === 11000) {
      return res.status(400).json({ message: 'Package name already exists' });
    }

    // Handle validation errors
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ message: errors.join(', ') });
    }

    res.status(500).json({ message: 'Server error' });
  }
};

// Get all membership packages (for admin management)
exports.getAllMembershipPackages = async (req, res) => {
  try {
    const { page = 1, limit = 20, isActive, includeDeleted = 'false' } = req.query;

    const filter = {};

    // Exclude deleted packages by default
    if (includeDeleted === 'false') {
      filter.isDeleted = false;
    }

    if (isActive !== undefined) {
      filter.isActive = isActive === 'true';
    }

    const packages = await MembershipPackage.find(filter)
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await MembershipPackage.countDocuments(filter);

    res.status(200).json({
      total,
      page: parseInt(page),
      pageSize: packages.length,
      packages
    });

  } catch (err) {
    console.error('[GET MEMBERSHIP PACKAGES ERROR]', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Cho Owner hoặc người dùng public truy cập
exports.getPublicMembershipPackages = async (req, res) => {
  try {
    const packages = await MembershipPackage.find({
      isDeleted: false,
      isActive: true
    }).sort({ createdAt: -1 });

    res.status(200).json({ success: true, packages });
  } catch (err) {
    console.error('[GET PUBLIC MEMBERSHIP PACKAGES ERROR]', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};



// Get single membership package details
exports.getMembershipPackageById = async (req, res) => {
  try {
    const package = await MembershipPackage.findById(req.params.id)
      .populate('createdBy', 'name email');

    if (!package) {
      return res.status(404).json({ message: 'Membership package not found' });
    }

    // Check if package is deleted
    if (package.isDeleted) {
      return res.status(404).json({ message: 'Membership package has been deleted' });
    }

    res.status(200).json(package);

  } catch (err) {
    console.error('[GET MEMBERSHIP PACKAGE ERROR]', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update membership package
exports.updateMembershipPackage = async (req, res) => {
  try {
    // Check if req.body exists
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ message: 'Request body is required' });
    }

    const { packageName, price, duration, description, postsAllowed, features, isActive } = req.body;

    const package = await MembershipPackage.findById(req.params.id);
    if (!package) {
      return res.status(404).json({ message: 'Membership package not found' });
    }

    // Check if package is deleted
    if (package.isDeleted) {
      return res.status(400).json({ message: 'Cannot update a deleted membership package' });
    }

    // Store old data for audit log
    const oldData = {
      packageName: package.packageName,
      price: package.price,
      duration: package.duration,
      description: package.description,
      postsAllowed: package.postsAllowed,
      isActive: package.isActive
    };

    // Validate price if provided
    if (price !== undefined) {
      if (price <= 0) {
        return res.status(400).json({ message: 'Price must be greater than 0' });
      }
      if (price > 999999) {
        return res.status(400).json({ message: 'Price exceeds maximum limit' });
      }
    }

    // Check for duplicate package name if name is being changed
    if (packageName && packageName !== package.packageName) {
      const existingPackage = await MembershipPackage.findOne({
        packageName: { $regex: new RegExp(`^${packageName}$`, 'i') },
        _id: { $ne: req.params.id }
      });

      if (existingPackage) {
        return res.status(400).json({ message: 'Package name already exists' });
      }
    }

    // Update fields
    if (packageName) package.packageName = packageName.trim();
    if (price !== undefined) package.price = price;
    if (duration !== undefined) package.duration = duration;
    if (description) package.description = description.trim();
    if (postsAllowed !== undefined) package.postsAllowed = postsAllowed;
    if (features !== undefined) package.features = features;
    if (isActive !== undefined) package.isActive = isActive;

    await package.save();

    // Log the action
    await AuditLog.create({
      adminId: req.user._id,
      action: 'UPDATE_MEMBERSHIP_PACKAGE',
      description: `Updated membership package: ${package.packageName}`,
      oldData,
      newData: {
        packageName: package.packageName,
        price: package.price,
        duration: package.duration,
        postsAllowed: package.postsAllowed,
        isActive: package.isActive
      }
    });

    res.status(200).json({
      message: 'Membership package updated successfully',
      data: package
    });

  } catch (err) {
    console.error('[UPDATE MEMBERSHIP PACKAGE ERROR]', err);

    if (err.code === 11000) {
      return res.status(400).json({ message: 'Package name already exists' });
    }

    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ message: errors.join(', ') });
    }

    res.status(500).json({ message: 'Server error' });
  }
};

// Delete (soft delete) membership package
exports.deleteMembershipPackage = async (req, res) => {
  try {
    const package = await MembershipPackage.findById(req.params.id);
    if (!package) {
      return res.status(404).json({ message: 'Membership package not found' });
    }

    // Check if already deleted
    if (package.isDeleted) {
      return res.status(400).json({ message: 'Membership package has already been deleted' });
    }

    // Soft delete by setting isDeleted to true
    package.isDeleted = true;
    package.isActive = false; // Also deactivate when deleted
    await package.save();

    // Log the action
    await AuditLog.create({
      adminId: req.user._id,
      action: 'DELETE_MEMBERSHIP_PACKAGE',
      description: `Deleted membership package: ${package.packageName}`
    });

    res.status(200).json({
      message: 'Membership package deleted successfully'
    });

  } catch (err) {
    console.error('[DELETE MEMBERSHIP PACKAGE ERROR]', err);
    res.status(500).json({ message: 'Server error' });
  }
};