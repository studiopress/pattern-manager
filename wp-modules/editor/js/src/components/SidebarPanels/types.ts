import usePatternData from '../../hooks/usePatternData';
import useSavedPostData from '../../hooks/useSavedPostData';
import type { PatternPostData } from '../../types';
import type { Dispatch, SetStateAction } from 'react';

export type BaseSidebarProps< T extends keyof PatternPostData > = Pick<
	PatternPostData,
	T
> & {
	handleChange: ReturnType< typeof usePatternData >[ 'updatePostMeta' ];
};

type AdditionalTypes = {
	blockTypeOptions: ReturnType<
		typeof usePatternData
	>[ 'queriedBlockTypes' ];
	categoryOptions: ReturnType< typeof usePatternData >[ 'queriedCategories' ];
	currentName: ReturnType< typeof useSavedPostData >[ 'currentName' ];
	errorMessage: string;
	patternNames: Array< PatternPostData[ 'slug' ] >;
	postTypeOptions: ReturnType< typeof usePatternData >[ 'queriedPostTypes' ];
	setErrorMessage: Dispatch< SetStateAction< string > >;
};

export type AdditionalSidebarProps< T extends keyof AdditionalTypes > = Pick<
	AdditionalTypes,
	T
>;
