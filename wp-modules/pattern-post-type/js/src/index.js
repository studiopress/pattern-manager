import '../../css/src/index.scss';
import { registerPlugin } from '@wordpress/plugins';
import { __ } from '@wordpress/i18n';
import { PluginDocumentSettingPanel } from '@wordpress/edit-post';
import {
	PanelHeader,
	PanelRow,
	Spinner,
	TextControl,
	ToggleControl,
} from '@wordpress/components';
import { useState, useEffect } from '@wordpress/element';

const FseStudioMetaControls = () => {
	const [ coreLastUpdate, setCoreLastUpdate ] = useState();
	const [ postTypes, setPostTypes ] = useState( null );

	const postMeta = wp.data
		.select( 'core/editor' )
		.getEditedPostAttribute( 'meta' );

	/**
	 * Get all of the post types for filtering.
	 * Wrapping call in useSelect to prevent async null return on initial load.
	 */
	const getPostTypes = wp.data.useSelect(
		( select ) => select( 'core' ).getPostTypes( { per_page: -1 } ),
		[]
	);

	// Current sole block type needed to display modal.
	const blockTypePostContent = 'core/post-content';

	// Simple bool to match primary toggle for 'Post Type Modal' section.
	const blockModalVisible = postMeta.blockTypes?.includes(
		blockTypePostContent
	)
		? true
		: false;

	useEffect( () => {
		wp.data.subscribe( () => {
			setCoreLastUpdate( Date.now() );
		} );
	}, [] );

	/**
	 * Filter and setup postTypes for mapping.
	 * 'core/post-content' in 'Block Types' header always displays for 'page' post type.
	 *
	 * @see https://developer.wordpress.org/block-editor/reference-guides/core-blocks/
	 */
	useEffect( () => {
		if ( getPostTypes === null ) {
			return;
		}

		// Core post types to filter.
		const corePostTypesToFilter = [
			'attachment', // Media
			'nav_menu_item',
			'wp_block',
			'wp_template',
			'wp_template_part',
			'wp_navigation',
		];

		const filteredPostTypes = getPostTypes.filter( ( postType ) => {
			// Since core/post-content always shows for 'page', add blockType value for that index.
			if ( postType.slug === 'page' ) {
				postType.blockType = blockTypePostContent;
			}
			// Filter out the unapplicable core post types.
			return ! corePostTypesToFilter.includes( postType.slug );
		} );

		setPostTypes( filteredPostTypes );
	}, [ getPostTypes ] );

	/**
	 * Edge case for postType 'page' if it was not selected before modal visibility is checked.
	 * Without this block, 'page' would not be stored to 'Post Types' in the pattern file.
	 */
	useEffect( () => {
		if ( blockModalVisible && ! postMeta?.postTypes?.includes( 'page' ) ) {
			handleToggleChange( true, 'postTypes', 'page' );
		}
	}, [ postMeta ] );

	/**
	 * Handler for ToggleControl component changes.
	 * Updates postMeta via wp.data.dispatch.
	 *
	 * @param {boolean} event The toggle event.
	 * @param {string}  key   The object key to reference in postMeta.
	 * @param {string}  value The value to update or remove from postMeta.
	 */
	function handleToggleChange( event, key, value ) {
		let updatedValues = [];

		if ( event ) {
			updatedValues = ! postMeta[ key ]?.includes( value )
				? postMeta[ key ]?.concat( [ value ] )
				: postMeta[ key ];
		} else {
			updatedValues = postMeta[ key ]?.includes( value )
				? postMeta[ key ]?.filter( ( item ) => {
						return item !== value;
				  } )
				: postMeta[ key ];
		}

		wp.data.dispatch( 'core/editor' ).editPost( {
			meta: {
				...postMeta,
				[ key ]: updatedValues,
			},
		} );
	}

	/**
	 * Primary toggle component.
	 * The value of this toggle hides or shows the 'Post Types' section.
	 */
	function ModalToggle() {
		return (
			<PanelRow key={ `fse-pattern-visibility-block-content` }>
				<ToggleControl
					label={ __( 'Modal Visibility', 'fse-studio' ) }
					checked={
						postMeta.blockTypes?.includes( blockTypePostContent )
							? true
							: false
					}
					help={
						postMeta.blockTypes?.includes( blockTypePostContent )
							? 'Enabled for selected post types.'
							: 'Disabled for all post types.'
					}
					onChange={ ( event ) => {
						handleToggleChange(
							event,
							'blockTypes',
							blockTypePostContent
						);
					} }
				/>
			</PanelRow>
		);
	}

	/**
	 * Heading component for 'Post Types' section.
	 */
	function PostTypeHeading() {
		return <PanelHeader>{ __( 'Post Types', 'fse-studio' ) }</PanelHeader>;
	}

	/**
	 * Toggle component for postType. Intended to be iterated over.
	 * Toggle is disabled and checked if postType is associated with blockTypePostContent.
	 *
	 * @param {Object} postType
	 * @param {Object} postType.postType
	 */
	function PostTypeToggle( { postType } ) {
		const { name, blockType, slug } = postType;

		return (
			<PanelRow key={ `fse-pattern-visibility-post-type-${ name }` }>
				<ToggleControl
					label={ name }
					disabled={
						/* prettier-ignore */
						blockType === blockTypePostContent &&
						blockModalVisible ||
						! postMeta.blockTypes?.includes(
							blockTypePostContent
						)
							? true
							: false
					}
					checked={
						/* prettier-ignore */
						blockType === blockTypePostContent &&
						blockModalVisible ||
						postMeta.postTypes?.includes(
							slug
						)
							? true
							: postMeta.postTypes?.includes(
									slug
								)
					}
					help={
						/* prettier-ignore */
						blockType === blockTypePostContent &&
						blockModalVisible
							? 'Enabled by default for modal visibility.'
							: ''
					}
					onChange={ ( event ) => {
						handleToggleChange( event, 'postTypes', slug );
					} }
				/>
			</PanelRow>
		);
	}

	if (
		'fsestudio_pattern' !==
		wp.data.select( 'core/editor' ).getCurrentPostType()
	) {
		return null; // Will only render component for post type 'fsestudio_pattern'
	}

	if ( postMeta?.type === 'template' ) {
		return (
			<div id={ coreLastUpdate }>
				<PluginDocumentSettingPanel
					className="fsestudio-template-details"
					title={ __( 'Template Details', 'fse-studio' ) }
					icon="edit"
				>
					<PanelRow>
						{ __( 'Template:', 'fse-studio' ) +
							' ' +
							postMeta.title }
					</PanelRow>
				</PluginDocumentSettingPanel>
			</div>
		);
	}

	return (
		<div id={ coreLastUpdate }>
			<PluginDocumentSettingPanel
				title={ __( 'Pattern Settings', 'fse-studio' ) }
				icon="edit"
			>
				<PanelRow>
					<TextControl
						label={ __( 'Pattern Name', 'fse-studio' ) }
						value={ postMeta.title }
						onChange={ ( value ) => {
							wp.data.dispatch( 'core/editor' ).editPost( {
								meta: {
									...postMeta,
									title: value,
								},
							} );
						} }
					/>
				</PanelRow>
			</PluginDocumentSettingPanel>

			<PluginDocumentSettingPanel
				title={ __( 'Post Type Modal', 'fse-studio' ) }
				icon="admin-post"
			>
				<ModalToggle />

				{ blockModalVisible && <PostTypeHeading /> }

				{ postTypes && postTypes !== null
					? blockModalVisible &&
					  postTypes.map( ( postType ) => {
							return (
								<PostTypeToggle
									key={ postType.slug }
									postType={ postType }
								/>
							);
					  } )
					: blockModalVisible && <Spinner /> }
			</PluginDocumentSettingPanel>
		</div>
	);
};

