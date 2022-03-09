import * as React from 'react';
import { createContext } from '@wordpress/element';

/** @type {React.Context<import('../').InitialFseStudio>} */
export const FseStudioContext = createContext( [ {}, function() {} ] );
