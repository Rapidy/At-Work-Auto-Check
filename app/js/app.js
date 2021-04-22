// // Import jQuery module (npm i jquery)
import $ from 'jquery'
window.jQuery = $
window.$ = $

import slick from 'slick-carousel'

// // Import vendor jQuery plugin example (not module)
// require('~/app/libs/mmenu/dist/mmenu.js')

document.addEventListener('DOMContentLoaded', () => {

	$('img').attr('draggable','false');

	$('.checklist-nav__item').mouseenter(function() {
		let currentNavItem = $(this).data('id');
		let currentPhoto = $('.checklist-photo__item')[currentNavItem];

		$('.checklist-photo__item').removeClass('active').addClass('hidden');
		currentPhoto.classList.remove('hidden');
		currentPhoto.classList.add('active')
	});

	$('.checklist-nav').mouseleave(function() {
		$('.checklist-photo__item').addClass('hidden').removeClass('active');
		$('.checklist-photo__item')[0].classList.add('active');
		$('.checklist-photo__item')[0].classList.remove('hidden');
	});

	// $('.slider-report').slick({
	// 	infinite: true,
	// 	slidesToShow: 3,
	// 	slidesToScroll: 1,
	// 	fade: true,
	// 	cssEase: 'linear',
	// 	speed: 500
	// })

})
