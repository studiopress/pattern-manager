import { create } from 'react-test-renderer';
import PatternPreview from '..';
import type { BoundingClientRect } from '../types';

const FAKE_URL = 'http://some-fake-url.com';
const VIEWPORT_WIDTH = 1200;
const BOUNDING_CLIENT_RECT: BoundingClientRect = { width: 600, height: 600 };
const EXPECTED_SCALE = BOUNDING_CLIENT_RECT.width / VIEWPORT_WIDTH;

jest.mock( '../../../hooks/useLazyRender', () => {
	return () => ( {
		lazyHasIntersected: true,
	} );
} );

jest.mock( '@wordpress/element', () => {
	return {
		...jest.requireActual( '@wordpress/element' ),
		useRef: () => ( {
			current: {
				getBoundingClientRect: jest.fn( () => {
					return {
						width: BOUNDING_CLIENT_RECT.width,
						height: BOUNDING_CLIENT_RECT.height,
					};
				} ),
			},
		} ),
	};
} );

describe( 'PatternPreview', () => {
	afterAll( () => {
		jest.restoreAllMocks();
	} );

	it( 'renders an iframe with the expected props', () => {
		const testRenderer = create(
			<PatternPreview url={ FAKE_URL } viewportWidth={ VIEWPORT_WIDTH } />
		);

		expect( testRenderer.root.findByType( 'iframe' ).props ).toMatchObject(
			{
				src: FAKE_URL,
				style: { transform: `scale(${ EXPECTED_SCALE })` },
			}
		);

		testRenderer.unmount();
	} );
} );
