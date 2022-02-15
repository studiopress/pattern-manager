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

import { Icon, layout, file, globe, check } from '@wordpress/icons';

/* eslint-disable */
export function ThemeJsonEditorApp( { visible } ) {
	const { themeJsonFiles, currentThemeJsonFileData } = useContext(
		FseStudioContext
	);
	const [ currentId, setCurrentId ] = useState();
	const themeJsonFile = useThemeJsonFile( currentId );

	useEffect( () => {
		currentThemeJsonFileData.setValue( themeJsonFile.data );
	}, [ themeJsonFile ] );

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
		<div hidden={ ! visible } className="fsestudio-theme-manager p-12">
			<div className="max-w-7xl mx-auto bg-white">
				<h1 className="p-5 text-xl border-b border-gray-200 px-4 sm:px-6 md:px-8">
					{ __( 'Dashboard', 'fse-studio' ) }
				</h1>
				<div className="px-4 sm:px-6 md:px-8 bg-[#F8F8F8] py-8 flex sm:flex-row flex-col items-end">
					<div>
						<label
							htmlFor="location"
							className="block text-sm font-medium text-gray-700"
						>
							{ __( 'Choose a theme', 'fse-studio' ) }
						</label>
						{ renderSelector() }
					</div>
					<div className="flex flex-col mx-6 my-2.5">
						{ __( 'or', 'fse-studio' ) }
					</div>
					<div className="flex flex-col gap-2">
						<button
							type="button"
							className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-sm shadow-sm text-white bg-wp-gray hover:bg-[#586b70] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-wp-blue"
							onClick={ () => {
								const newData = {
									name: 'new',
									content: '',
								};

								themeJsonFiles.setThemeJsonFiles( {
									...themeJsonFiles.themeJsonFiles,
									my: newData,
								} );
							} }
						>
							{ __(
								'Create a new theme JSON file',
								'fse-studio'
							) }
						</button>
					</div>
				</div>
				{ renderThemeEditorWhenReady() }
			</div>
		</div>
	);
}

