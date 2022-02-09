export function PatternPicker() {
	return <div className="max-w-7xl mx-auto bg-white mt-12">
		<h2 className="p-5 text-xl border-b border-gray-200 px-4 sm:px-6 md:px-8">{ __( 'Patterns', 'fse-studio' ) }</h2>
		<div className="flex">
			<div className="w-72 p-8">
				<input
					type="text"
					name="search"
					id="search"
					placeholder={ __( 'Search', 'fse-studio' ) }
					className="block w-full !bg-gray-100 !focus:bg-white !focus:ring-2 !focus:ring-wp-blue !focus:border-wp-blue sm:text-sm !rounded-none mb-10 !border-gray-300 !h-10"
				/>

				<ul>
					<li className="p-4 mb-0 bg-wp-black text-white font-medium">{ __( 'Featured', 'fse-studio' ) }</li>
					<li className="p-4 mb-0 font-medium hover:bg-gray-100">{ __( 'Footers', 'fse-studio' ) }</li>
					<li className="p-4 mb-0 font-medium hover:bg-gray-100">{ __( 'Headers', 'fse-studio' ) }</li>
					<li className="p-4 mb-0 font-medium hover:bg-gray-100">{ __( 'Query', 'fse-studio' ) }</li>
					<li className="p-4 mb-0 font-medium hover:bg-gray-100">{ __( 'Pages', 'fse-studio' ) }</li>
					<li className="p-4 mb-0 font-medium hover:bg-gray-100">{ __( 'Buttons', 'fse-studio' ) }</li>
				</ul>
			</div>
			<div className="grid grid-cols-3 w-full p-8 gap-5">
				<div className="bg-gray-200 min-h-[300px]"></div>
				<div className="bg-gray-200 min-h-[300px]"></div>
				<div className="bg-gray-200 min-h-[300px]"></div>
				<div className="bg-gray-200 min-h-[300px]"></div>
				<div className="bg-gray-200 min-h-[300px]"></div>
				<div className="bg-gray-200 min-h-[300px]"></div>
			</div>
		</div>
	</div>;
}
