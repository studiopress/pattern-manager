import usePatternData from '../../hooks/usePatternData';
import useSavedPostData from '../../hooks/useSavedPostData';
import { Pattern, PostMeta } from '../../types';

import type { Dispatch, SetStateAction } from 'react';

export type PatternEditorSidebarProps = {
	postMeta: PostMeta;
};

export type BaseSidebarProps = {
	postMeta: PostMeta;
	handleChange: ReturnType< typeof usePatternData >[ 'updatePostMeta' ];
};

export type AdditionalSidebarProps = {
	blockTypes: ReturnType< typeof usePatternData >[ 'blockTypes' ];
	categories: ReturnType< typeof usePatternData >[ 'categories' ];
	postTypes: ReturnType< typeof usePatternData >[ 'postTypes' ];
	errorMessage: string;
	patternNames: Array< Pattern[ 'name' ] >;
	setErrorMessage: Dispatch< SetStateAction< string > >;
	title: string;
	currentName: ReturnType< typeof useSavedPostData >[ 'currentName' ];
};
