<?php
/**
 * Frost: Footer with text, links, buttons.
 *
 * @package fse-studio
 */

return array(
	'title'         => __( 'Footer with text, links, buttons.', 'frost' ),
	'name'          => 'frost-footer-three-columns',
	'categories'    => array( 'frost-footer' ),
	'viewportWidth' => 1280,
	'content'       => '<!-- wp:group {"align":"full","style":{"spacing":{"padding":{"top":"40px","bottom":"40px"}}},"className":"has-small-font-size","layout":{"inherit":true}} -->
<div class="wp-block-group alignfull has-small-font-size" style="padding-top:40px;padding-bottom:40px"><!-- wp:group {"align":"wide","layout":{"type":"flex","allowOrientation":false,"justifyContent":"space-between"}} -->
<div class="wp-block-group alignwide"><!-- wp:paragraph -->
<p>© 2022 Your Company LLC</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p><a href="#">Privacy Policy</a> · <a href="#">Terms of Service</a> · <a href="#">Contact Us</a></p>
<!-- /wp:paragraph -->

<!-- wp:social-links {"iconColor":"white","iconColorValue":"#fff","iconBackgroundColor":"black","iconBackgroundColorValue":"#000","className":"is-style-default"} -->
<ul class="wp-block-social-links has-icon-color has-icon-background-color is-style-default"><!-- wp:social-link {"url":"#","service":"facebook"} /-->

<!-- wp:social-link {"url":"#","service":"instagram"} /-->

<!-- wp:social-link {"url":"#","service":"twitter"} /--></ul>
<!-- /wp:social-links --></div>
<!-- /wp:group --></div>
<!-- /wp:group -->',
);
