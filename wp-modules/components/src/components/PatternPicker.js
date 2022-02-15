// @ts-check

import * as React from 'react';
import { useMemo, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { searchItems } from '../utils/searchItems.js';

/**
 * @typedef {Object} Pattern
 * @property {Array}  categories    The pattern categories.
 * @property {string} content       The pattern HTML content.
 * @property {string} name          The pattern name.
 * @property {string} title         The pattern title.
 * @property {number} viewportWidth The viewport width.
 */

/**
 * The pattern picker component.
 *
 * @param {{
 *  patterns: {[key: string]: Pattern},
 *  selectedPatterns: {[key: string]: boolean},
 *  setSelectedPatterns: function({[key: string]: boolean}): void,
 *  layoutPreview: function,
 *  selectMultiple?: boolean,
 * }} props The component props.
 * @return {React.ReactElement} The rendered component.
 */
export default function PatternPicker( {
	patterns: allPatterns,
	selectedPatterns,
	setSelectedPatterns,
	layoutPreview: LayoutPreview,
	selectMultiple,
} ) {
	const [ searchValue, setSearchValue ] = useState( '' );

	const filteredPatterns = useMemo( () => {
		return searchItems( Object.values( allPatterns ), searchValue );
	}, [ searchValue, allPatterns ] );

	/**
	 * Sets the pattern to selected.
	 *
	 * @param {Pattern["name"]} patternName The name of the pattern.
	 */
	function togglePatternSelected( patternName ) {
		if ( selectMultiple ) {
			setSelectedPatterns( {
				...selectedPatterns,
				[ patternName ]: ! isPatternSelected( patternName ),
			} );

			return;
		}

		setSelectedPatterns( {
			[ patternName ]: ! isPatternSelected( patternName ),
		} );
	}

	/**
	 * Gets whether the pattern is selected.
	 *
	 * @param {Pattern["name"]} patternName The name of the pattern.
	 * @return {boolean} Whether the pattern is checked.
	 */
	function isPatternSelected( patternName ) {
		return !! selectedPatterns[ patternName ];
	}

	return (
		<div className="mx-auto mt-12 max-w-7xl bg-white">
			<h2 className="border-b border-gray-200 p-5 px-4 text-xl sm:px-6 md:px-8">
				{ __( 'Patterns', 'fse-studio' ) }
			</h2>
			<div className="flex">
				<div className="w-72 p-8">
					<input
						value={ searchValue }
						onChange={ ( event ) =>
							setSearchValue( event.target.value )
						}
						type="text"
						name="search"
						id="search"
						placeholder={ __( 'Search', 'fse-studio' ) }
						className="!focus:bg-white !focus:ring-2 !focus:ring-wp-blue !focus:border-wp-blue mb-10 block !h-10 w-full !rounded-none !border-gray-300 !bg-gray-100 sm:text-sm"
					/>
				</div>
				<div
					tabIndex={ -1 }
					className="grid w-full grid-cols-3 gap-5 p-8"
				>
					{ filteredPatterns.map( ( pattern, index ) => {
						const isChecked = isPatternSelected( pattern.name );

						return (
							<button
								key={ index }
								tabIndex={ 0 }
								role="checkbox"
								aria-checked={ isChecked }
								className={
									isChecked
										? 'min-h-[300px] border-2 border-solid border-sky-500 bg-gray-200'
										: 'min-h-[300px] bg-gray-200'
								}
								onClick={ () =>
									togglePatternSelected( pattern.name )
								}
								onKeyDown={ ( event ) => {
									if ( 'Enter' === event.code ) {
										togglePatternSelected( pattern.name );
									}
								} }
							>
								<h3 className="border-b border-gray-200 p-5 px-4 text-lg sm:px-6 md:px-8">
									{ pattern.title }
								</h3>
								<LayoutPreview bodyHTML={ pattern.content } />
							</button>
						);
					} ) }
				</div>
			</div>
		</div>
	);
}
