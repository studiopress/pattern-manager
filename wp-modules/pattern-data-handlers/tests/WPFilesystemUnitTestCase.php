<?php

/**
 * This class is designed to make use of MockFS, a Virtual in-memory filesystem compatible with WP_Filesystem.
 * Forked from Core: https://github.com/WordPress/wordpress-develop/blob/cc8dd3e1f66384d25646eef4435e507c6c9e5a60/tests/phpunit/tests/filesystem/base.php
 */
abstract class WP_Filesystem_UnitTestCase extends WP_UnitTestCase {
	public function set_up() {
		parent::set_up();
		add_filter( 'filesystem_method_file', array( $this, 'filter_abstraction_file' ) );
		add_filter( 'filesystem_method', array( $this, 'filter_fs_method' ) );
		WP_Filesystem();
	}

	public function tear_down() {
		global $wp_filesystem;
		remove_filter( 'filesystem_method_file', array( $this, 'filter_abstraction_file' ) );
		remove_filter( 'filesystem_method', array( $this, 'filter_fs_method' ) );
		unset( $wp_filesystem );

		parent::tear_down();
	}

	public function filter_fs_method( $method ) {
		return 'MockFS';
	}
	public function filter_abstraction_file( $file ) {
		return __DIR__ . '/MockFs.php';
	}
}
