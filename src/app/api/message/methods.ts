import { greenApiRequest, greenApiUrl } from '../client';
import {
	GreenApiMessage,
	ReceiveNotification,
	SendMessageResponse,
} from './types';

export async function receiveNotification() {
	try {
		const result = await greenApiRequest<ReceiveNotification | null>(
			'receiveNotification',
			{
				query: { receiveTimeout: 20 },
			},
		);

		return result;
	} catch (error) {
		if (error instanceof Error && error.message.startsWith('GREEN-API 408')) {
			return null;
		}

		throw error;
	}
}

export async function deleteNotification(receiptId: number) {
	const url = greenApiUrl('deleteNotification', `/${receiptId}`);

	const response = await fetch(url, {
		method: 'DELETE',
		cache: 'no-store',
	});

	if (!response.ok) {
		const error = await response.text();

		throw new Error(`Delete notification error: ${error}`);
	}

	const text = await response.text();

	if (!text.trim()) {
		return { result: true };
	}

	return JSON.parse(text) as { result: boolean; reason?: string };
}

export async function getChatHistory(
	chatId: string,
	count = 100,
): Promise<GreenApiMessage[]> {
	return greenApiRequest<GreenApiMessage[]>('getChatHistory', {
		method: 'POST',
		body: JSON.stringify({
			chatId,
			count,
		}),
	});
}

export async function sendMessage(
	chatId: string,
	message: string,
): Promise<SendMessageResponse> {
	return greenApiRequest<SendMessageResponse>('sendMessage', {
		method: 'POST',
		body: JSON.stringify({
			chatId,
			message,
		}),
	});
}
