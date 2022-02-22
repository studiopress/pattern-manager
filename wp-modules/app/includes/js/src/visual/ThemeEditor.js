/**
 * Genesis Studio App
 */

const { __ } = wp.i18n;

import Select from 'react-select';

import { useContext, useState, useRef } from '@wordpress/element';
import {
	FseStudioContext,
	useThemeData,
} from './../non-visual/non-visual-logic.js';

export function ThemeEditorApp() {
	const { themes, currentThemeId, currentTheme } = useContext( FseStudioContext );

	function renderThemeSelector() {
		const renderedThemes = [];

		renderedThemes.push(
			<option key={ 1 }>{ __( 'Choose a theme', 'fse-studio' ) }</option>
		);

		let counter = 3;

		for ( const thisTheme in themes.themes ) {
			const themeInQuestion = themes.themes[ thisTheme ];
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
					value={ currentThemeId.value }
					onChange={ ( event ) => {
						currentThemeId.setValue( event.target.value );
						
					} }
				>
					{ renderedThemes }
				</select>
			</>
		);
	}

	function renderThemeEditorWhenReady() {
		if ( ! currentTheme.data ) {
			return '';
		}

		return <ThemeEditor theme={ currentTheme } />;
	}

	return (
		<>
			<div className="fsestudio-subheader">
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
							theme_json_file: 'default',
							included_patterns: [],
							'index.html': '',
							'404.html': '',
						};

						themes.setThemes( {
							...themes.themes,
							'my-new-theme': newThemeData,
						} );

						// Switch to the newly created theme.
						currentThemeId.setValue( 'my-new-theme' );
					} }
				>
					Create a new theme
				</button>
				{ ( () => {
					if ( currentTheme.data ) {
						return (
							<button
								className="button"
								onClick={ () => {
									currentTheme.save();
								} }
							>
								Save theme data to disk
							</button>
						);
					}
				} )() }
			</div>
			{ renderThemeEditorWhenReady() }
		</>
	);
}

export function ThemeEditor( props ) {
	const { patterns } = useContext( FseStudioContext );
	const theme = props.theme;

	function formatPatternValuesForSelect() {
		const options = [];
		for ( const patternNum in theme.data.included_patterns ) {
			const patternId = theme.data.included_patterns[ patternNum ];
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
							included_patterns: reAssembledThemePatterns,
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
			<div className="fsestudio-theme-editor">
				<div
					className="fsestudio-info-editor-options"
					style={ { maxWidth: '600px', margin: '50px auto' } }
				>
					<div className="fsestudio-info-editor-option">
						<div className="fsestudio-info-editor-option-name">
							{ __( 'FSE Theme Name: ', 'fse-studio' ) }
						</div>
						<div className="fsestudio-info-editor-option-value">
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
					<div className="fsestudio-info-editor-option">
						<div className="fsestudio-info-editor-option-name">
							{ __( 'Directory name: ', 'fse-studio' ) }
						</div>
						<div className="fsestudio-info-editor-option-value">
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
					<div className="fsestudio-info-editor-option">
						<div className="fsestudio-info-editor-option-name">
							{ __( 'Namespace: ', 'fse-studio' ) }
						</div>
						<div className="fsestudio-info-editor-option-value">
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
					<div className="fsestudio-info-editor-option">
						<div className="fsestudio-info-editor-option-name">
							{ __( 'URI: ', 'fse-studio' ) }
						</div>
						<div className="fsestudio-info-editor-option-value">
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
					<div className="fsestudio-info-editor-option">
						<div className="fsestudio-info-editor-option-name">
							{ __( 'Author: ', 'fse-studio' ) }
						</div>
						<div className="fsestudio-info-editor-option-value">
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
					<div className="fsestudio-info-editor-option">
						<div className="fsestudio-info-editor-option-name">
							{ __( 'Author URI: ', 'fse-studio' ) }
						</div>
						<div className="fsestudio-info-editor-option-value">
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
					<div className="fsestudio-info-editor-option">
						<div className="fsestudio-info-editor-option-name">
							{ __( 'Description: ', 'fse-studio' ) }
						</div>
						<div className="fsestudio-info-editor-option-value">
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
					<div className="fsestudio-info-editor-option">
						<div className="fsestudio-info-editor-option-name">
							{ __( 'Tags: ', 'fse-studio' ) }
						</div>
						<div className="fsestudio-info-editor-option-value">
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
					<div className="fsestudio-info-editor-option">
						<div className="fsestudio-info-editor-option-name">
							{ __(
								'Tested up to (WordPress Version): ',
								'fse-studio'
							) }
						</div>
						<div className="fsestudio-info-editor-option-value">
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
					<div className="fsestudio-info-editor-option">
						<div className="fsestudio-info-editor-option-name">
							{ __(
								'Minimum WordPress Version: ',
								'fse-studio'
							) }
						</div>
						<div className="fsestudio-info-editor-option-value">
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
					<div className="fsestudio-info-editor-option">
						<div className="fsestudio-info-editor-option-name">
							{ __( 'Minimum PHP Version: ', 'fse-studio' ) }
						</div>
						<div className="fsestudio-info-editor-option-value">
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
					<div className="fsestudio-info-editor-option">
						<div className="fsestudio-info-editor-option-name">
							{ __( 'Version: ', 'fse-studio' ) }
						</div>
						<div className="fsestudio-info-editor-option-value">
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
					<div className="fsestudio-info-editor-option">
						<div className="fsestudio-info-editor-option-name">
							{ __( 'Text Domain: ', 'fse-studio' ) }
						</div>
						<div className="fsestudio-info-editor-option-value">
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

					<div className="fsestudio-info-editor-option">
						<div className="fsestudio-info-editor-option-name">
							{ __( 'Included Patterns: ', 'fse-studio' ) }
						</div>
						<div className="fsestudio-info-editor-option-value">
							{ renderPatternPicker() }
						</div>
					</div>
					<div className="fsestudio-info-editor-option">
						<div className="fsestudio-info-editor-option-name">
							{ __( 'index.html contents: ', 'fse-studio' ) }
						</div>
						<div className="fsestudio-info-editor-option-value">
							<div>
								{
									//currentThemeData[ 'index.html' ].pattern
								 }
							</div>
							<button onClick={ () => {} } className="button">
								{ __(
									'Set index.html contents',
									'fse-studio'
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

export function LayoutPreview( props ) {
	const { siteUrl } = useContext( FseStudioContext );
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
				pointerEvents: 'none',
			} }
		>
			<iframe
				title="Preview"
				ref={ iframeRef }
				onLoad={ onLoad }
				scrolling="no"
				style={ {
					width: '2000px',
					height: iframeInnerContentHeight + 'px',
					transform: 'scale(.2)',
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
