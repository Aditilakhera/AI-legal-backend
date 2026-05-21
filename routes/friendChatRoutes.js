import express from 'express';
import { verifyToken } from '../middleware/authorization.js';
import User from '../models/User.js';
import FriendRequest from '../models/FriendRequest.js';
import DirectMessage from '../models/DirectMessage.js';
import { getIO, notifyUser } from '../utils/socket.js';

const router = express.Router();

// 1. Search Users by Email or Name
router.get('/search', verifyToken, async (req, res) => {
    try {
        const query = req.query.query;
        let users;
        console.log(`[FRIEND_CHAT_SEARCH] Received Query: "${query}" | Caller User ID: "${req.user.id}"`);

        if (query && query.trim().length > 0) {
            // Find users matching query in email or name (excluding current user)
            users = await User.find({
                _id: { $ne: req.user.id },
                $or: [
                    { email: { $regex: query, $options: 'i' } },
                    { name: { $regex: query, $options: 'i' } }
                ]
            }).select('_id name email avatar').limit(15);
        } else {
            // Return default discovery list of other users
            users = await User.find({
                _id: { $ne: req.user.id }
            }).select('_id name email avatar').limit(15);
        }

        console.log(`[FRIEND_CHAT_SEARCH] DB Match Count: ${users.length} | Matches:`, users.map(u => u.email));

        // Map status of friendship for each searched user
        const mappedUsers = await Promise.all(users.map(async (u) => {
            const request = await FriendRequest.findOne({
                $or: [
                    { sender: req.user.id, receiver: u._id },
                    { sender: u._id, receiver: req.user.id }
                ]
            });

            let status = 'none'; // none, pending_sent, pending_received, accepted
            if (request) {
                if (request.status === 'accepted') {
                    status = 'accepted';
                } else if (request.status === 'pending') {
                    status = request.sender.toString() === req.user.id ? 'pending_sent' : 'pending_received';
                }
            }

            return {
                _id: u._id,
                name: u.name,
                email: u.email,
                avatar: u.avatar,
                friendshipStatus: status,
                requestId: request ? request._id : null
            };
        }));

        res.json({ success: true, data: mappedUsers });
    } catch (error) {
        console.error('[FRIEND_CHAT] Search error:', error);
        res.status(500).json({ error: 'Failed to search users' });
    }
});

// 2. Send Friend Request
router.post('/friend-request', verifyToken, async (req, res) => {
    try {
        const { receiverId } = req.body;
        if (!receiverId) {
            return res.status(400).json({ error: 'Receiver ID is required' });
        }

        if (receiverId === req.user.id) {
            return res.status(400).json({ error: 'You cannot add yourself' });
        }

        // Check if user exists
        const receiver = await User.findById(receiverId);
        if (!receiver) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Check if request already exists
        const existingRequest = await FriendRequest.findOne({
            $or: [
                { sender: req.user.id, receiver: receiverId },
                { sender: receiverId, receiver: req.user.id }
            ]
        });

        if (existingRequest) {
            return res.status(400).json({ error: 'Friend request already exists or you are already friends' });
        }

        const newRequest = new FriendRequest({
            sender: req.user.id,
            receiver: receiverId,
            status: 'pending'
        });

        await newRequest.save();

        // Push real-time notification via Socket.io
        notifyUser(receiverId, {
            id: `friend_req_${Date.now()}`,
            title: 'New Friend Request',
            desc: `${req.user.name || req.user.email} sent you a friend request.`,
            type: 'info',
            time: new Date(),
            isRead: false
        });

        res.json({ success: true, message: 'Friend request sent successfully', data: newRequest });
    } catch (error) {
        console.error('[FRIEND_CHAT] Send request error:', error);
        res.status(500).json({ error: 'Failed to send friend request' });
    }
});

// 3. Respond to Friend Request (Accept / Reject)
router.post('/friend-request/respond', verifyToken, async (req, res) => {
    try {
        const { requestId, action } = req.body; // action: 'accept' | 'reject'
        if (!requestId || !action) {
            return res.status(400).json({ error: 'Request ID and action are required' });
        }

        const request = await FriendRequest.findById(requestId);
        if (!request) {
            return res.status(404).json({ error: 'Friend request not found' });
        }

        if (request.receiver.toString() !== req.user.id) {
            return res.status(403).json({ error: 'Unauthorized to respond to this request' });
        }

        if (action === 'accept') {
            request.status = 'accepted';
            await request.save();

            // Notify sender that request was accepted
            notifyUser(request.sender, {
                id: `friend_acc_${Date.now()}`,
                title: 'Friend Request Accepted',
                desc: `${req.user.name || req.user.email} accepted your friend request!`,
                type: 'success',
                time: new Date(),
                isRead: false
            });

            // Trigger socket event for real-time list update
            try {
                const io = getIO();
                if (io) {
                    io.to(request.sender.toString()).emit('friendship_updated');
                    io.to(req.user.id).emit('friendship_updated');
                }
            } catch (sErr) {}

            return res.json({ success: true, message: 'Friend request accepted', data: request });
        } else if (action === 'reject') {
            await FriendRequest.findByIdAndDelete(requestId);
            return res.json({ success: true, message: 'Friend request rejected / deleted' });
        } else {
            return res.status(400).json({ error: 'Invalid action. Must be accept or reject' });
        }
    } catch (error) {
        console.error('[FRIEND_CHAT] Respond request error:', error);
        res.status(500).json({ error: 'Failed to respond to friend request' });
    }
});

