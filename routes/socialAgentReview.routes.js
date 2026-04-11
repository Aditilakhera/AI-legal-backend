import express from 'express';
import * as reviewController from '../controllers/socialAgentReview.controller.js';
import { verifyToken as protect } from '../middleware/authorization.js';

const router = express.Router();

// Approval Flow
router.patch('/posts/:postId/send-for-review', protect, reviewController.sendForReview);
router.patch('/posts/:postId/approve', protect, reviewController.approvePost);
router.patch('/posts/:postId/reject', protect, reviewController.rejectPost);

// Collaboration
router.post('/posts/:postId/comment', protect, reviewController.addPostComment);
router.get('/posts/:postId/history', protect, reviewController.getPostHistory);

// Scheduling
router.patch('/posts/:postId/schedule', protect, reviewController.schedulePost);
router.get('/schedule/:workspaceId', protect, reviewController.getSchedule);

// Queue
router.get('/review-queue/:workspaceId', protect, reviewController.getReviewQueue);

export default router;
