/**
 * Fse Studio
 */

const { __ } = wp.i18n;

import './../../css/src/index.scss';

import React from 'react';
import ReactDOM from 'react-dom';

ReactDOM.render(
	<FseStudioApp />,
	document.getElementById( 'fsestudioapp' )
);

function FseStudioApp() {
	return (
		<div className="p-7 mt-3 flex-1 text-xl">
			Replace me with the new markup eh!!
		</div>
	)
}
