/* global refreshWpeBeacon, wpeBeacon */

import { __ } from '@wordpress/i18n';
import { SteppedTour } from '@wpebeacon/stepped-tour';

const stepsInTour = [
	{
		initialData: {
			html: <h2>{ __( 'Welcome to the Fse Studio Tour. Let\'s make a theme.', 'fse-studio' ) }</h2>,
		},
		navigation: {
			backButton: false,
			nextButton: true,
		}
	},
	{
		highlightedElement: {
			role: 'button',
			name:  __( 'Create a new theme', 'fse-studio' )
		},
		beaconPosition: 'auto',
		initialData: {
			html: <h2>{ __( 'Click to create a new theme', 'fse-studio' ) }</h2>,
		},
		completionData: {
			html: <h2>{ __( 'Great Job', 'fse-studio' ) }</h2>,
			type: 'elementHasValue',
			element: {
				role: 'textbox',
				name: __( 'Theme Name', 'fse-studio' ),
				value: __( 'My New Theme', 'fse-studio' ),
			}
		},
		navigation: {
			backButton: false,
			nextButton: false,
			onComplete: 'goToNextStep',
		}
	},
	{
		highlightedElement: {
			role: 'textbox',
				name: __( 'Theme Name', 'fse-studio' ),
		},
		beaconPosition: 'top',
		initialData: {
			html: <h2>{ __( 'Nice work! Now, give your theme a unique name', 'fse-studio' ) }</h2>,
		},
		completionData: {
			html: <><h2>{ __( 'Nice work! Now, give your theme a unique name', 'fse-studio' ) }</h2><p>{ __( 'Looks good! Feel free to keep working on your unique name. When ready, click "next".', 'fse-studio' ) }</p></>,
			type: 'elementDoesNotHaveValues',
			element: {
				role: 'textbox',
				name: __( 'Theme Name', 'fse-studio' ),
				values: [
					'',
					__( 'My New Theme', 'fse-studio' ),	
				]
			}
		},
		navigation: {
			backButton: false,
			nextButton: true,
		}
	},
	{
		highlightedElement: {
			role: 'textbox',
				name: __( 'Directory Name', 'fse-studio' ),
		},
		beaconPosition: 'top',
		initialData: {
			html: <h2>{ __( 'Give your theme a unique slug', 'fse-studio' ) }</h2>,
		},
		completionData: {
			html: <h2>{ __( 'Great Job', 'fse-studio' ) }</h2>,
			type: 'elementDoesNotHaveValues',
			element: {
				role: 'textbox',
				name: __( 'Directory Name', 'fse-studio' ),
				values: [
					'',
					'my-new-theme',
				]
			}
		},
		navigation: {
			backButton: true,
			nextButton: true,
		}
	},
];

// Add this view to wpeBeacon.
wpeBeacon.views.fsestudio_step1 = {
	viewComponent: <SteppedTour stepsInTour={stepsInTour} />,
};

// Kick start the FSE Onboarding flow.
function startFseStudioFlow() {
	// Set it up for site-editor screens.
	if ( window.location.href.includes( 'wpeFseStudioTour' ) ) {
		wpeBeacon.headerTitle = 'FSE Studio Tour';
		wpeBeacon.currentView = 'fsestudio_step1';
		wpeBeacon.isOpen = true;
		refreshWpeBeacon();
	}
}
startFseStudioFlow();