function ThemeJsonEditor( { themeJsonFile } ) {
	const { patterns, patternPreviewParts } = useContext( FseStudioContext );
	const content = themeJsonFile.data.content;
	const [ currentView, setCurrentView ] = useState( 'settings' );

	const views = [
		{
			name: __( 'Settings', 'fse-studio' ),
			slug: 'settings',
			icon: file,
			current: true,
		},
		{
			name: __( 'Styles', 'fse-studio' ),
			slug: 'styles',
			icon: layout,
			current: false,
		},
		{
			name: __( 'Custom Templates', 'fse-studio' ),
			slug: 'custom_templates',
			icon: globe,
			current: false,
		},
		{
			name: __( 'Template Parts', 'fse-studio' ),
			slug: 'template_parts',
			icon: globe,
			current: false,
		},
	];

	function renderSettings() {
		const rendered = [];
		for ( const setting in content.settings ) {
			if ( setting === 'color' ) {
				for ( const colorSetting in content.settings[ setting ] ) {
					if ( colorSetting === 'palette' ) {
						rendered.push(
							<FseStudioColorPalette
								key={ colorSetting }
								themeJsonFile={ themeJsonFile }
								colors={
									content.settings[ setting ][ colorSetting ]
								}
							/>
						);
					}
				}
			}
		}

		return rendered;
	}

	function renderPatternPreviews() {
		const rendered = [];

		for ( const blockPattern in patterns.patterns ) {
			rendered.push(
				<PatternPreview
					key={ blockPattern }
					wpHead={ patternPreviewParts.data.wpHead }
					blockPatternData={ patterns.patterns[ blockPattern ] }
					wpFooter={ patternPreviewParts.data.wpFooter }
					themeJsonData={ null }
					scale={ 0.5 }
				/>
			);
		}

		return rendered;
	}

	function maybeRenderSettingsView() {
		if ( currentView !== 'settings' ) {
			return '';
		}

		const rendered = [];

		for ( const setting in content.settings ) {
			if ( setting === 'color' ) {
				for ( const colorSetting in content.settings[ setting ] ) {
					if ( colorSetting === 'palette' ) {
						rendered.push(
							<FseStudioColorPalette
								key={ colorSetting }
								themeJsonFile={ themeJsonFile }
								colors={
									content.settings[ setting ][ colorSetting ]
								}
							/>
						);
					}
				}
			}
		}

		return rendered;
	}

	function maybeRenderStylesView() {}

	function maybeRenderCustomTemplatesView() {}

	function maybeRenderTemplatePartsView() {}

	return (
		<>
			<div className="flex flex-row px-4 sm:px-6 md:px-8 py-8 gap-14">
				<ul className="w-72">
					{ views.map( ( item ) => (
						<li key={ item.name }>
							<button
								className={
									'w-full text-left p-5 font-medium' +
									( currentView === item.slug
										? ' bg-gray-100'
										: ' hover:bg-gray-100' )
								}
								key={ item.name }
								onClick={ () => {
									setCurrentView( item.slug );
								} }
							>
								{ item.name }
							</button>
						</li>
					) ) }
				</ul>
				{ maybeRenderSettingsView() }
				{ maybeRenderStylesView() }
				{ maybeRenderCustomTemplatesView() }
				{ maybeRenderTemplatePartsView() }
			</div>
			<div className="p-5 text-xl border-t border-gray-200 px-4 sm:px-6 md:px-8 flex justify-between items-center">
				<div className="flex items-center">
					{ ( () => {
						if ( themeJsonFile.hasSaved ) {
							return (
								<span className="text-sm text-green-600 flex flex-row items-center mr-6">
									<Icon
										className="fill-current"
										icon={ check }
										size={ 26 }
									/>{ ' ' }
									{ __( 'Saved to disk', 'fse-studio' ) }
								</span>
							);
						}
					} )() }
					<button
						type="button"
						className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-sm shadow-sm text-white bg-wp-blue hover:bg-wp-blue-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-wp-blue"
						onClick={ () => {
							themeJsonFile.save();
						} }
					>
						{ __( 'Save Theme Configuration File', 'fse-studio' ) }
					</button>
				</div>
			</div>
		</>
	);

	return (
		<>
			<div className="fsestudio-theme-json-editor">
				<div className="grid grid-cols-9">
					<div className="border-2 border-black">
						Settings
						{ renderSettings() }
					</div>
					<div className="border-2 border-black">Styles</div>
					<div className="border-2 border-black">
						Custom Templates
					</div>
					<div className="border-2 border-black">Template Parts</div>
					<div className="grid grid-cols-2 gap-2 col-span-5">
						{ renderPatternPreviews( patterns ) }
					</div>
				</div>
			</div>
		</>
	);
}

function FseStudioColorPalette( { themeJsonFile, colors } ) {
	function renderColorOptions() {
		return colors.map( ( color, index ) => (
			<FseStudioColorPalettePicker
				key={ color.slug }
				themeJsonFile={ themeJsonFile }
				color={ color }
				index={ index }
			/>
		) );
	}

	return <div className="grid gap-5">{ renderColorOptions() }</div>;
}

function FseStudioColorPalettePicker( { themeJsonFile, color, index } ) {
	const [ popoverIsVisible, setPopoverIsVisible ] = useState( false );

	function maybeRenderPickerPopover() {
		if ( popoverIsVisible ) {
			return (
				<Popover
					onClose={ () => {
						setPopoverIsVisible( false );
					} }
				>
					<div className="p-2">
						<ColorPicker
							color={ color.color }
							onChange={ ( colorValue ) => {
								const modifiedData = { ...themeJsonFile.data };
								modifiedData.content.settings.color.palette[
									index
								] = {
									...modifiedData.content.settings.color
										.palette[ index ],
									color: colorValue,
								};

								themeJsonFile.set( modifiedData );
							} }
							enableAlpha
							defaultValue="#000"
						/>
					</div>
				</Popover>
			);
		}
	}

	return (
		<>
			<div>
				<label
					className="flex gap-1"
					onClick={ () => {
						setPopoverIsVisible( true );
					} }
				>
					<div
						style={ {
							width: '20px',
							height: '20px',
							backgroundColor: color.color,
						} }
						onClick={ () => {
							setPopoverIsVisible( true );
						} }
					>
						{ maybeRenderPickerPopover() }
					</div>
					<div>{ color.name }</div>
				</label>
			</div>
		</>
	);
}
/* eslint-enable */
