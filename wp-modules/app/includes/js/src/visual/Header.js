/**
 * Genesis Studio App
 */

const { __ } = wp.i18n;

import { getPrefix } from './../non-visual/prefix.js';

import { FormTokenField, Snackbar, Modal } from '@wordpress/components';
import { useContext, useState, useEffect } from '@wordpress/element';
import { FseThemeManagerContext } from './../non-visual/non-visual-logic.js';
import {
	testCollectionForErrors,
	testCollectionsForErrors,
} from './../non-visual/error-tests/error-tests.js';

export function FseThemeManagerHeader() {
	const { view } = useContext( FseThemeManagerContext );

	function maybeRenderThemes() {
		if ( view.currentView !== 'themes' ) {
			return '';
		}
		return <ThemesHeader />;
	}

	function maybeRenderCollections() {
		if ( view.currentView !== 'collections' ) {
			return '';
		}
		return <CollectionsHeader />;
	}

	return (
		<div className="fsethememanager-header">
			<div style={ { textAlign: 'center' } }>
				<span style={ { display: 'inline-block', fontWeight: '700' } }>
					FSE Theme Manager
				</span>
			</div>
			<div>
				Mode
				<select
					value={ view.currentView }
					onChange={ ( event ) => {
						view.setCurrentView( event.target.value );
					} }
				>
					<option value="themejson">
						{ __( 'ThemeJson Mode', 'fsethememanager' ) }
					</option>
					<option value="themes">
						{ __( 'Manage Themes', 'fsethememanager' ) }
					</option>
					<option value="collections">
						{ __( 'Manage Collections', 'fsethememanager' ) }
					</option>
					<option value="customblocks">
						{ __( 'Manage Custom Blocks', 'fsethememanager' ) }
					</option>
				</select>
			</div>
			{ maybeRenderThemes() }
			{ maybeRenderCollections() }
		</div>
	);
}

function ThemesHeader() {
	const { themes, collections, saveThemeEndpoint } = useContext(
		FseThemeManagerContext
	);
	const [ snackBarOpen, setSnackBarOpen ] = useState( false );
	const [ snackBarMessage, setSnackBarMessage ] = useState( '' );

	function saveThemeToDisk( downloadZip = false ) {
		const postData = new FormData();
		postData.append(
			'theme',
			JSON.stringify( themes.themes[ themes.currentTheme ] )
		);
		postData.append( 'collections', JSON.stringify( collections ) );

		if ( downloadZip ) {
			postData.append( 'downloadZip', true );
		}

		fetch( saveThemeEndpoint, {
			method: 'POST',
			mode: 'same-origin',
			credentials: 'same-origin',
			body: postData,
		} )
			.then( function ( response ) {
				if ( response.status !== 200 ) {
					console.log(
						'Looks like there was a problem. Status Code: ' +
							response.status
					);

					return;
				}

				// Examine the text in the response
				response
					.json()
					.then( function ( data ) {
						console.log( data.zipLink );
						setSnackBarMessage( data.message );
						setSnackBarOpen( true );

						if ( downloadZip ) {
							window.location.replace( data.zipLink );
						}
					} )
					.catch( function ( err ) {
						console.log( 'Fetch Error: ', err );
						setSnackBarMessage( 'Something went wrong' );
						setSnackBarOpen( true );
					} );
			} )
			.catch( function ( err ) {
				console.log( 'Fetch Error: ', err );
				setSnackBarMessage( 'Something went wrong' );
				setSnackBarOpen( true );
			} );
	}

	function maybeRenderSnackBar() {
		if ( snackBarOpen ) {
			setTimeout( () => {
				setSnackBarOpen( false );
			}, 3000 );
			return (
				<div
					style={ {
						position: 'absolute',
						bottom: '40px',
						left: '10px',
						zIndex: '999',
					} }
				>
					<Snackbar>
						<p>{ snackBarMessage }</p>
					</Snackbar>
				</div>
			);
		}
	}

	return (
		<>
			{ maybeRenderSnackBar() }
			<div className="fsethememanager-themes">
				Themes:
				<RenderThemes />
			</div>
			<div></div>
			{ ( () => {
				if ( themes.currentTheme ) {
					return (
						<div className="fsethememanager-controls">
							<button
								className="button"
								onClick={ () => {
									saveThemeToDisk( true );
								} }
							>
								Download Theme Zip
							</button>
							<button
								className="button"
								onClick={ () => {
									saveThemeToDisk();
								} }
							>
								Save Theme
							</button>
						</div>
					);
				}
			} )() }
		</>
	);
}

