// // Import jQuery module (npm i jquery)
import $ from 'jquery'
window.jQuery = $
window.$ = $

import magnificPopup from 'magnific-popup'
import slick from 'slick-carousel'
import scrollTo from 'jquery.scrollto'

// // Import vendor jQuery plugin example (not module)
require('../libs/jquery.waterwheelCarousel.min.js')

document.addEventListener('DOMContentLoaded', () => {

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

		// api/func
		function voidReplace(text) {
			if(text == "")
				return '----';
			else
				return text;
		}

		function infoLoading(avto) {
			//main var 
			const VIN = avto.vin;
			const regNum = avto.regNum;

			//main info 
			$('#mainVin').text(VIN);
			$('#mainCarNumber').text(regNum);
			$('#mainYear').text(avto.mainInfo.vehicle.year);
			$('#mainColor').text(avto.mainInfo.vehicle.color);
			$('#mainModel').text(avto.mainInfo.vehicle.model);
			$('#mainVolume').text(avto.mainInfo.vehicle.engineVolume);
			$('#mainHorsePower').text(avto.mainInfo.vehicle.powerHp);
			$('#mainElectricPower').text(avto.mainInfo.vehicle.powerKwt);
			$('#mainEngineNumber').text(avto.mainInfo.vehicle.engineNumber);
			$('#mainBodyNumber').text(avto.mainInfo.vehicle.bodyNumber);
			$('#mainCarCatergory').text(avto.mainInfo.vehicle.category);
			$('#mainCarType').text(avto.mainInfo.vehicle.typeinfo);

			//slider number
			$('#carNumber').text(regNum);

			//slider photo 
			if(avto.photo.count) {
				avto.photo.records.map((item) => {
					$('#carPhoto').append('<a href="'+item.bigPhoto+'"><img src="'+item.urlphoto+'" alt=""></a>');
				});
			}

			//regHistory
			if(avto.mainInfo.ownershipPeriod.length) {
				avto.mainInfo.ownershipPeriod.map( (item) => {
					$('#regHistoryList').append(`
						<div class="info-main__item-table__item">

							<div class="info-main__item-table__item-container">
								<li><span>Причина регистрации: </span><strong>${item.lastOperationInfo}</strong></li>
								<li><span>Тип владельца: </span><strong>${item.simplePersonTypeInfo}</strong></li>
								<li><span>Дата регистрации: </span><strong>${item.from}</strong></li>
								<li><span>Дата снятия: </span><strong>${item.to}</strong></li>
							</div>
			
						</div>`);
				});
			}

			//detectiveCheck
			if(avto.wanted.count) {
				avto.wanted.records.map( (item) => {
					$('#detectiveCheckList').append(`
						<div class="info-main__item-table__item ">
							<div class="info-main__item-table__item-container">
								<li><span>Регион инициатора:</span> <strong>${item.w_reg_inic}</strong></li>
								<li><span>Номер кузова:</span> <strong>${item.w_kuzov}</strong></li>
								<li><span>Марка ТС:</span> <strong>${item.w_model}</strong></li>
								<li><span>Дата учета:</span> <strong>${item.w_data_pu}</strong></li>
							</div>
						</div>
	  				`);
				});
			}

			//limitCheck
			if(avto.limitation.count) {
				avto.limitation.records.map( (item) => {
					$('#limitCheckList').append(`
						<div class="info-main__item-table__item">

						<div class="info-main__item-table__item-container">
						<li><span>Регион: </span><strong>${item.regname}</strong></li>
						<li><span>Ключ ГИБДД: </span><strong>${item.gid}</strong></li>
						<li><span>Дата наложения: </span><strong>${item.dateogr} - ${item.dateadd}</strong></li>
						<li><span>Вид ограничения: </span><strong>${item.ogrkodinfo}</strong></li>
						<li><span>Телефон инициатора: </span><strong>${item.phone}</strong></li>
						<li><span>Кем наложен: </span><strong>${item.divtypeinfo}</strong></li>
						<li><span>Год ТС: </span><strong>${item.tsyear}</strong></li>
						<li><span>VIN TC: </span><strong>${VIN}</strong></li>
						<li><span>Модель ТС: </span><strong>${item.tsmodel}</strong></li>
						<li><span>Номер кузова: </span><strong>${item.tsKuzov}</strong></li>
		
						<h5>Основания</h5>
						<strong>${item.osnOgr}</strong>
						</div>
		
						</div>
					`);
				})
			}

			//crashCheck
			if(avto.trfacc.count) {
				avto.trfacc.records.map( (item) => {
					$('#crashCheckList').append(`
						<div class="info-main__item-table__item ">

							<div class="info-main__item-table__item-container">
								<li><span>Повреждение: </span><strong>${item.VehicleDamageState}</strong></li>
								<li><span>Номер инцидента: </span><strong>${item.AccidentNumber}</strong></li>
								<li><span>Тип ДТП: </span><strong>${item.AccidentType}</strong></li>
								<li><span>Количество авто: </span><strong>${item.VehicleAmount}</strong></li>
								<li><span>Владелец ТС: </span><strong>${item.OwnerOkopf}</strong></li>
								<li><span>Регион владения: </span><strong>${item.RegionName}</strong></li>
								<li><span>Место ДТП: </span><strong>${item.AccidentPlace}</strong></li>
								<li><span>Дата ДТП: </span><strong>${item.AccidentDateTime}</strong></li>
								<li><span>Марка ТС: </span><strong>${item.VehicleMark}</strong></li>
								<li><span>Модель ТС: </span><strong>${item.VehicleModel}</strong></li>
								<li><span>Год ТС: </span><strong>${item.VehicleYear}</strong></li>
								<li><span>Описание ДТП: </span><strong>${item.DamageDestription}</strong></li>
				
								<img src="https://mini.s-shot.ru/450x450/PNG/450/Z100/?${encodeURIComponent(item.DamagePointsSVG)}" alt=""> 
							</div>
		
						</div>
					`);
				});
			}

			//osagoCheck
			if(avto.policy.length) {
				avto.policy.map( (item) => {
					$('#osagoCheckList').append(`
						<div class="info-main__item-table__item">		
						
							<div class="info-main__item-table__item-container">
								<li><span>Серия ОСАГО: </span><strong>${item.seria}</strong></li>
								<li><span>Номер ОСАГО: </span><strong>${item.nomer}</strong></li>
								<li><span>Страховая орг.: </span><strong>${item.orgosago}</strong></li>
								<li><span>Статус договора: </span><strong>${item.status}</strong></li>
								<li><span>Срок действия: </span><strong>${item.term}</strong></li>
								<li><span>Марка и модель ТС: </span><strong>${item.brandmodel}</strong></li>
								<li><span>Госномер: </span><strong>${item.regnum}</strong></li>
								<li><span>VIN номер: </span><strong>${VIN}</strong></li>
								<li><span>Мощность (л.с.): </span><strong>${item.power}</strong></li>
								<li><span>Управление с прицепом: </span><strong>${item.trailer}</strong></li>
								<li><span>Цель использования: </span><strong>${item.cel}</strong></li>
								<li><span>Допущенные лица: </span><strong>${item.ogran}</strong></li>
								<li><span>Страхователь: </span><strong>${item.insured}</strong></li>
								<li><span>Собственник: </span><strong>${item.owner}</strong></li>
								<li><span>КБМ по договору: </span><strong>${item.kbm}</strong></li>
								<li><span>ТС используется: </span><strong>${item.region}</strong></li>
								<li><span>Страховая премия: </span><strong>${item.strahsum}</strong></li>
								<li><span>Дата актуальности: </span><strong>${item.dateactual}</strong></li>
							</div>

						</div>	
					`);
				});
			}

			//pledgeCheck
			if(avto.deposit.num) {
				let pledgees = '',
					pledgors = '';

				avto.deposit.rez.map( (item) => {

					//Залогодержатели
					item.pledgees.map( (gees) => {
						pledgees = pledgees + gees.name + '<br>';
					});

					//Залогодатели
					item.pledgors.map( (gors) => {
						pledgors = pledgors + gors.name + '<br>';
					});

					$('#pledgeCheckList').append(`
						<div class="info-main__item-table__item">
								
							<div class="info-main__item-table__item-container">
								<li><span>Дата: </span><strong>${item.regDate}</strong></li>
								<li><span>Залогодатели: </span><strong>${pledgors}</strong></li>
								<li><span>Залогодержатели: </span><strong>${pledgees}</strong></li>
							</div>

						</div>	
					`);
				});
			}

			//leasingCheck
			if(avto.leasing.length) {
				avto.leasing.map( (item) => {
					$('#osagoCheckList').append(`
						<div class="info-main__item-table__item">		
						
							<div class="info-main__item-table__item-container">
								<li><span>Информация: </span><strong>${item.seria}</strong></li>
							</div>

						</div>	
					`);
				});
			}

			//taxiCheck
			if(avto.taxi.length) {
				avto.taxi.map( (item) => {
					$('#osagoCheckList').append(`
						<div class="info-main__item-table__item">		
						
							<div class="info-main__item-table__item-container">
								<li><span>Информация: </span><strong>${item.seria}</strong></li>
							</div>

						</div>	
					`);
				});
			}

			//mileageCheck
			if(avto.mileage.length) {
				avto.mileage.map( (item) => {
					$('#osagoCheckList').append(`
						<div class="info-main__item-table__item">		
						
							<div class="info-main__item-table__item-container">
								<li><span>Информация: </span><strong>${item.seria}</strong></li>
								<li><span>Информация: </span><strong>${item.seria}</strong></li>
								<li><span>Информация: </span><strong>${item.seria}</strong></li>
								<li><span>Информация: </span><strong>${item.seria}</strong></li>
							</div>

						</div>	
					`);
				});
			}

		}

		$.ajax({
			url: 'https://shielded-beach-99956.herokuapp.com/api/main',
			type: 'POST',    
			dataType: 'json',  
			success: function(data){
				infoLoading(data);  
				console.log(data);  

				//slider
				$('.info-main__item-slider').slick({
					slidesToShow: 4,
					slidesToScroll: 4,
					infinite: false
				})
			}   
		});

		$('.info-menu__item').click(function(e) {
			e.preventDefault();

			if($(this).hasClass('active')) {
				return
			}
	
			const id = $(this).attr('href');
			$('.info-main').scrollTo(id, 500, {'offset': -10})
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

	setTimeout(function() {
		$('img').attr('draggable','false')
	}, 1000)	

})
