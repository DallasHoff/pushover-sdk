import type { PushoverResponse } from './pushover.js';

export const licenseOperatingSystems = ['Android', 'iOS', 'Desktop'] as const;

export type LicenseOperatingSystem = (typeof licenseOperatingSystems)[number];

export type LicenseOptions = {
	os?: LicenseOperatingSystem;
} & ({ user: string } | { email: string });

export type LicenseParameters = {
	token: string;
	user: string | undefined;
	email: string | undefined;
	os: LicenseOperatingSystem | undefined;
};

export type LicenseResponse = PushoverResponse & {
	credits: number;
};
