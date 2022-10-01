export const KEYS = {
	AUTH: {
		TOKEN: 'token',
	},
	URLS: {
		BASE_API: import.meta.env.VITE_API,
	},
}

export const SEARCH_OPTIONS = {
	keys: ['patientName'],
	threshold: 0.5,
}
