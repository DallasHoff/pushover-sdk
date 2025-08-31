import {
	normalizeFileType,
	normalizeFlag,
	normalizeInt,
	normalizeList,
	normalizeTime,
	normalizeUrl,
	normalizeUser,
} from './normalize.js';
import type {
	PushoverResponse,
	PushoverOptions,
	PushoverRequest,
} from './types/pushover.js';
import type {
	LimitsResponse,
	MessageOptions,
	MessageParameters,
	MessageResponse,
	ReceiptResponse,
	ReceiptsCanceledResponse,
	SoundsResponse,
	ValidationResponse,
} from './types/messages.js';
import type { GlanceOptions, GlanceParameters } from './types/glances.js';
import type {
	LicenseOptions,
	LicenseParameters,
	LicenseResponse,
} from './types/licenses.js';
import type { TeamOptions, TeamParameters } from './types/teams.js';
import type {
	GroupAddUserOptions,
	GroupAddUserParameters,
	GroupCreateResponse,
	GroupInfoResponse,
	GroupListResponse,
	GroupSelectUserOptions,
	GroupSelectUserParameters,
} from './types/groups.js';
import { PushoverResponseError } from './errors.js';

export class Pushover {
	token: string;
	user: string | undefined;

	constructor(options: PushoverOptions) {
		this.token = options.token;
		this.user = options.user;
	}

	private callPushover = async <T extends PushoverResponse>(
		request: PushoverRequest,
	): Promise<T> => {
		const url = new URL(`https://api.pushover.net/1/${request.endpoint}.json`);
		const method = request.method;
		const formData = new FormData();

		const parameterEntries = Object.entries(request.parameters).filter(
			(entry): entry is [string, string] => {
				const [key, value] = entry;
				return typeof key === 'string' && typeof value === 'string';
			},
		);

		for (let [key, value] of parameterEntries) {
			if (method === 'POST') {
				formData.set(key, value);
			} else {
				url.searchParams.set(key, value);
			}
		}

		if (request.attachment && method === 'POST') {
			formData.set('attachment', request.attachment);
		}

		const body = method === 'POST' ? formData : undefined;
		const res = await fetch(url, { method, body });
		const data = (await res.json()) as T;

		if (data.status !== 1) {
			throw new PushoverResponseError(JSON.stringify(data));
		}

		return data;
	};

	/**
	 * Send a push notification.
	 * @see {@link https://pushover.net/api}
	 */
	sendMessage = async (
		message: string | MessageOptions,
	): Promise<MessageResponse> => {
		const options = typeof message === 'string' ? { message } : message;

		const parameters: MessageParameters = {
			token: this.token,
			user: normalizeUser(normalizeList(options.user) ?? this.user),
			message: options.message,
			callback:
				'callback' in options ? normalizeUrl(options.callback) : undefined,
			device: normalizeList(options.device),
			expire: 'expire' in options ? normalizeInt(options.expire) : undefined,
			html: 'html' in options ? normalizeFlag(options.html) : undefined,
			monospace:
				'monospace' in options ? normalizeFlag(options.monospace) : undefined,
			priority: normalizeInt(options.priority),
			retry: 'retry' in options ? normalizeInt(options.retry) : undefined,
			sound: options.sound,
			tags: 'tags' in options ? normalizeList(options.tags) : undefined,
			timestamp: normalizeTime(options.timestamp),
			title: options.title,
			ttl: normalizeInt(options.ttl),
			url: normalizeUrl(options.url),
			url_title: 'urlTitle' in options ? options.urlTitle : undefined,
			attachment_type: normalizeFileType(options.attachment),
		};

		return this.callPushover({
			endpoint: 'messages',
			method: 'POST',
			parameters,
			attachment: options.attachment,
		});
	};

	/**
	 * Fetch a list of available notification sounds.
	 * @see {@link https://pushover.net/api#sounds}
	 */
	getSounds = async (): Promise<SoundsResponse> => {
		return this.callPushover({
			endpoint: 'sounds',
			method: 'GET',
			parameters: { token: this.token },
		});
	};

