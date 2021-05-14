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

		//save number 
		$('.numberBtn').click(function(e) {
			e.preventDefault();

			localStorage.clear();

			const num_input = $('.numCheckInput').val()

			if(num_input != '') {
				localStorage.setItem('regNm', num_input);
				document.location.href = "report.html";
			}
		})

		$('.vinBtn').click(function(e) {
			e.preventDefault();

			localStorage.clear();

			const vin_input = $('.vinCheckInput').val()

			if(vin_input != '' && vin_input.length == 17) {
				localStorage.setItem('vin', vin_input);
				document.location.href = "report.html";
			}
		})

		$('.main-buttons__btn--header').click(function() {

			$('.main-buttons__btn--header').removeClass('active')

			if($(this).data('id') == 'vinCheck') {
				$('.numberCheck').hide()
				$('.vinCheck').show();
				$('.numberBtn').hide()
				$('.vinBtn').show()
				$(this).addClass('active')
			}		

			if($(this).data('id') == 'numberCheck') {
				$('.vinCheck').hide();
				$('.numberCheck').show();
				$('.numberBtn').show()
				$('.vinBtn').hide()
				$(this).addClass('active')
			}
			
		})

		$('.main-buttons__btn--footer').click(function() {

			$('.main-buttons__btn--footer').removeClass('active')

			if($(this).data('id') == 'vinCheckFooter') {
				$('.numberCheck--footer').hide()
				$('.vinCheck--footer').show();
				$('.numberBtn').addClass('hidden')
				$('.vinBtn').removeClass('hidden')
				$(this).addClass('active')
			}		

			if($(this).data('id') == 'numberCheckFooter') {
				$('.vinCheck--footer').hide();
				$('.numberCheck--footer').show();
				$('.numberBtn').removeClass('hidden')
				$('.vinBtn').addClass('hidden')
				$(this).addClass('active')
			}
			
		})
		
	} else {

		// api/func
		function voidReplace(text) {
			if(text == "" || text == null || text == "null")
				return '----';
			else
				return text;
		}

		function infoLoading(avto) {
			//main var 
			const VIN = avto.VIN;
			const regNum = avto.regNum;
			if(avto.mainInfo.status == 200) {
				//header info 
				$('#carName').text(avto.mainInfo.vehicle.model);
				$('#carYear').text(avto.mainInfo.vehicle.year);

				//main info 
				$('#mainVin').text(VIN);
				$('#mainCarNumber').text(regNum);
				$('#mainYear').text(voidReplace(avto.mainInfo.vehicle.year));
				$('#mainColor').text(voidReplace(avto.mainInfo.vehicle.color));
				$('#mainModel').text(voidReplace(avto.mainInfo.vehicle.model));
				$('#mainVolume').text(voidReplace(avto.mainInfo.vehicle.engineVolume));
				$('#mainHorsePower').text(voidReplace(avto.mainInfo.vehicle.powerHp));
				$('#mainElectricPower').text(voidReplace(avto.mainInfo.vehicle.powerKwt));
				$('#mainEngineNumber').text(voidReplace(avto.mainInfo.vehicle.engineNumber));
				$('#mainBodyNumber').text(voidReplace(avto.mainInfo.vehicle.bodyNumber));
				$('#mainCarCatergory').text(voidReplace(avto.mainInfo.vehicle.category));
				$('#mainCarType').text(voidReplace(avto.mainInfo.vehicle.typeinfo));

				//slider number
				$('#carNumber').text(voidReplace(regNum));
			} else {
				$('#preloader').hide()

				$('#info').css({'display': 'flex', 'justify-content': 'center', 'align-items': 'center'}).html('<h2>Упссс!. Автомобиль в базе данных не найден</h2>');
			}
			
			//slider photo 
			if(avto.photo != undefined && avto.photo.count) {
				avto.photo.records.map((item) => {
					$('#carPhoto').append('<a href="'+item.bigPhoto+'"><img src="'+item.urlphoto+'" alt=""></a>');
				});
			} else {
				$('#carPhoto').append(`<h3>Фото не найдены</h3>`);
			}

			//regHistory
			if(avto.mainInfo.status == 200 && avto.mainInfo.ownershipPeriod.length) {
				avto.mainInfo.ownershipPeriod.map( (item) => {
					$('#regHistoryList').append(`
						<div class="info-main__item-table__item">

							<div class="info-main__item-table__item-container">
								<li><span>Причина: </span><strong>${voidReplace(item.lastOperationInfo)}</strong></li>
								<li><span>Тип владельца: </span><strong>${voidReplace(item.simplePersonTypeInfo)}</strong></li>
								<li><span>Дата регистрации: </span><strong>${voidReplace(item.from)}</strong></li>
								<li><span>Дата снятия: </span><strong>${voidReplace(item.to)}</strong></li>
							</div>
			
						</div>
					`);
				});
			} else {
				$('#regHistoryList').append(`<h3>История регистрации отсутвует</h3>`);
			}

			//detectiveCheck
			if(avto.wanted.count) {
				avto.wanted.records.map( (item) => {
					$('#detectiveCheckList').append(`
						<div class="info-main__item-table__item ">
							<div class="info-main__item-table__item-container">
								<li><span>Регион инициатора:</span> <strong>${voidReplace(item.w_reg_inic)}</strong></li>
								<li><span>Номер кузова:</span> <strong>${voidReplace(item.w_kuzov)}</strong></li>
								<li><span>Марка ТС:</span> <strong>${voidReplace(item.w_model)}</strong></li>
								<li><span>Дата учета:</span> <strong>${voidReplace(item.w_data_pu)}</strong></li>
							</div>
						</div>
	  				`);
				});
			} else {
				$('#detectiveCheckList').append(`<h3>ТС в розыске не найдена</h3>`);
			}

			//limitCheck
			if(avto.limitation.count) {
				avto.limitation.records.map( (item) => {
					$('#limitCheckList').append(`
						<div class="info-main__item-table__item">

							<div class="info-main__item-table__item-container">
								<li><span>Регион: </span><strong>${voidReplace(item.regname)}</strong></li>
								<li><span>Ключ ГИБДД: </span><strong>${voidReplace(item.gid)}</strong></li>
								<li><span>Дата наложения: </span><strong>${voidReplace(item.dateogr)} - ${voidReplace(item.dateadd)}</strong></li>
								<li><span>Вид ограничения: </span><strong>${voidReplace(item.ogrkodinfo)}</strong></li>
								<li><span>Телефон инициатора: </span><strong>${voidReplace(item.phone)}</strong></li>
								<li><span>Кем наложен: </span><strong>${voidReplace(item.divtypeinfo)}</strong></li>
								<li><span>Год ТС: </span><strong>${voidReplace(item.tsyear)}</strong></li>
								<li><span>VIN TC: </span><strong>${VIN}</strong></li>
								<li><span>Модель ТС: </span><strong>${voidReplace(item.tsmodel)}</strong></li>
								<li><span>Номер кузова: </span><strong>${voidReplace(item.tsKuzov)}</strong></li>
				
								<h5>Основания</h5>
								<strong>${voidReplace(item.osnOgr)}</strong>
							</div>
		
						</div>
					`);
				})
			} else {
				$('#limitCheckList').append(`<h3>Ограничения ТС не найдены</h3>`);
			}

			//crashCheck
			if(avto.trfacc.count) {
				avto.trfacc.records.map( (item) => {
					$('#crashCheckList').append(`
						<div class="info-main__item-table__item ">

							<div class="info-main__item-table__item-container">
								<li><span>Повреждение: </span><strong>${voidReplace(item.VehicleDamageState)}</strong></li>
								<li><span>Номер инцидента: </span><strong>${voidReplace(item.AccidentNumber)}</strong></li>
								<li><span>Тип ДТП: </span><strong>${voidReplace(item.AccidentType)}</strong></li>
								<li><span>Количество авто: </span><strong>${voidReplace(item.VehicleAmount)}</strong></li>
								<li><span>Владелец ТС: </span><strong>${voidReplace(item.OwnerOkopf)}</strong></li>
								<li><span>Регион владения: </span><strong>${voidReplace(item.RegionName)}</strong></li>
								<li><span>Место ДТП: </span><strong>${voidReplace(item.AccidentPlace)}</strong></li>
								<li><span>Дата ДТП: </span><strong>${voidReplace(item.AccidentDateTime)}</strong></li>
								<li><span>Марка ТС: </span><strong>${voidReplace(item.VehicleMark)}</strong></li>
								<li><span>Модель ТС: </span><strong>${voidReplace(item.VehicleModel)}</strong></li>
								<li><span>Год ТС: </span><strong>${voidReplace(item.VehicleYear)}</strong></li>
								<li><span>Описание ДТП: </span><strong>${voidReplace(item.DamageDestription)}</strong></li>
				
								<img src="https://mini.s-shot.ru/450x450/PNG/450/Z100/?${encodeURIComponent(item.DamagePointsSVG)}" alt=""> 
							</div>
		
						</div>
					`);
				});
			} else {
				$('#crashCheckList').append(`<h3>ДТП не найдены</h3>`);
			}

			//osagoCheck
			if(avto.policy.length) {
				avto.policy.map( (item) => {
					$('#osagoCheckList').append(`
						<div class="info-main__item-table__item">		
						
							<div class="info-main__item-table__item-container">
								<li><span>Серия ОСАГО: </span><strong>${voidReplace(item.seria)}</strong></li>
								<li><span>Номер ОСАГО: </span><strong>${voidReplace(item.nomer)}</strong></li>
								<li><span>Страховая орг.: </span><strong>${voidReplace(item.orgosago)}</strong></li>
								<li><span>Статус договора: </span><strong>${voidReplace(item.status)}</strong></li>
								<li><span>Срок действия: </span><strong>${voidReplace(item.term)}</strong></li>
								<li><span>Марка и модель ТС: </span><strong>${voidReplace(item.brandmodel)}</strong></li>
								<li><span>Госномер: </span><strong>${voidReplace(item.regnum)}</strong></li>
								<li><span>VIN номер: </span><strong>${VIN}</strong></li>
								<li><span>Мощность (л.с.): </span><strong>${voidReplace(item.power)}</strong></li>
								<li><span>Управление с прицепом: </span><strong>${voidReplace(item.trailer)}</strong></li>
								<li><span>Цель использования: </span><strong>${voidReplace(item.cel)}</strong></li>
								<li><span>Допущенные лица: </span><strong>${voidReplace(item.ogran)}</strong></li>
								<li><span>Страхователь: </span><strong>${voidReplace(item.insured)}</strong></li>
								<li><span>Собственник: </span><strong>${voidReplace(item.owner)}</strong></li>
								<li><span>КБМ по договору: </span><strong>${voidReplace(item.kbm)}</strong></li>
								<li><span>ТС используется: </span><strong>${voidReplace(item.region)}</strong></li>
								<li><span>Страховая премия: </span><strong>${voidReplace(item.strahsum)}</strong></li>
								<li><span>Дата актуальности: </span><strong>${voidReplace(item.dateactual)}</strong></li>
							</div>

						</div>	
					`);
				});
			} else {
				$('#osagoCheckList').append(`<h3>Полис ОСАГО отсутвует</h3>`);
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
								<li><span>Дата: </span><strong>${voidReplace(item.regDate)}</strong></li>
								<li><span>Залогодатели: </span><strong>${voidReplace(pledgors)}</strong></li>
								<li><span>Залогодержатели: </span><strong>${voidReplace(pledgees)}</strong></li>
							</div>

						</div>	
					`);
				});
			} else {
				$('#pledgeCheckList').append(`<h3>Залоги отсутвуют</h3>`);
			}

			//leasingCheck
			if(avto.leasing.num) {
				avto.leasing.map( (item) => {
					$('#leasingCheckList').append(`
						<div class="info-main__item-table__item">		
						
							<div class="info-main__item-table__item-container">
								<li><span>Информация: </span><strong>${voidReplace(item.rez)}</strong></li>
							</div>

						</div>	
					`);
				});
			} else {
				$('#leasingCheckList').append(`<h3>ТС в лизинге не найдена</h3>`);
			}

			//taxiCheck
			if(avto.taxi != undefined && avto.taxi.length) {
				avto.taxi.map( (item) => {
					$('#taxiCheckList').append(`
						<div class="info-main__item-table__item">		
						
							<div class="info-main__item-table__item-container">
								<li><span>Статус: </span><strong>${voidReplace(item.status)}</strong></li>
								<li><span>Дата выдачи: </span><strong>${voidReplace(item.date_issue)}</strong></li>
								<li><span>Номер разреш.: </span><strong>${voidReplace(item.permit_number)}</strong></li>
								<li><span>Владелец: </span><strong>${voidReplace(item.permit_owner)}</strong></li>
								<li><span>ИНН: </span><strong>${voidReplace(item.inn)}</strong></li>
								<li><span>Марка: </span><strong>${voidReplace(item.auto_marka)}</strong></li>
								<li><span>Модель: </span><strong>${voidReplace(item.model)}</strong></li>
								<li><span>Гос. номер: </span><strong>${voidReplace(item.regnum)}</strong></li>
								<li><span>Год выпуска: </span><strong>${voidReplace(item.auto_year)}</strong></li>
								<li><span>Номер бланка: </span><strong>${voidReplace(item.permit_seria)}</strong></li>
								<li><span>ЮЛ или ИП: </span><strong>${voidReplace(item.nameulip)}</strong></li>
								<li><span>Дата изменений: </span><strong>${voidReplace(item.date_modification)}</strong></li>
								<li><span>Срок действия: </span><strong>${voidReplace(item.permit_term)}</strong></li>
								<li><span>Регион: </span><strong>${voidReplace(item.region)}</strong></li>
							</div>

						</div>	
					`);
				});
			} else {
				$('#taxiCheckList').append(`<h3>ТС в базе такси не найдена</h3>`);
			}

			//mileageCheck
			if(avto.mileage.count) {
				avto.mileage.records.map( (item) => {
					$('#mileageCheckList').append(`
						<div class="info-main__item-table__item">		
						
							<div class="info-main__item-table__item-container">
								<li><span>Дата окон.: </span><strong>${voidReplace(item.dcExpirationDate)}</strong></li>
								<li><span>Адрес выдачи: </span><strong>${voidReplace(item.pointAddress)}</strong></li>
								<li><span>Шасси: </span><strong>${voidReplace(item.chassis)}</strong></li>
								<li><span>Кузов: </span><strong>${voidReplace(item.body)}</strong></li>
								<li><span>Оператор: </span><strong>${voidReplace(item.operatorName)}</strong></li>
								<li><span>Показания: </span><strong>${voidReplace(item.odometerValue)}</strong></li>
								<li><span>Номер ДК: </span><strong>${voidReplace(item.dcNumber)}</strong></li>
								<li><span>Дата выдачи: </span><strong>${voidReplace(item.dcDate)}</strong></li>
								<li><span>VIN ТС: </span><strong>${VIN}</strong></li>
								<li><span>Модель: </span><strong>${voidReplace(item.model)}</strong></li>
								<li><span>Марка: </span><strong>${voidReplace(item.brand)}</strong></li>
							</div>

						</div>	
					`);
					
					if(item.previousDcs.length != 0) {
						item.previousDcs.map( (item) => {
							$('#mileagePastCheckList').append(`
								<div class="info-main__item-table__item">		
								
									<div class="info-main__item-table__item-container">
										<li><span>Старые показания: </span><strong>${voidReplace(item.odometerValue)}</strong></li>
										<li><span>Дата ДК: </span><strong>${voidReplace(item.dcDate)} - ${voidReplace(item.dcExpirationDate)}</strong></li>
										<li><span>Номер ДК: </span><strong>${voidReplace(item.dcNumber)}</strong></li>
									</div>
	
								</div>	
							`);
						})
					}

				});

			} else {
				$('#mileageCheckList').append(`<h3>Данные ДК не найдены</h3>`);
				$('#detected_info').text('не найдены');
			}

		}

		let resAvto;
		if(localStorage.getItem('vin')) {
			$.ajax({
				type: "POST",
				url: 'backend/avto.php',
				cache: false,
				data: {
					vin: localStorage.getItem('vin')
				},
				dataType: 'json', 
				success: function(data){
					infoLoading(data);  
	
					//slider
					$('.info-main__item-slider').slick({
						slidesToShow: 4,
						slidesToScroll: 4,
						infinite: false
					})
	
					$('#preloader').hide()
	
					resAvto = data;
				},
				error: function(data){
					$('#preloader').hide()

					$('#info').css({'display': 'flex', 'justify-content': 'center', 'align-items': 'center'}).html('<h2>Упссс!. Автомобиль в базе данных не найден</h2>');
				}   
			});
		}
		
		if(localStorage.getItem('regNm')) {
			$.ajax({
				type: "POST",
				url: 'backend/avto.php',
				cache: false,
				data: {
					regNm: localStorage.getItem('regNm')
				},
				dataType: 'json', 
				success: function(data){
					infoLoading(data);  
	
					//slider
					$('.info-main__item-slider').slick({
						slidesToShow: 4,
						slidesToScroll: 4,
						infinite: false
					})
	
					$('#preloader').hide()
	
					resAvto = data;
				}   
			});
		}

		function downloadPDF(name) {
			let link = document.createElement('a');
			link.setAttribute('href', 'backend/' + name);
			link.setAttribute('download', name);
			link.click();
			link.remove();
			$('#preloader').hide()
		}


		//CTC 
		let ctc = null;
		function yesNo(num) {
			if(num == 1) 	
				return 'Да';
			else 
				return 'Нет';
		}
		$('#ctcNum').click(function(e) {
			e.preventDefault();
			$('#penaltyPreloader').removeClass('hidden')

			$.ajax({
				type: "POST",
				url: 'backend/penalty.php',
				cache: false,
				data: {
					regNum: resAvto.regNum,
					ctcNum: $('#ctcNumInput').val()
				},
				dataType: 'json',
			}).done((data) => {
				ctc = JSON.parse(data);

				$('#penaltyPreloader').addClass('hidden');
				$('#ctcInput').hide();
				$('.info-main__item-table').removeClass('hidden')


				if(ctc.length) {
					ctc.map((item) => {
						$('#penaltyCheckList').append(`
							<div class="info-main__item-table__item">	
												
								<div class="info-main__item-table__item-container">
									<li><span>Скидка: </span><strong>${yesNo(item.Discount)}</strong></li>
									<li><span>Скидка до: </span><strong>${item.DateDiscount}</strong></li>
									<li><span>Расшифровка КоАП: </span><strong>${item.KoAPtext}</strong></li>
									<li><span>Код КоАП: </span><strong>${item.KoAPcode}</strong></li>
									<li><span>Номер постановления: </span><strong>${item.NumPost}</strong></li>
									<li><span>КБК: </span><strong>${item.kbk}</strong></li>
									<li><span>Сумма штрафа: </span><strong>${item.Summa}</strong></li>
									<li><span>Дата постановления: </span><strong>${item.DatePost}</strong></li>
									<li><span>Подразделение: </span><strong>${item.division_name}</strong></li>
									<li><span>Адрес: </span><strong${item.division_address}></strong$></li>
									<li><span>Координаты: </span><strong>${item.division_coords}</strong></li>
									<li><span>Марка/Модель: </span><strong>${item.VehicleModel}</strong></li>
								</div>
	
							</div>`
						);
					});
				} else {
					$('#penaltyCheckList').append(`<h3>Штрафы отсутвуют</h3>`);
				}

			});
		});

		
		//download report 
		$('.info-main-header__btn').click(function(e) {
			e.preventDefault();
			$('#preloader').show()
			$.ajax({
				type: "POST",
				url: 'backend/reportPDF.php',
				cache: false,
				data: {
					vin: localStorage.getItem('vin'),
					regNum: resAvto.regNum,
					mainInfo: JSON.stringify(resAvto.mainInfo),
					wanted: JSON.stringify(resAvto.wanted),
					limitation: JSON.stringify(resAvto.limitation),
					trfacc: JSON.stringify(resAvto.trfacc),
					mileage: JSON.stringify(resAvto.mileage),
					policy: JSON.stringify(resAvto.policy),
					deposit: JSON.stringify(resAvto.deposit),
					leasing: JSON.stringify(resAvto.leasing),
					photo: JSON.stringify(resAvto.photo),
					taxi: JSON.stringify(resAvto.taxi),
					penalty: JSON.stringify(ctc)
				},
			}).done((data) => downloadPDF(data));
		});

		$('.info-menu-list__item').click(function(e) {
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
					document.querySelectorAll('.info-menu-list__item').forEach(function(item) {
						if(item.classList.contains('active')) {
							item.classList.remove('active')
						}
					})
				
					document.querySelectorAll('.info-menu-list__item')[i].classList.add('active')
				}

			})
		}) 
	
		$('.info-main-header__date time').html(new Date().toLocaleDateString());

		$('.info-menu-mobile__btn').click(function() {
			$('.info-menu').toggleClass('show')
			$(this).toggleClass('active')
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

	setTimeout(function() {
		$('img').attr('draggable','false')
	}, 1000)	

})
