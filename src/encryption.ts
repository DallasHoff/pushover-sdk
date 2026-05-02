import { PushoverParameterError } from './errors.js';

/**
 * TODO
 */
export function generateEncryptionKey(): string {
	const bytes = crypto.getRandomValues(new Uint8Array(32));
	return Array.from(bytes)
		.map((b) => b.toString(16).padStart(2, '0'))
		.join('');
}

/**
 * TODO
 */
export async function encrypt(
	message: string,
	encryptionKey: string,
): Promise<string> {
	if (encryptionKey.length !== 64) {
		throw new PushoverParameterError(
			'The encryption key must be 64 hexidecimal characters (32 bytes)',
		);
	}

	const keyBytes = hexToBytes(encryptionKey);

	// GZIP compress the plaintext
	const encoder = new TextEncoder();
	const inputData = encoder.encode(message);

	const cs = new CompressionStream('gzip');
	const compressedStream = new Blob([inputData]).stream().pipeThrough(cs);
	const compressed = new Uint8Array(
		await new Response(compressedStream).arrayBuffer(),
	);

	// Generate a random 16-byte IV
	const iv = crypto.getRandomValues(new Uint8Array(16));

	// Encrypt the compressed data with AES-256-CBC (PKCS7 padding)
	// using the 256-bit key and the IV
	const aesKey = await crypto.subtle.importKey(
		'raw',
		keyBytes,
		'AES-CBC',
		false,
		['encrypt'],
	);

	const ciphertext = new Uint8Array(
		await crypto.subtle.encrypt({ name: 'AES-CBC', iv }, aesKey, compressed),
	);

	// Compute HMAC-SHA256 over the IV concatenated with the ciphertext
	// using the same key
	const hmacKey = await crypto.subtle.importKey(
		'raw',
		keyBytes,
		{ name: 'HMAC', hash: 'SHA-256' },
		false,
		['sign'],
	);

	const macInput = new Uint8Array(iv.length + ciphertext.length);
	macInput.set(iv, 0);
	macInput.set(ciphertext, iv.length);

	const hmac = new Uint8Array(
		await crypto.subtle.sign('HMAC', hmacKey, macInput),
	);

	// Base64 encode the concatenation of IV + ciphertext + HMAC
	const output = new Uint8Array(iv.length + ciphertext.length + hmac.length);
	output.set(iv, 0);
	output.set(ciphertext, iv.length);
	output.set(hmac, iv.length + ciphertext.length);

	return base64Encode(output);
}

function hexToBytes(hex: string): Uint8Array<ArrayBuffer> {
	const bytes = new Uint8Array(hex.length / 2);
	for (let i = 0; i < bytes.length; i++) {
		bytes[i] = parseInt(hex.substring(i * 2, i * 2 + 2), 16);
	}
	return bytes;
}

function base64Encode(bytes: Uint8Array<ArrayBuffer>): string {
	let binary = '';
	const chunkSize = 0x8000;
	for (let i = 0; i < bytes.length; i += chunkSize) {
		binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
	}
	return btoa(binary);
}
