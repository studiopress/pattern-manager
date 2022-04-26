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
			<div className="divide-y divide-gray-200">
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
	);
}

