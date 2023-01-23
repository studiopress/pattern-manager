import { select, dispatch } from '@wordpress/data';
import { useEffect } from '@wordpress/element';

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

	const {
		isEditorPanelOpened,
	}: {
		isEditorPanelOpened: ( arg: string ) => boolean;
	} = select( 'core/edit-post' );

	const {
		toggleEditorPanelOpened,
	}: {
		toggleEditorPanelOpened: ( arg: string ) => Promise< void >;
	} = dispatch( 'core/edit-post' );

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
