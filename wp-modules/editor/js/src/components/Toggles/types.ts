import usePatternData from '../../hooks/usePatternData';
import type { PatternPostData, BaseSidebarProps } from '../SidebarPanels/types';

export type ToggleProps< T extends keyof PatternPostData > = Partial<
	BaseSidebarProps< T >
> & {
	handleChangeMulti?: ReturnType<
		typeof usePatternData
	>[ 'updatePostMetaMulti' ];
};
