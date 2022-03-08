/* global refreshWpeBeacon, wpeBeacon */

import { useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

// Add this view to wpeBeacon.
wpeBeacon.views.fsestudio_step1 = {
	viewComponent: <FseStudioStepOne />,
};

function FseStudioStepOne() {
	// Make sure this step is positioned in the initial spot.
	useEffect( () => {
		wpeBeacon.referenceElement = null;
		wpeBeacon.placementOnReferenceElement = null;
		refreshWpeBeacon();
	}, [] );

	return (
		<>
			<div className="step-text">
				<h2>{ __( 'Welcome to FSE Studio.', 'fse-studio' ) }</h2>
				<p>
					{ __(
						'Follow these steps to build your very own Full Site Editing theme without writing a single line of code.',
						'fse-studio'
					) }
				</p>
			</div>
			<div className="step-buttons">
				<button
					className="button next"
					onClick={ () => {
						wpeBeacon.currentView = 'fsestudio_step2';
						refreshWpeBeacon();
					} }
				>
					{ __( 'Next', 'fse-studio' ) } &rarr;
				</button>
			</div>
		</>
	);
}

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
