<?php
/**
 * Title: Section with image, text, buttons.
 * Slug: frost/general-hero-one-column-main-background
 * Categories: frost-general
 */

?>
<!-- wp:group {"align":"full","style":{"spacing":{"margin":{"top":"0px"}}},"backgroundColor":"main","textColor":"base","layout":{"wideSize":"800px"}} -->
<div class="wp-block-group alignfull has-base-color has-main-background-color has-text-color has-background" style="margin-top:0px">
<!-- wp:spacer {"height":100} -->
<div style="height:100px" aria-hidden="true" class="wp-block-spacer"></div>
<!-- /wp:spacer -->
<!-- wp:image {"id":3482,"sizeSlug":"full","linkDestination":"none"} -->
<figure class="wp-block-image size-full"><img src="<?php echo esc_url( __( 'https://frostwp.com/wp-content/uploads/2021/12/sample-white_1920x1200.jpg', 'fse-studio' ) ); ?>"  alt="<?php echo esc_attr__( 'Sample Image', 'fse-studio' ); ?>" class="wp-image-3482"/></figure>
<!-- /wp:image -->
<!-- wp:spacer {"height":60} -->
<div style="height:60px" aria-hidden="true" class="wp-block-spacer"></div>
<!-- /wp:spacer -->
<!-- wp:heading {"textAlign":"center","fontSize":"x-large"} -->
<h2 class="has-text-align-center has-x-large-font-size" id="image-heading-text-buttons"><?php echo esc_html__( 'Image, heading, text, buttons.', 'fse-studio' ); ?></h2>
<!-- /wp:heading -->
<!-- wp:paragraph {"align":"center"} -->
<p class="has-text-align-center">Lorem ipsum dolor sit amet, consectetur adipiscing vestibulum. Fringilla nec accumsan eget, facilisis mi justo, luctus eu pellentesque vitae gravida non diam accumsan.</p>
<!-- /wp:paragraph -->
<!-- wp:buttons {"layout":{"type":"flex","justifyContent":"center","orientation":"horizontal"},"style":{"spacing":{"blockGap":"10px"}}} -->
<div class="wp-block-buttons">
<!-- wp:button {"style":{"border":{"radius":0}},"className":"is-style-fill-base"} -->
<div class="wp-block-button is-style-fill-base"><a class="wp-block-button__link no-border-radius"><?php echo esc_html__( 'Get Started', 'fse-studio' ); ?></a></div>
<!-- /wp:button -->
<!-- wp:button {"style":{"border":{"radius":0}},"className":"is-style-outline-base"} -->
<div class="wp-block-button is-style-outline-base"><a class="wp-block-button__link no-border-radius"><?php echo esc_html__( 'Learn More', 'fse-studio' ); ?></a></div>
<!-- /wp:button -->
</div>
<!-- /wp:buttons -->
<!-- wp:spacer {"height":100} -->
<div style="height:100px" aria-hidden="true" class="wp-block-spacer"></div>
<!-- /wp:spacer -->
</div>
<!-- /wp:group -->
