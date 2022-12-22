import usePatternData from '../../hooks/usePatternData';
import { PostMeta } from '../../types';

export type PatternEditorSidebarProps = {
	coreLastUpdate: string;
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
};
