/**
 * WP dependencies
 */
import { select, dispatch } from '@wordpress/data';
import { useEffect } from '@wordpress/element';

type SidebarPanelName =
	| 'title'
	| 'categories'
	| 'keywords'
	| 'description'
	| 'post-types'
	| 'transforms';

/** Overrides the initial open/closed state of given sidebar panels. */
export default function useToggleSidebarPanels< T extends SidebarPanelName >( {
	isOpen,
	isClosed,
}: {
	isOpen: T[];
	isClosed: Exclude< SidebarPanelName, T >[];
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

	return useEffect( () => {
		[ ...isOpen, ...isClosed ].forEach( ( panelName: SidebarPanelName ) => {
			const currentPanel = `${ namespace }/${ panelNamePrefix }-${ panelName }`;

			if (
				( ! isEditorPanelOpened( currentPanel ) &&
					isOpen.includes( panelName as T ) ) ||
				( isEditorPanelOpened( currentPanel ) &&
					isClosed.includes(
						panelName as Exclude< SidebarPanelName, T >
					) )
			) {
				toggleEditorPanelOpened( currentPanel );
			}
		} );
	}, [] );
}
