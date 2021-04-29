// // Import jQuery module (npm i jquery)
import $ from 'jquery'
window.jQuery = $
window.$ = $

import slick from 'slick-carousel'

// // Import vendor jQuery plugin example (not module)
require('../libs/jquery.waterwheelCarousel.min.js')

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

	// $('.report-computer-viewport-slider').slick({
	// 	infinite: true,
	// 	slidesToScroll: 1,
	// 	slidesToShow: 1,
	// 	dots: true,
	// 	nextArrow: '<button class="report-computer__btn report-computer__btn--next"><img src="../images/dist/rightarrow.svg"></button>',
	// 	prevArrow: '<button class="report-computer__btn report-computer__btn--prev"><img src="../images/dist/leftarrow.svg"</button>',
	// 	centerMode: true,
	// 	centerPadding: '0'
	// })
	let sliderItems = 3,
			autoplay = 5000

	if (window.matchMedia("(max-width: 950px)").matches) { sliderItems = 1 }
	if (window.matchMedia("(max-width: 750px)").matches) { sliderItems = 0; autoplay = 0 }


	const slider = $('.report-container-slider').waterwheelCarousel({
		flankingItems: sliderItems,
		autoPlay: autoplay,
	});
	
	$('.report-container__btn--prev').click(function() {
		slider.prev()
	})

	$('.report-container__btn--next').click(function() {
		slider.next()
	})

	$('.hint-btn--top').click(function() {
		const hint = $('.hint--top');

		hint.toggleClass('show')
	})

	$('.hint-btn--bottom').click(function() {
		const hint = $('.hint--bottom');

		hint.toggleClass('show')
	})

	$('.info-menu__item').click(function() {
		$('.info-menu__item').removeClass('active')
		$(this).addClass('active');
		console.log($(this).siblings())
	})

})
