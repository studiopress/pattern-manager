<?php
/**
 * Plugin Name: FSE Studio
 * Plugin URI: wpengine.com
 * Description: An app for creating an maintaining FSE Themes.
 * Version: 1.0.0
 * Author: WP Engine
 * Author URI: wpengine.com
 * Text Domain: fse-studio
 * Domain Path: languages
 * License: GPLv2
 * License URI: http://www.gnu.org/licenses/gpl-2.0.txt
 * Requires at least: 5.0
 * Requires PHP: 7.4
 * Network:
 * Update URI:
 * Namespace: FseStudio
 *
 * @package fse-studio
 */

namespace FseStudio;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Notice to show when running outside a local or development environment.
 *
 * @return void
 */
function wrong_environment_warning() {
	?>
	<div class="notice notice-warning is-dismissible" style="margin-top: 1rem; padding-top: 1rem;padding-bottom: 1rem;">
		<?php echo esc_html_e( 'FSE Studio will not load. It should run on sites that are in development or local environment only.', 'fse-studio' ); ?>
	</div>
	<?php
}

if ( ! preg_match( '/\.local\/?$/', get_site_url() ) && ! preg_match( '/(local|development)/', wp_get_environment_type() ) ) {
	add_action( 'admin_notices', __NAMESPACE__ . '\wrong_environment_warning' );
	return;
}

/**
 * Automatically include wp modules, which are in the "wp-modules" directory.
 *
 * @return void
 */
function include_custom_modules() {
	$wp_modules = glob( plugin_dir_path( __FILE__ ) . 'wp-modules*/*' );

	foreach ( $wp_modules as $wp_module ) {
		$module_name = basename( $wp_module );
		$filename    = $module_name . '.php';
		$filepath    = $wp_module . '/' . $filename;

		if ( is_readable( $filepath ) ) {
			// If the module data exists, load it.
			require $filepath;
		} else {
			// Translators: The name of the module, and the filename that needs to exist inside that module.
			echo esc_html( sprintf( __( 'The module called "%1$s" has a problem. It needs a file called "%2$s" to exist in its root directory.', 'fse-studio' ), $module_name, $filename ) );
			exit;
		}
	}
}
add_action( 'plugins_loaded', __NAMESPACE__ . '\include_custom_modules' );
