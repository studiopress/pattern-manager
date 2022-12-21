import '../../css/src/index.scss';
import { registerPlugin } from '@wordpress/plugins';
import FseStudioMetaControls from './components/FseStudioMetaControls';

registerPlugin( 'fsestudio-postmeta-for-patterns', {
	icon: null,
	render: FseStudioMetaControls,
} );
