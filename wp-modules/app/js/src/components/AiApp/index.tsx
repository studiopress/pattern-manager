import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { Button, TextControl, __experimentalPaletteEdit as PaletteEdit, } from '@wordpress/components';
import { Panel, PanelBody, PanelRow } from '@wordpress/components';
import { PluginDocumentSettingPanel } from '@wordpress/edit-post';
import {
	chevronLeft,
	chevronRight,
	chevronUp,
	chevronDown,
} from '@wordpress/icons';


// Hooks
import usePmContext from '../../hooks/usePmContext';

export default function AiApp() {
	return <div
		style={{
			marginBottom: '20px',
			backgroundColor: '#f1f1f1',
			zIndex: '999999',
			width: '100%',
			alignContent: 'center',
			justifyContent: 'center',
			padding: '5px',
			
			gap: '20px',
		}}
	>
		<Panel header={__( 'Global Styles tools:', 'pattern-manager' ) }>
			<ColorPaletteTool />
			<FontTool />
		</Panel>
	</div>
}
function FontTool() {
	return <PanelBody title={__( 'Font Tool:', 'pattern-manager' ) } initialOpen={ false }>
			<PanelRow>
			</PanelRow>
	</PanelBody>
}
function ColorPaletteTool() {
	const [url, setUrl] = useState('https://');
	const [themejson, setThemeJson] = useState(patternManager.themeJson);
	const { patterns } = usePmContext();
	const [fetchState, setFetchState] = useState('none');
	const [errorMessage, setErrorMessage] = useState('');

	const colors = [
		{ name: 'red', color: '#f00', slug: 'sdgsdg' },
		{ name: 'white', color: '#fff' },
		{ name: 'blue', color: '#00f' },
	];
	
	async function writeThemeJsonToDisk(themejson) {
		try {
			var postData = new FormData();
			postData.append('themejson', JSON.stringify( themejson ) );

			const response = await fetch('http://localhost:10203/?update_theme_json=1', {
				method: "POST",
				mode: "same-origin",
				credentials: "same-origin",
				body: postData
			});
			if (!response.ok) {
			  throw new Error('Failed to fetch JSON');
			}
			const json = await response.json();
		
			if ( json?.error ) {
				console.log( json.error );
				throw new Error(json?.error);
			} else {
				//setThemeJson( json ); 
				patterns.refreshPatterns();
			}
			setFetchState( 'none' );
		} catch (error) {
			console.log( error );
			setErrorMessage(error.toString());
			setFetchState( 'none' );
		}
	}

	return <PanelBody title={__( 'Color Palette Tool:', 'pattern-manager' ) } initialOpen={ true }>
					<>
					<PanelRow>
						<form onSubmit={async (event) => {
							event.preventDefault();
							
							setFetchState( 'fetching' );
							setErrorMessage( '' );
	
							try {
								const response = await fetch('http://localhost:10203/?get_site_html=' + url);
								if (!response.ok) {
								  throw new Error('Failed to fetch JSON');
								}
								const json = await response.json();
							
								if ( json?.error ) {
									console.log( json.error );
									throw new Error(json?.error);
								} else {
									setThemeJson( json ); 
									patterns.refreshPatterns();
								}
								setFetchState( 'none' );
							} catch (error) {
								console.log( error );
								setErrorMessage(error.toString());
								setFetchState( 'none' );
							}
				
						}}>
							<label htmlFor="color-palette-tool-url-field">
								<span>Enter a URL</span>
								<p>This will find all the colors and build a color palette from them</p>
							</label>
							<TextControl
								id={'color-palette-tool-url-field'}
								value={url}
								onChange={(newValue) => {
									setUrl(newValue);
								}}
								aria-label={ __(
									'The URL to the website from which you wish to grab colors.',
									'pattern-manager'
								) }
							/>
							<button type="submit" className="button">
							{ fetchState === 'fetching' ? (
								__( 'Analying page...', 'pattern-manager' )
							) : (
								__( 'Build Color Palette', 'pattern-manager' )
							)}
							</button>
							{ errorMessage ? (
								<span>{errorMessage}</span>
							) : null }
						</form>
					</PanelRow>
					<PanelRow>
						{
							themejson ? (
								<ColorPaletteEditor
									colors={themejson?.settings?.color?.palette}
									setColors={(newColorPalette) => {
										const newThemeJson = JSON.parse( JSON.stringify( themejson ) );
										console.log( 'themejson', themejson, 'newThemeJson', newThemeJson );
										newThemeJson.settings.color.palette = newColorPalette;
										setThemeJson(newThemeJson);
										writeThemeJsonToDisk(newThemeJson);
										
									}}
									patterns={patterns}
								/>
							) : null 
						}
					</PanelRow>
					</>
			</PanelBody>
}

function ColorPaletteEditor({colors, setColors, patterns}) {
	
	function swapColor(arr, fromIndex, toIndex) {
		console.log( arr );
		
		const originalColorValue = arr[toIndex].color;
		
		const colorValueBeingSwapped = arr[fromIndex].color;
		
		arr[fromIndex].color = originalColorValue;
		arr[toIndex].color = colorValueBeingSwapped;

		return arr;
	 }

	function renderColors() {
		const renderedColors = [];
		
		for( const color in colors ) {
			renderedColors.push(<div style={{
				display: 'grid',
				gridTemplateColumns: 'min-content 20px 1fr',
				gap: '5px',
				padding: '5px',
				alignItems: 'center',
			}}>
				<div style={{
					display: 'grid',
					gridTemplateRows: '1fr 1fr',
				}}>
					<Button
						style={{
							height:'1px',
						}}
						className={ 'block-editor-block-mover-button is-up-button' }
						icon={ chevronUp }
						label={ 'Move up' }
						aria-describedby={ 'Move this color up' }
						onClick={() => {
							const newColors = swapColor([...colors], color, parseInt( color )-1);
							console.log( newColors );
							setColors(newColors);
						}}
					/>
					<Button
						style={{
							height:'1px',
						}}
						className={ 'block-editor-block-mover-button is-down-button' }
						icon={ chevronDown }
						label={ 'Move down' }
						aria-describedby={ 'Move this color down' }
						onClick={() => {
							console.log( color+1 );
							
							const newColors = swapColor([...colors], color, parseInt( color )+1);
							console.log( newColors );
							setColors(newColors);
						}}
					/>
				</div>
				<button
					style={{
						backgroundColor: colors[color]['color'],
						border: '1px solid #000',
						borderRadius: '50%',
						width: '20px',
						height: '20px',
					}}
				/>
				<div style={{justifyItems: 'start'}}>
					{colors[color]['name']}
				</div>
				
			</div>);
		}
		
		return renderedColors;
	}
	
	return <div className="color-palette-editor">
		{renderColors()}
	</div>
}