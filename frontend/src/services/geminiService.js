import axios from "axios";
import { apis } from "../types";
import { getUserData } from "../userStore/userData";
import { getDeviceFingerprint } from "../utils/fingerprint";

export const generateChatResponse = async (history, currentMessage, systemInstruction, attachments, language, abortSignal = null, mode = null) => {
    try {
        const token = getUserData()?.token;
        const headers = {
            'X-Device-Fingerprint': getDeviceFingerprint()
        };
        if (token && token !== 'undefined' && token !== 'null') {
            headers.Authorization = `Bearer ${token}`;
        }

        // Enhanced system instruction based on user language
        const langInstruction = language ? `You are a helpful AI assistant. Please respond to the user in ${language}. ` : '';
        const combinedSystemInstruction = (langInstruction + (systemInstruction || '')).trim();

        let images = [];
        let documents = [];
        let finalMessage = currentMessage;

        if (attachments && Array.isArray(attachments)) {
            attachments.forEach(attachment => {
                if (attachment.url && attachment.url.startsWith('data:')) {
                    const base64Data = attachment.url.split(',')[1];
                    const mimeType = attachment.url.substring(attachment.url.indexOf(':') + 1, attachment.url.indexOf(';'));

                    if (attachment.type === 'image' || mimeType.startsWith('image/')) {
                        images.push({ mimeType, base64Data });
                    } else {
                        documents.push({ mimeType: mimeType || 'application/pdf', base64Data, name: attachment.name });
                    }
                } else if (attachment.url) {
                    finalMessage += `\n[Shared File: ${attachment.name || 'Link'} - ${attachment.url}]`;
                }
            });
        }

        // Limit history to last 50 messages to prevent token overflow in unlimited chats
        const recentHistory = history.length > 50 ? history.slice(-50) : history;

        const payload = {
            content: finalMessage,
            history: recentHistory,
            systemInstruction: combinedSystemInstruction,
            image: images,
            document: documents,
            language: language || 'English',
            mode: mode
        };

        const result = await axios.post(apis.chatAgent, payload, {
            headers: headers,
            signal: abortSignal,
            withCredentials: true,
            timeout: 60000 // 60s timeout to match backend
        });

        // Return full response data (includes reply and potentially conversion data)
        // Return full response data (includes reply, conversion data, and imageUrl)
        return result.data;

    } catch (error) {
        console.error("Gemini API Error:", error);
        if (error.response?.status === 429) {
            // Allow backend detail to override if present, otherwise default
            const detail = error.response?.data?.details || error.response?.data?.error;
            if (detail) return `System Busy (429): ${detail}`;
            return "The A-Series system is currently busy (Quota limit reached). Please wait 60 seconds and try again.";
        }
        if (error.response?.status === 401) {
            return "Please [Log In](/login) to your AISA™ account to continue chatting.";
        }
        if (error.response?.data?.error === "LIMIT_REACHED") {
            return { error: "LIMIT_REACHED", reason: error.response.data.reason };
        }
        // Return backend error message if available
        if (error.response?.data?.error) {
            const details = error.response.data.details ? ` - ${error.response.data.details}` : '';
            return `System Message: ${error.response.data.error}${details}`;
        }
        if (error.response?.data?.details) {
            return `System Error: ${error.response.data.details}`;
        }
        return "Sorry, I am having trouble connecting to the A-Series network right now. Please check your connection.";
    }
};