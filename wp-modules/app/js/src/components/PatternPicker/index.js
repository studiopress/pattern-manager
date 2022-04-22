// @ts-check

import { useMemo, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import searchItems from '../../utils/searchItems.js';
import PatternPreview from '../PatternPreview';
import useMounted from '../../hooks/useMounted';

/**
 * @typedef {{
 *  type: string,
 *  categories: Array,
 *  content: string,
 *  name: string,
 *  title: string,
 *  viewportWidth: number
 * }} Pattern
 */

/**
 * @param {{
 *  patterns: Record<string, Pattern>,
 *  themeJsonData: import('../../hooks/useThemeJsonFile').ThemeData,
 *  onClickPattern: Function,
 *  selectedPatterns?: string[]
 * }} props The component props.
 */
export default function PatternPicker( {
	patterns: allPatterns,
	themeJsonData,
	onClickPattern,
	selectedPatterns = [],
} ) {
	const [ searchValue, setSearchValue ] = useState( '' );
	const [ numberToRender, setNumberToRender ] = useState( 0 );
	const { isMounted } = useMounted();

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
								if ( isMounted() ) {
									setSearchValue( event.target.value );
								}
							} }
							type="text"
							name="search"
							id="search"
							placeholder={ __( 'Search', 'fse-studio' ) }
							className="!focus:bg-white !focus:ring-2 !focus:ring-wp-blue !focus:border-wp-blue mb-10 block !h-12 w-full !rounded-none !border-[#F0F0F0] !bg-[#F0F0F0] sm:text-sm"
						/>
					</div>
				</div>
				<div tabIndex={ -1 } className="grid w-full grid-cols-3 gap-10">
					{ filteredPatterns.length > 0
						? filteredPatterns.map( ( pattern, index ) => {
								const isChecked = selectedPatterns.includes(
									pattern.name
								);

								if ( index <= numberToRender ) {
									return (
										<button
											key={ pattern.name }
											tabIndex={ 0 }
											role="checkbox"
											aria-checked={ isChecked }
											className={
												isChecked
													? 'min-h-[300px] bg-gray-100 flex flex-col justify-between border-2 border-blue-500 rounded relative group'
													: 'min-h-[300px] bg-gray-100 flex flex-col justify-between border border-gray-200 rounded relative group'
											}
											onClick={ () => {
												onClickPattern( pattern.name );
											} }
											onKeyDown={ ( event ) => {
												if ( 'Enter' === event.code ) {
													onClickPattern(
														pattern.name
													);
												}
											} }
										>
											<div className="p-3 flex flex-grow items-center w-full">
												<PatternPreview
													key={ pattern.name }
													blockPatternData={ pattern }
													themeJsonData={
														themeJsonData
													}
													scale={ 0.3 }
													onLoad={ () => {
														if ( isMounted() ) {
															setNumberToRender(
																index + 1
															);
														}
													} }
												/>
											</div>
											<div className="w-full">
												<h3 className="text-sm bg-white p-4 rounded-b w-full">
													{ pattern.title }
												</h3>
											</div>
										</button>
									);
								}

								return null;
						  } )
						: __( 'No patterns found', 'fse-studio' ) }
				</div>
			</div>
		</div>
	);
}
