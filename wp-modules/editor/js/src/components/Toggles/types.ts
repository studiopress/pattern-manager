import usePatternData from '../../hooks/usePatternData';
import type { BaseSidebarProps } from '../SidebarPanels/types';
import type { PatternPostData } from '../../types';

export type ToggleProps< T extends keyof PatternPostData > = Partial<
	BaseSidebarProps< T >
> & {
	handleChangeMulti?: ReturnType<
		typeof usePatternData
	>[ 'updatePostMetaMulti' ];
};
