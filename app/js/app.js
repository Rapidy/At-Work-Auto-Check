// // Import jQuery module (npm i jquery)
import $ from 'jquery'
window.jQuery = $
window.$ = $

import slick from 'slick-carousel'

// // Import vendor jQuery plugin example (not module)
// require('~/app/libs/mmenu/dist/mmenu.js')

document.addEventListener('DOMContentLoaded', () => {

	$('img').attr('draggable','false');

	$('.slider').slick({
		infinite: true,
		slidesToShow: 3,
		slidesToScroll: 1,
		dots: true,
		centerMode: true,
		arrows: false,
		centerPadding: '60px',
	})

	$('.slider-report').slick({
		infinite: true,
		slidesToShow: 1,
		slidesToScroll: 1,
		fade: true,
		cssEase: 'linear',
		speed: 500
	})

})
