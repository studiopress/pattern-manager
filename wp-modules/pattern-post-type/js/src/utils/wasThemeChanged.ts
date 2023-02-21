export default function wasThemeChanged(
	data: Record< string, unknown >,
	originalTheme: string
) {
	return !! data.activeTheme && data.activeTheme !== originalTheme;
}
