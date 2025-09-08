// file TroNhanh_BE/src/routes/adminRoutes.js
const express = require('express');
const router = express.Router();

const {
  getAllUsers,
  getUserStats,
  getUserStatsEndpoint,
  getUserById,
  lockUnlockUser,
  editUserInfo,
  deleteUser,
  getAuditLogs
} = require('../controllers/AdminController/UserController');

const { getAllAccommodationsAdmin, getAccommodationDetailAdmin, approveAccommodationAdmin, deleteAccommodationAdmin } = require('../controllers/AdminController/AccommodationController');

const {
  createMembershipPackage,
  getAllMembershipPackages,
  getMembershipPackageById,
  updateMembershipPackage,
  deleteMembershipPackage
} = require('../controllers/AdminController/MembershipController');

const {
  getTransactionHistory,
  getTransactionStats,
  getTransactionById
} = require('../controllers/AdminController/TransactionController');

// Import admin authentication middleware
const { adminAuth } = require('../middleware/adminAuth');

// Apply admin authentication to all routes
router.use(adminAuth);

// UC-Admin-01: View User List
router.get('/users', getAllUsers);                    // GET /api/admin/users
router.get('/users/stats', getUserStatsEndpoint);    // GET /api/admin/users/stats

// UC-Admin-02: Lock/Unlock User
router.put('/users/:id/lock-unlock', lockUnlockUser); // PUT /api/admin/users/:id/lock-unlock

// UC-Admin-03: Edit User Information  
router.put('/users/:id/edit', editUserInfo);         // PUT /api/admin/users/:id/edit

// UC-Admin-04: Delete User Account
router.delete('/users/:id', deleteUser);             // DELETE /api/admin/users/:id

// Additional endpoints
router.get('/users/:id', getUserById);               // GET /api/admin/users/:id
router.get('/audit-logs', getAuditLogs);            // GET /api/admin/audit-logs

// UC-Admin-05: Admin view all accommodation posts
router.get('/accommodations', getAllAccommodationsAdmin); // GET /api/admin/accommodations

// UC-Admin-06: Admin view accommodation post details
router.get('/accommodations/:id', getAccommodationDetailAdmin); // GET /api/admin/accommodations/:id

// UC-Admin-Approve: Admin approve/reject accommodation post
router.put('/accommodations/:id/approve', approveAccommodationAdmin); // PUT /api/admin/accommodations/:id/approve

// UC-Admin-07: Admin soft delete accommodation post
router.put('/accommodations/:id/delete', deleteAccommodationAdmin); // PUT /api/admin/accommodations/:id/delete

// UC-Admin-14: Membership Package Management
router.post('/membership-packages', createMembershipPackage);        // POST /api/admin/membership-packages
router.get('/membership-packages', getAllMembershipPackages);        // GET /api/admin/membership-packages
router.get('/membership-packages/:id', getMembershipPackageById);    // GET /api/admin/membership-packages/:id
router.put('/membership-packages/:id', updateMembershipPackage);     // PUT /api/admin/membership-packages/:id
router.delete('/membership-packages/:id', deleteMembershipPackage);  // DELETE /api/admin/membership-packages/:id

// UC-Admin-11: View Transaction History
router.get('/transactions', getTransactionHistory);                  // GET /api/admin/transactions
router.get('/transactions/stats', getTransactionStats);              // GET /api/admin/transactions/stats  
router.get('/transactions/:id', getTransactionById);                 // GET /api/admin/transactions/:id

module.exports = router;