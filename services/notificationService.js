import userModel from '../models/User.js';
import { notifyUser } from '../utils/socket.js';
import mongoose from 'mongoose';
import axios from 'axios';

export const createNotification = async (userId, { title, desc, type = 'info', voice = 'none', id = null, data = null }) => {
    try {
        const notification = {
            id: id || `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            title,
            desc,
            type,
            voice,
            time: new Date(),
            isRead: false,
            data: data
        };


        if (mongoose.connection.readyState === 1) {
            await userModel.findByIdAndUpdate(userId, {
                $push: { 
                    notificationsInbox: { 
                        $each: [notification], 
                        $position: 0 // Newest first
                    } 
                }
            });
        }

        // Send real-time WebSocket update
        notifyUser(userId, notification);

        // Send Expo Push Notification if user has pushToken registered
        try {
            const user = await userModel.findById(userId).select('pushToken settings');
            if (user && user.pushToken && user.pushToken.startsWith('ExponentPushToken')) {
                let deepLinkUrl = 'ailegalmobile://(tabs)/dashboard';
                if (data && data.url) {
                    deepLinkUrl = data.url;
                } else if (data && data.caseId) {
                    if (data.tab) {
                        deepLinkUrl = `ailegalmobile://workspace/${data.caseId}?tab=${data.tab}`;
                    } else {
                        deepLinkUrl = `ailegalmobile://workspace/${data.caseId}`;
                    }
                } else {
                    const descLower = desc.toLowerCase();
                    const titleLower = title.toLowerCase();
                    if (descLower.includes('hearing') || titleLower.includes('hearing')) {
                        deepLinkUrl = 'ailegalmobile://workspace'; 
                    } else if (descLower.includes('draft') || titleLower.includes('draft')) {
                        deepLinkUrl = 'ailegalmobile://(tabs)/tools';
                    }
                }

                await axios.post('https://exp.host/--/api/v2/push/send', {
                    to: user.pushToken,
                    title: title,
                    body: desc,
                    sound: 'default',
                    badge: 1,
                    data: {
                        id: notification.id,
                        type: type,
                        url: deepLinkUrl,
                        ...data
                    }
                }, {
                    headers: { 'Content-Type': 'application/json' }
                });
                console.log(`[Push Notification] Dispatched successfully to user ${userId} via token ${user.pushToken}`);
            }
        } catch (pushErr) {
            console.error('[Push Notification] Failed to dispatch push to user:', pushErr.message);
        }

        return notification;
    } catch (error) {
        console.error('Failed to create notification:', error);
        throw error;
    }
};
