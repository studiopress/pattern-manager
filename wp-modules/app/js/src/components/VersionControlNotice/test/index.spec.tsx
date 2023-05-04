import { create, act } from 'react-test-renderer';
import VersionControlNotice from '..';

it( 'VersionControlNotice is not visible when passed falsy isVisible', () => {
	const testRenderer = create(
		<VersionControlNotice isVisible={ false } handleDismiss={ () => {} } />
	);

	expect( testRenderer.toJSON() ).toBeNull();

	testRenderer.unmount();
} );

it( 'VersionControlNotice is visible when passed truthy isVisible', () => {
	const testRenderer = create(
		<VersionControlNotice isVisible={ true } handleDismiss={ () => {} } />
	);

	expect( testRenderer.toJSON() ).toMatchObject( {
		props: {
			className:
				'patternmanager-version-control-notice components-notice is-warning is-dismissible',
		},
		type: 'div',
	} );

	testRenderer.unmount();
} );

it( 'VersionControlNotice is dismissible', () => {
	const handleDismissSpy = jest.fn();
	const testRenderer = create(
		<VersionControlNotice
			isVisible={ true }
			handleDismiss={ handleDismissSpy }
		/>
	);

	// Dismiss the notice.
	act( () => {
		testRenderer.root.findByProps( { type: 'button' } ).props.onClick();
	} );

	expect( handleDismissSpy ).toHaveBeenCalled();

	testRenderer.unmount();
} );
