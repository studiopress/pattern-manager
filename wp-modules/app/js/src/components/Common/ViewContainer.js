import React from 'react';

/**
 * @param {{
 *  children: React.ReactChildren,
 *  description: string,
 *  heading: string
 * }} props
 */
export default function ViewContainer( { children, description, heading } ) {
	return (
		<div className="flex-1">
			<div className="bg-fses-gray mx-auto p-8 lg:p-12 w-full">
				<div className="max-w-7xl mx-auto">
					<h1 className="text-4xl mb-3">{ heading }</h1>
					<p className="text-lg max-w-2xl">{ description }</p>
				</div>
			</div>
			{ children }
		</div>
	);
}
