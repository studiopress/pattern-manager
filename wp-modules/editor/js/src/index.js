import '../../css/src/index.scss';
import { dispatch } from '@wordpress/data';
import { store as editorStore } from '@wordpress/editor';
import { addAction, addFilter } from '@wordpress/hooks';
import { registerPlugin } from '@wordpress/plugins';
import BackButton from './components/BackButton';
import PatternManagerMetaControls from './components/PatternManagerMetaControls';
import changeWords from './utils/changeWords';
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
addAction(
	'heartbeat.tick',
	'pattern-manager/checkActiveTheme',
	receiveActiveTheme
);

// @ts-expect-error the @wordpress/editor store isn't typed.
dispatch( editorStore ).disablePublishSidebar();
