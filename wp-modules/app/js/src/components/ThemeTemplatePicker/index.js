import { __ } from '@wordpress/i18n';
import { Modal } from '@wordpress/components';

import PatternPreview from '../PatternPreview';
import PatternPicker from '../PatternPicker';

import useStudioContext from '../../hooks/useStudioContext';

// WP Dependencies.
import { useState } from '@wordpress/element';

/**
 * @param {{
 *  templateName: string
 * }} props The component props.
 */
export default function ThemeTemplatePicker( { templateName } ) {
	const { patterns, currentTheme, currentThemeJsonFile } = useStudioContext();

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
			<div className="sm:grid sm:grid-cols-2 sm:gap-10 py-6 sm:items-center">
				<div>
					<h2 className="block text-sm font-medium text-gray-700 sm:col-span-1">
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
					<button
						className="mt-4 items-center px-4 py-2 border border-transparent text-sm font-medium rounded-sm shadow-sm text-white bg-wp-gray hover:bg-[#586b70] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-wp-blue block"
						onClick={ () => {
							setFocusedTemplateFileName( templateName );
							setModalOpen( true );
						} }
					>
						{ ( currentTheme.data?.template_files?.[
							templateName
						] &&
							__( 'Change Pattern', 'fse-studio' ) ) ||
							__( 'Set Pattern', 'fse-studio' ) }
					</button>
				</div>
				<div className="mt-1 sm:mt-0 sm:col-span-1">
					<div className="min-h-[30px] bg-white border border-[#F0F0F0]">
						<PatternPreview
							key={ templateName }
							blockPatternData={
								patterns?.patterns[
									currentTheme.data?.template_files?.[
										templateName
									]
								]
							}
							themeJsonData={ currentThemeJsonFile.data }
							scale={ 0.2 }
						/>
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
						themeJsonData={ currentThemeJsonFile.data }
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
