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
import { RichText } from '@wordpress/block-editor';
import { useState, useEffect, useRef } from '@wordpress/element';
import convertToSlug from '../../../app/js/src/utils/convertToSlug';

const FseStudioMetaControls = () => {
	const [ coreLastUpdate, setCoreLastUpdate ] = useState();
	const [ nameInput, setNameInput ] = useState();
	const [ nameInputDisabled, setNameInputDisabled ] = useState();
	const [ patternNameIsInvalid, setPatternNameIsInvalid ] = useState( false );
	const [ errorMessage, setErrorMessage ] = useState(
		__( 'Please enter a unique name.', 'fse-studio' )
	);

	const previousPatternName = useRef();
	const postMeta = wp.data.useSelect( ( select ) => {
		return select( 'core/editor' ).getEditedPostAttribute( 'meta' );
	} );

	// Current sole block type needed to display modal.
	const blockTypePostContent = 'core/post-content';

	// Simple bool to match primary toggle for 'Post Type Modal' section.
	const blockModalVisible =
		postMeta.blockTypes?.includes( blockTypePostContent );

	/**
	 * Get, filter, and sort the custom post types.
	 * Wrapping call in useSelect to prevent async null return on initial load.
	 *
	 * 'core/post-content' in 'Block Types' header always displays for 'page' post type.
	 *
	 * @see https://developer.wordpress.org/block-editor/reference-guides/core-blocks/
	 */
	const postTypes = wp.data.useSelect( ( select ) => {
		const initialPostTypes = select( 'core' ).getPostTypes( {
			per_page: 100,
		} );

		if ( initialPostTypes ) {
			// Core post types that are inapplicable or not user accessible.
			const corePostTypesToRemove = [
				'attachment', // Media
				'nav_menu_item',
				// 'wp_block', // Reusable blocks are a user-accessible post type
				'wp_template',
				'wp_template_part',
				'wp_navigation',
				'fsestudio_pattern',
			];

			const filteredPostTypes = initialPostTypes.filter( ( postType ) => {
				// Since core/post-content always shows for 'page', add blockType value for that index.
				if ( postType.slug === 'page' ) {
					postType.blockType = blockTypePostContent;
				}

				// Filter out the unapplicable core post types.
				return ! corePostTypesToRemove.includes( postType.slug );
			} );

			return sortAlphabetically(
				filteredPostTypes,
				'name',
				'blockType',
				blockTypePostContent
			);
		}
	}, [] );

	useEffect( () => {
		wp.data.subscribe( () => {
			setCoreLastUpdate( Date.now() );
		} );
	}, [] );

	/**
	 * Listener to catch name collision for patterns as they are renamed.
	 * The targeted response should populate `errorMessage` and `patternNameIsInvalid`.
	 */
	useEffect( () => {
		window.addEventListener(
			'message',
			( event ) => {
				const response = JSON.parse( event.data );
				if (
					response.message ===
					'fsestudio_response_is_pattern_title_taken'
				) {
					// Hide or show notice in settings panel on name collision.
					if ( response.isInvalid ) {
						setPatternNameIsInvalid( true );
					} else {
						setPatternNameIsInvalid( false );
					}

					setErrorMessage( response.errorMessage );
				}
			},
			false
		);
	}, [] );

	/**
	 * Edge case: postType 'page' was not selected before modal visibility was checked.
	 * Without this block, 'page' would not be stored to 'Post Types' in the pattern file.
	 */
	useEffect( () => {
		if ( blockModalVisible && ! postMeta?.postTypes?.includes( 'page' ) ) {
			handleToggleChange( true, 'postTypes', 'page' );
		}
	}, [ postMeta ] );

	/**
	 * Set nameInput and inputDisabled state when the post is switched.
	 * Mostly intended to catch switching between patterns.
	 */
	useEffect( () => {
		setNameInput( postMeta.title );
		setNameInputDisabled( true );

		previousPatternName.current = postMeta?.title;
	}, [ postMeta.title ] );

	/**
	 * Edge case: a post type that was previously saved for modal visibility no longer exists.
	 *
	 * This will compare the post types found in post meta to currently allowed modal post types
	 * and clean up both the post meta and pattern file.
	 *
	 * Admittedly, this might be needlessly destructive. The cleanup is not required for modal
	 * visibility to work as expected, and this method only targets one pattern at a time.
	 */
	useEffect( () => {
		if ( postTypes ) {
			/* prettier-ignore */
			const filteredPostTypeSlugs = postTypes?.map( ( postType ) => {
				return postMeta?.postTypes?.includes( postType?.slug ) ?
					postType?.slug :
					'';
			} ).filter( Boolean );

			if (
				! flatUnorderedEquals(
					postMeta.postTypes,
					filteredPostTypeSlugs
				)
			) {
				wp.data.dispatch( 'core/editor' ).editPost( {
					meta: {
						...postMeta,
						postTypes: filteredPostTypeSlugs,
					},
				} );
			}
		}
	}, [ postTypes ] );

	/**
	 * Check that two indexed arrays have the same elements.
	 * Elements do not need to be in order as both arrays will be sorted.
	 *
	 * @param {Array} arrayA
	 * @param {Array} arrayB
	 * @return {boolean} True if the arrays are loosely equal.
	 */
	function flatUnorderedEquals( arrayA, arrayB ) {
		arrayA.sort();
		arrayB.sort();

		return (
			arrayA.length === arrayB.length &&
			arrayA.every( ( value, index ) => {
				return value === arrayB[ index ];
			} )
		);
	}

	/**
	 * Sort an array of objects alphabetically by key.
	 * Optionally, include a key and string to place items on top of the sorted array.
	 *
	 * @param {Array}  arr       The array for sorting.
	 * @param {string} key       The key to use for sorting.
	 * @param {string} topKey    The extra key to check for pushing items to the top.
	 * @param {string} topString The extra string to match for pushing items to the top.
	 * @return {Array}           The sorted array.
	 */
	function sortAlphabetically( arr, key, topKey = '', topString = '' ) {
		// Sort the objects alphabetically by given key.
		arr.sort( ( a, b ) => {
			return a[ key ] > b[ key ] ? 1 : -1;
		} );

		// Check the extra key and string for pushing items to top.
		if ( topKey && topString ) {
			arr.sort( ( a ) => {
				return a[ topKey ] === topString ? -1 : 0;
			} );
		}

		return arr;
	}

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
			<div className="fsestudio-post-type-modal-toggle">
				<PanelRow key={ `fse-pattern-visibility-block-content` }>
					<ToggleControl
						label={ __( 'Modal Visibility', 'fse-studio' ) }
						checked={ postMeta.blockTypes?.includes(
							blockTypePostContent
						) }
						help={
							postMeta.blockTypes?.includes(
								blockTypePostContent
							)
								? __(
										'Enabled for selected post types.',
										'fse-studio'
								  )
								: __(
										'Disabled for all post types.',
										'fse-studio'
								  )
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
			</div>
		);
	}

	/**
	 * Heading component for 'Post Types' section.
	 */
	function PostTypeHeading() {
		return (
			<div className="fsestudio-post-type-heading">
				<PanelHeader>{ __( 'Post Types', 'fse-studio' ) }</PanelHeader>
			</div>
		);
	}

	/**
	 * Toggle component for postType. Intended to be iterated over.
	 * Toggle is disabled and checked if postType is associated with blockTypePostContent.
	 *
	 * @param {Object} props
	 * @param {Object} props.postType
	 */
	function PostTypeToggle( { postType } ) {
		const { name, blockType, slug } = postType;

		return (
			<div className="fsestudio-post-type-toggle">
				<PanelRow key={ `fse-pattern-visibility-post-type-${ name }` }>
					<ToggleControl
						label={ name }
						disabled={
							( blockType === blockTypePostContent &&
								blockModalVisible ) ||
							! postMeta.blockTypes?.includes(
								blockTypePostContent
							)
						}
						checked={
							( blockType === blockTypePostContent &&
								blockModalVisible ) ||
							postMeta.postTypes?.includes( slug )
						}
						help={
							blockType === blockTypePostContent &&
							blockModalVisible
								? __(
										'Enabled by default for modal visibility.',
										'fse-studio'
								  )
								: ''
						}
						onChange={ ( event ) => {
							handleToggleChange( event, 'postTypes', slug );
						} }
					/>
				</PanelRow>
			</div>
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
				title={ __( 'Pattern Title', 'fse-studio' ) }
				icon="edit"
			>
				<PanelRow>
					<div onDoubleClick={ () => setNameInputDisabled( false ) }>
						<TextControl
							disabled={ nameInputDisabled }
							style={ {
								width: '250px',
								height: '40px',
								paddingRight: '80px',
							} }
							value={ nameInput }
							onChange={ ( value ) => {
								setNameInput( value );
								// Fire off a postMessage to validate the nameInput.
								// Input is validated in PatternEditor component.
								window.parent.postMessage(
									JSON.stringify( {
										message:
											'fsestudio_pattern_editor_request_is_pattern_title_taken',
										patternTitle: value, // The newly entered title.
									} )
								);
							} }
						/>
					</div>

					{ /* Conditionally render the "Edit" button for pattern renaming. */ }
					{ /* If the pattern name is valid, show the "Edit" or "Done" option. */ }
					{ ! patternNameIsInvalid && (
						<button
							type="button"
							className="fses-pattern-post-name-button fses-pattern-post-name-button-edit"
							onClick={ () => {
								if (
									! nameInputDisabled &&
									nameInput.toLowerCase() !==
										previousPatternName.current.toLowerCase()
								) {
									wp.data
										.dispatch( 'core/editor' )
										.editPost( {
											meta: {
												...postMeta,
												title: nameInput,
												name: convertToSlug(
													nameInput
												),
												previousName:
													previousPatternName.current,
											},
										} );
								}

								setNameInputDisabled( ! nameInputDisabled );
							} }
						>
							{ nameInputDisabled
								? __( 'Edit', 'fse-studio' )
								: __( 'Done', 'fse-studio' ) }
						</button>
					) }

					{ /* Otherwise, show the "Cancel" button to bail out. */ }
					{ patternNameIsInvalid && (
						<button
							type="button"
							className="fses-pattern-post-name-button fses-pattern-post-name-button-cancel"
							onClick={ () => {
								setNameInput( previousPatternName?.current );
								setNameInputDisabled( true );
								setPatternNameIsInvalid( false );
							} }
						>
							{ __( 'Cancel', 'fse-studio' ) }
						</button>
					) }
				</PanelRow>

				<PanelRow className="components-panel__row-error">
					<RichText.Content
						tagName="h4"
						style={ {
							color: 'red',
							marginTop: '0',
							marginBottom: '0',
						} }
						value={ patternNameIsInvalid && errorMessage }
					/>
				</PanelRow>
			</PluginDocumentSettingPanel>

			{ /* The panel section for controlling pattern post type modals. */ }
			{ /* Custom post types (outside of inapplicable core types) are displayed as toggles. */ }
			<PluginDocumentSettingPanel
				title={ __( 'Post Type Modal', 'fse-studio' ) }
				icon="admin-post"
			>
				{ /* `ModalToggle` will hide or display remaining components via `blockModalVisible`. */ }
				<ModalToggle />

				{ blockModalVisible && <PostTypeHeading /> }

				{ postTypes
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
let patternDataSet = false;
let patternUpdatedDebounce = null;
wp.data.subscribe( () => {
	if ( ! fsestudioPatternEditorLoaded ) {
		window.parent.postMessage( 'fsestudio_pattern_editor_loaded' );
		fsestudioPatternEditorLoaded = true;
	}

	if ( wp.data.select( 'core/editor' ).isEditedPostDirty() ) {
		window.parent.postMessage( 'fsestudio_pattern_editor_dirty' );
	}

	// Whenever the block editor fires that a change happened, pass it up to the parent FSE Studio app state.
	if ( patternDataSet ) {
		clearTimeout( patternUpdatedDebounce );
		patternUpdatedDebounce = setTimeout( () => {
			const meta = wp.data
				.select( 'core/editor' )
				.getEditedPostAttribute( 'meta' );
			// Assemble the current blockPatternData into a single object.
			const blockPatternData = {
				content: wp.data.select( 'core/editor' ).getEditedPostContent(),
				...wp.data
					.select( 'core/editor' )
					.getEditedPostAttribute( 'meta' ),
				slug: meta.name,
			};
			window.parent.postMessage(
				JSON.stringify( {
					message: 'fsestudio_block_pattern_updated',
					blockPatternData,
				} )
			);
		}, 10 );
	}
} );

let fsestudioThemeJsonChangeDebounce = null;
// If the FSE Studio app sends an instruction, listen for and do it here.
window.addEventListener(
	'message',
	( event ) => {
		try {
			const response = JSON.parse( event.data );

			if ( response.message === 'set_initial_pattern_data' ) {
				// Insert the block string so the blocks show up in the editor itself.
				wp.data.dispatch( 'core/editor' ).resetEditorBlocks(
					wp.blocks.rawHandler( {
						HTML: response.patternData.content,
						mode: 'BLOCKS',
					} )
				);

				// A hack to prevent the notice 'The backup of this post in your browser is different from the version below.'
				window.sessionStorage.removeItem(
					`wp-autosave-block-editor-post-${ wp.data
						.select( 'core/editor' )
						.getEditedPostAttribute( 'id' ) }`
				);

				// TODO: Set the categories. They can found at: response.patternData.categories

				// Get all of the pattern meta (and remove anything that is not specifically "pattern meta" here).
				const patternMeta = { ...response.patternData };
				delete patternMeta.content;

				// Set the meta of the pattern
				wp.data.dispatch( 'core/editor' ).editPost( {
					meta: { ...patternMeta },
				} );
				patternDataSet = true;
				window.parent.postMessage( 'fsestudio_pattern_data_set' );
			}

			if ( response.message === 'fsestudio_hotswapped_theme' ) {
				// If the FSE Studio apps tells us the themejson file has been updated, put a notice that the editor should be refreshed.
				clearTimeout( fsestudioThemeJsonChangeDebounce );
				fsestudioThemeJsonChangeDebounce = setTimeout( () => {
					wp.data.dispatch( 'core/notices' ).createNotice(
						'warning', // Can be one of: success, info, warning, error.
						'FSE Studio: The theme selection has changed. To display accurate style options, please refresh this editor.', // Text string to display.
						{
							id: 'fse-studio-refresh-pattern-editor-hotswap-notice',
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
							id: 'fse-studio-refresh-pattern-editor-theme-json-notice',
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
