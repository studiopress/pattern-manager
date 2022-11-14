/* eslint-disable jsdoc/valid-types */

import { __ } from '@wordpress/i18n';

import PatternPreview from '../PatternPreview';

import useStudioContext from '../../hooks/useStudioContext';

import { Icon, close, edit, plus } from '@wordpress/icons';

/**
 * @param {{
 *  templateName: string
 *  templateData: Object
 *  standardTemplates: Object
 *  existsInTheme: boolean
 *  type: import('../../types').Pattern['type']
 * }} props The component props.
 */
export default function ThemeTemplatePicker( {
	templateName,
	templateData,
	standardTemplates,
	existsInTheme,
	type,
} ) {
	const { currentView, currentTheme, currentPatternId } = useStudioContext();

	return (
		<>
			<div className="sm:grid sm:grid-cols-2 py-10 sm:items-center w-full first:pt-0 gap-4">
				<div>
					<h2 className="block mb-1 font-medium text-gray-700 sm:col-span-1">
						{ standardTemplates[ templateName ]?.title ||
							__(
								'Template: this template is not recognized',
								'fse-studio'
							) }
					</h2>
					<span>
						{ standardTemplates[ templateName ]?.description ||
							__(
								'This Template is not recognized by this version of FSE Studio.',
								'fse-studio'
							) }
					</span>
				</div>
				<div className="mt-1 sm:mt-0 sm:col-span-1">
					<div className="flex justify-between border border-gray-200 rounded relative group">
						<button
							className="flex"
							type="button"
							onClick={ () => {
								// If this template doesn't exist in this theme yet, create it first, then go to the block editor.
								if ( ! existsInTheme ) {
									const newPatternData = {
										type,
										title: templateName,
										name: templateName,
										content: '',
										slug: ''
									};

									currentTheme
										.createPattern( newPatternData )
										.then( () => {
											// Switch to the newly created theme.
											currentPatternId.set(
												templateName
											);
											currentView.set( 'pattern_editor' );
										} );
								} else {
									currentPatternId.set( templateName );
									currentView.set( 'pattern_editor' );
								}
							} }
						>
							<div className="flex text-black fill-current p-1 bg-white shadow-sm rounded hover:text-red-500 ease-in-out duration-300">
								<Icon
									className="flex"
									icon={ existsInTheme ? edit : plus }
									size={ 30 }
								/>
								{ ! existsInTheme
									? __( 'Add to theme', 'fse-studio' )
									: null }
							</div>
						</button>
						<button
							className="flex"
							type="button"

							// onClick={ }
						>
							<Icon
								className="text-black fill-current p-1 bg-white shadow-sm rounded hover:text-red-500 ease-in-out duration-300"
								icon={ close }
								size={ 30 }
							/>
						</button>

						<div className="p-3 flex flex-grow items-center">
							<PatternPreview
								key={ templateName }
								scale={ 0.2 }
								url={ templateData?.url }
							/>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
