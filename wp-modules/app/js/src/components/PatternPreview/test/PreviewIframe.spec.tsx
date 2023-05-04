import { create } from 'react-test-renderer';
import PreviewIframe from '../PreviewIframe';

const FAKE_URL = 'http://some-fake-url.com';

describe( 'PreviewIframe', () => {
	it( 'renders an iframe with the expected props', () => {
		const testRenderer = create(
			<PreviewIframe
				url={ FAKE_URL }
				scale={ 0.5 }
				viewportWidth={ 1200 }
			/>
		);

		expect( testRenderer.root.findByType( 'iframe' ).props.src ).toEqual(
			FAKE_URL
		);

		testRenderer.unmount();
	} );
} );
