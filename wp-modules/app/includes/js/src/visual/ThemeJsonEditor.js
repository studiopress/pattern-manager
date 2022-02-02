/**
 * Genesis Studio App
 */

 const { __ } = wp.i18n;

 import Select from 'react-select';
 
 import { Modal } from '@wordpress/components';
 import { useContext, useState, useEffect, useRef } from '@wordpress/element';
 import {
	 FseStudioContext,
	 useThemeJsonFile,
 } from './../non-visual/non-visual-logic.js';

export function ThemeJsonEditorApp( props ) {
	const { themeJsonFiles } = useContext( FseStudioContext );
	const [ currentId, setCurrentId ] = useState();
	const themeJsonFile = useThemeJsonFile( currentId );

	function renderSelector() {
		const renderedOptions = [];

		renderedOptions.push(
			<option key={ 1 }>
				{ __( 'Choose a Theme JSON File', 'fsestudio' ) }
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
			<div className="fsestudio-subheader">
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
			</div>
			{ renderThemeEditorWhenReady() }
		</>
	);
}

function ThemeJsonEditor(props) {
	const themeJsonFile = props.themeJsonFile;
	return (
		<div className="fsestudio-theme-editor">
			{ themeJsonFile.data.name }
		</div>
	)
}