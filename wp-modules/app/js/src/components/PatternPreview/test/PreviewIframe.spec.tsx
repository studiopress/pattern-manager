/* eslint-disable import/default, camelcase */

import { create } from 'react-test-renderer';
import PreviewIframe from '../PreviewIframe';
import WP_Element from '@wordpress/element';

const FAKE_URL = 'http://some-fake-url.com';
const VIEWPORT_WIDTH = 1200;
const SCALE = 0.5;
const STATE_MOCK_$iframeRef = {
	contentWindow: {
		document: {
			documentElement: {
				scrollHeight: 1200,
			},
		},
	},
};
const STATE_MOCK_$iframeBodyHeight = 600;
const STATE_MOCK_$iframeLoaded = true;

jest.mock( '@wordpress/element', () => {
	return {
		...jest.requireActual( '@wordpress/element' ),
		useState: jest.fn(),
	};
} );

describe( 'PreviewIframe', () => {
	beforeEach( () => {
		jest.spyOn( WP_Element, 'useState' )
			.mockImplementationOnce( () => [
				STATE_MOCK_$iframeRef,
				() => null,
			] )
			.mockImplementationOnce( () => [
				STATE_MOCK_$iframeBodyHeight,
				() => null,
			] )
			.mockImplementationOnce( () => [
				STATE_MOCK_$iframeLoaded,
				() => null,
			] );
	} );

	afterEach( () => {
		jest.clearAllMocks();
	} );

	it( 'renders an container div with the expected height and opacity style props', () => {
		const testRenderer = create(
			<PreviewIframe
				url={ FAKE_URL }
				scale={ SCALE }
				viewportWidth={ VIEWPORT_WIDTH }
			/>
		);

		expect(
			testRenderer.root.findByProps( {
				className: 'pattern-preview-iframe-inner',
			} ).props
		).toMatchObject( {
			style: {
				height: STATE_MOCK_$iframeBodyHeight * SCALE,
				opacity: 1, // Opacity of `1` would otherwise be assigned by onLoad().
			},
		} );

		testRenderer.unmount();
	} );

	it( 'renders an iframe with the expected props', () => {
		const testRenderer = create(
			<PreviewIframe
				url={ FAKE_URL }
				scale={ SCALE }
				viewportWidth={ VIEWPORT_WIDTH }
			/>
		);

		expect( testRenderer.root.findByType( 'iframe' ).props ).toMatchObject(
			{
				src: FAKE_URL,
				style: {
					width: VIEWPORT_WIDTH,
					height: 600,
				},
			}
		);

		testRenderer.unmount();
	} );

	it( 'hides the `pattern-loader` div when loaded', () => {
		const testRenderer = create(
			<PreviewIframe
				url={ FAKE_URL }
				scale={ SCALE }
				viewportWidth={ VIEWPORT_WIDTH }
			/>
		);

		expect(
			testRenderer.root.findByProps( {
				className: 'pattern-loader',
			} ).props
		).toMatchObject( {
			hidden: true,
		} );

		testRenderer.unmount();
	} );
} );
