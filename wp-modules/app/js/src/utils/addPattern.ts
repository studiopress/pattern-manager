import type { Pattern, Patterns } from '../types';

export default function addPattern( newPattern: Pattern, existingPatterns: Patterns ) {
    const defaultPattern = {
        categories: [],
        keywords: [],
        blockTypes: [],
        postTypes: [],
        inserter: true,
        description: '',
        viewportWidth: '',
        content: '',
    };

    return {
        ...existingPatterns,
        [ newPattern.name ]: {
            ...defaultPattern,
            ...newPattern,
        },
    };
}