function RenderThemes() {
	const { themes } = useContext( FseThemeManagerContext );
	const renderedThemes = [];

	renderedThemes.push(
		<option key={ 1 }>{ __( 'Choose a theme', 'fsethememanager' ) }</option>
	);
	renderedThemes.push(
		<option key={ 2 } value="create_new_theme">
			{ __( 'Create new theme', 'fsethememanager' ) }
		</option>
	);

	let counter = 3;

	for ( const theme in themes.themes ) {
		const themeInQuestion = themes.themes[ theme ];
		renderedThemes.push(
			<option key={ counter } value={ themeInQuestion.slug }>
				{ themeInQuestion.name }
			</option>
		);
		counter++;
	}

	return (
		<>
			<select
				value={ themes.currentTheme }
				onChange={ ( event ) => {
					if ( event.target.value === 'create_new_theme' ) {
						themes.createNewTheme();
					} else {
						themes.setCurrentTheme( event.target.value );
					}
				} }
			>
				{ renderedThemes }
			</select>
		</>
	);
}

function CollectionsHeader() {
	const {
		frontendPreviewUrl,
		collections,
		saveCollectionEndpoint,
	} = useContext( FseThemeManagerContext );
	const [ collectionInfoEditorOpen, setCollectionInfoEditorOpen ] = useState(
		false
	);
	const [ saveOptionsOpen, setSaveOptionsOpen ] = useState( false );
	const [ testOptionsOpen, setTestOptionsOpen ] = useState( false );
	const [ patternInfoEditorOpen, setPatternInfoEditorOpen ] = useState(
		false
	);
	const [ snackBarOpen, setSnackBarOpen ] = useState( false );
	const [ snackBarMessage, setSnackBarMessage ] = useState( '' );

	useEffect( () => {
		if (
			collections.currentCollection &&
			collections.currentPattern &&
			collections.currentCollection.collection_info.slug ===
				'mynewcollection'
		) {
			setCollectionInfoEditorOpen( true );
		}
	} );

	function saveCollectionToDisk() {
		const postData = new FormData();
		postData.append(
			'collection',
			JSON.stringify( collections.currentCollection )
		);

		fetch( saveCollectionEndpoint, {
			method: 'POST',
			mode: 'same-origin',
			credentials: 'same-origin',
			body: postData,
		} )
			.then( function ( response ) {
				if ( response.status !== 200 ) {
					console.log(
						'Looks like there was a problem. Status Code: ' +
							response.status
					);

					return;
				}

				// Examine the text in the response
				response
					.json()
					.then( function ( data ) {
						console.log( data );
						setSnackBarMessage( data );
						setSnackBarOpen( true );
					} )
					.catch( function ( err ) {
						console.log( 'Fetch Error: ', err );
					} );
			} )
			.catch( function ( err ) {
				console.log( 'Fetch Error: ', err );
			} );
	}

	function getFrontendPreviewUrl( screenshotMode ) {
		const prefix = getPrefix(
			collections.currentCollection.collection_info.plugin
		);

		const url = new URL( frontendPreviewUrl );

		if ( screenshotMode ) {
			url.searchParams.set( 'fsethememanager_blocks_only_page', true );
			url.searchParams.set(
				'title',
				prefix +
					'_' +
					collections.currentCollection.collection_info.slug +
					'_' +
					collections.currentPattern.type +
					'_' +
					collections.currentPattern.key
						.replaceAll(
							collections.currentCollection.collection_info.slug +
								'-',
							''
						)
						.replaceAll( '-', '_' )
			);
			url.searchParams.set( 'screenshot_mode', 1 );
			return url.toString();
		}
		if ( currentView === 'blockEditor' ) {
			return '';
		}
		if ( currentView === 'frontend' ) {
			url.searchParams.set( 'fsethememanager_blocks_only_page', true );
			url.searchParams.set( 'title', collections.currentPattern.key );
			return url.toString();
		}
	}

	function maybeRenderCollectionInfoEditor() {
		if ( collectionInfoEditorOpen ) {
			return (
				<Modal
					title={ __( 'Collection Info', 'fsethememanager' ) }
					onRequestClose={ () =>
						setCollectionInfoEditorOpen( false )
					}
				>
					<CollectionInfoEditor
						setCollectionInfoEditorOpen={
							setCollectionInfoEditorOpen
						}
					/>
				</Modal>
			);
		}
	}

	function maybeRenderPatternInfoEditor() {
		if ( patternInfoEditorOpen ) {
			return (
				<Modal
					title={ __( 'Pattern Info', 'fsethememanager' ) }
					onRequestClose={ () => setPatternInfoEditorOpen( false ) }
				>
					<PatternInfoEditor
						setPatternInfoEditorOpen={ setPatternInfoEditorOpen }
					/>
				</Modal>
			);
		}
	}

	function maybeRenderSnackBar() {
		if ( snackBarOpen ) {
			setTimeout( () => {
				setSnackBarOpen( false );
			}, 3000 );
			return (
				<div
					style={ {
						position: 'absolute',
						bottom: '40px',
						left: '10px',
						zIndex: '999',
					} }
				>
					<Snackbar>
						<p>{ snackBarMessage }</p>
					</Snackbar>
				</div>
			);
		}
	}

	function maybeRenderEditorControls() {
		if ( ! collections.currentPattern ) {
			return '';
		}
		return (
			<div className="fsethememanager-controls">
				<button
					className="button"
					onClick={ () => {
						setCollectionInfoEditorOpen( true );
					} }
				>
					Edit Collection Info
				</button>
				<button
					className="button"
					onClick={ () => {
						setPatternInfoEditorOpen( true );
					} }
				>
					Edit Pattern Info
				</button>
				<button
					className="button"
					onClick={ () => {
						saveCollectionToDisk();
					} }
				>
					Save
				</button>
				<button
					className="button"
					onClick={ () => {
						setTestOptionsOpen( true );
					} }
				>
					Test
				</button>
			</div>
		);
	}

	return (
		<>
			{ maybeRenderCollectionInfoEditor() }
			{ maybeRenderPatternInfoEditor() }
			{ maybeRenderSnackBar() }
			<TestAndSaveActions
				saveOptionsOpen={ saveOptionsOpen }
				setSaveOptionsOpen={ setSaveOptionsOpen }
				testOptionsOpen={ testOptionsOpen }
				setTestOptionsOpen={ setTestOptionsOpen }
			/>
			<div className="fsethememanager-collections">
				Collection:
				<RenderCollections />
			</div>
			{ ( () => {
				if ( collections.currentCollection ) {
					return (
						<div className="fsethememanager-patterns">
							{ 'Pattern: ' }
							<RenderPatternPreviews />
						</div>
					);
				}
			} )() }
			{ maybeRenderEditorControls() }
		</>
	);
}

