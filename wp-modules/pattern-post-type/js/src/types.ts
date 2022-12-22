/* eslint-disable camelcase */

export type PostMeta = {
	type: 'pattern' | 'template' | 'template_part';
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

export type SelectQuery = ( dataStore: string ) => {
	getEditedPostAttribute: ( postAttribute: string ) => PostMeta;
	getCurrentPostType: () => string;
	getPostTypes: ( {
		per_page,
	}: {
		per_page?: number | string;
	} ) => { name: string; slug: string }[];
	getBlockPatternCategories: () => { name: string; label: string }[];
	getBlockTypes: () => { name: string; transforms?: unknown }[];
};

export type SelectOptions = {
	label: string;
	value: string;
	isFixed?: boolean;
	transforms?: unknown;
}[];
