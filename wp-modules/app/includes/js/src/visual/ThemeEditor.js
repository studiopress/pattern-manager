/**
 * Genesis Studio App
 */

const { __ } = wp.i18n;

import Select from 'react-select';

import { Modal } from '@wordpress/components';
import { useContext, useState, useEffect, useRef } from '@wordpress/element';
import {
	FseThemeManagerContext,
	useThemeData,
} from './../non-visual/non-visual-logic.js';

export function ThemeEditorApp( props ) {
	const { themes } = useContext( FseThemeManagerContext );
	const [ currentThemeId, setCurrentThemeId ] = useState();
	const theme = useThemeData( currentThemeId, themes );

	function renderThemeSelector() {
		const renderedThemes = [];

		renderedThemes.push(
			<option key={ 1 }>
				{ __( 'Choose a theme', 'fsethememanager' ) }
			</option>
		);

		let counter = 3;

		for ( const theme in themes.themes ) {
			const themeInQuestion = themes.themes[ theme ];
			renderedThemes.push(
				<option key={ counter } value={ themeInQuestion.dirname }>
					{ themeInQuestion.name }
				</option>
			);
			counter++;
		}

		return (
			<>
				<select
					value={ currentThemeId }
					onChange={ ( event ) => {
						setCurrentThemeId( event.target.value );
					} }
				>
					{ renderedThemes }
				</select>
			</>
		);
	}

	function renderThemeEditorWhenReady() {
		if ( ! theme.data ) {
			return '';
		}

		return <ThemeEditor theme={ theme } />;
	}

	return (
		<>
			<div className="fsethememanager-subheader">
				<div>Theme Editor</div>
				{ renderThemeSelector() }
				or{ ' ' }
				<button
					className="button"
					onClick={ () => {
						const newThemeData = {
							name: 'My New Theme',
							dirname: 'my-new-theme',
							namespace: 'MyNewTheme',
							uri: 'mysite.com',
							author: 'Me',
							author_uri: 'mysite.com',
							description: 'My new FSE Theme',
							tags: [],
							tested_up_to: '5.9',
							requires_wp: '5.9',
							requires_php: '7.4',
							version: '1.0.0',
							text_domain: 'my-new-theme',
							included_patterns: [],
							'index.html': '',
							'404.html': '',
						};

						themes.setThemes( {
							...themes.themes,
							'my-new-theme': newThemeData,
						} );

						// Switch to the newly created theme.
						setCurrentThemeId( 'my-new-theme' );
					} }
				>
					Create a new theme
				</button>
				{(() => {
					if ( theme.data ) {
						return (
							<button
								className="button"
								onClick={ () => {
									theme.save();
								} }
							>
								Save theme data to disk
							</button>
						)
					}
				})()}
			</div>
			{ renderThemeEditorWhenReady() }
		</>
	);
}

