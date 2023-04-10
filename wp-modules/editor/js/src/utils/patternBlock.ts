import { __ } from '@wordpress/i18n';
import { PatternEdit } from '../components/PatternEdit';

export default function patternBlock( settings, name ) {
	return name === 'core/pattern'
		? {
				...settings,
				title: __( 'PM Pattern Block', 'pattern-manager' ),
				icon: '',
				category: 'common',
				apiVersion: 1,
				attributes: {
					slug: {
						type: 'string',
						default: '',
					},
				},
				supports: {
					...settings.supports,
					inserter: true,
				},
				edit: PatternEdit,
				save: () => null,
		  }
		: settings;
}
