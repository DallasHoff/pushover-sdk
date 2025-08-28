export function normalizeInt(input: number | undefined): string | undefined {
	return typeof input === 'number' ? Math.round(input).toString() : undefined;
}

export function normalizeTime(
	input: Date | number | undefined,
): string | undefined {
	return typeof input === 'number'
		? normalizeInt(input)
		: input instanceof Date
			? normalizeInt(input.getTime() / 1000)
			: undefined;
}

export function normalizeUrl(
	input: URL | string | undefined,
): string | undefined {
	return input instanceof URL ? input.toString() : input;
}

export function normalizeFlag(input: boolean | undefined): '1' | undefined {
	return input === true ? '1' : undefined;
}

export function normalizeFileType(input: Blob | undefined): string | undefined {
	return input instanceof Blob ? input.type : undefined;
}

export function normalizeList(
	input: string[] | string | undefined,
): string | undefined {
	return Array.isArray(input)
		? input.length
			? input.map((item) => item.trim()).join(',')
			: undefined
		: input;
}

export function normalizeUser(input: string | undefined): string {
	if (!input) {
		throw new Error('No user specified');
	}
	return input;
}
