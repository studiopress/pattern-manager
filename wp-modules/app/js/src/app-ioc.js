import { Container } from 'inversify';
import SnackbarPresenter from './snackbar/snackbar-presenter';

export default class AppIoc {
	container;

	constructor() {
		this.container = new Container( {
			autoBindInjectable: true,
			defaultScope: 'Transient',
		} );
	}

	buildBaseTemplate() {
		this.container
			.bind( SnackbarPresenter )
			.to( SnackbarPresenter )
			.inSingletonScope();
		return this.container;
	}
}
