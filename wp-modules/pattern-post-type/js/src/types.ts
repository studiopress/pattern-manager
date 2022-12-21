export type PostMeta = {
	type: "pattern" | "template" | "template_part";
	title: string;
	slug: string;
	name: string;
	previousName: string;
	description: string;
	postTypes: string[];
	blockTypes: string[];
	categories: string[];
	keywords: string[];
	inserter: boolean;
	viewportWidth: string | number;
};

export type SelectOptions = {
	label: string;
	value: string;
};