function CollectionInfoEditor( props ) {
	const { collections } = useContext( FseThemeManagerContext );
	const [ collectionName, setCollectionName ] = useState(
		collections.currentCollection.collection_info.label
	);
	const [ plugin, setPlugin ] = useState(
		collections.currentCollection.collection_info.plugin
			? collections.currentCollection.collection_info.plugin
			: ''
	);
	const defaultPatternAsCover = collections.currentCollection.collection_info
		.patternAsCover
		? collections.currentCollection.collection_info.patternAsCover
		: collections.currentCollection.patterns[
				Object.keys( collections.currentCollection.patterns )[ 0 ]
		  ].key;
	const [ patternAsCover, setPatternAsCover ] = useState(
		defaultPatternAsCover
	);
	const [ allowThemeColorPalette, setAllowThemeColorPalette ] = useState(
		collections.currentCollection.collection_info.allowThemeColorPalette
			? collections.currentCollection.collection_info
					.allowThemeColorPalette
			: false
	);

	useEffect( () => {
		// Pass the plugin name up into the collection_info
		collections.changeCurrentCollectionPlugin( plugin );
	}, [ plugin ] );

	useEffect( () => {
		collections.changeCurrentCollectionAllowThemeColorPalette(
			allowThemeColorPalette
		);
	}, [ allowThemeColorPalette ] );

	useEffect( () => {
		collections.changeCurrentCollectionCover( patternAsCover );
	}, [ patternAsCover ] );

	function renderPatternOptions() {
		const options = [];
		let counter = 0;
		for ( const pattern in collections.currentCollection.patterns ) {
			const thisPattern =
				collections.currentCollection.patterns[ pattern ];
			options.push(
				<option key={ counter } value={ thisPattern.key }>
					{ thisPattern.name }
				</option>
			);
			counter++;
		}

		return options;
	}

	return (
		<div className="fsethememanager-info-editor">
			<div className="fsethememanager-info-editor-options">
				<div className="fsethememanager-info-editor-option">
					<div className="fsethememanager-info-editor-option-name">
						Collection Actions
					</div>
					<div className="fsethememanager-info-editor-option-value">
						<button
							className="button"
							onClick={ () => {
								collections.duplicateCurrentCollection();
								props.setCollectionInfoEditorOpen( false );
							} }
						>
							{ 'Duplicate ' +
								collections.currentCollection.collection_info
									.label +
								' Collection' }
						</button>
						<button
							className="button"
							onClick={ () => {
								if (
									window.confirm(
										'Are you sure to delete this collection?'
									)
								) {
									collections.deleteCurrentCollection();
									props.setCollectionInfoEditorOpen( false );
								}
							} }
						>
							{ 'Delete ' +
								collections.currentCollection.collection_info
									.label +
								' Collection' }
						</button>
					</div>
				</div>
				<div className="fsethememanager-info-editor-option">
					<div className="fsethememanager-info-editor-option-name">
						Collection Name
					</div>
					<div className="fsethememanager-info-editor-option-value">
						<input
							type="text"
							value={ collectionName }
							onChange={ ( event ) => {
								setCollectionName( event.target.value );
							} }
						/>
						<button
							className="button"
							onClick={ () => {
								collections.changeCurrentCollectionName(
									collectionName
								);
								props.setCollectionInfoEditorOpen( false );
							} }
						>
							Update Collection
						</button>
					</div>
				</div>
				<div className="fsethememanager-info-editor-option">
					<div className="fsethememanager-info-editor-option-name">
						Plugin where files live
					</div>
					<div className="fsethememanager-info-editor-option-value">
						<select
							value={ plugin }
							onChange={ ( event ) => {
								setPlugin( event.target.value );
							} }
						>
							<option value="genesis_blocks">
								Genesis Blocks
							</option>
							<option value="genesis_page_builder">
								Genesis Page Builder
							</option>
							<option value="wpeshopinabox">WPEShopInABox</option>
						</select>
					</div>
				</div>
				<div className="fsethememanager-info-editor-option">
					<div className="fsethememanager-info-editor-option-name">
						Allow Theme Color Palette?
					</div>
					<div className="fsethememanager-info-editor-option-value">
						<input
							type="checkbox"
							checked={ allowThemeColorPalette }
							onChange={ ( event ) => {
								console.log( event.target.checked );

								setAllowThemeColorPalette(
									event.target.checked
								);
							} }
						/>
					</div>
				</div>
				<div className="fsethememanager-info-editor-option">
					<div className="fsethememanager-info-editor-option-name">
						Pattern to use as Collection Cover
					</div>
					<div className="fsethememanager-info-editor-option-value">
						<select
							value={ patternAsCover }
							onChange={ ( event ) => {
								setPatternAsCover( event.target.value );
							} }
						>
							{ renderPatternOptions() }
						</select>
					</div>
				</div>
			</div>
		</div>
	);
}

