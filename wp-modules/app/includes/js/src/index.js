/**
 * Fse Theme Manager
 */

const { __ } = wp.i18n;

import './../../css/src/index.scss';

import React from 'react';
import ReactDOM from 'react-dom';
import { FseThemeManagerApp } from './visual/App.js';

ReactDOM.render(
	<FseThemeManagerApp />,
	document.getElementById( 'fsethememanagerapp' )
);