// 4. Get Friends List (All accepted users) & Pending Requests
router.get('/list', verifyToken, async (req, res) => {
    try {
        // Find accepted friendships
        const friendships = await FriendRequest.find({
            $or: [
                { sender: req.user.id },
                { receiver: req.user.id }
            ],
            status: 'accepted'
        }).populate('sender', 'name email avatar').populate('receiver', 'name email avatar');

        const friends = friendships.map(f => {
            const isSender = f.sender._id.toString() === req.user.id;
            return {
                friendshipId: f._id,
                user: isSender ? f.receiver : f.sender
            };
        });

        // Find pending received requests
        const pendingReceived = await FriendRequest.find({
            receiver: req.user.id,
            status: 'pending'
        }).populate('sender', 'name email avatar');

        // Find pending sent requests
        const pendingSent = await FriendRequest.find({
            sender: req.user.id,
            status: 'pending'
        }).populate('receiver', 'name email avatar');

        res.json({
            success: true,
            friends,
            pendingReceived,
            pendingSent
        });
    } catch (error) {
        console.error('[FRIEND_CHAT] Fetch list error:', error);
        res.status(500).json({ error: 'Failed to fetch friends list' });
    }
});

// 5. Get Direct Message History between users
router.get('/history/:friendId', verifyToken, async (req, res) => {
    try {
        const { friendId } = req.params;
        if (!friendId) {
            return res.status(400).json({ error: 'Friend ID is required' });
        }

        // Verify they are indeed friends
        const isFriend = await FriendRequest.findOne({
            $or: [
                { sender: req.user.id, receiver: friendId },
                { sender: friendId, receiver: req.user.id }
            ],
            status: 'accepted'
        });

        if (!isFriend) {
            return res.status(403).json({ error: 'You are not friends with this user' });
        }

        // Fetch direct messages sorted by oldest first
        const messages = await DirectMessage.find({
            $or: [
                { sender: req.user.id, receiver: friendId },
                { sender: friendId, receiver: req.user.id }
            ]
        }).sort({ createdAt: 1 });

        // Silent: Mark all unread messages from friend to me as read
        await DirectMessage.updateMany(
            { sender: friendId, receiver: req.user.id, isRead: false },
            { $set: { isRead: true } }
        );

        res.json({ success: true, data: messages });
    } catch (error) {
        console.error('[FRIEND_CHAT] Fetch history error:', error);
        res.status(500).json({ error: 'Failed to fetch message history' });
    }
});

// 6. Send Direct Message
router.post('/message', verifyToken, async (req, res) => {
    try {
        const { receiverId, message } = req.body;
        if (!receiverId || !message) {
            return res.status(400).json({ error: 'Receiver ID and message content are required' });
        }

        // Verify they are indeed friends
        const isFriend = await FriendRequest.findOne({
            $or: [
                { sender: req.user.id, receiver: receiverId },
                { sender: receiverId, receiver: req.user.id }
            ],
            status: 'accepted'
        });

        if (!isFriend) {
            return res.status(403).json({ error: 'You can only message users who are your friends' });
        }

        const newMsg = new DirectMessage({
            sender: req.user.id,
            receiver: receiverId,
            message: message.trim()
        });

        await newMsg.save();

        // Broadcast to receiver's socket room in real-time
        try {
            const io = getIO();
            if (io) {
                io.to(receiverId.toString()).emit('direct_message', newMsg);
                io.to(req.user.id).emit('direct_message_sent', newMsg);
            }
        } catch (socketErr) {
            console.error('[Socket] Direct message broadcast failed:', socketErr.message);
        }

        res.json({ success: true, data: newMsg });
    } catch (error) {
        console.error('[FRIEND_CHAT] Send message error:', error);
        res.status(500).json({ error: 'Failed to send message' });
    }
});

export default router;
