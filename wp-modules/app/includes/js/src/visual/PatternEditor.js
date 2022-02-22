const { __ } = wp.i18n;

/* eslint-disable */
import {
	BlockEditorProvider,
	BlockList,
	BlockTools,
	WritingFlow,
	ObserveTyping,
	BlockInspector,
	BlockBreadcrumb,
	MediaUpload,
	MediaUploadCheck,
	MediaPlaceholder,
	MediaReplaceFlow,
	__unstableEditorStyles as EditorStyles,
	__unstableUseTypingObserver as useTypingObserver,
} from '@wordpress/block-editor';
import ResizableEditor from './ResizableEditor';
import { useMergeRefs, useViewportMatch } from '@wordpress/compose';
import { 
	Icon,
	layout,
} from '@wordpress/icons';

import { serialize, parse } from '@wordpress/blocks';



import { getPrefix } from './../non-visual/prefix.js';

import {
	SlotFillProvider,
	Popover,
	Modal,
	FormTokenField,
	Snackbar,
} from '@wordpress/components';
/* eslint-enable */
import { ShortcutProvider } from '@wordpress/keyboard-shortcuts';
import { useContext, useState, useEffect, useRef } from '@wordpress/element';
import {
	FseStudioContext,
	usePatternData,
} from './../non-visual/non-visual-logic.js';
import { testPatternForErrors } from './../non-visual/error-tests/error-tests.js';

import { registerCoreBlocks } from '@wordpress/block-library';
registerCoreBlocks();

