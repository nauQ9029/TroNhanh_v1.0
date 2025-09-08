const Payment = require('../../models/Payment');
const User = require('../../models/User');
const MembershipPackage = require('../../models/MembershipPackage');

// UC-Admin-11: View Transaction History
exports.getTransactionHistory = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      status,
      ownerId,
      membershipPackageId,
      fromDate,
      toDate,
      search
    } = req.query;

    const filter = {};

    // Filter by status
    if (status) {
      filter.status = status;
    }

    // Filter by owner
    if (ownerId) {
      filter.ownerId = ownerId;
    }

    // Filter by membership package
    if (membershipPackageId) {
      filter.membershipPackageId = membershipPackageId;
    }

    // Filter by date range
    if (fromDate || toDate) {
      filter.createAt = {};
      if (fromDate) filter.createAt.$gte = new Date(fromDate);
      if (toDate) filter.createAt.$lte = new Date(toDate);
    }

    // Search in title, description, or transaction ID
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { vnpayTransactionId: { $regex: search, $options: 'i' } }
      ];
    }

    const total = await Payment.countDocuments(filter);

    // BR-VTH-03: Sorted Data Rule - Transactions must be sorted in descending order by date
    const transactions = await Payment.find(filter)
      .populate('ownerId', 'name email phone role')
      .populate('membershipPackageId', 'packageName price duration')
      .sort({ createAt: -1 }) // Descending order by date
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    // BR-VTH-01: Data Displays Rule - Include date, sender, receiver, transaction type, and amount
    const formattedTransactions = transactions.map(transaction => ({
      _id: transaction._id,
      transactionId: transaction.vnpayTransactionId,
      date: transaction.createAt,
      sender: transaction.ownerId ? {
        _id: transaction.ownerId._id,
        name: transaction.ownerId.name,
        email: transaction.ownerId.email,
        phone: transaction.ownerId.phone,
        role: transaction.ownerId.role
      } : null,
      receiver: 'TroNhanh System', // The system receives payment
      transactionType: 'Membership Purchase',
      membershipPackage: transaction.membershipPackageId ? {
        _id: transaction.membershipPackageId._id,
        packageName: transaction.membershipPackageId.packageName,
        price: transaction.membershipPackageId.price,
        duration: transaction.membershipPackageId.duration
      } : null,
      title: transaction.title,
      description: transaction.description,
      amount: transaction.amount,
      status: transaction.status,
      createdAt: transaction.createAt
    }));

    // Check if no transactions exist
    if (total === 0) {
      return res.status(200).json({
        total: 0,
        page: parseInt(page),
        pageSize: 0,
        transactions: [],
        message: "No data available."
      });
    }

    res.status(200).json({
      total,
      page: parseInt(page),
      pageSize: transactions.length,
      transactions: formattedTransactions,
      summary: {
        totalTransactions: total,
        totalAmount: await Payment.aggregate([
          { $match: filter },
          { $group: { _id: null, total: { $sum: '$amount' } } }
        ]).then(result => result[0]?.total || 0),
        statusBreakdown: await Payment.aggregate([
          { $match: filter },
          { $group: { _id: '$status', count: { $sum: 1 }, totalAmount: { $sum: '$amount' } } }
        ])
      }
    });

  } catch (err) {
    console.error('[GET TRANSACTION HISTORY ERROR]', err);
    res.status(500).json({ message: 'Database connection error. Please try again later.' });
  }
};

// Get transaction statistics for admin dashboard
exports.getTransactionStats = async (req, res) => {
  try {
    const { period = '30d' } = req.query;
    
    // Calculate date range based on period
    const now = new Date();
    let startDate;
    
    switch (period) {
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      case '1y':
        startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    const filter = { createAt: { $gte: startDate } };

    const stats = await Promise.all([
      // Total transactions in period
      Payment.countDocuments(filter),
      
      // Total revenue in period
      Payment.aggregate([
        { $match: { ...filter, status: 'Paid' } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]),
      
      // Status breakdown
      Payment.aggregate([
        { $match: filter },
        { $group: { _id: '$status', count: { $sum: 1 }, totalAmount: { $sum: '$amount' } } }
      ]),
      
      // Daily transaction trends
      Payment.aggregate([
        { $match: filter },
        {
          $group: {
            _id: {
              year: { $year: '$createAt' },
              month: { $month: '$createAt' },
              day: { $dayOfMonth: '$createAt' }
            },
            count: { $sum: 1 },
            amount: { $sum: '$amount' }
          }
        },
        { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
      ])
    ]);

    res.status(200).json({
      period,
      totalTransactions: stats[0],
      totalRevenue: stats[1][0]?.total || 0,
      statusBreakdown: stats[2],
      dailyTrends: stats[3]
    });

  } catch (err) {
    console.error('[GET TRANSACTION STATS ERROR]', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get single transaction details
exports.getTransactionById = async (req, res) => {
  try {
    const transaction = await Payment.findById(req.params.id)
      .populate('ownerId', 'name email phone role address')
      .populate('membershipPackageId', 'packageName price duration description features');

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    // Format transaction details
    const formattedTransaction = {
      _id: transaction._id,
      transactionId: transaction.vnpayTransactionId,
      date: transaction.createAt,
      sender: transaction.ownerId ? {
        _id: transaction.ownerId._id,
        name: transaction.ownerId.name,
        email: transaction.ownerId.email,
        phone: transaction.ownerId.phone,
        role: transaction.ownerId.role,
        address: transaction.ownerId.address
      } : null,
      receiver: 'TroNhanh System',
      transactionType: 'Membership Purchase',
      membershipPackage: transaction.membershipPackageId,
      title: transaction.title,
      description: transaction.description,
      amount: transaction.amount,
      status: transaction.status,
      createdAt: transaction.createAt
    };

    res.status(200).json(formattedTransaction);

  } catch (err) {
    console.error('[GET TRANSACTION BY ID ERROR]', err);
    res.status(500).json({ message: 'Server error' });
  }
};