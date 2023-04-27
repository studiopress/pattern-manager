import { __ } from '@wordpress/i18n';
import PatternEdit from '../components/PatternEdit';

export default function registerPatternBlock(
	settings: Record< string, unknown >,
	name: string
) {
	return name === 'core/pattern'
		? {
				...settings,
				title: __( 'PM Pattern Block', 'pattern-manager' ),
				icon: 'text',
				category: 'common',
				supports: {
					html: false,
					inserter: true,
				},
				parent: [ 'core/post-content' ], // Don't allow this block as a child of another.
				edit: PatternEdit,
				save: () => null,
		  }
		: settings;
}
