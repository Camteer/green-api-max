export type GreenApiChatType = 'user' | 'group' | 'channel' | 'bot' | 'unknown';

export interface GreenApiChat {
	chatId: string;
	name: string;
	type: GreenApiChatType;
	avatar?: string;
	phoneNumber: number;
	unreadCount?: number;
	archive?: boolean;
}

export interface CheckAccountResponse {
	exist: boolean;
	chatId: string;
	fromCache: boolean;
}

export interface ContactInfo {
	avatar: string;
	name: string;
	contactName: string;
	chatId: string;
	chatType: GreenApiChatType;
	lastSeen?: number | null;
	phoneNumber?: number;
	phoneNumberTimestamp?: number;
}