function PatternInfoEditor( props ) {
	const { collections } = useContext( FseThemeManagerContext );
	const [ patternName, setPatternName ] = useState(
		collections.currentPattern.name
	);

	const prefix = getPrefix(
		collections.currentCollection.collection_info.plugin
	);
	const className =
		prefix +
		'-' +
		collections.currentCollection.collection_info.slug +
		'-' +
		collections.currentPattern.type +
		'-' +
		collections.currentPattern.key
			.replaceAll(
				collections.currentCollection.collection_info.slug + '-',
				''
			)
			.replaceAll( '_', '-' );

	return (
		<div className="fsethememanager-info-editor">
			<div className="fsethememanager-info-editor-options">
				<div className="fsethememanager-info-editor-option">
					<div className="fsethememanager-info-editor-option-name">
						Pattern Stats
					</div>
					<div className="fsethememanager-info-editor-option-value">
						<a
							href={
								'https://publicwww.com/websites/%22' +
								className +
								'%22+depth%3Aall/'
							}
							target="_blank"
							rel="noreferrer"
						>
							{ __( 'Pattern Stats', 'genesis-studio' ) }{ ' ' }
						</a>
					</div>
				</div>
				<div className="fsethememanager-info-editor-option">
					<div className="fsethememanager-info-editor-option-name">
						Pattern Actions
					</div>
					<div className="fsethememanager-info-editor-option-value">
						<button
							className="button"
							onClick={ () => {
								collections.duplicateCurrentPattern();
								props.setPatternInfoEditorOpen( false );
							} }
						>
							{ 'Duplicate ' +
								collections.currentPattern.name +
								' Pattern' }
						</button>
						<button
							className="button"
							onClick={ () => {
								if (
									window.confirm(
										'Are you sure to delete this pattern?'
									)
								) {
									collections.deleteCurrentPattern();
									props.setPatternInfoEditorOpen( false );
								}
							} }
						>
							{ 'Delete ' +
								collections.currentPattern.name +
								' Pattern' }
						</button>
					</div>
				</div>
				<div className="fsethememanager-info-editor-option">
					<div className="fsethememanager-info-editor-option-name">
						Pattern Name
					</div>
					<div className="fsethememanager-info-editor-option-value">
						<input
							type="text"
							value={ patternName }
							onChange={ ( event ) => {
								setPatternName( event.target.value );
							} }
						/>
						<button
							className="button"
							onClick={ () => {
								collections.changeCurrentPatternName(
									patternName
								);
							} }
						>
							Update Pattern
						</button>
					</div>
				</div>
				<div className="fsethememanager-info-editor-option">
					<div className="fsethememanager-info-editor-option-name">
						Pattern Type
					</div>
					<div className="fsethememanager-info-editor-option-value">
						<select
							value={ collections.currentPattern.type }
							onChange={ ( event ) => {
								if (
									window.confirm(
										'Are you sure to change the type of this pattern? The content will be lost upon change.'
									)
								) {
									const updatedPattern = JSON.parse(
										JSON.stringify(
											collections.currentPattern
										)
									);
									updatedPattern.type = event.target.value;
									updatedPattern.section_keys = [];

									// Update the type of the pattern
									collections.setCurrentPattern(
										updatedPattern
									);
								}
							} }
						>
							<option value="section">Section</option>
							<option value="layout">Layout</option>
						</select>
					</div>
				</div>
				<div className="fsethememanager-info-editor-option">
					<div className="fsethememanager-info-editor-option-name">
						Pattern Categories
					</div>
					<div className="fsethememanager-info-editor-option-value">
						<FormTokenField
							label={ __(
								'Choose the categories for this pattern.',
								'genesis-studio'
							) }
							value={ collections.currentPattern.category }
							onChange={ ( newCategories ) =>
								collections.setCurrentPatternCategories(
									newCategories
								)
							}
						/>

						<div className="fsethememanager-info-editor-category-list">
							<p>
								<strong>Section:</strong> Header, Services,
								Media, Team, Testimonial, Contact, Business,
								Landing, Blog, Posts, Product, Portfolio,
								Agency, Ecommerce
							</p>
							<p>
								<strong>Layout:</strong> Business, Landing,
								Team, Services, Media, Contact, Product, Blog,
								Agency, Portfolio, Ecommerce
							</p>
						</div>
					</div>
				</div>
				<div className="fsethememanager-info-editor-option">
					<div className="fsethememanager-info-editor-option-name">
						Pattern Keywords
					</div>
					<div className="fsethememanager-info-editor-option-value">
						<FormTokenField
							label={ __(
								'Choose the keywords for this pattern. Note that the Collection and Pattern name keywords are auto generated for you and cannot be removed.',
								'genesis-studio'
							) }
							value={ collections.currentPattern.keywords }
							onChange={ ( newCategories ) =>
								collections.setCurrentPatternKeywords(
									newCategories
								)
							}
						/>
					</div>
				</div>
			</div>
		</div>
	);
}