export function ThemeEditor( props ) {
	const { patterns } = useContext( FseThemeManagerContext );
	const theme = props.theme;

	function formatPatternValuesForSelect() {
		const options = [];
		for ( const patternNum in theme.data.includedPatterns ) {
			const patternId = theme.data.includedPatterns[ patternNum ];
			options.push( {
				value: patterns.patterns[ patternId ].name,
				label: patterns.patterns[ patternId ].title,
			} );
		}

		return options;
	}

	function formatPatternOptionsForSelect() {
		const options = [];
		for ( const pattern in patterns.patterns ) {
			options.push( {
				value: patterns.patterns[ pattern ].name,
				label: patterns.patterns[ pattern ].title,
			} );
		}

		return options;
	}

	function formatPatternOptionsFromSelect( valuesFromSelect ) {
		//console.log( theme.data );
		//console.log( valuesFromSelect );

		const reAssembledThemePatterns = [];

		for ( const value in valuesFromSelect ) {
			//console.log( valuesFromSelect[value].value );
			//console.log( patterns.patterns[valuesFromSelect[value].value]);

			if ( patterns.patterns[ valuesFromSelect[ value ].value ] ) {
				const pattern =
					patterns.patterns[ valuesFromSelect[ value ].value ];

				reAssembledThemePatterns.push( pattern.name );
			}
		}
		console.log( reAssembledThemePatterns );

		return reAssembledThemePatterns;
	}

	function renderPatternPicker() {
		return (
			<>
				<Select
					options={ formatPatternOptionsForSelect() }
					value={ formatPatternValuesForSelect() }
					onChange={ ( newIncludedPatterns ) => {
						const reAssembledThemePatterns = formatPatternOptionsFromSelect(
							newIncludedPatterns
						);

						theme.set( {
							...theme.data,
							includedPatterns: reAssembledThemePatterns,
						} );
					} }
					isMulti={ true }
				/>
			</>
		);
	}

	function renderCurrentTheme() {
		if ( ! theme.data ) {
			return '';
		}
		return (
			<div className="fsethememanager-theme-editor">
				<div
					className="fsethememanager-info-editor-options"
					style={ { maxWidth: '600px', margin: '50px auto' } }
				>
					<div className="fsethememanager-info-editor-option">
						<div className="fsethememanager-info-editor-option-name">
							{ __( 'FSE Theme Name: ', 'fsethememanager' ) }
						</div>
						<div className="fsethememanager-info-editor-option-value">
							<input
								type="text"
								value={
									theme?.data?.name ? theme.data.name : ''
								}
								onChange={ ( event ) => {
									theme.set( {
										...theme.data,
										name: event.target.value,
									} );
								} }
							/>
						</div>
					</div>
					<div className="fsethememanager-info-editor-option">
						<div className="fsethememanager-info-editor-option-name">
							{ __( 'Directory name: ', 'fsethememanager' ) }
						</div>
						<div className="fsethememanager-info-editor-option-value">
							<input
								type="text"
								value={
									theme?.data?.dirname
										? theme.data.dirname
										: ''
								}
								onChange={ ( event ) => {
									theme.set( {
										...theme.data,
										dirname: event.target.value,
									} );
								} }
							/>
						</div>
					</div>
					<div className="fsethememanager-info-editor-option">
						<div className="fsethememanager-info-editor-option-name">
							{ __( 'Namespace: ', 'fsethememanager' ) }
						</div>
						<div className="fsethememanager-info-editor-option-value">
							<input
								type="text"
								value={
									theme?.data?.namespace
										? theme.data.namespace
										: ''
								}
								onChange={ ( event ) => {
									theme.set( {
										...theme.data,
										namespace: event.target.value,
									} );
								} }
							/>
						</div>
					</div>
					<div className="fsethememanager-info-editor-option">
						<div className="fsethememanager-info-editor-option-name">
							{ __( 'URI: ', 'fsethememanager' ) }
						</div>
						<div className="fsethememanager-info-editor-option-value">
							<input
								type="text"
								value={ theme?.data?.uri ? theme.data.uri : '' }
								onChange={ ( event ) => {
									theme.set( {
										...theme.data,
										uri: event.target.value,
									} );
								} }
							/>
						</div>
					</div>
					<div className="fsethememanager-info-editor-option">
						<div className="fsethememanager-info-editor-option-name">
							{ __( 'Author: ', 'fsethememanager' ) }
						</div>
						<div className="fsethememanager-info-editor-option-value">
							<input
								type="text"
								value={
									theme?.data?.author ? theme.data.author : ''
								}
								onChange={ ( event ) => {
									theme.set( {
										...theme.data,
										author: event.target.value,
									} );
								} }
							/>
						</div>
					</div>
					<div className="fsethememanager-info-editor-option">
						<div className="fsethememanager-info-editor-option-name">
							{ __( 'Author URI: ', 'fsethememanager' ) }
						</div>
						<div className="fsethememanager-info-editor-option-value">
							<input
								type="text"
								value={
									theme?.data?.author_uri
										? theme.data.author_uri
										: ''
								}
								onChange={ ( event ) => {
									theme.set( {
										...theme.data,
										author_uri: event.target.value,
									} );
								} }
							/>
						</div>
					</div>
					<div className="fsethememanager-info-editor-option">
						<div className="fsethememanager-info-editor-option-name">
							{ __( 'Description: ', 'fsethememanager' ) }
						</div>
						<div className="fsethememanager-info-editor-option-value">
							<input
								type="text"
								value={
									theme?.data?.description
										? theme.data.description
										: ''
								}
								onChange={ ( event ) => {
									theme.set( {
										...theme.data,
										description: event.target.value,
									} );
								} }
							/>
						</div>
					</div>
					<div className="fsethememanager-info-editor-option">
						<div className="fsethememanager-info-editor-option-name">
							{ __( 'Tags: ', 'fsethememanager' ) }
						</div>
						<div className="fsethememanager-info-editor-option-value">
							<input
								type="text"
								value={
									theme?.data?.tags ? theme.data.tags : ''
								}
								onChange={ ( event ) => {
									theme.set( {
										...theme.data,
										tags: event.target.value,
									} );
								} }
							/>
						</div>
					</div>
					<div className="fsethememanager-info-editor-option">
						<div className="fsethememanager-info-editor-option-name">
							{ __(
								'Tested up to (WordPress Version): ',
								'fsethememanager'
							) }
						</div>
						<div className="fsethememanager-info-editor-option-value">
							<input
								type="text"
								value={
									theme?.data?.tested_up_to
										? theme.data.tested_up_to
										: ''
								}
								onChange={ ( event ) => {
									theme.set( {
										...theme.data,
										tested_up_to: event.target.value,
									} );
								} }
							/>
						</div>
					</div>
					<div className="fsethememanager-info-editor-option">
						<div className="fsethememanager-info-editor-option-name">
							{ __(
								'Minimum WordPress Version: ',
								'fsethememanager'
							) }
						</div>
						<div className="fsethememanager-info-editor-option-value">
							<input
								type="text"
								value={
									theme?.data?.requires_wp
										? theme.data.requires_wp
										: ''
								}
								onChange={ ( event ) => {
									theme.set( {
										...theme.data,
										requires_wp: event.target.value,
									} );
								} }
							/>
						</div>
					</div>
					<div className="fsethememanager-info-editor-option">
						<div className="fsethememanager-info-editor-option-name">
							{ __( 'Minimum PHP Version: ', 'fsethememanager' ) }
						</div>
						<div className="fsethememanager-info-editor-option-value">
							<input
								type="text"
								value={
									theme?.data?.requires_php
										? theme.data.requires_php
										: ''
								}
								onChange={ ( event ) => {
									theme.set( {
										...theme.data,
										requires_php: event.target.value,
									} );
								} }
							/>
						</div>
					</div>
					<div className="fsethememanager-info-editor-option">
						<div className="fsethememanager-info-editor-option-name">
							{ __( 'Version: ', 'fsethememanager' ) }
						</div>
						<div className="fsethememanager-info-editor-option-value">
							<input
								type="text"
								value={
									theme?.data?.version
										? theme.data.version
										: ''
								}
								onChange={ ( event ) => {
									theme.set( {
										...theme.data,
										version: event.target.value,
									} );
								} }
							/>
						</div>
					</div>
					<div className="fsethememanager-info-editor-option">
						<div className="fsethememanager-info-editor-option-name">
							{ __( 'Text Domain: ', 'fsethememanager' ) }
						</div>
						<div className="fsethememanager-info-editor-option-value">
							<input
								type="text"
								value={
									theme?.data?.text_domain
										? theme.data.text_domain
										: ''
								}
								onChange={ ( event ) => {
									theme.set( {
										...theme.data,
										text_domain: event.target.value,
									} );
								} }
							/>
						</div>
					</div>

					<div className="fsethememanager-info-editor-option">
						<div className="fsethememanager-info-editor-option-name">
							{ __( 'Included Patterns: ', 'fsethememanager' ) }
						</div>
						<div className="fsethememanager-info-editor-option-value">
							{ renderPatternPicker() }
						</div>
					</div>
					<div className="fsethememanager-info-editor-option">
						<div className="fsethememanager-info-editor-option-name">
							{ __( 'index.html contents: ', 'fsethememanager' ) }
						</div>
						<div className="fsethememanager-info-editor-option-value">
							<div>
								{
									//currentThemeData[ 'index.html' ].pattern
								 }
							</div>
							<button
								onClick={ () => {
								
									
								} }
								className="button"
							>
								{ __(
									'Set index.html contents',
									'fsethememanager'
								) }
							</button>
						</div>
					</div>
				</div>
			</div>
		);
	}

	return <>{ renderCurrentTheme() }</>;
}

