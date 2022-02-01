/**
 * Fse Studio
 */

const { __ } = wp.i18n;

import './../../css/src/index.scss';

import React from 'react';
import ReactDOM from 'react-dom';
import { FseStudioApp } from './visual/App.js';

ReactDOM.render(
	<FseStudioApp />,
	document.getElementById( 'fsestudioapp' )
);
