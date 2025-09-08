const Report = require('../models/Report')

exports.createReport = async(req,res)=>{
    try{
        const report = new Report(req.body);
        await report.save();
        res.status(201).json(report);
    }catch(error){
        console.error(error);
        res.status(500).json({message:"Failed to create report"})
    }
}

exports.getMyReports = async (req, res) => {
  try {
    const reports = await Report.find({ reporterId: req.user.id })
      .sort({ createdAt: -1 });
    res.json(reports);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};