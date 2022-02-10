/**
 * Genesis Studio App
 */

const { __ } = wp.i18n;

import { BlockPreview } from '@wordpress/block-editor';
import { ColorPicker, Popover } from '@wordpress/components';
import { serialize, parse } from '@wordpress/blocks';
import { useContext, useState, useEffect, createPortal, useRef } from '@wordpress/element';
import {
	FseStudioContext,
	useThemeJsonFile,
} from './../non-visual/non-visual-logic.js';

export function ThemeJsonEditorApp( {visible} ) {
	const { themeJsonFiles, currentThemeJsonFileData } = useContext( FseStudioContext );
	const [ currentId, setCurrentId ] = useState();
	const themeJsonFile = useThemeJsonFile( currentId );
	
	useEffect( () => {
		currentThemeJsonFileData.setValue( themeJsonFile.data );
	}, [themeJsonFile] );

	function renderSelector() {
		const renderedOptions = [];

		renderedOptions.push(
			<option key={ 1 }>
				{ __( 'Choose a Theme JSON File', 'fse-studio' ) }
			</option>
		);

		let counter = 3;

		for ( const fileId in themeJsonFiles.themeJsonFiles ) {
			const optionInQuestion = themeJsonFiles.themeJsonFiles[ fileId ];

			renderedOptions.push(
				<option key={ counter } value={ optionInQuestion.name }>
					{ optionInQuestion.name }
				</option>
			);
			counter++;
		}

		return (
			<>
				<select
					value={ currentId }
					onChange={ ( event ) => {
						setCurrentId( event.target.value );
					} }
				>
					{ renderedOptions }
				</select>
			</>
		);
	}

	function renderThemeEditorWhenReady() {
		if ( ! themeJsonFile.data ) {
			return '';
		}

		return <ThemeJsonEditor themeJsonFile={ themeJsonFile } />;
	}

	return (
		<>
			<div hidden={!visible} className="fsestudio-theme-json-app">
				<div>Theme Json Editor</div>
				{ renderSelector() }
				or{ ' ' }
				<button
					className="button"
					onClick={ () => {
						const newData = {
							name: 'new',
							content: '',
						};

						themeJsonFiles.setThemeJsonFiles( {
							...themeJsonFiles.themeJsonFiles,
							'my': newData,
						} );

						// Switch to the newly created theme.
						setCurrentThemeId( 'new' );
					} }
				>
					Create a new theme Json file.
				</button>
				{(() => {
					if ( themeJsonFile.data ) {
						return (
							<button
								className="button"
								onClick={ () => {
									themeJsonFile.save();
								} }
							>
								Save theme JSON data to disk
							</button>
						)
					}
				})()}
				{ renderThemeEditorWhenReady() }
			</div>
		</>
	);
}

function ThemeJsonEditor({themeJsonFile}) {
	const { patterns } = useContext( FseStudioContext );
	const content = themeJsonFile.data.content;
	
	function renderSettings() {
		const rendered = [];
		console.log( 'Settings?', content );
		for ( const setting in content.settings ) {
			if ( setting === 'color' ) {
				console.log(  content.settings[setting] );
				
				for ( const colorSetting in content.settings[setting] ) {
					
					if (  colorSetting === 'palette' ) {
						rendered.push( <FseStudioColorPalette key={colorSetting} themeJsonFile={themeJsonFile} colors={content.settings[setting][colorSetting] } /> )
					}
				}
			}
		}
		
		return rendered;
	}
	
	function renderPatternPreviews( patterns ) {
		const rendered = [];
		
		for( const blockPattern in patterns.patterns ) {
			console.log( patterns.patterns[blockPattern] );
			
			rendered.push(
				<CustomBlockPatternPreview
					html={ patterns.patterns[blockPattern].content }
				/>
			);
		}
		
		return rendered;
		
	}

	return (
	<>
		<div className="fsestudio-theme-json-editor">
			<div className="grid grid-cols-8">
				<div className="border-2 border-black">
					Settings
					{ renderSettings() }
				</div>
				<div className="border-2 border-black">
					Styles
					
				</div>
				<div className="border-2 border-black">
					Custom Templates
					
				</div>
				<div className="border-2 border-black">
					Template Parts
				</div>
				<div className="columns-10 gap-2 col-span-4">
					{ renderPatternPreviews( patterns ) }
				</div>
			</div>
			
		</div>
	</>
	)
}

