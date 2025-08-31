export type PushoverOptions = {
	token: string;
	user?: string;
};

/** @internal */
export type PushoverRequest = {
	endpoint: string;
	method: 'GET' | 'POST';
	parameters: Record<string, string | undefined>;
	attachment?: Blob;
};

export type PushoverResponse = {
	status: 1;
	request: string;
};
