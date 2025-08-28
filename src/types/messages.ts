import type { PushoverResponse } from './pushover.js';

export type MessageOptions = {
	user?: string | string[];
	device?: string | string[];
	sound?: Sound;
	timestamp?: number | Date;
	title?: string;
	ttl?: number;
	attachment?: Attachment;
} & (
	| {
			url: string | URL;
			urlTitle?: string;
	  }
	| {
			url?: undefined;
	  }
) &
	(
		| {
				html: boolean;
		  }
		| {
				monospace: boolean;
		  }
		| {
				html?: undefined;
				monospace?: undefined;
		  }
	) &
	(
		| {
				priority?: Exclude<Priority, Priority.EMERGENCY>;
		  }
		| {
				priority: Priority.EMERGENCY;
				retry: number;
				expire: number;
				callback?: string | URL;
				tags?: string[];
		  }
	);

export type MessageParameters = {
	token: string;
	user: string;
	message: string;
	callback: string | undefined;
	device: string | undefined;
	expire: string | undefined;
	html: '1' | undefined;
	monospace: '1' | undefined;
	priority: string | undefined;
	retry: string | undefined;
	sound: Sound | undefined;
	tags: string | undefined;
	timestamp: string | undefined;
	title: string | undefined;
	ttl: string | undefined;
	url: string | undefined;
	url_title: string | undefined;
	attachment_type: string | undefined;
};

export type Attachment = Blob | File;

export enum Priority {
	LOWEST = -2,
	LOW = -1,
	NORMAL = 0,
	HIGH = 1,
	EMERGENCY = 2,
}

export type Sound =
	| (string & {})
	| 'pushover'
	| 'bike'
	| 'bugle'
	| 'cashregister'
	| 'classical'
	| 'cosmic'
	| 'falling'
	| 'gamelan'
	| 'incoming'
	| 'intermission'
	| 'magic'
	| 'mechanical'
	| 'pianobar'
	| 'siren'
	| 'spacealarm'
	| 'tugboat'
	| 'alien'
	| 'climb'
	| 'persistent'
	| 'echo'
	| 'updown'
	| 'vibrate'
	| 'none';

export type MessageResponse = PushoverResponse & {
	receipt?: string;
};

export type SoundsResponse = PushoverResponse & {
	sounds: Record<Sound, string>;
};

export type LimitsResponse = PushoverResponse & {
	limit: number;
	remaining: number;
	reset: number;
};

export type ValidationResponse = PushoverResponse & {
	devices: string[];
	licenses: string[];
};

export type ReceiptResponse = PushoverResponse & {
	acknowledged: 1 | 0;
	acknowledged_at: number;
	acknowledged_by: string;
	acknowledged_by_device: string;
	last_delivered_at: number;
	expired: 1 | 0;
	expires_at: number;
	called_back: 1 | 0;
	called_back_at: number;
};

export type ReceiptsCanceledResponse = PushoverResponse & {
	canceled: number;
};
