/**
 * Fse Theme Manager
 */

const { __ } = wp.i18n;

import './../../css/src/index.scss';

import ReactDOM from 'react-dom';

ReactDOM.render(
	<App />,
	document.getElementById( 'fsethememanagerapp' )
);

function App() {
	return (
		<>
			<div class="p-4">
				Hey Mike. Replace me with the good stuff.
			</div>
		</>
	)
}