function TestAndSaveActions( props ) {
	const {
		collections,
		saveCollectionsEndpoint,
		saveCollectionEndpoint,
	} = useContext( FseThemeManagerContext );
	const [ errorMessage, setErrorMessage ] = useState( '' );
	const [ errorMessageOpen, setErrorMessageOpen ] = useState( false );

	function formatErrorMessage( testResult ) {
		const output = [];
		let counter = 0;
		for ( const error in testResult.errors ) {
			counter++;
			const errorTitle = testResult.errors[ error ].errorTitle;
			const errorMessage = testResult.errors[ error ].errorMessage;
			const block = testResult.errors[ error ].block;
			const invalidValue =
				'Invalid Value: ' + testResult.errors[ error ].invalidValue;
			output.push(
				<div key={ counter }>
					<h2>Error: { errorTitle }</h2>
					<h2>{ errorMessage }</h2>
					<h4>Collection: { testResult.collection }</h4>
					<h4>Pattern: { testResult.pattern }</h4>
					<p>Block: { block.name }</p>
					<p>{ invalidValue }</p>
				</div>
			);
		}

		return output;
	}

	function doCollectionErrorTest( collection, multipleCollections = false ) {
		let testResult = null;

		if ( multipleCollections ) {
			testResult = testCollectionsForErrors( collection );
		} else {
			testResult = testCollectionForErrors( collection );
		}

		// If a collection has failed a test, highlight the pattern and the block in question so the error can be fixed.
		if ( ! testResult.success ) {
			console.log( testResult );

			// Set the current collection to be the one where the error was found.
			collections.switchCurrentCollection(
				collections.collections[ testResult.collection ]
			);

			// Set the current pattern to be the one where the error was found.
			collections.setCurrentPattern(
				collections.collections[ testResult.collection ].patterns[
					testResult.pattern
				]
			);

			// Highlight the block in question (not working yet).
			//selectBlock( testResult.errors.backgroundColorRequired.block.clientId );

			setErrorMessage( formatErrorMessage( testResult ) );
			setErrorMessageOpen( true );

			return testResult;
		}

		// If no errors were found in this pattern, return success.
		return {
			success: true,
		};
	}

	function testCollections() {
		const testResults = doCollectionErrorTest(
			collections.collections,
			true
		);
		if ( testResults.success ) {
			setErrorMessage( __( 'No errors found.', 'fsethememanager' ) );
			setErrorMessageOpen( true );
		}
	}

	function saveCollectionsToDisk() {
		//const testResults = doCollectionErrorTest( collections.collections, true );

		// If the tests were unsuccessful, don't export the files.
		if ( ! testResults.success ) {
			//return;
		}

		const postData = new FormData();
		postData.append(
			'collections',
			JSON.stringify( collections.collections )
		);

		fetch( saveCollectionsEndpoint, {
			method: 'POST',
			mode: 'same-origin',
			credentials: 'same-origin',
			body: postData,
		} )
			.then( function ( response ) {
				if ( response.status !== 200 ) {
					console.log(
						'Looks like there was a problem. Status Code: ' +
							response.status
					);

					return;
				}

				// Examine the text in the response
				response
					.json()
					.then( function ( data ) {
						setSnackBarMessage( data );
						setSnackBarOpen( true );
					} )
					.catch( function ( err ) {
						console.log( 'Fetch Error: ', err );
					} );
			} )
			.catch( function ( err ) {
				console.log( 'Fetch Error: ', err );
			} );
	}

	function testCollection() {
		const testResults = doCollectionErrorTest(
			collections.currentCollection
		);
		if ( testResults.success ) {
			setErrorMessage( __( 'No errors found.', 'fsethememanager' ) );
			setErrorMessageOpen( true );
		}
	}

	function maybeRenderTestOptions() {
		if ( props.testOptionsOpen ) {
			return (
				<Modal
					title={ __( 'Test Options', 'fsethememanager' ) }
					onRequestClose={ () => props.setTestOptionsOpen( false ) }
				>
					<button
						className="button"
						onClick={ () => {
							testCollections();
						} }
					>
						Test all collections
					</button>
					<button
						className="button"
						onClick={ () => {
							testCollection();
						} }
					>
						{ 'Test ' +
							collections.currentCollection.collection_info
								.label +
							' Collection' }
					</button>
				</Modal>
			);
		}
	}

	function maybeRenderSaveOptions() {
		if ( props.saveOptionsOpen ) {
			return (
				<Modal
					title={ __( 'Save Options', 'fsethememanager' ) }
					onRequestClose={ () => props.setSaveOptionsOpen( false ) }
				>
					<button
						className="button"
						onClick={ () => {
							saveCollectionsToDisk();
						} }
					>
						Save all collections to disk
					</button>
					<button
						className="button"
						onClick={ () => {
							saveCollectionToDisk();
						} }
					>
						{ 'Save ' +
							collections.currentCollection.collection_info
								.label +
							' Collection to disk' }
					</button>
				</Modal>
			);
		}
	}

	function maybeRenderErrors() {
		if ( errorMessageOpen ) {
			return (
				<Modal
					title={ __( 'Error', 'fsethememanager' ) }
					onRequestClose={ () => {
						setErrorMessageOpen( false );
						props.setTestOptionsOpen( false );
					} }
				>
					<div>{ errorMessage }</div>
				</Modal>
			);
		}
	}

	if ( ! collections.currentPattern ) {
		return '';
	}

	return (
		<>
			{ maybeRenderTestOptions() }
			{ maybeRenderErrors() }
		</>
	);
}

