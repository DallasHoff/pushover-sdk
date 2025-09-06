import type { PushoverResponse } from './pushover.js';

export const LICENSE_OPERATING_SYSTEMS = ['Android', 'iOS', 'Desktop'] as const;

export type LicenseOperatingSystem = (typeof LICENSE_OPERATING_SYSTEMS)[number];

export type LicenseOptions = {
	os?: LicenseOperatingSystem;
} & ({ user: string } | { email: string });

/** @internal */
export type LicenseParameters = {
	token: string;
	user: string | undefined;
	email: string | undefined;
	os: LicenseOperatingSystem | undefined;
};

export type LicenseResponse = PushoverResponse & {
	credits: number;
};
