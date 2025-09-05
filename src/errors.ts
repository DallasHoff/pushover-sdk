/**
 * The base class for all errors that this SDK might throw.
 */
export class PushoverError extends Error {
	constructor(message: string, cause?: unknown) {
		super(message, { cause });
		this.name = 'PushoverError';
	}
}

/**
 * An error that is thrown when the Pushover API responds with an
 * error status.
 */
export class PushoverResponseError extends PushoverError {
	constructor(message: string, cause?: unknown) {
		super(message, cause);
		this.name = 'PushoverResponseError';
	}
}

/**
 * An error that is thrown when the parameters passed to the
 * Pushover API are invalid in some way.
 */
export class PushoverParameterError extends PushoverError {
	constructor(message: string, cause?: unknown) {
		super(message, cause);
		this.name = 'PushoverParameterError';
	}
}
