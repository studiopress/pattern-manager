import { createContext } from '@wordpress/element';
import type { NoticeContext } from '../types';

export default createContext< NoticeContext | undefined >( undefined );
