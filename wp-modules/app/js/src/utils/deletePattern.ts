import type { Pattern, Patterns } from '../types';

export default function deletePattern( nameToDelete: Pattern[ 'name' ], patterns: Patterns ) {
    const {
        [ nameToDelete ]: {},
        ...newPatterns
    } = patterns;

    return newPatterns;
}
