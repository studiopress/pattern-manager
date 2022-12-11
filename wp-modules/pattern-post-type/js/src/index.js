/* eslint-disable @wordpress/no-unused-vars-before-return */

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
	Tooltip,
	Dashicon,
} from '@wordpress/components';
import { RichText } from '@wordpress/block-editor';
import Select from 'react-select';
import CreatableSelect from 'react-select/creatable';
import { useState, useEffect, useRef } from '@wordpress/element';
import convertToSlug from '../../../app/js/src/utils/convertToSlug';

const FseStudioMetaControls = () => {
	const [ coreLastUpdate, setCoreLastUpdate ] = useState();
	const [ nameInput, setNameInput ] = useState();
	const [ nameInputDisabled, setNameInputDisabled ] = useState( true );
	const [ patternNameIsInvalid, setPatternNameIsInvalid ] = useState( false );
	const [ errorMessage, setErrorMessage ] = useState(
		__( 'Please enter a unique name.', 'fse-studio' )
	);
	const [ keywordInputValue, setKeywordInputValue ] = useState( '' );

	const previousPatternName = useRef();
	const postMeta = wp.data.useSelect( ( select ) => {
		return select( 'core/editor' ).getEditedPostAttribute( 'meta' );
	} );

	/**
	 * Get, filter, and sort the custom post types, mapped for react-select.
	 * Wrapping call in useSelect to prevent async null return on initial load.
	 *
	 * 'core/post-content' in 'Block Types' header always displays for 'page' post type.
	 *
	 * @see https://developer.wordpress.org/block-editor/reference-guides/core-blocks/
	 */
	const postTypes = wp.data.useSelect( ( select ) => {
		const initialPostTypes = select( 'core' )
			.getPostTypes( {
				per_page: 100,
			} )
			?.map( ( postType ) => ( {
				label: postType.name,
				value: postType.slug,
			} ) );

		if ( initialPostTypes ) {
			/**
			 * Core post types that are inapplicable or not user accessible.
			 *
			 * Current core types for possible removal:
			  'attachment', // Media
			  'nav_menu_item',
			  'wp_block', // Reusable blocks are a user-accessible post type
			  'wp_template',
			  'wp_template_part',
			  'wp_navigation',
			  'fsestudio_pattern',
			 */
			const corePostTypesToRemove = [
				'attachment',
				'nav_menu_item',
				'wp_navigation',
				'fsestudio_pattern',
			];

			const filteredPostTypes = initialPostTypes.filter( ( postType ) => {
				// Filter out the unapplicable core post types.
				return ! corePostTypesToRemove.includes( postType.value );
			} );

			return sortAlphabetically( filteredPostTypes, 'label' );
		}
	}, [] );

	/**
	 * The alphabetized list of transformable block types, mapped for react-select.
	 * Template-part types are added to support template part replacement in site editor.
	 */
	const transformableBlockTypes = wp.data.useSelect( ( select ) => {
		const registeredBlockTypes = [
			...select( 'core/blocks' )
				.getBlockTypes()
				.map( ( blockType ) => ( {
					label: blockType.name, // blockType.title also available
					value: blockType.name,
					// Only add the transforms property if it exists.
					...( blockType.transforms && {
						transforms: blockType.transforms,
					} ),
				} ) ),
			{
				label: 'core/template-part/header',
				value: 'core/template-part/header',
				transforms: {},
			},
			{
				label: 'core/template-part/footer',
				value: 'core/template-part/footer',
				transforms: {},
			},
		];

		return sortAlphabetically(
			registeredBlockTypes.filter(
				( blockType ) => blockType.transforms
			),
			'label'
		);
	}, [] );

	/**
	 * Alphabetized block pattern categories for the site editor, mapped for react-select.
	 */
	const blockPatternCategories = wp.data.useSelect( ( select ) => {
		return sortAlphabetically(
			select( 'core' )
				.getBlockPatternCategories()
				.map( ( category ) => ( {
					label: category.label,
					value: category.name,
				} ) ),
			'label'
		);
	}, [] );

	/**
	 * Boolean to catch when a template-part related block type is selected.
	 * This is used to automatically select and disable the wp_template post type.
	 */
	const templatePartBlockTypeSelected =
		postMeta?.blockTypes.some(
			( blockType ) => blockType !== 'core/post-content'
		) &&
		postMeta?.blockTypes?.some( ( blockType ) =>
			blockType.includes( 'core/template-part' )
		);

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
					setPatternNameIsInvalid( response.isInvalid );
					setErrorMessage( response.errorMessage );
				}
			},
			false
		);
	}, [] );

	/**
	 * Automatically select the wp_template postType when a template-part blockType is selected.
	 * wp_template postType removal will also be disabled in the postType Select component.
	 */
	useEffect( () => {
		if (
			templatePartBlockTypeSelected &&
			! postMeta?.postTypes?.includes( 'wp_template' )
		) {
			wp.data.dispatch( 'core/editor' ).editPost( {
				meta: {
					...postMeta,
					postTypes: [ ...postMeta.postTypes, 'wp_template' ],
				},
			} );
		}
	}, [ postMeta.postTypes, templatePartBlockTypeSelected ] );

	/**
	 * Set nameInput and inputDisabled state when the post is switched.
	 * Mostly intended to catch switching between patterns.
	 */
	useEffect( () => {
		// postMeta is initially returned with empty values until the select request resolves.
		// Try to prevent populating an empty title by only updating if the type is a pattern.
		// Doing it this way should still catch an empty title if the user somehow passes one.
		if ( postMeta?.type === 'pattern' ) {
			setNameInput( postMeta.title );
			setNameInputDisabled( true );
			// Validate the initial postMeta title.
			checkPatternTitle( postMeta.title );

			previousPatternName.current = postMeta.title;
		}
	}, [ postMeta.title ] );

	/**
	 * Delete non-existing post types that were previously saved to the pattern.
	 *
	 * This will compare the post types found in post meta to currently allowed post types and
	 * clean up both the post meta and pattern file.
	 *
	 * Admittedly, this might be needlessly destructive. The cleanup is not required, and this
	 * method only targets one pattern at a time.
	 */
	useEffect( () => {
		if ( postTypes ) {
			/* prettier-ignore */
			const filteredPostTypeSlugs = postTypes?.map( ( postType ) => {
				return postMeta?.postTypes?.includes( postType?.value ) ?
					postType?.value :
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
	 * Fire off a postMessage to validate pattern title.
	 * String is validated in PatternEditor component.
	 *
	 * @param {string} patternTitle
	 */
	function checkPatternTitle( patternTitle ) {
		window.parent.postMessage(
			JSON.stringify( {
				message:
					'fsestudio_pattern_editor_request_is_pattern_title_taken',
				patternTitle,
			} )
		);
	}

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
		// Block type for displaying in the pattern modal on new post creation.
		const blockTypeForModal = 'core/post-content';

		return (
			<div className="fsestudio-post-type-modal-toggle">
				<PanelRow key={ `fse-pattern-visibility-block-content` }>
					<ToggleControl
						label={
							<ReverseTooltip
								helperText="Show this pattern in a modal when new posts are created."
								helperTitle="Modal visibility"
							/>
						}
						checked={ postMeta.blockTypes?.includes(
							blockTypeForModal
						) }
						help={
							postMeta.blockTypes?.includes( blockTypeForModal )
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
								blockTypeForModal
							);
						} }
					/>
				</PanelRow>
			</div>
		);
	}

	function HelperTooltip( {
		helperText,
		helperTitle,
		icon = 'info-outline',
	} ) {
		return (
			<div className="fsestudio-pattern-sidebar-tooltip">
				<Tooltip text={ helperText } delay="200">
					<div>
						<Dashicon icon={ icon } />
						<span id="tooltip-icon-helper-text">
							{ helperTitle }
						</span>
					</div>
				</Tooltip>
			</div>
		);
	}

	function ReverseTooltip( {
		helperText,
		helperTitle,
		icon = 'info-outline',
	} ) {
		return (
			<div className="fsestudio-pattern-sidebar-reverse-tooltip">
				<Tooltip text={ helperText } delay="200">
					<div>
						<span id="tooltip-icon-helper-text">
							{ helperTitle }
						</span>
						<Dashicon icon={ icon } />
					</div>
				</Tooltip>
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
				{ postMeta?.title && (
					<PanelRow>
						<div
							onDoubleClick={ () =>
								setNameInputDisabled( false )
							}
						>
							<TextControl
								disabled={ nameInputDisabled }
								className="fsestudio-pattern-post-name-input-outer"
								aria-label="Pattern Title Name Input (used for renaming the pattern)"
								value={ nameInput }
								onChange={ ( value ) => {
									setNameInput( value );
									// Validate the nameInput to provide immediate feedback.
									checkPatternTitle( value );
								} }
							/>
						</div>

						{ /* Conditionally render the "Edit" button for pattern renaming. */ }
						{ /* If the pattern name is valid, show the "Edit" or "Done" option. */ }
						{ ! patternNameIsInvalid && (
							<button
								type="button"
								className="fsestudio-pattern-post-name-button fsestudio-pattern-post-name-button-edit"
								aria-label="Pattern Title Edit Button (click to rename the pattern title)"
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
								className="fsestudio-pattern-post-name-button fsestudio-pattern-post-name-button-cancel"
								aria-label="Pattern Title Cancel Button (click to cancel renaming)"
								onClick={ () => {
									setNameInput(
										previousPatternName?.current
									);
									setNameInputDisabled( true );
									setPatternNameIsInvalid( false );
								} }
							>
								{ __( 'Cancel', 'fse-studio' ) }
							</button>
						) }
					</PanelRow>
				) }

				<PanelRow className="components-panel__row-fsestudio-pattern-name-error">
					<RichText.Content
						tagName="h4"
						className="components-panel__row-fsestudio-pattern-name-error-inner"
						value={ patternNameIsInvalid && errorMessage }
					/>
				</PanelRow>
			</PluginDocumentSettingPanel>

			{ /* The panel section for restricting post types for the pattern. */ }
			{ /* Custom post types and certain core types are displayed as toggles. */ }
			<PluginDocumentSettingPanel
				title={ __( 'Post Types', 'fse-studio' ) }
				icon="admin-post"
			>
				<HelperTooltip
					helperText="With no selections, this pattern will show for all post types."
					helperTitle="Allowed post types"
				/>
				{ postTypes ? (
					<Select
						isMulti
						isClearable
						closeMenuOnSelect={ false }
						value={ postMeta?.postTypes?.map( ( postType ) => {
							return {
								...postTypes.find(
									( matchedPostType ) =>
										matchedPostType.value === postType
								),
								// Conditionally make wp_template post type non-removable.
								// Add a custom label with Tooltip.
								...( postType === 'wp_template' &&
									templatePartBlockTypeSelected && {
										label: (
											<ReverseTooltip
												helperText='Required for "core/template-part" transforms (block types).'
												helperTitle="Templates"
												icon="lock"
											/>
										),
										isFixed: true,
									} ),
							};
						} ) }
						options={ postTypes }
						onChange={ ( postTypeSelections ) => {
							wp.data.dispatch( 'core/editor' ).editPost( {
								meta: {
									...postMeta,
									postTypes: postTypeSelections.map(
										( postType ) => postType.value
									),
								},
							} );
						} }
						menuPlacement="auto"
						styles={ {
							menu: ( base ) => ( {
								...base,
								// Without this z-index value, the dropdown is transparent.
								zIndex: 100,
							} ),
							multiValue: ( base, state ) => {
								return state.data.isFixed
									? { ...base, backgroundColor: 'gray' }
									: base;
							},
							multiValueLabel: ( base, state ) => {
								return state.data.isFixed
									? {
											...base,
											fontWeight: 'bold',
											color: 'white',
											paddingRight: 6,
									  }
									: base;
							},
							multiValueRemove: ( base, state ) => {
								return state.data.isFixed
									? { ...base, display: 'none' }
									: base;
							},
						} }
					/>
				) : (
					<Spinner />
				) }

				{ /* Toggle the pattern modal on new post creation for the given post types. */ }
				<div className="fsestudio-post-type-heading">
					<PanelHeader>
						{ __( 'Additional settings', 'fse-studio' ) }
					</PanelHeader>
				</div>
				<ModalToggle />
			</PluginDocumentSettingPanel>

			{ /* The panel section for assigning keywords to the pattern. */ }
			{ /* Keywords are searchable terms in the site editor inserter. */ }
			<PluginDocumentSettingPanel
				title={ __( 'Pattern Keywords', 'fse-studio' ) }
				icon="filter"
			>
				<CreatableSelect
					components={ {
						DropdownIndicator: null,
					} }
					inputValue={ keywordInputValue }
					isClearable
					isMulti
					menuIsOpen={ false }
					onChange={ ( newValue ) => {
						wp.data.dispatch( 'core/editor' ).editPost( {
							meta: {
								...postMeta,
								keywords: [
									...newValue.map(
										( keywordObject ) => keywordObject.value
									),
								],
							},
						} );
					} }
					onInputChange={ ( newValue ) =>
						setKeywordInputValue( newValue )
					}
					onKeyDown={ ( event ) => {
						if ( ! keywordInputValue ) {
							return;
						}

						if ( [ 'Enter', 'Tab' ].includes( event.key ) ) {
							wp.data.dispatch( 'core/editor' ).editPost( {
								meta: {
									...postMeta,
									keywords: [
										...postMeta.keywords,
										keywordInputValue,
									],
								},
							} );
							setKeywordInputValue( '' );
							event.preventDefault();
						}
					} }
					placeholder="Add searchable terms..."
					value={ postMeta.keywords.map( ( keyword ) => ( {
						label: keyword,
						value: keyword,
					} ) ) }
				/>
			</PluginDocumentSettingPanel>

			{ /* The panel section for assigning block pattern categories to the pattern. */ }
			{ /* Selected categories will show under the matching dropdown in the site editor. */ }
			<PluginDocumentSettingPanel
				title={ __( 'Pattern Categories', 'fse-studio' ) }
				icon="paperclip"
			>
				{ blockPatternCategories ? (
					<Select
						isMulti
						isClearable
						closeMenuOnSelect={ false }
						value={ postMeta?.categories?.map( ( category ) =>
							blockPatternCategories.find(
								( matchedCategory ) =>
									matchedCategory.value === category
							)
						) }
						options={ blockPatternCategories }
						onChange={ ( categorySelections ) => {
							wp.data.dispatch( 'core/editor' ).editPost( {
								meta: {
									...postMeta,
									categories: categorySelections.map(
										( category ) => category.value
									),
								},
							} );
						} }
						menuPlacement="auto"
						styles={ {
							menu: ( base ) => ( {
								...base,
								zIndex: 100,
							} ),
						} }
					/>
				) : (
					<Spinner />
				) }
			</PluginDocumentSettingPanel>

			{ /* The panel section for assigning block types to the pattern. */ }
			{ /* Block types in the pattern file are primarily used for transforming blocks. */ }
			<PluginDocumentSettingPanel
				title={ __( 'Transforms (Block Types)', 'fse-studio' ) }
				icon="block-default"
			>
				<HelperTooltip
					helperText="Select the blocks that users can transform into this pattern."
					helperTitle="Blocks for transformation"
				/>
				{ transformableBlockTypes ? (
					<Select
						isMulti
						isClearable
						closeMenuOnSelect={ false }
						value={ postMeta?.blockTypes?.map( ( blockType ) => {
							// Hide block type related to the post type modal.
							if ( blockType === 'core/post-content' ) {
								return null;
							}

							return (
								transformableBlockTypes.find(
									( matchedBlocktype ) =>
										matchedBlocktype.value === blockType
								) || {
									label: blockType,
									value: blockType,
								}
							);
						} ) }
						options={ transformableBlockTypes }
						onChange={ ( blockTypeSelections ) => {
							wp.data.dispatch( 'core/editor' ).editPost( {
								meta: {
									...postMeta,
									blockTypes: blockTypeSelections.map(
										( blockTypeObject ) =>
											blockTypeObject.value
									),
								},
							} );
						} }
						menuPlacement="auto"
						styles={ {
							menu: ( base ) => ( {
								...base,
								zIndex: 100,
							} ),
						} }
					/>
				) : (
					<Spinner />
				) }
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
	if (
		! fsestudioPatternEditorLoaded &&
		wp.data.select( 'core/editor' ).getCurrentPostType()
	) {
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

				// Prevent this notice: "The backup of this post in your browser is different from the version below."
				// Get all notices, then remove if the notice has a matching wp autosave id.
				const notices = wp.data.select( 'core/notices' ).getNotices();
				notices?.forEach( ( notice ) => {
					if ( notice.id.includes( 'wpEditorAutosaveRestore' ) ) {
						wp.data
							.dispatch( 'core/notices' )
							.removeNotice( notice.id );
					}
				} );

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
