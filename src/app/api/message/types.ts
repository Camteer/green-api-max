export interface GreenApiMessage {
	type: 'incoming' | 'outgoing';
	idMessage: string;
	timestamp: number;
	chatId: string;
	textMessage: string;
}

export interface SendMessageResponse {
	idMessage: string;
}

export interface ReceiveNotification {
	receiptId: number;
	body: {
		typeWebhook: string;
		timestamp: number;
		idMessage: string;
		senderData: {
			chatId: string;
		};
		messageData: {
			typeMessage: string;
			textMessageData?: {
				textMessage: string;
			};
		};
	};
}
