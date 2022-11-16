import { createContext } from '@wordpress/element';
import { NoticeContext } from '../types';

export default createContext< NoticeContext | undefined >( undefined );
