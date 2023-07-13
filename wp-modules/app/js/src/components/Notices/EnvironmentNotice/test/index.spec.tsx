import { create, act } from 'react-test-renderer';
import EnvironmentNotice from '..';

it( 'EnvironmentNotice is not visible when passed falsy isVisible', () => {
	const testRenderer = create(
		<EnvironmentNotice isVisible={ false } handleDismiss={ () => {} } />
	);

	expect( testRenderer.toJSON() ).toBeNull();

	testRenderer.unmount();
} );

it( 'EnvironmentNotice is visible when passed truthy isVisible', () => {
	const testRenderer = create(
		<EnvironmentNotice isVisible={ true } handleDismiss={ () => {} } />
	);

	expect( testRenderer.toJSON() ).toMatchObject( {
		props: {
			className:
				'patternmanager-notice components-notice is-error is-dismissible',
		},
		type: 'div',
	} );

	testRenderer.unmount();
} );

it( 'EnvironmentNotice is dismissible', () => {
	const handleDismissSpy = jest.fn();
	const testRenderer = create(
		<EnvironmentNotice
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
