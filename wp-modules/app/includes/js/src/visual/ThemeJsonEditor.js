/**
 * Genesis Studio App
 */

const { __ } = wp.i18n;

import { ColorPicker, Popover } from '@wordpress/components';
import { useContext, useState, useEffect } from '@wordpress/element';
import {
	FseStudioContext,
	useThemeJsonFile,
} from './../non-visual/non-visual-logic.js';

import { PatternPreview } from './PatternPreview';

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
	const { patterns, patternPreviewParts } = useContext( FseStudioContext );
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
			console.log( 'Block Pattern', patterns.patterns[blockPattern] );
			
			rendered.push(
				<PatternPreview
					key={blockPattern}
					wpHead={ patternPreviewParts.data.wpHead }
					blockPatternData={ patterns.patterns[blockPattern] }
					wpFooter={ patternPreviewParts.data.wpFooter}
					themeJsonData={ null }
					scale={ .5 }
				/>
			);
		}
		
		return rendered;
		
	}

	return (
	<>
		<div className="fsestudio-theme-json-editor">
			<div className="grid grid-cols-9">
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
				<div className="grid grid-cols-2 gap-2 col-span-5">
					{ renderPatternPreviews( patterns ) }
				</div>
			</div>
			
		</div>
	</>
	)
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
