function getGreenApiConfig() {
	const GREEN_API_URL = 'https://3100.api.green-api.com';
	const INSTANCE_ID = process.env.NEXT_PUBLIC_GREEN_API_INSTANCE_ID;
	const TOKEN = process.env.NEXT_PUBLIC_GREEN_API_TOKEN;

	if (!INSTANCE_ID || !TOKEN) {
		throw new Error('GREEN-API environment variables are missing');
	}

	return { GREEN_API_URL, INSTANCE_ID, TOKEN };
}

export async function greenApiRequest<T>(
	path: string,
	options?: RequestInit & { query?: Record<string, string | number> },
): Promise<T> {
	const { GREEN_API_URL, INSTANCE_ID, TOKEN } = getGreenApiConfig();
	const { query, headers, ...fetchOptions } = options ?? {};

	const url = new URL(
		`${GREEN_API_URL}/waInstance${INSTANCE_ID}/${path}/${TOKEN}`,
	);

	
	if (query) {
		for (const [key, value] of Object.entries(query)) {
			url.searchParams.set(key, String(value));
		}
	}

	const response = await fetch(url, {
		...fetchOptions,
		headers: {
			'Content-Type': 'application/json',
			...headers,
		},
	});

	if (!response.ok) {
		const error = await response.text();

		throw new Error(`GREEN-API ${response.status}: ${error}`);
	}

	const text = await response.text();

	return JSON.parse(text) as T;
}

export function greenApiUrl(path: string, extraPath = '') {
	const { GREEN_API_URL, INSTANCE_ID, TOKEN } = getGreenApiConfig();

	return (
		`${GREEN_API_URL}/waInstance${INSTANCE_ID}` +
		`/${path}/${TOKEN}${extraPath}`
	);
}
