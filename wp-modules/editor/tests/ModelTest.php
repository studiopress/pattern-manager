<?php
/**
 * Class ModelTest
 *
 * @package pattern-manager
 */

namespace PatternManager\Editor;

use WP_UnitTestCase;

require_once dirname( __DIR__ ) . '/model.php';

/**
 * Test the model.
 */
class ModelTest extends WP_UnitTestCase {

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
	 * Tests that a pattern newly created with Pattern Manager results in a slug that matches the title.
	 */
	public function test_new_pattern_title_matches_slug() {
		
		// Mock a post object so we can test it.
		$post_id              = -998; // negative ID, to avoid clash with a valid post.
		$post                 = new \stdClass();
		$post->ID             = $post_id;
		$post->post_author    = 1;
		$post->post_title     = 'New Pattern, originally created with Pattern Manager.';
		$post->post_content   = 'test pattern content';
		$post->post_status    = 'publish';
		$post->post_name      = 'new-pattern-originally-created-with-pattern-manager';
		$post->post_type      = get_pattern_post_type();
		$post->filter         = 'raw';

		// Convert to WP_Post object.
		$wp_post = new \WP_Post( $post );
		
		// Save the mocked pattern to the disk.
		\PatternManager\Editor\save_pattern_to_file( $wp_post );
		
		// Get the contents of the file that was saved.
		$pattern = \PatternManager\PatternDataHandlers\get_pattern_by_name( $post->post_name );
		
		// Make sure the slug of the post and the slug in the file match.
		$this->assertSame($post->post_name, $pattern['slug']);
		
		// Make sure the slug of the post and the filename match.
		$this->assertSame($post->post_name, $pattern['name']);

	}
	
	/**
	 * Tests a pattern with a slug that does not match the filename remains the same if something other than the title was not changed.
	 */
	public function test_slug_and_filename_stay_the_same_after_content_update() {
		
		// Mock a post object so we can test it.
		$post_id              = -997; // negative ID, to avoid clash with a valid post.
		$post                 = new \stdClass();
		$post->ID             = $post_id;
		$post->post_author    = 1;
		$post->post_title     = 'This title remains the same after content changes.';
		$post->post_content   = 'test pattern content';
		$post->post_status    = 'publish';
		$post->post_name      = 'this-slug-remains-the-same-after-content-changes';
		$post->post_type      = get_pattern_post_type();
		$post->filter         = 'raw';

		// Convert to WP_Post object.
		$wp_post = new \WP_Post( $post );
		
		// Save the pattern to the disk.
		\PatternManager\Editor\save_pattern_to_file( $wp_post );
		
		// Rename the pattern's filename to something different than the slug.
		// This is to mock how it might be for for a non-pm-made pattern, with mismatching filenames and slugs.
		$wp_filesystem = \PatternManager\GetWpFilesystem\get_wp_filesystem_api();
		$patterns_dir  = \PatternManager\PatternDataHandlers\get_patterns_directory();
		$original_name = $post->post_name . '.php';
		$mocked_mismatching_name = 'mismatched-name.php';
		$wp_filesystem->move( $patterns_dir . $original_name, $patterns_dir . $mocked_mismatching_name );
		$wp_filesystem->delete( $patterns_dir . $original_name );
		
		// Get the contents of the file;
		$pattern = \PatternManager\PatternDataHandlers\get_pattern_by_name( 'mismatched-name' );
		
		// Mock a post object so we can test modifying only the content.
		$post_id              = -997; // negative ID, to avoid clash with a valid post.
		$post                 = new \stdClass();
		$post->ID             = $post_id;
		$post->post_author    = 1;
		$post->post_title     = $pattern['title'];
		$post->post_content   = 'This is modified pattern content, but nothing else is changed!';
		$post->post_status    = 'publish';
		$post->post_name      = $pattern['slug'];
		$post->post_type      = get_pattern_post_type();
		$post->filter         = 'raw';
		
		// Convert to WP_Post object.
		$wp_post = new \WP_Post( $post );

		// Save the pattern to the disk.
		\PatternManager\Editor\save_pattern_to_file( $wp_post );
		
		// Get the contents of the file;
		$content_modified_pattern = \PatternManager\PatternDataHandlers\get_pattern_by_name( 'mismatched-name' );

		// Make sure the slug does not get changed when only the content is modified.
		$this->assertSame('this-slug-remains-the-same-after-content-changes', $content_modified_pattern['slug']);
		
		// Make sure the title does not get changed when only the content is modified.
		$this->assertSame('This title remains the same after content changes.', $content_modified_pattern['title']);
		
		// Make sure the filename does not get changed when only the content is modified.
		$this->assertSame('mismatched-name', $content_modified_pattern['name']);

	}
}