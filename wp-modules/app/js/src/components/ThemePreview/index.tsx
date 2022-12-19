// WP Dependencies
import { __ } from '@wordpress/i18n';
import { useState, useEffect } from '@wordpress/element';

// Hooks
import useStudioContext from '../../hooks/useStudioContext';

// Globals
import { fsestudio } from '../../globals';

type Props = {
	isVisible: boolean;
};

export default function ThemePreview( { isVisible }: Props ) {
	const { currentView, currentTheme } = useStudioContext();
	const [ currentUrl, setCurrentUrl ] = useState( fsestudio.siteUrl );

	useEffect( () => {
		if ( currentTheme.fetchInProgress ) {
			setCurrentUrl( '' );
		}
		if ( ! currentTheme.fetchInProgress ) {
			setCurrentUrl( fsestudio.siteUrl + '/?timestamp=' + Date.now() );
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
					title={ __( 'Theme Preview', 'fse-studio' ) }
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