function RenderCustomBlocks() {
	const { themes } = useContext( FseThemeManagerContext );
	const options = [
		{ value: 'custom_block_one', label: 'My Custom Block One' },
		{ value: 'custom_block_two', label: 'My Custom Block Two' },
	];

	return (
		<>
			<Select
				options={ options }
				value={
					themes.themes[ themes.currentTheme ].includedCustomBlocks
				}
				onChange={ ( newIncludedCustomBlocks ) => {
					themes.updateCurrentTheme( {
						includedCustomBlocks: newIncludedCustomBlocks,
					} );
				} }
				isMulti={ true }
			/>
		</>
	);
}

function ThemeFileEditor( props ) {
	const { patterns, themes } = useContext( FseThemeManagerContext );
	const [ currentCollection, setCurrentCollection ] = useState();

	function renderCollections() {
		const mapper = [];

		mapper.push(
			<option
				key={ 1 }
				className={ 'fsethememanager-collection-preview' }
			>
				{ __( 'Choose a collection', 'fsethememanager' ) }
			</option>
		);

		let counter = 2;
		for ( const collection in themes.themes[ themes.currentTheme ]
			.includedCollections ) {
			const collectionInQuestion =
				themes.themes[ themes.currentTheme ].includedCollections[
					collection
				];
			mapper.push(
				<option key={ counter } value={ collectionInQuestion.value }>
					{ collectionInQuestion.label }
				</option>
			);
			counter++;
		}

		return (
			<>
				<select
					value={ currentCollection }
					onChange={ ( event ) => {
						setCurrentCollection( event.target.value );
					} }
				>
					{ mapper }
				</select>
			</>
		);
	}

	function maybeRenderPatterns() {
		if ( ! currentCollection ) {
			return '';
		}

		const patterns = [];
		let counter = 1;
		for ( const pattern in patterns.patterns[ currentCollection ]
			.patterns ) {
			const thisPattern =
				patterns.patterns[ currentCollection ].patterns[ pattern ];
			patterns.push(
				<div key={ counter }>
					<div
						onClick={ () => {
							themes.updateCurrentTheme( {
								[ props.currentFileName ]: {
									collection:
										patterns.patterns[ currentCollection ]
											.collection_info.dirname,
									pattern: thisPattern.key,
								},
							} );
							props.setThemeFileContentsEditorOpen( false );
						} }
					>
						{ thisPattern.name }
						<LayoutPreview bodyHTML={ thisPattern.content } />
					</div>
				</div>
			);
			counter++;
		}

		return (
			<>
				<div
					className="fsethememanager-info-editor-option"
					style={ {
						display: 'grid',
						gridTemplateColumns: '205px 200px 200px 200px',
						gridGap: '20px',
						boxSizing: 'border-box',
					} }
				>
					{ patterns }
				</div>
			</>
		);
	}

	return (
		<>
			<div className="fsethememanager-info-editor-options">
				<div className="fsethememanager-info-editor-option">
					<div className="fsethememanager-info-editor-option-name">
						{ __(
							'Choose from a Collection: ',
							'fsethememanager'
						) }
					</div>
					<div className="fsethememanager-info-editor-option-value">
						{ renderCollections() }
					</div>
				</div>
				{ maybeRenderPatterns() }
			</div>
		</>
	);
}

