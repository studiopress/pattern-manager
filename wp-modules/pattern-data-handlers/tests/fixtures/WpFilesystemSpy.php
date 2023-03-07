<?php
/**
 * Class PatternDataHandlersTest
 *
 * @package pattern-manager
 */

// phpcs:disable WordPress.WP.AlternativeFunctions.file_get_contents_file_get_contents

namespace PatternManager\PatternDataHandlers;

class WpFilesystemSpy {

	private $copied = [];

	public function copy( string $local_path_to_image, string $desired_destination_in_theme ) {
		$this->copied = array_merge( $this->copied, [ $desired_destination_in_theme ] );
	}

	public function get_copied() {
		return $this->copied;
	}

	public function exists( string $file ): boolean {
		return true;
	}

	public function wp_content_dir(): string {
		return __DIR__;
	}

	public function mkdir( string $path ) {}

	public function delete( string $path ) {}
}