function CustomBlockPatternPreview({html}) {
	const {blockEditorSettings, currentThemeJsonFileData} = useContext( FseStudioContext );

	function renderPortalCssStyles() {
		const renderedStyles = [
			<div dangerouslySetInnerHTML={ { __html: blockEditorSettings.__unstableResolvedAssets.styles } } />
		];

		for( const style in blockEditorSettings.styles ) {
			renderedStyles.push(
				<style key={style}>
					{ blockEditorSettings.styles[style].css }
				</style>
			);
		}
		
		if ( currentThemeJsonFileData?.value?.renderedGlobalStyles ) {
			renderedStyles.push(
				<style key={'renderedGlobalStyles'}>
					{ currentThemeJsonFileData.value.renderedGlobalStyles }
				</style>
			);
		}

		return renderedStyles;
	}
	
	return (
		<Portal>
			<div>
				{ renderPortalCssStyles() }
			</div>
			<div dangerouslySetInnerHTML={{__html: html }} />
		</Portal>
	)
}

function Portal({children}) {
	const [iframeRef, setRef] = useState();
	const [iframeInnerContentHeight, setIframeInnerContentHeight] = useState(0);
	const container = iframeRef?.contentWindow?.document?.body;
	
	const scale = .08;
	const scaleMultiplier = 10 / (scale*10);
	
	useEffect( () => {
		if ( iframeRef ) {
			setTimeout( () => {
				setIframeInnerContentHeight( container.scrollHeight );
			}, [1000]);
		}
	} );

	return (
		<div
		style={{
			position:'relative',
			width: '100%',
			height: iframeInnerContentHeight / scaleMultiplier,
			marginTop:'10px',
			marginBottom:'10px',
		}}>
			<iframe
				ref={setRef}
				style={ {
					position: 'absolute',
					top: '0',
					left: '0',
					width: 100 * scaleMultiplier + '%',
					height: 100 * scaleMultiplier + '%',
					display: 'block',
					transform: 'scale(' + scale + ')',
					transformOrigin: 'top left',
				} }
			>
				
				{container && createPortal(children, container)}
			</iframe>
		</div>
	);
}

function FseStudioColorPalette( {themeJsonFile, colors} ) {
	
	function renderColorOptions() {
		return colors.map((color, index) => (
			<FseStudioColorPalettePicker key={color.slug} themeJsonFile={themeJsonFile} color={color} index={index} />
		))
	}
	
	return (
		<div className="grid gap-5">
			{ renderColorOptions() }
		</div>
	)
}

function FseStudioColorPalettePicker( {themeJsonFile, color, index} ) {
	
	const [ popoverIsVisible, setPopoverIsVisible ] = useState( false );
	
	function maybeRenderPickerPopover() {
		if ( popoverIsVisible ) {
			return (
				<Popover
					onClose={() => {
						setPopoverIsVisible( false )
					}}
				>
					<div className="p-2">
						<ColorPicker
							color={color.color}
							onChange={(colorValue) => {
								const modifiedData = { ...themeJsonFile.data };
								console.log( modifiedData.content.settings.color.palette[index] );
								modifiedData.content.settings.color.palette[index] = {
									...modifiedData.content.settings.color.palette[index],
									color: colorValue
								}

								themeJsonFile.set(modifiedData);
							}}
							enableAlpha
							defaultValue="#000"
						/>
					</div>
				</Popover>
			)
		}
	}

	return (
		<>
			<div>
				<label 
					className="flex gap-1"
					onClick={() => {
						setPopoverIsVisible( true )
					}}
				>
					<div
						style={{
							width: '20px',
							height: '20px',
							backgroundColor: color.color
						}}
						onClick={() => {
							setPopoverIsVisible( true )
						}}
					>
						{ maybeRenderPickerPopover() }
					</div>
					<div>
						{ color.name }
					</div>
				</label>
			</div>
		</>
	);
}
