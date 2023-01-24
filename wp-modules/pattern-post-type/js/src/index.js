import '../../css/src/index.scss';
import { registerPlugin } from '@wordpress/plugins';
import BackButton from './components/BackButton';
import PatternManagerMetaControls from './components/PatternManagerMetaControls';

registerPlugin( 'pattern-manager-postmeta-for-patterns', {
	icon: null,
	render: PatternManagerMetaControls,
} );

registerPlugin( 'pattern-manager-back-button', {
	icon: null,
	render: BackButton,
} );
