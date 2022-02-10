<?php
/**
 * Frost: Header with site title, navigation.
 *
 * @package fse-studio
 */

return array(
	'title'         => __( 'Header with site title, navigation.', 'frost' ),
	'name'          => 'frost-header-default-black-background',
	'categories'    => array( 'frost-header' ),
	'viewportWidth' => 1280,
	'content'       => '<!-- wp:group {"align":"full","style":{"spacing":{"padding":{"top":"30px","bottom":"30px"}}},"backgroundColor":"black","layout":{"inherit":true}} -->
<div class="wp-block-group alignfull has-black-background-color has-background" style="padding-top:30px;padding-bottom:30px"><!-- wp:group {"align":"wide","layout":{"type":"flex","justifyContent":"space-between"}} -->
<div class="wp-block-group alignwide"><!-- wp:site-title {"style":{"elements":{"link":{"color":{"text":"var:preset|color|white"}}}}} /-->

<!-- wp:navigation {"textColor":"white","layout":{"type":"flex","orientation":"horizontal"}} -->
<!-- wp:page-list /-->
<!-- /wp:navigation --></div>
<!-- /wp:group --></div>
<!-- /wp:group -->',
);