function RenderCollections() {
	const { collections } = useContext( FseThemeManagerContext );
	const mapper = [];

	function getCurrentClass( collectionInQuestion ) {
		if ( ! collections.currentCollection ) {
			return '';
		}

		if (
			collectionInQuestion.collection_info.slug ===
			collections.currentCollection.collection_info.slug
		) {
			return ' fsethememanager-pattern-preview-current';
		}
		return '';
	}

	mapper.push(
		<option key={ 1 } className={ 'fsethememanager-collection-preview' }>
			{ __( 'Choose a collection', 'fsethememanager' ) }
		</option>
	);
	mapper.push(
		<option
			key={ 2 }
			className={ 'fsethememanager-collection-preview' }
			value="create_new_collection"
		>
			{ __( 'Create new collection', 'fsethememanager' ) }
		</option>
	);

	let counter = 3;
	for ( const collection in collections.collections ) {
		const collectionInQuestion = collections.collections[ collection ];
		mapper.push(
			<option
				key={ counter }
				className={
					'fsethememanager-collection-preview' +
					getCurrentClass( collectionInQuestion )
				}
				value={ collectionInQuestion.collection_info.slug }
			>
				{ collections.collections[ collection ].collection_info.label }
			</option>
		);
		counter++;
	}

	return (
		<>
			<select
				onChange={ ( event ) => {
					if ( event.target.value === 'create_new_collection' ) {
						collections.createNewCollection();
					} else {
						collections.switchCurrentCollection(
							collections.collections[ event.target.value ]
						);
					}
				} }
			>
				{ mapper }
			</select>
		</>
	);
}

