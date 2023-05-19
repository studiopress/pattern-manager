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
	 * Tests delete_pattern_posts.
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
		$post->post_type      = 'page';
		$post->filter         = 'raw';

		// Convert to WP_Post object.
		$wp_post = new \WP_Post( $post );
		
		// Pass that mocked post into the function we want to test.
		save_pattern_to_file( $wp_post );
		
		// Get the contents of the file that was saved.
		$pattern = get_pattern_by_name( $post->post_name );
		
		print_r( $pattern );
	}
}