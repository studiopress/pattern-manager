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
export default function ThemeTemplatePicker( { templateName } ) {
	const { patterns, currentTheme } = useStudioContext();

	const [ isModalOpen, setModalOpen ] = useState( false );
	const [ focusedTemplateFileName, setFocusedTemplateFileName ] = useState(
		''
	);

	const data = {
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
				'This template is used when you use an archive.',
				'fse-studio'
			),
		},
		single: {
			title: __( 'Template: archive.html', 'fse-studio' ),
			description: __(
				'This template is used when you use an single page.',
				'fse-studio'
			),
		},
		page: {
			title: __( 'Template: page.html', 'fse-studio' ),
			description: __(
				'This template is used when you select an page.',
				'fse-studio'
			),
		},
		search: {
			title: __( 'Template: search.html', 'fse-studio' ),
			description: __(
				'This template is used when you search in your WordPress site.',
				'fse-studio'
			),
		},
	};

	return (
		<>
			<div className="sm:grid sm:grid-cols-2 py-10 sm:items-center w-full first:pt-0 gap-4">
				<div>
					<h2 className="block mb-1 font-medium text-gray-700 sm:col-span-1">
						{ data[ templateName ]?.title ||
							__(
								'Template: this template is not recognized',
								'fse-studio'
							) }
					</h2>
					<span>
						{ data[ templateName ]?.description ||
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