export function PatternEditorApp( { visible } ) {
	const { patterns } = useContext( FseStudioContext );
	const [ currentPatternId, setCurrentPatternId ] = useState();
	const pattern = usePatternData( currentPatternId );
	const [ errors, setErrors ] = useState( false );
	const [ errorModalOpen, setErrorModalOpen ] = useState( false );

	function renderPatternSelector() {
		const renderedPatterns = [];

		renderedPatterns.push(
			<option key={ 1 }>
				{ __( 'Choose a pattern', 'fse-studio' ) }
			</option>
		);

		let counter = 3;

		for ( const thisPattern in patterns.patterns ) {
			const patternInQuestion = patterns.patterns[ thisPattern ];
			renderedPatterns.push(
				<option key={ counter } value={ thisPattern }>
					{ patternInQuestion.title }
				</option>
			);
			counter++;
		}

		return (
			<>
				<select
					value={ currentPatternId }
					onChange={ ( event ) => {
						setCurrentPatternId( event.target.value );
					} }
				>
					{ renderedPatterns }
				</select>
			</>
		);
	}

	function renderPatternEditorWhenReady() {
		if ( pattern.data ) {
			return (
				<PatternEditor pattern={ pattern } setErrors={ setErrors } />
			);
		}
		return '';
	}

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
					<h4>Pattern: { testResult.pattern }</h4>
					<p>Block: { block.name }</p>
					<p>{ invalidValue }</p>
				</div>
			);
		}

		return output;
	}

	function maybeRenderErrors() {
		if ( errors && ! errors?.success ) {
			/* eslint-disable */
			console.log( errors );
			/* eslint-enable */
			return (
				<div>
					<span>Errors </span>
					<button
						onClick={ () => {
							setErrorModalOpen( true );
						} }
					>
						{ Object.keys( errors?.errors ).length }
					</button>
					{ ( () => {
						if ( errorModalOpen ) {
							return (
								<Modal
									title={ __(
										'Errors in pattern',
										'fse-studio'
									) }
									onRequestClose={ () =>
										setErrorModalOpen( false )
									}
								>
									{ formatErrorMessage( errors ) }
								</Modal>
							);
						}
					} )() }
				</div>
			);
		}
		return '';
	}

	return (
		<div hidden={ ! visible } className="fsestudio-pattern-work-area">
			<div className="sticky top-0 z-10 flex-shrink-0 flex h-16 bg-white shadow">
				<div className="flex-1 flex">
					<div className="flex w-full p-3 gap-5">
						<button
							type="button"
							className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-sm shadow-sm text-white bg-wp-gray hover:bg-[#586b70] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-wp-blue"
						>
							<Icon
								className="text-white fill-current mr-2"
								icon={ layout }
								size={ 26 }
							/>{ ' ' }
							{ __( 'Browse Patterns', 'fse-studio' ) }
						</button>

						{ renderPatternSelector() }
						{ maybeRenderErrors() }
					</div>
				</div>
			</div>
			{ ( () => {
				if ( ! pattern.data ) {
					return (
						<div className="max-w-7xl mx-auto bg-white mt-20 shadow">
							<h1 className="p-5 text-xl border-b border-gray-200 px-4 sm:px-6 md:px-8">
								{ __( 'Pattern Manager', 'fse-studio' ) }
							</h1>
							<div className="px-4 sm:px-6 md:px-8 py-8 flex flex-row gap-14 items-center">
								<p className="text-base mb-4 max-w-3xl">
									{ __(
										'Welcome to the Pattern Manager! Here, you can create and edit patterns for your site. Browse your patterns by clicking the Browse Patterns button to the right, or by using the Browse Patterns button in the header.',
										'fse-studio'
									) }
								</p>
								<div className="bg-[#F8F8F8] p-20 w-full text-center">
									<button
										type="button"
										className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-sm shadow-sm text-white bg-wp-gray hover:bg-[#586b70] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-wp-blue"
									>
										<Icon
											className="text-white fill-current mr-2"
											icon={ layout }
											size={ 26 }
										/>{ ' ' }
										{ __(
											'Browse Patterns',
											'fse-studio'
										) }
									</button>
								</div>
							</div>
						</div>
					);
				}
			} )() }

			{ renderPatternEditorWhenReady() }
		</div>
	);
}

export function PatternEditor( props ) {
	const contentRef = useRef();
	const mergedRefs = useMergeRefs( [ contentRef, useTypingObserver() ] );

	const { blockEditorSettings, currentThemeJsonFile } = useContext(
		FseStudioContext
	);
	const pattern = props.pattern;

	const [ blocks, updateBlocks ] = useState( [
		parseBlocks(
			pattern?.data?.content
				? pattern?.data?.content
				: '<!-- wp:paragraph --><p></p><!-- /wp:paragraph -->'
		),
	] );

	const [ serializedBlocks, updateSerializedBlocks ] = useState();

	const [ currentView, setCurrentView ] = useState( 'blockEditor' ); //Other option is "frontend"
	const [ editorWidth, setEditorWidth ] = useState( '100%' );

	useEffect( () => {
		// If the pattern prop changes to a new pattern, reset the blocks in the editor to be that pattern's blocks.
		updateBlocks(
			parse(
				pattern?.data?.content
					? pattern?.data?.content
					: '<!-- wp:paragraph --><p></p><!-- /wp:paragraph -->'
			)
		);
		props.setErrors( false );
	}, [ pattern?.data?.name ] );

	// When blocks are changed in the block editor, update them in their corresponding files as well.
	useEffect( () => {
		props.setErrors( testPatternForErrors( blocks ) );

		pattern.set( {
			...pattern.data,
			content: serialize( blocks[ 0 ] ),
		} );
	}, [ blocks ] );

	function getEditorSettings() {
		const editorSettings = JSON.parse(
			JSON.stringify( blockEditorSettings )
		);

		// Make media library work.
		editorSettings.mediaUploadCheck = MediaUploadCheck;
		editorSettings.mediaUpload = MediaUpload;
		editorSettings.mediaPlaceholder = MediaPlaceholder;
		editorSettings.mediaReplaceFlow = MediaReplaceFlow;

		// Inject the current styles rendered by the current themeJsonFileData.
		if ( currentThemeJsonFile?.data?.renderedGlobalStyles ) {
			editorSettings.styles.push( {
				css: currentThemeJsonFile.data.renderedGlobalStyles,
			} );
		}

		return editorSettings;
	}
	/* eslint-disable */
	function renderPortalCssStyles() {
		const renderedStyles = [
			<div
				key="inline-style-from-block-editor"
				dangerouslySetInnerHTML={ {
					__html: blockEditorSettings.__unstableResolvedAssets.styles,
				} }
			/>,
		];

		for ( const style in blockEditorSettings.styles ) {
			renderedStyles.push(
				<style key={ style }>
					{ blockEditorSettings.styles[ style ].css }
				</style>
			);
		}

		if ( currentThemeJsonFileData?.value?.renderedGlobalStyles ) {
			renderedStyles.push(
				<style key={ 'renderedGlobalStyles' }>
					{ currentThemeJsonFileData.value.renderedGlobalStyles }
				</style>
			);
		}

		return renderedStyles;
	}
	/* eslint-enable */
	if ( ! pattern.data ) {
		return 'Select a pattern to edit it here';
	}

	function getViewToggleClassName( toggleInQuestion ) {
		if ( currentView === toggleInQuestion ) {
			return ' fsestudio-active-tab';
		}

		return '';
	}

	return (
		<div className="fsestudio-pattern-editor">
			<div
				style={ { display: 'none' } }
				className="fsestudio-editor-header"
			>
				<div className="fsestudio-pattern-image"></div>
				<div className="fsestudio-pattern-name">
					<h2>{ pattern.data.name }</h2>
				</div>
				<div className="fsestudio-pattern-tabs">
					<button
						className={
							'fsestudio-tab' +
							getViewToggleClassName( 'blockEditor' )
						}
						onClick={ () => {
							setCurrentView( 'blockEditor' );
						} }
					>
						Block Editor
					</button>
					<button
						className={
							'fsestudio-tab' +
							getViewToggleClassName( 'codeEditor' )
						}
						onClick={ () => {
							setCurrentView( 'codeEditor' );
						} }
					>
						Code Editor
					</button>
					<button
						className={
							'fsestudio-tab' +
							getViewToggleClassName( 'frontend' )
						}
						onClick={ () => {
							setCurrentView( 'frontend' );
						} }
					>
						Frontend Preview
					</button>
					<select
						onChange={ ( event ) => {
							setEditorWidth( event.target.value );
						} }
						value={ editorWidth }
					>
						<option value={ '100%' }>Desktop</option>
						<option value={ '320px' }>320px (iPhone 5/SE)</option>
						<option value={ '375px' }>375px (iPhone X)</option>
						<option value={ '768px' }>768px (iPad)</option>
						<option value={ '1024px' }>1024px (iPad Pro)</option>
					</select>
				</div>
			</div>
			<div className="fsestudio-pattern-editor-body">
				<div
					className="fsestudio-pattern-editor-view"
					style={ {
						display:
							currentView === 'codeEditor' ? 'block' : 'none',
					} }
				>
					<button
						className="button"
						onClick={ () => {
							try {
								parse( serializedBlocks );
							} catch ( error ) {
								/* eslint-disable */
								alert(
									'Invalid block content. Please check your code to make sure it is valid.'
								);
								/* eslint-enable */
								return;
							}

							updateBlocks( parse( serializedBlocks ) );
						} }
					>
						{ __( 'Done Editing', 'fse-studio' ) }
					</button>
					<textarea
						style={ {
							width: '100%',
							height: '90%',
						} }
						value={ serializedBlocks }
						onChange={ ( event ) => {
							updateSerializedBlocks( event.target.value );
						} }
					/>
				</div>

				<div
					className="fsestudio-pattern-editor-view"
					style={ {
						display:
							currentView === 'blockEditor' ? 'block' : 'none',
					} }
				>
					<ShortcutProvider>
						<BlockEditorProvider
							value={ blocks }
							onChange={ updateBlocks }
							onInput={ updateBlocks }
							settings={ getEditorSettings() }
						>
							<SlotFillProvider>
								<Popover.Slot />
								<BlockTools>
									<WritingFlow>
										<ObserveTyping>
											<div className="fsestudio-pattern-editor-columns">
												<div className={ 'column' }>
													<div className="edit-post-visual-editor editor-styles-wrapper">
														<ResizableEditor
															// Reinitialize the editor and reset the states when the template changes.
															key={
																pattern?.data
																	?.name
															}
															enableResizing={
																false
															}
															settings={ getEditorSettings() }
															contentRef={
																mergedRefs
															}
														>
															<BlockList />
														</ResizableEditor>
													</div>

													<div
														style={ {
															position: 'fixed',
															bottom: '0px',
															width: '100%',
															backgroundColor:
																'#fff',
															padding: '4px',
															zIndex: '999',
														} }
													>
														<BlockBreadcrumb />
													</div>
												</div>
												<div className={ 'column' }>
													<BlockInspector />
												</div>
											</div>
										</ObserveTyping>
									</WritingFlow>
								</BlockTools>
							</SlotFillProvider>
						</BlockEditorProvider>
					</ShortcutProvider>
				</div>
			</div>
		</div>
	);
}

function parseBlocks( blocksToParse ) {
	if ( parse( blocksToParse ) ) {
		return parse( blocksToParse );
	}
	/* eslint-disable */
	console.log(
		'Invalid block content. Unable to parse.',
		blocksToParse,
		parse( blocksToParse )
	);
	/* eslint-enable */
	return parse( blocksToParse );
}
