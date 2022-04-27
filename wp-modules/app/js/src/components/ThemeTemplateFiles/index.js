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
import ThemeTemplatePicker from '../ThemeTemplatePicker';

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
			<div className="bg-fses-gray mx-auto p-12 w-full">
				<div className="max-w-7xl mx-auto">
					<h1 className="text-4xl mb-3">{ __( 'Theme Templates', 'fse-studio' ) }</h1>
					<p className="text-lg max-w-2xl">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.</p>
				</div>
			</div>

			<div className="mx-auto p-12">
				<div className="divide-y divide-gray-200 max-w-7xl mx-auto flex flex-col justify-between ">
					{ Object.entries( standardTemplates ?? {} ).map(
						( [templateName, templateHelpInfo] ) => {
							return (
								<ThemeTemplatePicker
									key={ templateName }
									templateName={ templateName }
									templateData={ currentTheme.data?.template_files ? currentTheme.data?.template_files[templateName] : '' }
									standardTemplates={standardTemplates}
								/>
							);
						}
					) }
					{ Object.entries( currentTheme.data?.template_files ?? {} ).map(
						( [templateName, templateData] ) => {
							// Skip any we've already rendered above (standardTemplates).
							if ( ! standardTemplates.hasOwnProperty( templateName ) ) {
									
								return (
									<ThemeTemplatePicker
										key={ templateName }
										templateName={ templateName }
										templateData={ templateData }
										standardTemplates={standardTemplates}
									/>
								);
							}
						}
					) }

				</div>
			</div>
		</div>
	);
}

