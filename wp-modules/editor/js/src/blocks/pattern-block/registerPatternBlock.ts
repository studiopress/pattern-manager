import { __ } from '@wordpress/i18n';
import PatternEdit from './PatternEdit';
import { layout } from '@wordpress/icons';

export default function registerPatternBlock(
	settings: Record< string, unknown >,
	name: string
) {
	return name === 'core/pattern'
		? {
				...settings,
				title: __( 'Pattern Block', 'pattern-manager' ),
				icon: layout,
				category: 'common',
				description: __(
					'Build a multi-pattern layout with more than one Pattern Block.',
					'pattern-manager'
				),
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
