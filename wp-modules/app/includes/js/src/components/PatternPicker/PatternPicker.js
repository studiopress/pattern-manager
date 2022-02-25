// @ts-check

import * as React from 'react';
import { useMemo, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { searchItems } from './utils/searchItems.js';
import { PatternPreview } from './../PatternPreview/PatternPreview.js';

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
 *  themeJsonData: string[],
 *  onClickPattern: Function,
 *  selectedPatterns: string[]
 * }} props The component props.
 * @return {React.ReactElement} The rendered component.
 */
export default function PatternPicker( {
	patterns: allPatterns,
	themeJsonData,
	onClickPattern,
	selectedPatterns = [],
} ) {
	const [ searchValue, setSearchValue ] = useState( '' );
	const [numberToRender, setNumberToRender] = useState( 0 );

	const filteredPatterns = useMemo( () => {
		return searchItems( Object.values( allPatterns ), searchValue );
	}, [ searchValue, allPatterns ] );

	return (
		<div className="mx-auto bg-white">
			<div className="flex gap-10">
				<div className="w-72">
					<div className="absolute w-56">
						<input
							value={ searchValue }
							onChange={ ( event ) => {
								setSearchValue( event.target.value );
							} }
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
						const isChecked = selectedPatterns.includes(
							pattern.name
						);
						
						if ( index <= numberToRender ) {
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
									onClick={ () => {
										onClickPattern( pattern.name );
									} }
									onKeyDown={ ( event ) => {
										if ( 'Enter' === event.code ) {
											onClickPattern( pattern.name );
										}
									} }
								>
									<PatternPreview
										key={ pattern.name }
										blockPatternData={ pattern }
										themeJsonData={ themeJsonData }
										scale={ 0.3 }
										onLoad={() => {
											setNumberToRender( index + 1 )
										}}
									/>
									<h3 className="p-5 px-4 text-lg sm:px-6 md:px-8">
										{ pattern.title }
									</h3>
								</button>
							);
						}
					} ) }
				</div>
			</div>
		</div>
	);
}