registerPlugin( 'fsestudio-postmeta-for-patterns', {
	icon: null,
	render: () => {
		return <FseStudioMetaControls />;
	},
} );

// Change the word "Publish" to "Save Pattern"
function changeWords( translation, text ) {
	const postMeta = wp.data
		.select( 'core/editor' )
		.getEditedPostAttribute( 'meta' );

	if ( postMeta?.type === 'pattern' ) {
		if ( text === 'Publish' ) {
			return 'Save pattern to theme';
		}
		if ( text === 'Post published.' || text === 'Post updated.' ) {
			return 'Pattern saved to theme';
		}
		if ( text === 'Update' || text === 'Post updated.' ) {
			return 'Update Pattern';
		}
		if ( text === 'Add New Tag' ) {
			return 'Pattern Categories';
		}
		if ( text === 'Saved' ) {
			return 'Saved to your theme directory';
		}
	}

	if ( postMeta?.type === 'template' ) {
		if ( text === 'Pattern' ) {
			return 'Template';
		}
		if ( text === 'Publish' ) {
			return 'Save template to theme';
		}
		if ( text === 'Post published.' || text === 'Post updated.' ) {
			return 'Template saved to theme';
		}
		if ( text === 'Update' || text === 'Post updated.' ) {
			return 'Update Template';
		}
		if ( text === 'Add New Tag' ) {
			return 'Pattern Categories';
		}
		if ( text === 'Saved' ) {
			return 'Saved to your theme directory';
		}
	}

	return translation;
}
wp.hooks.addFilter( 'i18n.gettext', 'fse-studio/changeWords', changeWords );

