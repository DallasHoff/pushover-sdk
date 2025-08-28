import type { PushoverResponse } from './pushover.js';

export type GroupAddUserOptions = {
	groupId: string;
	user?: string;
	device?: string;
	memo?: string;
};

export type GroupAddUserParameters = {
	token: string;
	user: string;
	device: string | undefined;
	memo: string | undefined;
};

export type GroupSelectUserOptions = {
	groupId: string;
	user?: string;
	device?: string;
};

export type GroupSelectUserParameters = {
	token: string;
	user: string;
	device: string | undefined;
};

export type GroupCreateResponse = PushoverResponse & {
	group: string;
};

export type GroupListResponse = PushoverResponse & {
	groups: {
		group: string;
		name: string;
	}[];
};

export type GroupInfoResponse = PushoverResponse & {
	name: string;
	users: {
		user: string;
		device: string | null;
		memo: string | null;
		disabled: boolean;
		name?: string;
		email?: string;
	}[];
};
