import { useEffect } from '@wordpress/element';
import { select, subscribe, dispatch } from '@wordpress/data';
import { rawHandler } from '@wordpress/blocks';
import { PostMeta } from '../types';

export default function useSubscription(
	currentPostType: string,
	postDirty: boolean
) {
	useEffect( () => {
		// Tell the parent page (fse studio) that we are loaded.
		let patternmanagerPatternEditorLoaded = false;
		let patternDataSet = false;
		let patternUpdatedDebounce: null | ReturnType< typeof setTimeout > =
			null;
		subscribe( () => {
			if ( ! patternmanagerPatternEditorLoaded && currentPostType ) {
				window.parent.postMessage(
					'patternmanager_pattern_editor_loaded'
				);
				patternmanagerPatternEditorLoaded = true;
			}

			if ( postDirty ) {
				window.parent.postMessage(
					'patternmanager_pattern_editor_dirty'
				);
			}

			// Whenever the block editor fires that a change happened, pass it up to the parent Pattern Manager app state.
			if ( patternDataSet ) {
				clearTimeout( patternUpdatedDebounce );
				patternUpdatedDebounce = setTimeout( () => {
					// Get fresh meta and content for the post.
					const meta: PostMeta =
						select( 'core/editor' ).getEditedPostAttribute(
							'meta'
						);
					const content: string =
						select( 'core/editor' ).getEditedPostContent();

					// Assemble the current blockPatternData into a single object.
					const blockPatternData = {
						content,
						...meta,
						slug: meta.name,
					};
					window.parent.postMessage(
						JSON.stringify( {
							message: 'patternmanager_block_pattern_updated',
							blockPatternData,
						} )
					);
				}, 10 );
			}
		} );

		let patternmanagerThemeJsonChangeDebounce: null | ReturnType<
			typeof setTimeout
		> = null;
		// If the Pattern Manager app sends an instruction, listen for and do it here.
		window.addEventListener(
			'message',
			( event ) => {
				try {
					const response: {
						message: string;
						patternData?: PostMeta;
					} = JSON.parse( event.data );

					if ( response.message === 'set_initial_pattern_data' ) {
						// Insert the block string so the blocks show up in the editor itself.
						dispatch( 'core/editor' ).resetEditorBlocks(
							rawHandler( {
								HTML: response.patternData.content,
								mode: 'BLOCKS',
							} )
						);

						// Prevent this notice: "The backup of this post in your browser is different from the version below."
						// Get all notices, then remove if the notice has a matching wp autosave id.
						const notices = select( 'core/notices' ).getNotices();
						notices?.forEach( ( notice ) => {
							if (
								notice.id.includes( 'wpEditorAutosaveRestore' )
							) {
								dispatch( 'core/notices' ).removeNotice(
									notice.id
								);
							}
						} );

						// TODO: Set the categories. They can found at: response.patternData.categories

						// Get all of the pattern meta (and remove anything that is not specifically "pattern meta" here).
						const patternMeta = { ...response.patternData };
						delete patternMeta.content;

						// Set the meta of the pattern
						dispatch( 'core/editor' ).editPost( {
							meta: { ...patternMeta },
						} );
						patternDataSet = true;
						window.parent.postMessage(
							'patternmanager_pattern_data_set'
						);
					}

					if (
						response.message === 'patternmanager_hotswapped_theme'
					) {
						// If the Pattern Manager apps tells us the themejson file has been updated, put a notice that the editor should be refreshed.
						clearTimeout( patternmanagerThemeJsonChangeDebounce );
						patternmanagerThemeJsonChangeDebounce = setTimeout(
							() => {
								dispatch( 'core/notices' ).createNotice(
									'warning', // Can be one of: success, info, warning, error.
									'Pattern Manager: The theme selection has changed. To display accurate style options, please refresh this editor.', // Text string to display.
									{
										id: 'pattern-manager-refresh-pattern-editor-hotswap-notice',
										isDismissible: false, // Whether the user can dismiss the notice.
										// Any actions the user can perform.
										actions: [
											{
												url: '',
												label: 'Refresh Editor',
											},
										],
									}
								);
							},
							200
						);
					}

					if (
						response.message ===
							'patternmanager_themejson_changed' ||
						response.message === 'patternmanager_stylejson_changed'
					) {
						// If the Pattern Manager apps tells us the themejson file has been updated, put a notice that the editor should be refreshed.
						clearTimeout( patternmanagerThemeJsonChangeDebounce );
						patternmanagerThemeJsonChangeDebounce = setTimeout(
							() => {
								dispatch( 'core/notices' ).createNotice(
									'warning', // Can be one of: success, info, warning, error.
									"Pattern Manager: The values in this theme's theme.json or style variation files have changed. To experience them accurately, you will need to refresh this editor.", // Text string to display.
									{
										id: 'pattern-manager-refresh-pattern-editor-theme-json-notice',
										isDismissible: false, // Whether the user can dismiss the notice.
										// Any actions the user can perform.
										actions: [
											{
												url: '',
												label: 'Refresh Editor',
											},
										],
									}
								);
							},
							200
						);
					}
				} catch ( e ) {
					// Message posted was not JSON, so do nothing.
				}
			},
			false
		);
	}, [] );
}
