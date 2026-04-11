import GeneratedPost from '../models/GeneratedPost.js';
import ApprovalAction from '../models/ApprovalAction.js';
import PostComment from '../models/PostComment.js';
import ScheduleItem from '../models/ScheduleItem.js';
import BrandProfile from '../models/BrandProfile.js';

export const reviewService = {
  /**
   * Send a draft post for review
   */
  sendForReview: async (postId, workspaceId, userId, note) => {
    const post = await GeneratedPost.findById(postId);
    if (!post) throw new Error('Post not found');

    const prevStatus = post.status;
    post.status = 'in_review';
    await post.save();

    const action = new ApprovalAction({
      postId,
      workspaceId,
      actionBy: userId,
      actionType: 'send_for_review',
      actionNote: note,
      previousStatus: prevStatus,
      newStatus: 'in_review'
    });
    await action.save();

    return { post, action };
  },

  /**
   * Approve a post
   */
  approvePost: async (postId, workspaceId, userId, note) => {
    const post = await GeneratedPost.findById(postId);
    if (!post) throw new Error('Post not found');

    const prevStatus = post.status;
    post.status = 'approved';
    await post.save();

    // Audit action
    const action = new ApprovalAction({
      postId,
      workspaceId,
      actionBy: userId,
      actionType: 'approve',
      actionNote: note,
      previousStatus: prevStatus,
      newStatus: 'approved'
    });
    await action.save();

    // Memory Logic: Store preferences from approved post
    await updateAgentMemory(workspaceId, post);

    return { post, action };
  },

  /**
   * Reject a post
   */
  rejectPost: async (postId, workspaceId, userId, note) => {
    const post = await GeneratedPost.findById(postId);
    if (!post) throw new Error('Post not found');

    const prevStatus = post.status;
    post.status = 'rejected';
    await post.save();

    const action = new ApprovalAction({
      postId,
      workspaceId,
      actionBy: userId,
      actionType: 'reject',
      actionNote: note,
      previousStatus: prevStatus,
      newStatus: 'rejected'
    });
    await action.save();

    return { post, action };
  },

  /**
   * Add a comment to a post
   */
  addComment: async (postId, workspaceId, userId, message) => {
    const comment = new PostComment({
      postId,
      workspaceId,
      userId,
      message
    });
    await comment.save();

    // Also Log as an action
    await new ApprovalAction({
      postId,
      workspaceId,
      actionBy: userId,
      actionType: 'comment',
      actionNote: message.substring(0, 50) + '...'
    }).save();

    return comment;
  },

  /**
   * Schedule a post for publishing
   */
  schedulePost: async (postId, workspaceId, platform, scheduledFor, timezone) => {
    const post = await GeneratedPost.findById(postId);
    if (!post || post.status !== 'approved') {
        throw new Error('Only approved posts can be scheduled');
    }

    const prevStatus = post.status;
    post.status = 'scheduled';
    await post.save();

    const scheduleItem = new ScheduleItem({
      postId,
      workspaceId,
      platform,
      scheduledFor,
      timezone
    });
    await scheduleItem.save();

    await new ApprovalAction({
      postId,
      workspaceId,
      actionType: 'schedule',
      actionNote: `Scheduled for ${scheduledFor} (${platform})`,
      previousStatus: prevStatus,
      newStatus: 'scheduled'
    }).save();

    return scheduleItem;
  },

  /**
   * Get complete audit history
   */
  getPostHistory: async (postId) => {
    const actions = await ApprovalAction.find({ postId }).sort({ createdAt: -1 }).populate('actionBy', 'name');
    const comments = await PostComment.find({ postId }).sort({ createdAt: -1 }).populate('userId', 'name');
    return { actions, comments };
  }
};

/**
 * Update Agent Memory based on approved content
 */
async function updateAgentMemory(workspaceId, post) {
  try {
    const profile = await BrandProfile.findOne({ workspaceId });
    if (!profile) return;

    // Simple Rule: approved post attributes become preferred attributes
    profile.preferredTone = profile.toneOfVoice; // Store for now to confirm "working" style
    profile.preferredHookStyle = post.hook?.length > 40 ? 'Long form' : 'Punchy';
    profile.preferredCtaStyle = post.cta || profile.ctaStyle;
    
    // Future: Analyze post context for deeper memory
    await profile.save();
  } catch (err) {
    console.error("Memory Update Error:", err);
  }
}
