import { reviewService } from '../services/socialAgentReview.service.js';
import GeneratedPost from '../models/GeneratedPost.js';
import ScheduleItem from '../models/ScheduleItem.js';

export const sendForReview = async (req, res) => {
  try {
    const { postId } = req.params;
    const { workspaceId, note } = req.body;
    const userId = req.user?._id; 
    
    const result = await reviewService.sendForReview(postId, workspaceId, userId, note);
    res.json({ success: true, ...result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const approvePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { workspaceId, note } = req.body;
    const userId = req.user?._id;

    const result = await reviewService.approvePost(postId, workspaceId, userId, note);
    res.json({ success: true, ...result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const rejectPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { workspaceId, note } = req.body;
    const userId = req.user?._id;

    const result = await reviewService.rejectPost(postId, workspaceId, userId, note);
    res.json({ success: true, ...result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const addPostComment = async (req, res) => {
  try {
    const { postId } = req.params;
    const { workspaceId, message } = req.body;
    const userId = req.user?._id;

    const comment = await reviewService.addComment(postId, workspaceId, userId, message);
    res.json({ success: true, comment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getPostHistory = async (req, res) => {
  try {
    const { postId } = req.params;
    const result = await reviewService.getPostHistory(postId);
    res.json({ success: true, ...result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const schedulePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { workspaceId, platform, scheduledFor, timezone } = req.body;
    
    const scheduleItem = await reviewService.schedulePost(postId, workspaceId, platform, scheduledFor, timezone);
    res.json({ success: true, scheduleItem });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getReviewQueue = async (req, res) => {
  try {
    const { workspaceId } = req.params;
    const posts = await GeneratedPost.find({ 
      workspaceId, 
      status: 'in_review' 
    }).populate('primaryAssetId').sort({ updatedAt: -1 });
    
    res.json({ success: true, posts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getSchedule = async (req, res) => {
  try {
    const { workspaceId } = req.params;
    const items = await ScheduleItem.find({ 
      workspaceId 
    }).populate('postId').sort({ scheduledFor: 1 });
    
    res.json({ success: true, items });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
