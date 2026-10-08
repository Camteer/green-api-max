
import { greenApiRequest } from '../client';
import { CheckAccountResponse, ContactInfo, GreenApiChat } from './types';


export async function getChats(): Promise<GreenApiChat[]> {
	return greenApiRequest<GreenApiChat[]>('getChats');
}

export async function checkAccount(
	phoneNumber: number,
): Promise<CheckAccountResponse> {
	return greenApiRequest<CheckAccountResponse>('checkAccount', {
		method: 'POST',
		body: JSON.stringify({
			phoneNumber,
		}),
	});
}
