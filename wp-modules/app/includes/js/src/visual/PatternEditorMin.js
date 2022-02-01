import {
	BlockEditorProvider,
	BlockList,
	BlockTools,
	WritingFlow,
	ObserveTyping,
} from '@wordpress/block-editor';
import { ShortcutProvider } from '@wordpress/keyboard-shortcuts';
import { SlotFillProvider, Popover } from '@wordpress/components';
import { useState } from '@wordpress/element';

//import '@wordpress/components/build-style/style.css';
//import '@wordpress/block-editor/build-style/style.css';

export function PatternEditorApp() {
	const [ blocks, updateBlocks ] = useState( [] );

	return (
		<ShortcutProvider>
			<BlockEditorProvider
				value={ blocks }
				onInput={ ( blocks ) => updateBlocks( blocks ) }
				onChange={ ( blocks ) => updateBlocks( blocks ) }
			>
				<SlotFillProvider>
					<BlockTools>
						<WritingFlow className="editor-styles-wrapper">
							<ObserveTyping>
								<BlockList />
							</ObserveTyping>
						</WritingFlow>
					</BlockTools>
					<Popover.Slot />
				</SlotFillProvider>
			</BlockEditorProvider>
		</ShortcutProvider>
	);
}
