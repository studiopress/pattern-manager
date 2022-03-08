/* global refreshWpeBeacon, wpeBeacon */

import { useEffect } from '@wordpress/element';
import { queries } from '@testing-library/dom';
import { __ } from '@wordpress/i18n';
import { useBeaconStep } from '@wpebeacon/beaconstep';
import HighlightElement from './components/HighlightElement';

// Add this view to wpeBeacon.
wpeBeacon.views.fsestudio_step3 = {
	viewComponent: <FseStepThree />,
};

let stepCompleteInterval = null;

function FseStepThree() {
	
	// Here, we pass an object containing a function called "getElement" to a react hook, and it gives us back 2 variables: element, and elementClass.
	const { elementClass } = useBeaconStep( {
		getElement,
		beaconPosition: 'right',
	} );

	// This function contains logic to get the element we wish to highlight.
	function getElement() {
		const foundElements = queries.queryAllByRole( document, 'button', {
			name: __( 'Create a new theme', 'fse-studio' ),
		} );
		return foundElements.length ? foundElements[ 0 ] : null;
	}
	
	function isStepComplete() {
		const foundElements = queries.queryAllByRole( document, 'textbox', {
			name: __( 'theme name field', 'fse-studio' ),
		} );
		
		return foundElements[ 0 ]?.value === __( 'My New Theme', 'fse-studio' );
	}
	
	useEffect( () => {
		if ( isStepComplete() ) {
			wpeBeacon.currentView = 'fsestudio_step3';
			refreshWpeBeacon();
		}
	} );

	return (
		<>
			<div className="step-text">
				<h2>{ __( 'Click to create a new theme', 'fse-studio' ) }</h2>
				{ isStepComplete() ? (
					'👍'
				) : null }
			</div>
			<div className="step-buttons">
				<button
					className="button previous"
					onClick={ () => {
						wpeBeacon.currentView = 'fsestudio_step1';
						refreshWpeBeacon();
					} }
				>
					&larr; { __( 'Back', 'fse-studio' ) }
				</button>
				<button
						className="button next"
						onClick={ () => {
							wpeBeacon.currentView = 'fsestudio_step3';
							refreshWpeBeacon();
						} }
					>
						{ __( 'Next', 'fse-studio' ) } &rarr;
				</button>
			</div>
			<HighlightElement elementClass={ elementClass } />
		</>
	);
}