	/**
	 * Fetch usage limit information.
	 * @see {@link https://pushover.net/api#limits}
	 */
	getLimits = async (): Promise<LimitsResponse> => {
		return this.callPushover({
			endpoint: 'apps/limits',
			method: 'GET',
			parameters: { token: this.token },
		});
	};

	/**
	 * Check that a passed user key is valid.
	 * @see {@link https://pushover.net/api#validate}
	 */
	validateUser = async (
		user: string,
		device?: string,
	): Promise<ValidationResponse> => {
		return this.callPushover({
			endpoint: 'users/validate',
			method: 'POST',
			parameters: { token: this.token, user, device },
		});
	};

	/**
	 * Check the status of a receipt from an emergency-priority notification.
	 * @see {@link https://pushover.net/api/receipts}
	 */
	getReceipt = async (receiptId: string): Promise<ReceiptResponse> => {
		return this.callPushover({
			endpoint: `receipts/${receiptId}`,
			method: 'GET',
			parameters: { token: this.token },
		});
	};

	/**
	 * Cancel retries of an emergency-priority notification by its receipt ID.
	 * @see {@link https://pushover.net/api/receipts#cancel}
	 */
	cancelReceipt = async (receiptId: string): Promise<PushoverResponse> => {
		return this.callPushover({
			endpoint: `receipts/${receiptId}/cancel`,
			method: 'POST',
			parameters: { token: this.token },
		});
	};

	/**
	 * Cancel retries of emergency-priority notifications by a tag.
	 * @see {@link https://pushover.net/api/receipts#cancel_by_tag}
	 */
	cancelReceiptsByTag = async (
		tag: string,
	): Promise<ReceiptsCanceledResponse> => {
		return this.callPushover({
			endpoint: `receipts/cancel_by_tag/${tag}`,
			method: 'POST',
			parameters: { token: this.token },
		});
	};

	/**
	 * Update the data displayed on a widget.
	 * @see {@link https://pushover.net/api/glances}
	 */
	updateGlances = async (
		options: GlanceOptions = {},
	): Promise<PushoverResponse> => {
		const parameters: GlanceParameters = {
			token: this.token,
			user: normalizeUser(options.user ?? this.user),
			device: options.device,
			title: options.title,
			text: options.text,
			subtext: options.subtext,
			count: normalizeInt(options.count),
			percent: normalizeInt(options.percent),
		};

		return this.callPushover({
			endpoint: 'glances',
			method: 'POST',
			parameters,
		});
	};

	/**
	 * Create a message delivery group.
	 * @see {@link https://pushover.net/api/groups#create}
	 */
	createGroup = async (name: string): Promise<GroupCreateResponse> => {
		return this.callPushover({
			endpoint: 'groups',
			method: 'POST',
			parameters: { token: this.token, name },
		});
	};

	/**
	 * Fetch a list of available message delivery groups.
	 * @see {@link https://pushover.net/api/groups#list}
	 */
	getGroups = async (): Promise<GroupListResponse> => {
		return this.callPushover({
			endpoint: 'groups',
			method: 'GET',
			parameters: { token: this.token },
		});
	};

	/**
	 * Fetch information about a message delivery group.
	 * @see {@link https://pushover.net/api/groups#show}
	 */
	getGroup = async (groupId: string): Promise<GroupInfoResponse> => {
		return this.callPushover({
			endpoint: `groups/${groupId}`,
			method: 'GET',
			parameters: { token: this.token },
		});
	};

	/**
	 * Rename a message delivery group.
	 * @see {@link https://pushover.net/api/groups#rename}
	 */
	renameGroup = async (
		groupId: string,
		name: string,
	): Promise<PushoverResponse> => {
		return this.callPushover({
			endpoint: `groups/${groupId}/rename`,
			method: 'POST',
			parameters: { token: this.token, name },
		});
	};

