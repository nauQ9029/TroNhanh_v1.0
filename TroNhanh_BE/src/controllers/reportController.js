const Report = require('../models/Report')
const User = require('../models/User')
exports.createReport = async (req, res) => {
  try {
    const { type, content, accommodationId, bookingId, reportedUserId } = req.body;

    const reportData = {
      reporterId: req.body.reporterId,
      type,
      content,
    };

    // Thêm các trường optional nếu có
    if (accommodationId) reportData.accommodationId = accommodationId;
    if (bookingId) reportData.bookingId = bookingId;
    if (reportedUserId) reportData.reportedUserId = reportedUserId;

    const report = new Report(reportData);
    await report.save();

    console.log("✅ Report created with data:", reportData);
    res.status(201).json(report);
  } catch (error) {
    console.error("❌ Error creating report:", error);
    res.status(500).json({ message: "Failed to create report" })
  }
}

exports.getMyReports = async (req, res) => {
  try {
    console.log("🔍 Getting reports for user:", req.user);
    console.log("🔍 User ID:", req.user?.id);

    const reports = await Report.find({ reporterId: req.user.id })
      .populate('accommodationId', 'title location status')
      .populate('bookingId', 'checkInDate checkOutDate totalPrice status')
      .populate('reportedUserId', 'name email')
      .sort({ createAt: -1 });

    console.log("✅ Found reports:", reports.length);
    res.json(reports);
  } catch (error) {
    console.error("❌ Error in getMyReports:", error);
    res.status(500).json({ message: "Server error" });
  }
};
exports.getOwners = async (req, res) => {
  try {
    const owners = await User.find({ role: 'owner' }).select('_id name role avatar');
    res.status(200).json(owners);
  } catch (error) {
    console.error("Failed to fetch owners:", error);
    res.status(500).json({ message: "Failed to fetch owners" });
  }
};