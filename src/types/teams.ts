export type TeamOptions = {
	email: string;
	name?: string;
	password?: string;
	instant?: boolean;
	admin?: boolean;
	group?: string;
};

export type TeamParameters = {
	token: string;
	email: string;
	name: string | undefined;
	password: string | undefined;
	instant: string | undefined;
	admin: string | undefined;
	group: string | undefined;
};
