import { __ } from '@wordpress/i18n';
import { PatternEdit } from '../components/PatternEdit';

export default function patternBlock(
	settings: Record< string, unknown >,
	name: string
) {
	return name === 'core/pattern'
		? {
				...settings,
				apiVersion: 1,
				title: __( 'PM Pattern Block', 'pattern-manager' ),
				icon: '',
				category: 'common',
				attributes: {
					slug: {
						type: 'string',
					},
				},
				supports: {
					inserter: true,
				},
				edit: PatternEdit,
				save: () => null,
		  }
		: settings;
}
