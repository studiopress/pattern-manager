import { select, dispatch } from '@wordpress/data';
import { useEffect } from '@wordpress/element';

type SelectIsEditorPanelOpened = {
	isEditorPanelOpened: ( arg: string ) => boolean;
};
type DispatchToggleEditorPanel = {
	toggleEditorPanelOpened: ( arg: string ) => Promise< void >;
};

type SidebarPanelName =
	| 'title'
	| 'categories'
	| 'keywords'
	| 'description'
	| 'post-types'
	| 'transforms';

export default function useToggleSidebarPanels( {
	isOpen,
	isClosed,
}: {
	isOpen: SidebarPanelName[];
	isClosed: SidebarPanelName[];
} ) {
	const namespace = 'patternmanager-postmeta-for-patterns';
	const panelNamePrefix = 'patternmanager-pattern-editor-pattern';

	const { isEditorPanelOpened }: SelectIsEditorPanelOpened =
		select( 'core/edit-post' );

	const { toggleEditorPanelOpened }: DispatchToggleEditorPanel =
		dispatch( 'core/edit-post' );

	useEffect( () => {
		[ ...isOpen, ...isClosed ].forEach( ( panelName ) => {
			const currentPanel = `${ namespace }/${ panelNamePrefix }-${ panelName }`;

			if (
				( ! isEditorPanelOpened( currentPanel ) &&
					isOpen.includes( panelName ) ) ||
				( isEditorPanelOpened( currentPanel ) &&
					isClosed.includes( panelName ) )
			) {
				toggleEditorPanelOpened( currentPanel );
			}
		} );
	}, [] );
}