wp.hooks.removeFilter(
	'blockEditor.__unstableCanInsertBlockType',
	'removeTemplatePartsFromInserter'
);

// Tell the parent page (fse studio) that we are loaded.
let fsestudioPatternEditorLoaded = false;
let fsestudioBlockPatternEditorIsSaving = false;
wp.data.subscribe( () => {
	if ( ! fsestudioPatternEditorLoaded ) {
		window.parent.postMessage( 'fsestudio_pattern_editor_loaded' );
		fsestudioPatternEditorLoaded = true;
	}

	if ( wp.data.select( 'core/editor' ).isEditedPostDirty() ) {
		window.parent.postMessage( 'fsestudio_pattern_editor_dirty' );
	}

	// If saving just started, set a flag.
	if (
		wp.data.select( 'core/editor' ).isSavingPost() &&
		! fsestudioBlockPatternEditorIsSaving
	) {
		fsestudioBlockPatternEditorIsSaving = true;
	}
	if (
		! wp.data.select( 'core/editor' ).isSavingPost() &&
		fsestudioBlockPatternEditorIsSaving
	) {
		window.parent.postMessage( 'fsestudio_pattern_editor_save_complete' );
		fsestudioBlockPatternEditorIsSaving = false;
	}
} );

let fsestudioSaveDebounce = null;
let fsestudioSaveAndRefreshDebounce = null;
let fsestudioThemeJsonChangeDebounce = null;
// If the FSE Studio app sends an instruction, listen for and do it here.
window.addEventListener(
	'message',
	( event ) => {
		try {
			const response = JSON.parse( event.data );

			if ( response.message === 'fsestudio_save_and_refresh' ) {
				// If the FSE Studio apps tells us to save the current post, do it:
				clearTimeout( fsestudioSaveAndRefreshDebounce );
				fsestudioSaveAndRefreshDebounce = setTimeout( () => {
					wp.data
						.dispatch( 'core/editor' )
						.savePost()
						.then( () => {
							window.location.reload();
						} );
				}, 100 );
			}

			if ( response.message === 'fsestudio_save' ) {
				// If the FSE Studio apps tells us to save the current post, do it:
				clearTimeout( fsestudioSaveDebounce );
				fsestudioSaveDebounce = setTimeout( () => {
					wp.data.dispatch( 'core/editor' ).savePost();
				}, 200 );
			}

			if (
				response.message === 'fsestudio_themejson_changed' ||
				response.message === 'fsestudio_stylejson_changed'
			) {
				// If the FSE Studio apps tells us the themejson file has been updated, put a notice that the editor should be refreshed.
				clearTimeout( fsestudioThemeJsonChangeDebounce );
				fsestudioThemeJsonChangeDebounce = setTimeout( () => {
					wp.data.dispatch( 'core/notices' ).createNotice(
						'warning', // Can be one of: success, info, warning, error.
						"FSE Studio: The values in this theme's theme.json or style variation files have changed. To experience them accurately, you will need to refresh this editor.", // Text string to display.
						{
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
				}, 200 );
			}
		} catch ( e ) {
			// Message posted was not JSON, so do nothing.
		}
	},
	false
);
