<?php
/**
 * Class ModelTest
 *
 * @package pattern-manager
 */

namespace PatternManager\Editor;

use WP_UnitTestCase;
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
		remove_all_filters( 'stylesheet_directory' );
		get_wp_filesystem_api()->rmdir(
			$this->stylesheet_dir,
			true
		);
		get_wp_filesystem_api()->delete(
			$this->get_fixtures_directory() . '/patterns/b.php'
		);

		parent::tearDown();
	}

	/**
	 * Gets the fixtures directory.
	 */
	public function get_fixtures_directory() {
		return dirname( __DIR__ ) . '/tests/fixtures';
	}

	/**
	 * Normalizes in order to compare in tests.
	 */
	public function normalize( string $to_normalize ): string {
		return preg_replace(
			'/\s?[\t\n]/',
			'',
			$to_normalize
		);
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
	 * Tests that a pattern newly created with Pattern Manager results in a slug and filename that matches the post_name.
	 */
	public function test_new_pattern_title_matches_slug() {

		// Mock a post object so we can test it.
		$wp_post = $this->factory()->post->create_and_get(
			[
				'post_title'   => 'New Pattern, originally created with Pattern Manager.',
				'post_content' => 'test pattern content',
				'post_name'    => 'new-pattern-originally-created-with-pattern-manager',
				'post_type'    => get_pattern_post_type(),
			]
		);

		// Save the mocked pattern to the disk.
		save_pattern_to_file( $wp_post );

		// Get the contents of the file that was saved.
		$pattern = get_pattern_by_name( $wp_post->post_name );

		// Make sure the ->post_name is the same as the slug, other than the prefixed textdomain.
		$this->assertStringEndsWith( $wp_post->post_name, $pattern['slug'] );

		// Make sure the post_name (aka "slug") of the post and the filename match.
		$this->assertSame( $wp_post->post_name, $pattern['name'] );
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

	/**
	 * Tests that images remain after a pattern is renamed.
	 */
	public function test_images_remain_after_a_pattern_is_renamed() {
		wp_set_current_user( $this->factory()->user->create( [ 'role' => 'administrator' ] ) );
		add_filter( 'stylesheet_directory', [ $this, 'get_fixtures_directory' ] );

		apply_filters(
			'get_post_metadata', // phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedHooknameFound
			null,
			$this->factory()->post->create_and_get(
				[
					'post_name' => 'a',
					'post_type' => get_pattern_post_type(),
				]
			),
			'name',
			'b'
		);
		do_action(
			'rest_after_insert_' . get_pattern_post_type(), // phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedHooknameFound
			$this->factory()->post->create_and_get(
				[
					'post_name'    => 'b',
					'post_title'   => 'B',
					'post_type'    => get_pattern_post_type(),
					'post_content' => '<!-- wp:image {"id":610,"sizeSlug":"full","linkDestination":"none"} --><figure class="wp-block-image size-full"><img src="<?php echo esc_url( get_stylesheet_directory_uri() ); ?>/patterns/images/220px-Golde33443.jpg" alt="" class="wp-image-610"/></figure><!-- /wp:image -->',
				]
			)
		);

		// Make sure the image wasn't deleted (the php tag remains around the img src).
		$this->assertSame(
			$this->normalize( get_wp_filesystem_api()->get_contents( $this->get_fixtures_directory() . '/expected/b.php' ) ),
			$this->normalize( get_wp_filesystem_api()->get_contents( $this->get_fixtures_directory() . '/patterns/b.php' ) )
		);
	}
}
