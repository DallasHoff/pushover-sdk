import type { PushoverResponse } from './pushover.js';

export type LicenseOptions = {
	os?: 'Android' | 'iOS' | 'Desktop';
} & ({ user: string } | { email: string });

export type LicenseParameters = {
	token: string;
	user: string | undefined;
	email: string | undefined;
	os: string | undefined;
};

export type LicenseResponse = PushoverResponse & {
	credits: number;
};
