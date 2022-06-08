// WP Dependencies

// @ts-check
import { __ } from '@wordpress/i18n';
import { useState, useEffect } from '@wordpress/element';

// Hooks
import useStudioContext from '../../hooks/useStudioContext';

// Globals
import { fsestudio } from '../../globals';

/** @param {{visible: boolean}} props */
export default function ThemePreview( { isVisible } ) {
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

	if ( ! currentTheme?.existsOnDisk ) {
		return '';
	}

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
					backgroundColor: '#e5e5f7',
					backgroundImage:
						'linear-gradient(#f7bf45 2px, transparent 2px), linear-gradient(90deg, #f7bf45 2px, transparent 2px), linear-gradient(#f7bf45 1px, transparent 1px), linear-gradient(90deg, #f7bf45 1px, #e5e5f7 1px)',
					backgroundSize:
						'50px 50px, 50px 50px, 10px 10px, 10px 10px',
					backgroundPosition:
						'-2px -2px, -2px -2px, -1px -1px, -1px -1px',
					zIndex: '9999',
				} }
			>
				Theme Preview ❌
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
