import { useState } from 'react';
import { create, act } from 'react-test-renderer';
import VersionControlNotice from '..';

/** VersionControlNotice container allows dismissing notice via state. */
const VersionControlNoticeWrapper = ( { initialIsVisible = false } ) => {
	const [ isVisible, setIsVisible ] = useState( initialIsVisible );

	return (
		<VersionControlNotice
			isVisible={ isVisible }
			handleDismiss={ () => setIsVisible( false ) }
		/>
	);
};

it( 'VersionControlNotice is not visible when passed falsy isVisible', () => {
	const testRenderer = create( <VersionControlNoticeWrapper /> );

	expect( testRenderer.toJSON() ).toBeNull();

	testRenderer.unmount();
} );

it( 'VersionControlNotice is visible when passed truthy isVisible', () => {
	const testRenderer = create(
		<VersionControlNoticeWrapper initialIsVisible />
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
	const testRenderer = create(
		<VersionControlNoticeWrapper initialIsVisible />
	);

	expect( testRenderer.toJSON() ).toMatchObject( {
		props: {
			className:
				'patternmanager-version-control-notice components-notice is-warning is-dismissible',
		},
		type: 'div',
	} );

	// Dismiss the notice.
	act( () => {
		testRenderer.root.findByProps( { type: 'button' } ).props.onClick();
	} );

	expect( testRenderer.toJSON() ).toBeNull();

	testRenderer.unmount();
} );
