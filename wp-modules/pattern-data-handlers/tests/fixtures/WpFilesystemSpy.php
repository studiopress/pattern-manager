<?php
/**
 * Class WpFilesystemSpy
 *
 * @package pattern-manager
 */

namespace PatternManager\PatternDataHandlers;

class WpFilesystemSpy {

	private $copied = [];

	public function copy( string $local_path_to_image, string $desired_destination_in_theme ) {
		$this->copied = array_merge( $this->copied, [ $desired_destination_in_theme ] );
	}

	public function get_copied(): array {
		return $this->copied;
	}

	public function exists( string $file ): bool {
		return true;
	}

	public function wp_content_dir(): string {
		return __DIR__;
	}

	public function mkdir( string $path ) {}
	public function delete( string $path ) {}
}
