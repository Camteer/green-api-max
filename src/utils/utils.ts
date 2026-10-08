export function getDateLabel(timestamp: number) {
	const date = new Date(timestamp * 1000);
	const today = new Date();
	const yesterday = new Date();

	yesterday.setDate(today.getDate() - 1);

	if (date.toDateString() === today.toDateString()) {
		return 'Сегодня';
	}

	if (date.toDateString() === yesterday.toDateString()) {
		return 'Вчера';
	}

	return date.toLocaleDateString('ru-RU', {
		day: 'numeric',
		month: 'long',
		year: 'numeric',
	});
}

export function getMessageTime(timestamp: number) {
	return new Date(timestamp * 1000).toLocaleTimeString('ru-RU', {
		hour: '2-digit',
		minute: '2-digit',
	});
}

export const formatPhone = (value: string) => {
	const digits = value.replace(/\D/g, '').replace(/^7/, '').slice(0, 10);

	let result = '+7';

	if (digits.length > 0) result += ` ${digits.slice(0, 3)}`;
	if (digits.length > 3) result += ` ${digits.slice(3, 6)}`;
	if (digits.length > 6) result += ` ${digits.slice(6, 8)}`;
	if (digits.length > 8) result += ` ${digits.slice(8, 10)}`;

	return result;
};
