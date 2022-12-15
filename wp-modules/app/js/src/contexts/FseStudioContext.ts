import { createContext } from '@wordpress/element';
import type { InitialContext } from '../types';

export default createContext< InitialContext | undefined >( undefined );
