// file TroNhanh_BE/src/models/AuditLog.js
const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
    adminId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    action: {
        type: String,
        required: true,
        enum: [
            'VIEW_USER_LIST',
            'LOCK_USER',
            'UNLOCK_USER',
            'EDIT_USER',
            'DELETE_USER',
            'CREATE_USER',
            'delete_accommodation',
            'approve_accommodation',
            'CREATE_MEMBERSHIP_PACKAGE',
            'UPDATE_MEMBERSHIP_PACKAGE',
            'DELETE_MEMBERSHIP_PACKAGE'
        ]
    },
    targetUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false // Some actions might not target specific users
    },
    description: {
        type: String,
        required: true
    },
    oldData: {
        type: mongoose.Schema.Types.Mixed, // Store old values for edit actions
        required: false
    },
    newData: {
        type: mongoose.Schema.Types.Mixed, // Store new values for edit actions
        required: false
    },
    ipAddress: {
        type: String,
        required: false
    },
    userAgent: {
        type: String,
        required: false
    }
}, {
    timestamps: true
});

// Index for better query performance
auditLogSchema.index({ adminId: 1, createdAt: -1 });
auditLogSchema.index({ targetUserId: 1, createdAt: -1 });
auditLogSchema.index({ action: 1, createdAt: -1 });

module.exports = mongoose.model('AuditLog', auditLogSchema);