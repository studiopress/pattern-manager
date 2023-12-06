<?php
/**
 * Class ModelTest
 *
 * @package pattern-manager
 */

namespace PatternManager\Editor;

use WP_UnitTestCase;
use function \PatternManager\Editor\save_pattern_to_file;
use function \PatternManager\GetWpFilesystem\get_wp_filesystem_api;
use function \PatternManager\PatternDataHandlers\get_pattern_by_name;
use function \PatternManager\PatternDataHandlers\get_patterns_directory;

require_once dirname( __DIR__ ) . '/model.php';

/**
 * Test the model.
 */
class ModelTest extends WP_UnitTestCase {

	/**
	 * @inheritDoc
	 */
	public function setUp(): void {
		parent::setUp();
		$this->stylesheet_dir = get_wp_filesystem_api()->wp_themes_dir() . '/pm-testing';
		get_wp_filesystem_api()->mkdir( $this->stylesheet_dir );
		add_filter( 'stylesheet_directory', [ $this, 'get_stylesheet_dir' ] );
	}

	/**
	 * @inheritDoc
	 */
	public function tearDown(): void {
		remove_filter( 'stylesheet_directory', [ $this, 'get_stylesheet_dir' ] );
		get_wp_filesystem_api()->rmdir(
			$this->stylesheet_dir,
			true
		);
		parent::tearDown();
	}

	/**
	 * Gets the stub stylesheet directory.
	 */
	public function get_stylesheet_dir() {
		return $this->stylesheet_dir;
	}

	/**
	 * Tests add_active_theme_to_heartbeat.
	 */
	public function test_add_active_theme_to_heartbeat_wrong_post() {
		$this->assertSame(
			[ 'refresh-nonces' => true ],
			add_active_theme_to_heartbeat(
				[ 'refresh-nonces' => true ],
				[],
				'post'
			)
		);
	}

	/**
	 * Tests add_active_theme_to_heartbeat.
	 */
	public function test_add_active_theme_to_heartbeat_correct_post() {
		$this->assertTrue(
			array_key_exists(
				'activeTheme',
				add_active_theme_to_heartbeat(
					[ 'refresh-nonces' => true ],
					[],
					'pm_pattern'
				)
			)
		);
	}

	/**
	 * Tests delete_pattern_posts.
	 */
	public function test_delete_pattern_posts_wrong_post() {
		for ( $i = 0; $i < 5; $i++ ) {
			$this->factory()->post->create();
		}

		$this->assertCount( 5, get_posts() );

		delete_pattern_posts();

		$this->assertCount( 5, get_posts() );
	}

	/**
	 * Tests delete_pattern_posts.
	 */
	public function test_delete_pattern_posts_correct_post() {
		for ( $i = 0; $i < 5; $i++ ) {
			$this->factory()->post->create( [ 'post_type' => 'pm_pattern' ] );
		}

		$this->assertCount(
			5,
			get_posts( [ 'post_type' => 'pm_pattern ' ] )
		);

		delete_pattern_posts();

		$this->assertCount(
			0,
			get_posts( [ 'post_type' => 'pm_pattern ' ] )
		);
	}

	/**
	 * Tests a pattern with a slug that does not match the filename remains the same if something other than the title was not changed.
	 */
	public function test_slug_and_filename_stay_the_same_after_content_update() {

		// Mock a post object so we can test it.
		$wp_post = $this->factory()->post->create_and_get(
			[
				'post_title'   => 'This title remains the same after content changes.',
				'post_content' => 'test pattern content',
				'post_name'    => 'remains-the-same-after-content-changes',
				'post_type'    => get_pattern_post_type(),
			]
		);

		// Save the pattern to the disk.
		save_pattern_to_file( $wp_post );

		// Rename the pattern's filename to something different than the slug.
		// This is to mock how it might be for for a non-pm-made pattern, with mismatching filenames and slugs.
		$wp_filesystem           = get_wp_filesystem_api();
		$patterns_dir            = get_patterns_directory();
		$original_name           = $wp_post->post_name . '.php';
		$mocked_mismatching_name = 'mismatched-name.php';
		$wp_filesystem->move( $patterns_dir . $original_name, $patterns_dir . $mocked_mismatching_name );
		$wp_filesystem->delete( $patterns_dir . $original_name );

		// Get the contents of the file.
		$pattern = get_pattern_by_name( 'mismatched-name' );

		// Mock a post object so we can test modifying only the content.
		$wp_post = $this->factory()->post->create_and_get(
			[
				'post_title'   => $pattern['title'],
				'post_content' => 'This is modified pattern content, but nothing else is changed!',
				'post_name'    => $pattern['name'],
				'post_type'    => get_pattern_post_type(),
			]
		);

		// Save the pattern to the disk.
		save_pattern_to_file( $wp_post );

		// Get the contents of the file.
		$content_modified_pattern = get_pattern_by_name( 'mismatched-name' );

		// Make sure the slug does not get changed when only the content is modified.
		$this->assertStringEndsWith( 'remains-the-same-after-content-changes', $content_modified_pattern['slug'] );

		// Make sure the title does not get changed when only the content is modified.
		$this->assertSame( 'This title remains the same after content changes.', $content_modified_pattern['title'] );

		// Make sure the filename does not get changed when only the content is modified.
		$this->assertSame( 'mismatched-name', $content_modified_pattern['name'] );
	}
}
