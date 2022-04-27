import { v4 as uuidv4 } from 'uuid';

// WP Dependencies.
import {
	useRef,
	useState,
} from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import {
	Icon,
	layout,
	file,
	globe,
	check,
	download,
	close,
	edit,
	plus,
} from '@wordpress/icons';

import useStudioContext from '../../hooks/useStudioContext';

// Components
import PatternPreview from '../PatternPreview';

// Utils
import classNames from '../../utils/classNames';

// Globals
import { fsestudio } from '../../globals';

/** @param {{isVisible: boolean}} props */
export default function ThemeTemplateFiles( { isVisible } ) {
	const { currentTheme } = useStudioContext();
	
	if ( ! currentTheme.data ) {
		return '';
	}
	
	const standardTemplates = {
		index: {
			title: __( 'Template: index.html', 'fse-studio' ),
			description: __(
				'This template is used to show any post or page if no other template makes sense.',
				'fse-studio'
			),
		},
		404: {
			title: __( 'Template: 404.html', 'fse-studio' ),
			description: __(
				'This template is used when the URL does not match anything on the website.',
				'fse-studio'
			),
		},
		archive: {
			title: __( 'Template: archive.html', 'fse-studio' ),
			description: __(
				'This template is used when viewing a whole page of posts.',
				'fse-studio'
			),
		},
		single: {
			title: __( 'Template: single.html', 'fse-studio' ),
			description: __(
				'This template is used when viewing a single post.',
				'fse-studio'
			),
		},
		page: {
			title: __( 'Template: page.html', 'fse-studio' ),
			description: __(
				'This template is used when viewing a single page.',
				'fse-studio'
			),
		},
		search: {
			title: __( 'Template: search.html', 'fse-studio' ),
			description: __(
				'This template is used to show search results when the viewer performs a search in your WordPress site.',
				'fse-studio'
			),
		},
	};

	return (
		<div hidden={ ! isVisible } className="flex-1">
			<div className="divide-y divide-gray-200">
				{ Object.entries( standardTemplates ?? {} ).map(
					( [templateName, templateHelpInfo] ) => {
						return (
							<ThemeTemplatePicker
								key={ templateName }
								templateName={ templateName }
								templateContent={ currentTheme.data?.template_files[templateName] }
								standardTemplates={standardTemplates}
							/>
						);
					}
				) }
				{ Object.entries( currentTheme.data?.template_files ?? {} ).map(
					( [templateName, templateContent] ) => {
						// Skip any we've already rendered above (standardTemplates).
						if ( ! standardTemplates.hasOwnProperty( templateName ) ) {
								
							return (
								<ThemeTemplatePicker
									key={ templateName }
									templateName={ templateName }
									templateContent={ templateContent }
									standardTemplates={standardTemplates}
								/>
							);
						}
					}
				) }
			</div>
		</div>
	);
}


/**
 * @param {{
 *  templateName: string
 * }} props The component props.
 */
function ThemeTemplatePicker( { templateName, standardTemplates } ) {
	const { patterns, currentTheme } = useStudioContext();

	const [ isModalOpen, setModalOpen ] = useState( false );
	const [ focusedTemplateFileName, setFocusedTemplateFileName ] = useState(
		''
	);

	return (
		<>
			<div className="sm:grid sm:grid-cols-2 sm:gap-10 py-6 sm:items-center">
				<div>
					<h2 className="block text-sm font-medium text-gray-700 sm:col-span-1">
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
								currentPatternId.set( patternName );
								currentView.set( 'pattern_editor' );
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
								blockPatternData={
									patterns?.patterns[
										currentTheme.data?.template_files?.[
											templateName
										]
									]
								}
								
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


