export type GlanceOptions = {
	user?: string;
	device?: string;
	title?: string;
	text?: string;
	subtext?: string;
	count?: number;
	percent?: number;
};

export type GlanceParameters = {
	token: string;
	user: string;
	device: string | undefined;
	title: string | undefined;
	text: string | undefined;
	subtext: string | undefined;
	count: string | undefined;
	percent: string | undefined;
};
