<?php
/**
 * Homepage.
 *
 * @package fse-studio
 */

return array(
	'type'          => 'default',
	'title'         => __( 'Homepage', 'fse-studio' ),
	'name'          => 'homepage',
	'categories'    => array( 'templates' ),
	'viewportWidth' => 1280,
	'content'       => '<!-- wp:group {"align":"full","style":{"spacing":{"padding":{"top":"30px","bottom":"30px"}}},"backgroundColor":"black","layout":{"inherit":true}} -->
	<div class="wp-block-group alignfull has-black-background-color has-background" style="padding-top:30px;padding-bottom:30px"><!-- wp:group {"align":"wide","layout":{"type":"flex","justifyContent":"space-between"}} -->
	<div class="wp-block-group alignwide"><!-- wp:site-title {"style":{"elements":{"link":{"color":{"text":"var:preset|color|white"}}}}} /-->
	<!-- wp:navigation {"textColor":"white","layout":{"type":"flex","orientation":"horizontal"}} -->
	<!-- wp:page-list /-->
	<!-- /wp:navigation --></div>
	<!-- /wp:group --></div>
	<!-- /wp:group -->
	<!-- wp:group {"align":"full","backgroundColor":"black","textColor":"white","layout":{"inherit":true}} -->
	<div class="wp-block-group alignfull has-white-color has-black-background-color has-text-color has-background"><!-- wp:spacer -->
	<div style="height:100px" aria-hidden="true" class="wp-block-spacer"></div>
	<!-- /wp:spacer -->
	<!-- wp:heading {"textAlign":"center","style":{"typography":{"fontStyle":"normal","fontWeight":"400"},"spacing":{"margin":{"bottom":"20px"}}},"fontSize":"max-48"} -->
	<h2 class="has-text-align-center has-max-48-font-size" id="let-s-connect" style="font-style:normal;font-weight:400;margin-bottom:20px">Let’s Connect</h2>
	<!-- /wp:heading -->
	<!-- wp:paragraph {"align":"center"} -->
	<p class="has-text-align-center">Quisque aliquam nisl quis metus taylor feugiat. Lorem ipsum dolor sit amet, consectetur adipiscing vestibulum vitae gravida non diam accumsan.</p>
	<!-- /wp:paragraph -->
	<!-- wp:buttons {"layout":{"type":"flex","justifyContent":"center"}} -->
	<div class="wp-block-buttons"><!-- wp:button {"className":"is-style-outline-white"} -->
	<div class="wp-block-button is-style-outline-white"><a class="wp-block-button__link">Get in Touch →</a></div>
	<!-- /wp:button --></div>
	<!-- /wp:buttons -->
	<!-- wp:spacer -->
	<div style="height:100px" aria-hidden="true" class="wp-block-spacer"></div>
	<!-- /wp:spacer --></div>
	<!-- /wp:group -->
	<!-- wp:group {"align":"full","layout":{"inherit":true}} -->
	<div class="wp-block-group alignfull"><!-- wp:spacer -->
	<div style="height:100px" aria-hidden="true" class="wp-block-spacer"></div>
	<!-- /wp:spacer -->
	<!-- wp:heading {"textAlign":"center","fontSize":"x-large"} -->
	<h2 class="has-text-align-center has-x-large-font-size" id="image-heading-text-button-1">Image, heading, text, button.</h2>
	<!-- /wp:heading -->
	<!-- wp:paragraph {"align":"center","className":"is-style-no-margin"} -->
	<p class="has-text-align-center is-style-no-margin">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
	<!-- /wp:paragraph -->
	<!-- wp:spacer {"height":"40px"} -->
	<div style="height:40px" aria-hidden="true" class="wp-block-spacer"></div>
	<!-- /wp:spacer -->
	<!-- wp:columns {"align":"wide"} -->
	<div class="wp-block-columns alignwide"><!-- wp:column -->
	<div class="wp-block-column"><!-- wp:image {"id":676,"sizeSlug":"full","linkDestination":"none"} -->
	<figure class="wp-block-image size-full"><img src="https://frostwp.com/wp-content/uploads/2021/12/sample-black_1200x1200.jpg" alt="Sample Image" class="wp-image-676"/></figure>
	<!-- /wp:image -->
	<!-- wp:heading {"textAlign":"center","level":3} -->
	<h3 class="has-text-align-center" id="sample-heading-1">Sample Heading</h3>
	<!-- /wp:heading -->
	<!-- wp:paragraph {"align":"center","style":{"typography":{"fontSize":"18px"}}} -->
	<p class="has-text-align-center" style="font-size:18px">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris finibus dolor ex, non hendrerit purus vulputate blandit.</p>
	<!-- /wp:paragraph -->
	<!-- wp:buttons {"layout":{"type":"flex","justifyContent":"center","orientation":"horizontal"}} -->
	<div class="wp-block-buttons"><!-- wp:button {"style":{"border":{"radius":0}},"className":"is-style-outline"} -->
	<div class="wp-block-button is-style-outline"><a class="wp-block-button__link no-border-radius">Learn More</a></div>
	<!-- /wp:button --></div>
	<!-- /wp:buttons --></div>
	<!-- /wp:column -->
	<!-- wp:column -->
	<div class="wp-block-column"><!-- wp:image {"id":676,"sizeSlug":"full","linkDestination":"none"} -->
	<figure class="wp-block-image size-full"><img src="https://frostwp.com/wp-content/uploads/2021/12/sample-black_1200x1200.jpg" alt="Sample Image" class="wp-image-676"/></figure>
	<!-- /wp:image -->
	<!-- wp:heading {"textAlign":"center","level":3} -->
	<h3 class="has-text-align-center" id="sample-heading-2">Sample Heading</h3>
	<!-- /wp:heading -->
	<!-- wp:paragraph {"align":"center","style":{"typography":{"fontSize":"18px"}}} -->
	<p class="has-text-align-center" style="font-size:18px">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris finibus dolor ex, non hendrerit purus vulputate blandit.</p>
	<!-- /wp:paragraph -->
	<!-- wp:buttons {"layout":{"type":"flex","justifyContent":"center","orientation":"horizontal"}} -->
	<div class="wp-block-buttons"><!-- wp:button {"style":{"border":{"radius":0}},"className":"is-style-outline"} -->
	<div class="wp-block-button is-style-outline"><a class="wp-block-button__link no-border-radius">Learn More</a></div>
	<!-- /wp:button --></div>
	<!-- /wp:buttons --></div>
	<!-- /wp:column -->
	<!-- wp:column -->
	<div class="wp-block-column"><!-- wp:image {"id":676,"sizeSlug":"full","linkDestination":"none"} -->
	<figure class="wp-block-image size-full"><img src="https://frostwp.com/wp-content/uploads/2021/12/sample-black_1200x1200.jpg" alt="Sample Image" class="wp-image-676"/></figure>
	<!-- /wp:image -->
	<!-- wp:heading {"textAlign":"center","level":3} -->
	<h3 class="has-text-align-center" id="sample-heading-3">Sample Heading</h3>
	<!-- /wp:heading -->
	<!-- wp:paragraph {"align":"center","style":{"typography":{"fontSize":"18px"}}} -->
	<p class="has-text-align-center" style="font-size:18px">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris finibus dolor ex, non hendrerit purus vulputate blandit.</p>
	<!-- /wp:paragraph -->
	<!-- wp:buttons {"layout":{"type":"flex","justifyContent":"center","orientation":"horizontal"}} -->
	<div class="wp-block-buttons"><!-- wp:button {"style":{"border":{"radius":0}},"className":"is-style-outline"} -->
	<div class="wp-block-button is-style-outline"><a class="wp-block-button__link no-border-radius">Learn More</a></div>
	<!-- /wp:button --></div>
	<!-- /wp:buttons --></div>
	<!-- /wp:column --></div>
	<!-- /wp:columns -->
	<!-- wp:spacer {"height":"70px"} -->
	<div style="height:70px" aria-hidden="true" class="wp-block-spacer"></div>
	<!-- /wp:spacer --></div>
	<!-- /wp:group -->
	<!-- wp:group {"align":"full","backgroundColor":"black","textColor":"white","layout":{"inherit":true}} -->
	<div class="wp-block-group alignfull has-white-color has-black-background-color has-text-color has-background"><!-- wp:spacer -->
	<div style="height:100px" aria-hidden="true" class="wp-block-spacer"></div>
	<!-- /wp:spacer -->
	<!-- wp:columns {"align":"wide"} -->
	<div class="wp-block-columns alignwide"><!-- wp:column -->
	<div class="wp-block-column"><!-- wp:heading {"level":4,"style":{"typography":{"fontSize":72,"lineHeight":"1"},"spacing":{"margin":{"top":"0px","right":"0px","bottom":"0px","left":"0px"}}}} -->
	<h4 style="font-size:72px;line-height:1;margin-top:0px;margin-right:0px;margin-bottom:0px;margin-left:0px">“</h4>
	<!-- /wp:heading -->
	<!-- wp:paragraph {"style":{"typography":{"fontSize":"18px"}}} -->
	<p style="font-size:18px">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla vitae lorem a neque imperdiet sagittis. Vivamus enim velit.</p>
	<!-- /wp:paragraph -->
	<!-- wp:paragraph {"fontSize":"small"} -->
	<p class="has-small-font-size"><strong>—Allison Taylor, Designer</strong></p>
	<!-- /wp:paragraph --></div>
	<!-- /wp:column -->
	<!-- wp:column -->
	<div class="wp-block-column"><!-- wp:heading {"level":4,"style":{"typography":{"fontSize":72,"lineHeight":"1"},"spacing":{"margin":{"top":"0px","right":"0px","bottom":"0px","left":"0px"}}}} -->
	<h4 style="font-size:72px;line-height:1;margin-top:0px;margin-right:0px;margin-bottom:0px;margin-left:0px">“</h4>
	<!-- /wp:heading -->
	<!-- wp:paragraph {"style":{"typography":{"fontSize":"18px"}}} -->
	<p style="font-size:18px">Fusce at est sapien. Aliquam tempus et nulla nisipt rhoncus, morbi convallis magna swift. Morbi viverra lobortis ante, volutpat ipsum.</p>
	<!-- /wp:paragraph -->
	<!-- wp:paragraph {"fontSize":"small"} -->
	<p class="has-small-font-size"><strong>—Anthony Breck, Developer</strong></p>
	<!-- /wp:paragraph --></div>
	<!-- /wp:column -->
	<!-- wp:column -->
	<div class="wp-block-column"><!-- wp:heading {"level":4,"style":{"typography":{"fontSize":72,"lineHeight":"1"},"spacing":{"margin":{"top":"0px","right":"0px","bottom":"0px","left":"0px"}}}} -->
	<h4 style="font-size:72px;line-height:1;margin-top:0px;margin-right:0px;margin-bottom:0px;margin-left:0px">“</h4>
	<!-- /wp:heading -->
	<!-- wp:paragraph {"style":{"typography":{"fontSize":"18px"}}} -->
	<p style="font-size:18px">Quisque ullamcorper nulla breu elementum, atipo consectetur ex iaculis quis. Vestibulum et faucibus. Quisque vitae mi pellentesque.</p>
	<!-- /wp:paragraph -->
	<!-- wp:paragraph {"fontSize":"small"} -->
	<p class="has-small-font-size"><strong>—Rebecca Jones, Coach</strong></p>
	<!-- /wp:paragraph --></div>
	<!-- /wp:column --></div>
	<!-- /wp:columns -->
	<!-- wp:spacer {"height":"40px"} -->
	<div style="height:40px" aria-hidden="true" class="wp-block-spacer"></div>
	<!-- /wp:spacer --></div>
	<!-- /wp:group -->
	<!-- wp:group {"align":"full","layout":{"inherit":true}} -->
	<div class="wp-block-group alignfull"><!-- wp:spacer -->
	<div style="height:100px" aria-hidden="true" class="wp-block-spacer"></div>
	<!-- /wp:spacer -->
	<!-- wp:columns {"align":"wide","style":{"spacing":{"margin":{"top":"0px","bottom":"0px"}}}} -->
	<div class="wp-block-columns alignwide" style="margin-top:0px;margin-bottom:0px"><!-- wp:column {"verticalAlignment":"center","width":"60%"} -->
	<div class="wp-block-column is-vertically-aligned-center" style="flex-basis:60%"><!-- wp:paragraph {"style":{"typography":{"lineHeight":"1.5"}},"className":"is-style-no-margin","fontSize":"large"} -->
	<p class="is-style-no-margin has-large-font-size" style="line-height:1.5">Lorem ipsum dolor sit amet, consectetur adipiscing lectus. Vestibulum mi justo, luctus eu pellentesque vitae gravida non.</p>
	<!-- /wp:paragraph --></div>
	<!-- /wp:column -->
	<!-- wp:column {"verticalAlignment":"center","width":"40%"} -->
	<div class="wp-block-column is-vertically-aligned-center" style="flex-basis:40%"><!-- wp:buttons {"layout":{"type":"flex","justifyContent":"right","orientation":"horizontal"}} -->
	<div class="wp-block-buttons"><!-- wp:button {"style":{"border":{"radius":0}},"className":"is-style-fill large"} -->
	<div class="wp-block-button is-style-fill large"><a class="wp-block-button__link no-border-radius">Get Started →</a></div>
	<!-- /wp:button -->
	<!-- wp:button {"style":{"border":{"radius":0}},"className":"is-style-outline large"} -->
	<div class="wp-block-button is-style-outline large"><a class="wp-block-button__link no-border-radius">Learn More</a></div>
	<!-- /wp:button --></div>
	<!-- /wp:buttons --></div>
	<!-- /wp:column --></div>
	<!-- /wp:columns -->
	<!-- wp:spacer {"height":"70px"} -->
	<div style="height:70px" aria-hidden="true" class="wp-block-spacer"></div>
	<!-- /wp:spacer --></div>
	<!-- /wp:group -->
	<!-- wp:group {"align":"full","style":{"elements":{"link":{"color":{"text":"var:preset|color|white"}}},"typography":{"fontSize":"18px"}},"backgroundColor":"black","textColor":"white","layout":{"inherit":true}} -->
	<div class="wp-block-group alignfull has-white-color has-black-background-color has-text-color has-background has-link-color" style="font-size:18px"><!-- wp:columns {"align":"wide","style":{"elements":{"link":{"color":[]}},"spacing":{"padding":{"top":"100px","bottom":"70px"}}}} -->
	<div class="wp-block-columns alignwide has-link-color" style="padding-top:100px;padding-bottom:70px"><!-- wp:column {"width":"50%"} -->
	<div class="wp-block-column" style="flex-basis:50%"><!-- wp:heading {"level":4} -->
	<h4 id="our-company">Our Company</h4>
	<!-- /wp:heading -->
	<!-- wp:paragraph -->
	<p>Lorem ipsum dolor sit amet, consectetur adipiscing lectus. Vestibulum mi justo, luctus eu pellentesque vitae gravida non.</p>
	<!-- /wp:paragraph -->
	<!-- wp:buttons -->
	<div class="wp-block-buttons"><!-- wp:button {"style":{"border":{"radius":0}},"className":"is-style-fill-white"} -->
	<div class="wp-block-button is-style-fill-white"><a class="wp-block-button__link no-border-radius" href="#">Learn More</a></div>
	<!-- /wp:button --></div>
	<!-- /wp:buttons --></div>
	<!-- /wp:column -->
	<!-- wp:column {"width":"5%"} -->
	<div class="wp-block-column" style="flex-basis:5%"></div>
	<!-- /wp:column -->
	<!-- wp:column {"width":"15%"} -->
	<div class="wp-block-column" style="flex-basis:15%"><!-- wp:heading {"level":4} -->
	<h4 id="about-us">About Us</h4>
	<!-- /wp:heading -->
	<!-- wp:list {"fontSize":"small"} -->
	<ul class="has-small-font-size"><li><a href="#">Start Here</a></li><li><a href="#">Our Mission</a></li><li><a href="#">Brand Guide</a></li><li><a href="#">Newsletter</a></li><li><a href="#">Accessibility</a></li></ul>
	<!-- /wp:list --></div>
	<!-- /wp:column -->
	<!-- wp:column {"width":"15%"} -->
	<div class="wp-block-column" style="flex-basis:15%"><!-- wp:heading {"level":4} -->
	<h4 id="services">Services</h4>
	<!-- /wp:heading -->
	<!-- wp:list {"fontSize":"small"} -->
	<ul class="has-small-font-size"><li><a href="#">Web Design</a></li><li><a href="#">Development</a></li><li><a href="#">Copywriting</a></li><li><a href="#">Marketing</a></li><li><a href="#">Social Media</a></li></ul>
	<!-- /wp:list --></div>
	<!-- /wp:column -->
	<!-- wp:column {"width":"15%"} -->
	<div class="wp-block-column" style="flex-basis:15%"><!-- wp:heading {"level":4} -->
	<h4 id="connect">Connect</h4>
	<!-- /wp:heading -->
	<!-- wp:list {"fontSize":"small"} -->
	<ul class="has-small-font-size"><li><a href="#">Facebook</a></li><li><a href="#">Instagram</a></li><li><a style="font-family: var(--font-family-primary);font-size: var(--font-size-regular);font-weight: var(--font-weight-regular)" href="#">Twitter</a></li><li><a style="font-family: var(--font-family-primary);font-size: var(--font-size-regular);font-weight: var(--font-weight-regular)" href="#">LinkedIn</a></li><li><a href="#">Dribbble</a></li></ul>
	<!-- /wp:list --></div>
	<!-- /wp:column --></div>
	<!-- /wp:columns --></div>
	<!-- /wp:group -->',
);
