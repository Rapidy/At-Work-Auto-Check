// // Import jQuery module (npm i jquery)
import $ from 'jquery'
window.jQuery = $
window.$ = $

import magnificPopup from 'magnific-popup'
import slick from 'slick-carousel'

// // Import vendor jQuery plugin example (not module)
require('../libs/jquery.waterwheelCarousel.min.js')

document.addEventListener('DOMContentLoaded', () => {

	$('img').attr('draggable','false');

	if($('main').is('.main')) {

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
		
	} else {

		$('.info-menu__item').click(function(e) {
			// e.preventDefault();

			if($(this).hasClass('active')) {
				return
			}

			// $('.info-menu__item').removeClass('active')
			// $(this).addClass('active')
	
			// const id = $(this).attr('href'),
			// 			top = $(id).offset().top - 30;
			// $('.info-main').animate({scrollTop: top}, 500)
		})

		document.querySelector('.info-main').addEventListener('scroll', function() {
			const scrollDistance = this.scrollTop + 50;
			
			document.querySelectorAll('.info-main__item').forEach(function(item, i) {

				if(item.offsetTop <= scrollDistance) {
					document.querySelectorAll('.info-menu__item').forEach(function(item) {
						if(item.classList.contains('active')) {
							item.classList.remove('active')
						}
					})
				
					document.querySelectorAll('.info-menu__item')[i].classList.add('active')
				}

			})
		}) 
	
		$('.info-main-header__date time').html(new Date().toLocaleDateString());
	
		$('.info-main__item-slider').slick({
			slidesToShow: 4,
			slidesToScroll: 4,
			infinite: false
		})

		$('.info-main__item-slider').magnificPopup({
			delegate: 'a',
			type: 'image',
			tLoading: 'Загрузка фото #%curr%...',
			mainClass: 'mfp-img-mobile',
			gallery: {
				enabled: true,
				navigateByImgClick: true,
			}
		})

	}

	

})