function LayoutPreview( props ) {
	const { siteUrl } = useContext( FseThemeManagerContext );
	const iframeRef = useRef( null );
	const [ iframeInnerContentHeight, setIframeInnerContentHeight ] = useState(
		0
	);

	function renderLayoutHtmlForIframe( bodyHTML ) {
		return (
			`<html>
			<head>
				<link rel="stylesheet" id="wp-block-library-css" href="` +
			siteUrl +
			`/wp-includes/css/dist/block-library/style.min.css" media="all">
				<link rel="stylesheet" id="wp-block-library-theme-css" href="` +
			siteUrl +
			`wp-includes/css/dist/block-library/theme.min.css" media="all">
				<link rel="stylesheet" id="genesis-blocks-style-css-css" href="https://developer.wpengine.com/ecom/wp-content/plugins/genesis-page-builder/lib/genesis-blocks/dist/blocks.style.build.css?ver=1613169060" media="all">
				<link rel="stylesheet" id="genesis-page-builder-frontend-styles-css" href="https://developer.wpengine.com/ecom/wp-content/plugins/genesis-page-builder/build/frontend.styles.build.css?ver=1613169060" media="all">
				<link rel="stylesheet" id="genesis-block-theme-style-css" href="https://developer.wpengine.com/slate/wp-content/themes/genesis-block-theme/style.css?ver=5.6" type="text/css" media="all">
			</head>
			<body>` +
			bodyHTML +
			`</body>
		</html>`
		);
	}

	function onLoad() {
		setIframeInnerContentHeight(
			iframeRef.current.contentWindow.document.body.scrollHeight
		);
	}

	return (
		<div
			style={ {
				width: '200px',
				height: iframeInnerContentHeight * 0.1 + 'px',
				boxShadow: '0 0 0px 2px #000',
				pointerEvents: 'none',
			} }
		>
			<iframe
				ref={ iframeRef }
				onLoad={ onLoad }
				scrolling="no"
				style={ {
					width: '2000px',
					height: iframeInnerContentHeight + 'px',
					transform: 'scale(.1)',
					transformOrigin: '0 0',
					overflow: 'hidden',
					top: '0px',
					borderRadius: '5px',
				} }
				srcDoc={ renderLayoutHtmlForIframe( props.bodyHTML ) }
				src={
					'data:text/html;charset=utf-8,' +
					escape( renderLayoutHtmlForIframe( props.bodyHTML ) )
				}
			/>
		</div>
	);
}
