import type { LicenseOperatingSystem } from './licenses.js';
import type { PushoverResponse } from './pushover.js';

export type TeamOptions = {
	email: string;
	name?: string;
	password?: string;
	instant?: boolean;
	admin?: boolean;
	group?: string;
};

/** @internal */
export type TeamParameters = {
	token: string;
	email: string;
	name: string | undefined;
	password: string | undefined;
	instant: string | undefined;
	admin: string | undefined;
	group: string | undefined;
};

export type TeamResponse = PushoverResponse & {
	name: string;
	users: {
		id: string;
		name: string;
		email: string;
		administrator: boolean;
		devices: {
			name: string;
			os: LicenseOperatingSystem;
			os_version: string;
			enabled: boolean;
			administratively_disabled: boolean;
		}[];
	}[];
};
