export class PushoverResponseError extends Error {
	constructor(message: string) {
		super(message);
		this.name = 'PushoverResponseError';
	}
}

export class PushoverParameterError extends Error {
	constructor(message: string) {
		super(message);
		this.name = 'PushoverParameterError';
	}
}
