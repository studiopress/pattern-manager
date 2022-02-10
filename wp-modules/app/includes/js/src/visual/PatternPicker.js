import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

export function PatternPicker({ patterns }) {
	const [checkedPatterns, setCheckedPatterns] = useState({});

	return (
		<div className="mx-auto mt-12 max-w-7xl bg-white">
			<h2 className="border-b border-gray-200 p-5 px-4 text-xl sm:px-6 md:px-8">
				{__('Patterns', 'fse-studio')}
			</h2>
			<div className="flex">
				<div className="w-72 p-8">
					<input
						type="text"
						name="search"
						id="search"
						placeholder={__('Search', 'fse-studio')}
						className="!focus:bg-white !focus:ring-2 !focus:ring-wp-blue !focus:border-wp-blue mb-10 block !h-10 w-full !rounded-none !border-gray-300 !bg-gray-100 sm:text-sm"
					/>

					<ul>
						<li className="mb-0 bg-wp-black p-4 font-medium text-white">
							{__('Featured', 'fse-studio')}
						</li>
						<li className="mb-0 p-4 font-medium hover:bg-gray-100">
							{__('Footers', 'fse-studio')}
						</li>
						<li className="mb-0 p-4 font-medium hover:bg-gray-100">
							{__('Headers', 'fse-studio')}
						</li>
						<li className="mb-0 p-4 font-medium hover:bg-gray-100">
							{__('Query', 'fse-studio')}
						</li>
						<li className="mb-0 p-4 font-medium hover:bg-gray-100">
							{__('Pages', 'fse-studio')}
						</li>
						<li className="mb-0 p-4 font-medium hover:bg-gray-100">
							{__('Buttons', 'fse-studio')}
						</li>
					</ul>
				</div>
				<ul tabIndex="-1" className="grid w-full grid-cols-3 gap-5 p-8">
					{Object.values(patterns).map((pattern, index) => {
						const isChecked = !!checkedPatterns[pattern?.name];

						return (
							<li
								key={index}
								tabIndex="0"
								role="checkbox"
								aria-checked={isChecked}
								className={
									isChecked
										? 'min-h-[300px] border-2 border-solid border-sky-500 bg-gray-200'
										: 'min-h-[300px] bg-gray-200'
								}
								onClick={() =>
									setCheckedPatterns({
										...checkedPatterns,
										[pattern.name]: !isChecked,
									})
								}
							>
								<h3>{pattern.title}</h3>
							</li>
						);
					})}
				</ul>
			</div>
		</div>
	);
}
