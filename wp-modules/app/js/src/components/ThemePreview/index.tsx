// WP Dependencies
import { __ } from '@wordpress/i18n';
import { useState, useEffect } from '@wordpress/element';

// Hooks
import usePmContext from '../../hooks/usePmContext';

// Globals
import { patternmanager } from '../../globals';

type Props = {
	isVisible: boolean;
};

export default function ThemePreview( { isVisible }: Props ) {
	const { currentView, currentTheme } = usePmContext();
	const [ currentUrl, setCurrentUrl ] = useState( patternmanager.siteUrl );

	useEffect( () => {
		if ( currentTheme.fetchInProgress ) {
			setCurrentUrl( '' );
		}
		if ( ! currentTheme.fetchInProgress ) {
			setCurrentUrl(
				patternmanager.siteUrl + '/?timestamp=' + Date.now()
			);
		}
	}, [ currentTheme.fetchInProgress ] );

	return (
		<div
			style={ {
				display: ! isVisible ? 'none' : 'block',
				position: 'absolute',
				top: '0',
				bottom: '0',
				right: '0',
				left: '0',
				width: '100vw',
				height: '100vh',
				zIndex: '9999',
				backgroundColor: '#ffffff',
			} }
		>
			<button
				onClick={ () => {
					currentView.set( 'theme_setup' );
				} }
				style={ {
					display: ! isVisible ? 'none' : 'block',
					position: 'absolute',
					top: '0',
					right: '0',
					width: '100vw',
					height: '50px',
					backgroundColor: '#007BBA',
					color: '#fff',
					zIndex: '9999',
					fontWeight: 'bold',
				} }
			>
				Close Preview&nbsp;&nbsp;✖︎
			</button>
			{ currentUrl ? (
				<iframe
					title={ __( 'Theme Preview', 'pattern-manager' ) }
					style={ {
						marginTop: '18px',
						width: '100vw',
						height: '100vh',
					} }
					src={ currentUrl }
				/>
			) : null }
		</div>
	);
}
