const Report = require('../../models/Report');
const User = require('../../models/User');
const Accommodation = require('../../models/Accommodation');
const AuditLog = require('../../models/AuditLog');

// UC-Admin-12: Admin view all reports with filters and pagination
exports.getAllReports = async (req, res) => {
  try {
    let {
      page = 1,
      limit = 20,
      status,
      type,
      reportType, // 'customer_report_owner' or 'owner_report_customer'
      reporterId,
      reportedUserId,
      accommodationId,
      fromDate,
      toDate,
      search,
      sortBy = 'createAt',
      sortOrder = 'desc'
    } = req.query;

    page = parseInt(page);
    limit = Math.min(parseInt(limit), 50); // Max 50 per page

    const filter = {};

    // Filter by status
    if (status) {
      filter.status = status;
    }

    // Filter by report type (content type)
    if (type) {
      filter.type = { $regex: type, $options: 'i' };
    }

    // Filter by report category (customer vs owner reports)
    if (reportType) {
      if (reportType === 'customer_report_owner') {
        // Customer reporting owner - reportedUserId should exist and be an owner
        filter.reportedUserId = { $exists: true, $ne: null };
      } else if (reportType === 'owner_report_customer') {
        // Owner reporting customer - reportedUserId should exist and be a customer
        filter.reportedUserId = { $exists: true, $ne: null };
      }
    }

    // Filter by specific reporter
    if (reporterId) {
      filter.reporterId = reporterId;
    }

    // Filter by specific reported user
    if (reportedUserId) {
      filter.reportedUserId = reportedUserId;
    }

    // Filter by accommodation
    if (accommodationId) {
      filter.accommodationId = accommodationId;
    }

    // Date range filter
    if (fromDate || toDate) {
      filter.createAt = {};
      if (fromDate) filter.createAt.$gte = new Date(fromDate);
      if (toDate) filter.createAt.$lte = new Date(toDate);
    }

    // Search in content or admin feedback
    if (search) {
      filter.$or = [
        { content: { $regex: search, $options: 'i' } },
        { adminFeedback: { $regex: search, $options: 'i' } },
        { type: { $regex: search, $options: 'i' } }
      ];
    }

    // Build sort object
    const sortObj = {};
    sortObj[sortBy] = sortOrder === 'asc' ? 1 : -1;

    const total = await Report.countDocuments(filter);
    const reports = await Report.find(filter)
      .populate({
        path: 'reporterId',
        select: 'name email role avatar phone',
        model: 'User'
      })
      .populate({
        path: 'reportedUserId',
        select: 'name email role avatar phone status',
        model: 'User'
      })
      .populate({
        path: 'accommodationId',
        select: 'title location price status approvedStatus',
        model: 'Accommodation'
      })
      .sort(sortObj)
      .skip((page - 1) * limit)
      .limit(limit);

    // Enhanced response with categorized data
    const formattedReports = reports.map(report => {
      const reportData = {
        _id: report._id,
        type: report.type,
        content: report.content,
        status: report.status,
        adminFeedback: report.adminFeedback,
        createAt: report.createAt,
        reporter: report.reporterId ? {
          _id: report.reporterId._id,
          name: report.reporterId.name,
          email: report.reporterId.email,
          role: report.reporterId.role,
          avatar: report.reporterId.avatar,
          phone: report.reporterId.phone
        } : null,
        reportedUser: report.reportedUserId ? {
          _id: report.reportedUserId._id,
          name: report.reportedUserId.name,
          email: report.reportedUserId.email,
          role: report.reportedUserId.role,
          avatar: report.reportedUserId.avatar,
          phone: report.reportedUserId.phone,
          status: report.reportedUserId.status
        } : null,
        accommodation: report.accommodationId ? {
          _id: report.accommodationId._id,
          title: report.accommodationId.title,
          location: report.accommodationId.location,
          price: report.accommodationId.price,
          status: report.accommodationId.status,
          approvedStatus: report.accommodationId.approvedStatus
        } : null
      };

      // Determine report category
      if (report.reporterId && report.reportedUserId) {
        if (report.reporterId.role === 'customer' && report.reportedUserId.role === 'owner') {
          reportData.category = 'customer_report_owner';
        } else if (report.reporterId.role === 'owner' && report.reportedUserId.role === 'customer') {
          reportData.category = 'owner_report_customer';
        } else {
          reportData.category = 'other';
        }
      } else {
        reportData.category = 'general';
      }

      return reportData;
    });

    // Get statistics for dashboard
    const stats = await getReportStatistics(filter);

    res.status(200).json({
      success: true,
      data: {
        reports: formattedReports,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
          hasNextPage: page < Math.ceil(total / limit),
          hasPrevPage: page > 1
        },
        statistics: stats
      },
      message: 'Reports retrieved successfully'
    });

  } catch (error) {
    console.error('[ADMIN GET ALL REPORTS ERROR]', error);
    res.status(500).json({
      success: false,
      message: 'Server error while retrieving reports',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// UC-Admin-13: Admin view report details
exports.getReportById = async (req, res) => {
  try {
    const { id } = req.params;

    const report = await Report.findById(id)
      .populate({
        path: 'reporterId',
        select: 'name email role avatar phone address createdAt',
        model: 'User'
      })
      .populate({
        path: 'reportedUserId',
        select: 'name email role avatar phone address status createdAt',
        model: 'User'
      })
      .populate({
        path: 'accommodationId',
        select: 'title description location price status approvedStatus photos ownerId createdAt',
        populate: {
          path: 'ownerId',
          select: 'name email phone'
        }
      });

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found'
      });
    }

    // Determine report category
    let category = 'general';
    if (report.reporterId && report.reportedUserId) {
      if (report.reporterId.role === 'customer' && report.reportedUserId.role === 'owner') {
        category = 'customer_report_owner';
      } else if (report.reporterId.role === 'owner' && report.reportedUserId.role === 'customer') {
        category = 'owner_report_customer';
      } else {
        category = 'other';
      }
    }

    const formattedReport = {
      _id: report._id,
      type: report.type,
      content: report.content,
      status: report.status,
      adminFeedback: report.adminFeedback,
      createAt: report.createAt,
      category,
      reporter: report.reporterId,
      reportedUser: report.reportedUserId,
      accommodation: report.accommodationId
    };

    res.status(200).json({
      success: true,
      data: formattedReport,
      message: 'Report details retrieved successfully'
    });

  } catch (error) {
    console.error('[ADMIN GET REPORT DETAILS ERROR]', error);
    res.status(500).json({
      success: false,
      message: 'Server error while retrieving report details',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// UC-Admin-14: Admin resolve report (approve/reject with feedback)
exports.resolveReport = async (req, res) => {
  try {
    const { id } = req.params;
    const { action, adminFeedback, actionOnReportedUser } = req.body;

    // Validate input
    if (!action || !['approve', 'reject'].includes(action)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid action. Must be "approve" or "reject"'
      });
    }

    if (!adminFeedback || adminFeedback.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Admin feedback is required'
      });
    }

    // Find the report
    const report = await Report.findById(id)
      .populate('reporterId', 'name email role')
      .populate('reportedUserId', 'name email role status')
      .populate('accommodationId', 'title ownerId');

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found'
      });
    }

    if (report.status !== 'Pending') {
      return res.status(400).json({
        success: false,
        message: 'Report has already been resolved'
      });
    }

    // Update report status
    const newStatus = action === 'approve' ? 'Approved' : 'Rejected';
    report.status = newStatus;
    report.adminFeedback = adminFeedback.trim();

    // If report is approved and action is specified for reported user
    if (action === 'approve' && actionOnReportedUser && report.reportedUserId) {
      if (actionOnReportedUser === 'lock_user') {
        // Lock the reported user
        report.reportedUserId.status = 'locked';
        await report.reportedUserId.save();

        // Log the user lock action
        await AuditLog.create({
          adminId: req.user._id,
          action: 'lock_user',
          targetUserId: report.reportedUserId._id,
          description: `User locked due to approved report: ${report.type}. Report ID: ${report._id}`,
          metadata: {
            reportId: report._id,
            reportType: report.type,
            reason: adminFeedback
          }
        });
      }
    }

    await report.save();

    // Log the report resolution action
    await AuditLog.create({
      adminId: req.user._id,
      action: 'resolve_report',
      targetReportId: report._id,
      description: `Report ${action}d: ${report.type}. Action: ${actionOnReportedUser || 'none'}`,
      metadata: {
        reportId: report._id,
        reportType: report.type,
        action: action,
        actionOnReportedUser: actionOnReportedUser || 'none',
        adminFeedback: adminFeedback,
        reporterId: report.reporterId?._id,
        reportedUserId: report.reportedUserId?._id
      }
    });

    // Determine report category for response
    let category = 'general';
    if (report.reporterId && report.reportedUserId) {
      if (report.reporterId.role === 'customer' && report.reportedUserId.role === 'owner') {
        category = 'customer_report_owner';
      } else if (report.reporterId.role === 'owner' && report.reportedUserId.role === 'customer') {
        category = 'owner_report_customer';
      }
    }

    res.status(200).json({
      success: true,
      data: {
        _id: report._id,
        type: report.type,
        status: report.status,
        adminFeedback: report.adminFeedback,
        category,
        actionTaken: actionOnReportedUser || 'none',
        resolvedAt: new Date()
      },
      message: `Report ${action}d successfully`
    });

  } catch (error) {
    console.error('[ADMIN RESOLVE REPORT ERROR]', error);
    res.status(500).json({
      success: false,
      message: 'Server error while resolving report',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// UC-Admin-15: Get report statistics for dashboard
exports.getReportStats = async (req, res) => {
  try {
    const { fromDate, toDate } = req.query;

    const filter = {};
    if (fromDate || toDate) {
      filter.createAt = {};
      if (fromDate) filter.createAt.$gte = new Date(fromDate);
      if (toDate) filter.createAt.$lte = new Date(toDate);
    }

    const stats = await getReportStatistics(filter);

    res.status(200).json({
      success: true,
      data: stats,
      message: 'Report statistics retrieved successfully'
    });

  } catch (error) {
    console.error('[ADMIN GET REPORT STATS ERROR]', error);
    res.status(500).json({
      success: false,
      message: 'Server error while retrieving report statistics',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// Helper function to get report statistics
async function getReportStatistics(baseFilter = {}) {
  try {
    const totalReports = await Report.countDocuments(baseFilter);
    
    const statusStats = await Report.aggregate([
      { $match: baseFilter },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    const categoryStats = await Report.aggregate([
      { $match: baseFilter },
      {
        $lookup: {
          from: 'users',
          localField: 'reporterId',
          foreignField: '_id',
          as: 'reporter'
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'reportedUserId',
          foreignField: '_id',
          as: 'reportedUser'
        }
      },
      {
        $addFields: {
          category: {
            $cond: {
              if: { 
                $and: [
                  { $eq: [{ $arrayElemAt: ['$reporter.role', 0] }, 'customer'] },
                  { $eq: [{ $arrayElemAt: ['$reportedUser.role', 0] }, 'owner'] }
                ]
              },
              then: 'customer_report_owner',
              else: {
                $cond: {
                  if: {
                    $and: [
                      { $eq: [{ $arrayElemAt: ['$reporter.role', 0] }, 'owner'] },
                      { $eq: [{ $arrayElemAt: ['$reportedUser.role', 0] }, 'customer'] }
                    ]
                  },
                  then: 'owner_report_customer',
                  else: 'other'
                }
              }
            }
          }
        }
      },
      {
        $group: { _id: '$category', count: { $sum: 1 } }
      }
    ]);

    const typeStats = await Report.aggregate([
      { $match: baseFilter },
      { $group: { _id: '$type', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    // Recent reports trend (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const trendFilter = { ...baseFilter, createAt: { $gte: sevenDaysAgo } };
    const recentTrend = await Report.aggregate([
      { $match: trendFilter },
      {
        $group: {
          _id: {
            year: { $year: '$createAt' },
            month: { $month: '$createAt' },
            day: { $dayOfMonth: '$createAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
    ]);

    return {
      total: totalReports,
      statusBreakdown: statusStats.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {}),
      categoryBreakdown: categoryStats.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {}),
      topReportTypes: typeStats.map(item => ({
        type: item._id,
        count: item.count
      })),
      recentTrend: recentTrend.map(item => ({
        date: `${item._id.year}-${String(item._id.month).padStart(2, '0')}-${String(item._id.day).padStart(2, '0')}`,
        count: item.count
      })),
      pendingCount: statusStats.find(s => s._id === 'Pending')?.count || 0,
      resolvedCount: (statusStats.find(s => s._id === 'Approved')?.count || 0) + 
                   (statusStats.find(s => s._id === 'Rejected')?.count || 0)
    };
  } catch (error) {
    console.error('[GET REPORT STATISTICS ERROR]', error);
    return {
      total: 0,
      statusBreakdown: {},
      categoryBreakdown: {},
      topReportTypes: [],
      recentTrend: [],
      pendingCount: 0,
      resolvedCount: 0
    };
  }
}