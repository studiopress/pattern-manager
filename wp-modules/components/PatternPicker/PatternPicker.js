// @ts-check

import * as React from 'react';
import { useMemo, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { searchItems } from './utils/searchItems.js';

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
 *  patterns: Record<string, Pattern>,
 *  selectedPatterns: Record<string, boolean>,
 *  setSelectedPatterns: Function,
 *  layoutPreview: Function,
 *  selectMultiple: boolean | undefined
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
	 * @param {string} patternName The name of the pattern.
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
	 * @param {string} patternName The name of the pattern.
	 * @return {boolean} Whether the pattern is checked.
	 */
	function isPatternSelected( patternName ) {
		return !! selectedPatterns[ patternName ];
	}

	return (
		<div className="mx-auto bg-white">
			<div className="flex gap-10">
				<div className="w-72">
					<div className="absolute w-56">
						<input
							value={ searchValue }
							onChange={ ( event ) =>
								setSearchValue( event.target.value )
							}
							type="text"
							name="search"
							id="search"
							placeholder={ __( 'Search', 'fse-studio' ) }
							className="!focus:bg-white !focus:ring-2 !focus:ring-wp-blue !focus:border-wp-blue mb-10 block !h-12 w-full !rounded-none !border-[#F0F0F0] !bg-[#F0F0F0] sm:text-sm"
						/>
					</div>
				</div>
				<div tabIndex={ -1 } className="grid w-full grid-cols-3 gap-5">
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
										? 'min-h-[300px] border-2 border-solid border-sky-500 bg-white'
										: 'min-h-[300px] bg-white border border-[#F0F0F0]'
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
								<LayoutPreview bodyHTML={ pattern.content } />
								<h3 className="p-5 px-4 text-lg sm:px-6 md:px-8">
									{ pattern.title }
								</h3>
							</button>
						);
					} ) }
				</div>
			</div>
		</div>
	);
}
