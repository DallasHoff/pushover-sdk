import { PushoverParameterError } from './errors.js';
import type { MessageOptions, MessageParameters } from './types/messages.js';

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
		throw new PushoverParameterError('No user specified');
	}
	return input;
}

export function normalizeMessage(
	token: string,
	user: string | undefined,
	options: MessageOptions,
): MessageParameters {
	const parameters: MessageParameters = {
		token,
		user: normalizeUser(normalizeList(options.user) ?? user),
		message: options.message,
		callback:
			'callback' in options ? normalizeUrl(options.callback) : undefined,
		device: normalizeList(options.device),
		encrypted:
			'encrypted' in options ? normalizeFlag(options.encrypted) : undefined,
		expire: 'expire' in options ? normalizeInt(options.expire) : undefined,
		html: 'html' in options ? normalizeFlag(options.html) : undefined,
		monospace:
			'monospace' in options ? normalizeFlag(options.monospace) : undefined,
		priority: normalizeInt(options.priority),
		retry: 'retry' in options ? normalizeInt(options.retry) : undefined,
		sound: options.sound,
		tags: 'tags' in options ? normalizeList(options.tags) : undefined,
		timestamp: normalizeTime(options.timestamp),
		title: options.title,
		ttl: normalizeInt(options.ttl),
		url: normalizeUrl(options.url),
		url_title: 'urlTitle' in options ? options.urlTitle : undefined,
		attachment_type: normalizeFileType(options.attachment),
	};
	return parameters;
}
