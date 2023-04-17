/**
 * Internal dependencies
 */
import wasThemeChanged from '../wasThemeChanged';
describe('wasThemeChanged', () => {
    it.each([
        [{}, '', false],
        [{}, 'theme-name', false],
        [{ activeTheme: 'foo-theme' }, 'foo-theme', false],
        [{ activeTheme: 'foo-theme' }, 'baz-theme', true],
    ])('should get whether the theme was changed', (data, originalTheme, expected) => {
        expect(wasThemeChanged(data, originalTheme)).toEqual(expected);
    });
});
