import { decorate, injectable } from 'inversify';
import { makeAutoObservable, observe } from 'mobx';

class SnackbarPresenter {
	value = null;

	constructor() {
		makeAutoObservable( this );

		observe( this, ( change ) => {
			if ( change.name === 'value' && change.newValue ) {
				this.removeSnackbarAfterDelay();
			}
		} );
	}

	setValue( newValue ) {
		this.value = newValue;
	}

	removeSnackbarAfterDelay() {
		if ( ! this.value ) {
			return;
		}

		setTimeout( () => {
			this.setValue( null );
		}, 7000 );
	}
}

decorate( injectable(), SnackbarPresenter );
export default SnackbarPresenter;