function RenderPatternPreviews() {
	const { collections } = useContext( FseThemeManagerContext );
	if ( ! collections.currentCollection ) {
		return 'no collection selected';
	}
	const mapper = [];

	function getCurrentClass( patternInQuestion ) {
		if ( ! collections.currentPattern ) {
			return '';
		}
		if ( patternInQuestion.key === collections.currentPattern.key ) {
			return ' fsethememanager-pattern-preview-current';
		}
		return '';
	}

	mapper.push(
		<option
			key={ 1 }
			className={ 'fsethememanager-collection-preview' }
			value=""
		>
			{ __( 'Choose a pattern', 'fsethememanager' ) }
		</option>
	);

	let counter = 2;
	for ( const pattern in collections.currentCollection.patterns ) {
		const patternInQuestion =
			collections.currentCollection.patterns[ pattern ];

		mapper.push(
			<option
				key={ counter }
				className={
					'fsethememanager-pattern-preview' +
					getCurrentClass( patternInQuestion )
				}
				value={ collections.currentCollection.patterns[ pattern ].key }
			>
				{ collections.currentCollection.patterns[ pattern ].name }
			</option>
		);
		counter++;
	}

	let currentPatternKey = '';
	if ( collections.currentPattern ) {
		currentPatternKey = collections.currentPattern.key;
	}

	return (
		<>
			<select
				value={ currentPatternKey }
				onChange={ ( event ) => {
					if ( event.target.value === '' ) {
						collections.setCurrentPattern( null );
					} else {
						collections.setCurrentPattern(
							collections.currentCollection.patterns[
								event.target.value
							]
						);
					}
				} }
			>
				{ mapper }
			</select>
		</>
	);
}

function openScreenshot( url, type = 'section' ) {
	if ( type === 'section' ) {
		// Scaled up version of 600 by 422 - to a factor of 2.25
		window.open(
			url,
			'targetWindow',
			`toolbar=no,
		    location=no,
		    status=no,
		    menubar=no,
		    scrollbars=yes,
		    resizable=no,
		    width=1350,
		    height=949.5`
		);
	}

	if ( type === 'layout' ) {
		// Scaled up version of 600 by 679 - to a factor of 2.25
		window.open(
			url,
			'targetWindow',
			`toolbar=no,
		    location=no,
		    status=no,
		    menubar=no,
		    scrollbars=yes,
		    resizable=no,
		    width=1350,
		    height=1527.75`
		);
	}
}
