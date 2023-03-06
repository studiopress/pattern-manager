import usePatternData from '../../hooks/usePatternData';
import useSavedPostData from '../../hooks/useSavedPostData';
import type { Pattern, PostMeta } from '../../types';
import type { Dispatch, SetStateAction } from 'react';

export type PatternPostData = PostMeta & {
	title: string;
};

export type BaseSidebarProps< T extends keyof PatternPostData > = Pick<
	PatternPostData,
	T
> & {
	handleChange: ReturnType< typeof usePatternData >[ 'updatePostMeta' ];
};

export type AdditionalSidebarProps = {
	blockTypeOptions: ReturnType<
		typeof usePatternData
	>[ 'queriedBlockTypes' ];
	categoryOptions: ReturnType< typeof usePatternData >[ 'queriedCategories' ];
	currentName: ReturnType< typeof useSavedPostData >[ 'currentName' ];
	errorMessage: string;
	patternNames: Array< Pattern[ 'name' ] >;
	postTypeOptions: ReturnType< typeof usePatternData >[ 'queriedPostTypes' ];
	setErrorMessage: Dispatch< SetStateAction< string > >;
};
