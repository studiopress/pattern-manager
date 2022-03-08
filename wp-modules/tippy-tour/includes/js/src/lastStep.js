/* global refreshWpeBeacon, wpeBeacon */

import { useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

// Add this view to wpeBeacon.
wpeBeacon.views.fse_laststep = {
	viewComponent: <FseLastStep />,
};

function FseLastStep() {
	useEffect( () => {
		wpeBeacon.referenceElement = null;
		wpeBeacon.placementOnReferenceElement = null;
		refreshWpeBeacon();
	}, [] );

	return (
		<>
			<div className="step-text">
				<h2>{ __( 'Congratulations!', 'tippy' ) }</h2>
				<p>
					{ __(
						'You have completed the full site editing tutorial! Click the close button below, or click "Done" to see more tours!.',
						'tippy'
					) }
				</p>
			</div>
			<div className="step-buttons">
				<button
					className="button"
					onClick={ () => {
						wpeBeacon.headerTitle = 'WP Engine Tours!';
						wpeBeacon.currentView = 'tours';
						refreshWpeBeacon();
					} }
				>
					{ __( 'Done', 'fseEducator' ) }
				</button>
			</div>
		</>
	);
}
