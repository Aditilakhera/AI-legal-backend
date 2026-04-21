import cron from 'node-cron';
import Reminder from '../models/Reminder.js';
import Notification from '../models/Notification.js';
import User from '../models/User.js';
import logger from '../utils/logger.js';
// Add email service if later needed for email reminders, for now let's just log or push notification
// import * as emailService from './emailService.js';

import PersonalTask from '../models/PersonalTask.js';

export const initReminderScheduler = () => {
    logger.info('[ReminderScheduler] Initializing Multi Schedule Reminder System (v2)...');

    // Runs every minute
    cron.schedule('* * * * *', async () => {
        try {
            const now = new Date();
            const currentMinute = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), now.getMinutes());
            const nextMinute = new Date(currentMinute.getTime() + 60000);

            // 1. Process standard Reminders
            const dueReminders = await Reminder.find({
                isActive: true,
                status: 'pending',
                datetime: { $lt: nextMinute }
            });

            // 2. Process PersonalTasks from AI Assistant
            const dueTasks = await PersonalTask.find({
                status: 'pending',
                datetime: { $lt: nextMinute }
            });

            if (dueReminders.length > 0 || dueTasks.length > 0) {
                logger.info(`[ReminderScheduler] Found ${dueReminders.length} reminders and ${dueTasks.length} tasks due.`);
            }

            for (const reminder of dueReminders) {
                await processDueReminder(reminder, now);
            }

            for (const task of dueTasks) {
                await processDueTask(task, now);
            }
        } catch (error) {
            logger.error(`[ReminderScheduler] Error running cron: ${error.message}`);
        }
    });
};

const processDueTask = async (task, now) => {
    try {
        logger.info(`[ReminderScheduler] Processing PersonalTask: ${task.title} - ${task._id}`);
        
        // Create in-app notification
        const { createNotification } = await import('./notificationService.js');
        await createNotification(task.user, {
            id: `task_${task._id}`,
            title: `Task Alert: ${task.title}`,
            desc: task.description || 'Time for your scheduled routine.',
            type: task.isUrgent ? 'alert' : 'info',
            voice: 'none' // PersonalTask doesn't have voice selection in model yet
        });

        // Handle Recurring logic for PersonalTask
        if (task.recurring === 'none') {
            task.status = 'completed';
        } else {
            const nextTime = new Date(task.datetime);
            if (task.recurring === 'daily') nextTime.setDate(nextTime.getDate() + 1);
            else if (task.recurring === 'weekly') nextTime.setDate(nextTime.getDate() + 7);
            else if (task.recurring === 'monthly') nextTime.setMonth(nextTime.getMonth() + 1);
            
            task.datetime = nextTime;
        }

        await task.save();
    } catch (error) {
        logger.error(`[ReminderScheduler] Error processing task ${task._id}: ${error.message}`);
    }
};

const processDueReminder = async (reminder, now) => {
    try {
        logger.info(`[ReminderScheduler] Processing reminder: ${reminder.title} - ${reminder._id}`);
        // 1. Send Notification based on type
        if (reminder.notificationType === 'in-app' || reminder.notificationType === 'both') {
            const { createNotification } = await import('./notificationService.js');
            await createNotification(reminder.userId, {
                id: `reminder_${reminder._id}`,
                title: `Reminder: ${reminder.title}`,
                desc: reminder.description || 'Time to check your scheduled task.',
                type: 'alert',
                voice: reminder.voice || 'none'
            });

            logger.info(`[ReminderScheduler] Real-time notification sent to user ${reminder.userId}`);
        }

        
        // Handle Repeat Logic
        if (reminder.repeat === 'none') {
            reminder.status = 'completed';
        } else {
            // Calculate next datetime
            const nextTime = new Date(reminder.datetime);
            
            if (reminder.repeat === 'daily') {
                nextTime.setDate(nextTime.getDate() + 1);
            } else if (reminder.repeat === 'weekly') {
                nextTime.setDate(nextTime.getDate() + 7);
            } else if (reminder.repeat === 'monthly') {
                nextTime.setMonth(nextTime.getMonth() + 1);
            } else if (reminder.repeat === 'custom') {
                // Find next day strictly greater than today based on customDays
                const currentDay = nextTime.getDay(); // 0-6
                let daysToAdd = 1;
                let found = false;
                
                if (reminder.customDays && reminder.customDays.length > 0) {
                    for (let i = 1; i <= 7; i++) {
                        const nextDayToCheck = (currentDay + i) % 7;
                        if (reminder.customDays.includes(nextDayToCheck)) {
                            daysToAdd = i;
                            found = true;
                            break;
                        }
                    }
                }
                nextTime.setDate(nextTime.getDate() + daysToAdd);
            }
            
            reminder.datetime = nextTime;
        }

        await reminder.save();
    } catch (error) {
        logger.error(`[ReminderScheduler] Error processing reminder ${reminder._id}: ${error.message}`);
    }
};