	/**
	 * Add a user to a message delivery group.
	 * @see {@link https://pushover.net/api/groups#add_user}
	 */
	addGroupUser = async (
		options: GroupAddUserOptions,
	): Promise<PushoverResponse> => {
		const parameters: GroupAddUserParameters = {
			token: this.token,
			user: normalizeUser(options.user ?? this.user),
			device: options.device,
			memo: options.memo,
		};

		return this.callPushover({
			endpoint: `groups/${options.groupId}/add_user`,
			method: 'POST',
			parameters,
		});
	};

	/**
	 * Remove a user from a message delivery group.
	 * @see {@link https://pushover.net/api/groups#remove_user}
	 */
	removeGroupUser = async (
		options: GroupSelectUserOptions,
	): Promise<PushoverResponse> => {
		const parameters: GroupSelectUserParameters = {
			token: this.token,
			user: normalizeUser(options.user ?? this.user),
			device: options.device,
		};

		return this.callPushover({
			endpoint: `groups/${options.groupId}/remove_user`,
			method: 'POST',
			parameters,
		});
	};

	/**
	 * Temporarily stop sending messages to a user in a message delivery group.
	 * @see {@link https://pushover.net/api/groups#disable_user}
	 */
	disableGroupUser = async (
		options: GroupSelectUserOptions,
	): Promise<PushoverResponse> => {
		const parameters: GroupSelectUserParameters = {
			token: this.token,
			user: normalizeUser(options.user ?? this.user),
			device: options.device,
		};

		return this.callPushover({
			endpoint: `groups/${options.groupId}/disable_user`,
			method: 'POST',
			parameters,
		});
	};

	/**
	 * Resume sending messages to a user in a message delivery group.
	 * @see {@link https://pushover.net/api/groups#enable_user}
	 */
	enableGroupUser = async (
		options: GroupSelectUserOptions,
	): Promise<PushoverResponse> => {
		const parameters: GroupSelectUserParameters = {
			token: this.token,
			user: normalizeUser(options.user ?? this.user),
			device: options.device,
		};

		return this.callPushover({
			endpoint: `groups/${options.groupId}/enable_user`,
			method: 'POST',
			parameters,
		});
	};

	/**
	 * Fetch the number of available license credits.
	 * @see {@link http://pushover.net/api/licensing#check}
	 */
	getLicenseCredits = async (): Promise<LicenseResponse> => {
		return this.callPushover({
			endpoint: 'licenses',
			method: 'GET',
			parameters: { token: this.token },
		});
	};

	/**
	 * Assign a license to a user.
	 * @see {@link https://pushover.net/api/licensing#assign}
	 */
	assignLicense = async (options: LicenseOptions): Promise<LicenseResponse> => {
		const parameters: LicenseParameters = {
			token: this.token,
			user: 'user' in options ? options.user : undefined,
			email: 'email' in options ? options.email : undefined,
			os: options.os,
		};

		return this.callPushover({
			endpoint: 'licenses/assign',
			method: 'POST',
			parameters,
		});
	};

	/**
	 * Add a user to a team.
	 * @see {@link https://pushover.net/api/teams#add_user}
	 */
	addTeamUser = async (options: TeamOptions): Promise<PushoverResponse> => {
		const parameters: TeamParameters = {
			token: this.token,
			email: options.email,
			name: options.name,
			password: options.password,
			instant: options.instant ? 'true' : undefined,
			admin: options.admin ? 'true' : undefined,
			group: options.group,
		};

		return this.callPushover({
			endpoint: 'teams/add_user',
			method: 'POST',
			parameters,
		});
	};

	/**
	 * Remove a user from a team.
	 * @see {@link https://pushover.net/api/teams#remove_user}
	 */
	removeTeamUser = async (email: string): Promise<PushoverResponse> => {
		return this.callPushover({
			endpoint: 'teams/remove_user',
			method: 'POST',
			parameters: { token: this.token, email },
		});
	};
}
