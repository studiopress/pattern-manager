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
		return 'no theme loaded';
	}

	return (
		<div hidden={ ! isVisible } className="flex-1">
			<div className="bg-fses-gray mx-auto p-12 w-full">
				<div className="max-w-7xl mx-auto">
					<h1 className="text-4xl mb-3">{ __( 'Theme Templates', 'fse-studio' ) }</h1>
					<p className="text-lg max-w-2xl">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.</p>
				</div>
			</div>

			<div className="mx-auto p-12">
				<div className="divide-y divide-gray-200 max-w-7xl mx-auto flex justify-between gap-20">
					{ Object.entries( currentTheme.data?.template_files ?? {} ).map(
						( [templateName, templateContent] ) => {
							console.log( templateName );
							return (
								<ThemeTemplatePicker
									key={ templateName }
									templateName={ templateName }
									templateContent={ templateContent }
								/>
							);
						}
					) }
				</div>
			</div>
		</div>
	);
}

