// @ts-check
import { __ } from '@wordpress/i18n';
import image from '../../../../img/video-placeholder.jpg';

export default function GettingStarted() {
	return (
		<>
			<div className="bg-fses-gray mx-auto p-12 w-full">
				<div className="max-w-7xl mx-auto">
					<h1 className="text-4xl mb-3">{ __( 'Welcome to FSE Studio', 'fse-studio' ) }</h1>
					<p className="text-lg max-w-2xl">Build your full site editing themes faster and easier with FSE Studio! Check out the video below to learn how to get started.</p>
				</div>
			</div>

			<div className="mx-auto p-14 pb-20">
				<div className="mx-auto max-w-7xl flex flex-col justify-between gap-20">
					<div className="w-full">
						<img className="rounded-md" src={ image } />
					</div>
					
					<div className="grid grid-cols-2 gap-10">
						<div>
							<h2 className="text-4xl mb-3">Create your first theme</h2>
							<p className="text-lg mb-3">Donec ac leo condimentum, feugiat lacus in, euismod magna. Curabitur in gravida justo. Vestibulum cursus, elit in rutrum hendrerit, dui nunc.</p>
							<p className="text-lg mb-3">Donec ac leo condimentum, feugiat lacus in, euismod magna. Curabitur in gravida justo. Vestibulum cursus, elit in rutrum hendrerit.</p>
						</div>
						<div className="bg-fses-gray p-20 items-center justify-center flex flex-col rounded">
							<button className="inline-flex items-center px-4 py-2 border-4 border-transparent text-lg font-medium rounded-sm shadow-sm text-white bg-wp-blue hover:bg-wp-blue-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-wp-blue">Start Creating Your Theme &rarr;</button>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
