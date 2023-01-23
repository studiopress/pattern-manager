import '../../css/src/index.scss';
import { registerPlugin } from '@wordpress/plugins';
import PatternManagerMetaControls from './components/PatternManagerMetaControls';

registerPlugin( 'patternmanager-postmeta-for-patterns', {
	icon: null,
	render: PatternManagerMetaControls,
} );
