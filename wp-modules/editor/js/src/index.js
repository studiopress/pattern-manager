import '../../css/src/index.scss';
import { dispatch } from '@wordpress/data';
import { addAction, addFilter } from '@wordpress/hooks';
import { registerPlugin } from '@wordpress/plugins';
import BackButton from './components/BackButton';
import PatternManagerMetaControls from './components/PatternManagerMetaControls';
import changeWords from './utils/changeWords';
import patternBlock from './utils/patternBlock';
import receiveActiveTheme from './utils/receiveActiveTheme';

registerPlugin( 'pattern-manager-postmeta-for-patterns', {
	icon: null,
	render: PatternManagerMetaControls,
} );

registerPlugin( 'pattern-manager-back-button', {
	icon: null,
	render: BackButton,
} );

addFilter( 'i18n.gettext', 'pattern-manager/changeWords', changeWords );
addFilter(
	'blocks.registerBlockType',
	'pattern-manager/patternBlock',
	patternBlock
);
addAction(
	'heartbeat.tick',
	'pattern-manager/checkActiveTheme',
	receiveActiveTheme
);

dispatch( 'core/editor' ).disablePublishSidebar();
