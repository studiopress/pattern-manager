import { __ } from '@wordpress/i18n';
import { Modal } from '@wordpress/components';

import PatternPreview from '../PatternPreview';
import PatternPicker from '../PatternPicker';

import useStudioContext from '../../hooks/useStudioContext';

// WP Dependencies.
import { useState } from '@wordpress/element';

import {
	Icon,
	close,
	edit,
} from '@wordpress/icons';

/**
 * @param {{
 *  templateName: string
 * }} props The component props.
 */
export default function ThemeTemplatePicker( { templateName, templateData, standardTemplates } ) {
	const { currentView, currentTheme, currentPatternId } = useStudioContext();

	const [ isModalOpen, setModalOpen ] = useState( false );
	const [ focusedTemplateFileName, setFocusedTemplateFileName ] = useState(
		''
	);

	return (
		<>
			<div className="sm:grid sm:grid-cols-2 py-10 sm:items-center w-full">
				<div>
					<h2 className="block text-lg mb-1 font-medium text-gray-700 sm:col-span-1">
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
					<div
						
						className="min-h-[300px] bg-gray-100 flex flex-col justify-between border border-gray-200 rounded relative group"
					>
						<button
							type="button"
							className="absolute top-2 right-2"
							// onClick={ }
						>
							<Icon
								className="text-black fill-current p-1 bg-white shadow-sm rounded hover:text-red-500 ease-in-out duration-300"
								icon={ close }
								size={ 30 }
							/>
						</button>
						<button
							type="button"
							className="absolute top-2 left-2"
							 onClick={() => {
								// If this template doesn't exist in this theme yet, create it first, then go to the block editor.
								if ( ! currentTheme.data?.template_files?.hasOwnProperty( templateName ) ) {
									const newPatternData = {
										type: 'template',
										title: templateName,
										name: templateName,
										content: '',
									};

									currentTheme.createPattern( newPatternData )
									.then( (newPatternData) => {
										console.log( newPatternData );
										// Switch to the newly created theme.
										currentPatternId.set( templateName );
										currentView.set('pattern_editor');
									} );
								
								} else {
									currentPatternId.set( templateName );
									currentView.set( 'pattern_editor' );
								}
							 }}
						>
							<Icon
								className="text-black fill-current p-1 bg-white shadow-sm rounded hover:text-red-500 ease-in-out duration-300"
								icon={ edit }
								size={ 30 }
							/>
						</button>

						<div className="p-3 flex flex-grow items-center">
							<PatternPreview
								key={ templateName }
								scale={ 0.2 }
							/>
						</div>
					</div>
				</div>
			</div>
			{ isModalOpen ? (
				<Modal
					title={ __(
						'Pick the pattern to use for this template file',
						'fse-studio'
					) }
					onRequestClose={ () => {
						setModalOpen( false );
					} }
				>
					<PatternPicker
						patterns={ patterns.patterns }
					
						onClickPattern={ ( clickedPatternName ) => {
							setModalOpen( false );
							currentTheme.set( {
								...currentTheme.data,
								template_files: {
									...currentTheme.data.template_files,
									[ focusedTemplateFileName ]: clickedPatternName,
								},
							} );
						} }
					/>
				</Modal>
			) : null }
		</>
	);
}
