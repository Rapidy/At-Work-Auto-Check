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

	$('.report-computer-viewport-slider').slick({
		infinite: true,
		slidesToScroll: 1,
		slidesToShow: 1,
		dots: true,
		nextArrow: '<button class="report-computer__btn report-computer__btn--next"><img src="../images/dist/rightarrow.svg"></button>',
		prevArrow: '<button class="report-computer__btn report-computer__btn--prev"><img src="../images/dist/leftarrow.svg"</button>',
		centerMode: true,
		centerPadding: '0'
	})

	$('.hint-btn').click(function() {
		const hint = $('.main-check-input__hint');

		if(hint.hasClass('show')) {
			$(hint.removeClass('show'))
		} else {
			$(hint.addClass('show'))
		}
	})

})
