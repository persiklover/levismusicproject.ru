$(function() {

  function scrollToForm() {
    $('html, body').animate({
      scrollTop: $('#form').offset().top - 5 + 'px'
    }, 500);
  }

  $('.js-form-scroll').click(function() {
    scrollToForm();
  });

  $('a[href^="#"]').click(function (e) {
    e.preventDefault();
    $('html, body').animate({
      scrollTop: $($(this).attr('href')).offset().top - 10 + 'px'
    }, 500);
  });

  // Открытие бургер-меню
  $('.js-menu-btn').click(function () {
    $(this).toggleClass('menu-btn--active');
    $('body').toggleClass('scroll-disabled');
    $('.nav').find('.nav__list').toggleClass('active');
  });

  // Клик по моменю
  $('.nav a').click(function() {
    $('.js-menu-btn').removeClass('menu-btn--active');
    $('body').removeClass('scroll-disabled');
    $('.nav').find('.nav__list').removeClass('active');
  });

  $('input[type="tel"]').mask('(999) 999 99-99');

  let $sliderCounter = $('.js-slider-counter');
  $('.slider')
    .owlCarousel({
      loop: true,
      margin: 2,
      nav: true,
      dots: true,
      items: 1
    })
    .on('changed.owl.carousel', function (event) {
      let i = event.item.index - 1;
      if (i == 0) {
        i = event.item.count;
      }
      $sliderCounter.text('Видео 0'+(i)+'/0'+event.item.count);
    });

  $('.teachers').owlCarousel({
    loop: true,
    mouseDrag: false,
    nav: true,
    dots: true,
    responsive: {
      0: {
        items:   2,
        slideBy: 2,
        margin:  1
      },
      808: {
        items:   4,
        slideBy: 4,
        margin:  1
      }
    }
  });

  let $videos = $('.video');
  let links   = $('.video__link');

  $videos.click(function () {
    if ($(this).attr('data-played-once') == 'true') {
      return;
    }
    $(this).attr('data-played-once', 'true');

    let url = $(this).attr('data-url');
    let id = url.slice(url.lastIndexOf('/') + 1);
    let link = $(this).find('.video__link');
    let play = $(this).find('.video__play');

    let iframe = document.createElement('iframe');
    iframe.setAttribute('allowfullscreen', '');
    iframe.setAttribute('src', 'https://www.youtube.com/embed/' + id + '?rel=0&showinfo=0&autoplay=1');
    iframe.classList.add('video__embed');

    link.remove();
    play.remove();
    $(this).append(iframe);
  });

  links.parent().attr('data-url', links.attr('href'));
  links.removeAttr('href');
  links.removeAttr('target');

  let $formCounter = $('.js-form-counter');
  let $form = $('.form'); 
  $form
    .owlCarousel({
      mouseDrag: false,
      touchDrag: false,
      items: 1,
      responsive: {
        0: {
          autoHeight: true,
          margin: 50
        },
        808: {
          autoHeight: false,
          margin: 150
        }
      }
    })
    .on('changed.owl.carousel', function (event) {
      let currentStep = event.item.index + 1;
      if (currentStep == 8) {
        let $heading = $(this).siblings('.section__heading');
        $heading.html('Заявка<br> отправлена');
        $formCounter.toggleClass('invisible');

        // ЗДЕСЬ ОТПРАВЛЯЕМ ЗАЯВКУ

        // page 7
        let infoSource = [];
        if ($('.resource-socnet').prop('checked')) {
          infoSource.push('Реклама в соцсетях');
        }
        if ($('.resource-vk').prop('checked')) {
          infoSource.push('Реклама ВК');
        }
        if ($('.resource-telegram').prop('checked')) {
          infoSource.push('Реклама в Telegram-канале');
        }
        if ($('.resource-blogger').prop('checked')) {
          infoSource.push('В соцсетях блоггера ('+$('.resource-blogger-name').val()+')');
        }
        if ($('.resource-media').prop('checked')) {
          infoSource.push('В онлайн СМИ');
        }
        if ($('.resource-poster-street').prop('checked')) {
          infoSource.push('Постер на улице');
        }
        if ($('.resource-poster-school').prop('checked')) {
          infoSource.push('Постер в школе');
        }

        let birthday = $('.birthday-day').val() + ' ' +
                       $('.birthday-month').attr('data-value') + ' ' +
                       $('.birthday-year').attr('data-value');

        let directions = [];
        if ($('.direction-guitar').prop('checked')) {
          directions.push('guitar');
        } 
        if ($('.direction-keys').prop('checked')) {
          directions.push('keys');
        } 
        if ($('.direction-drums').prop('checked')) {
          directions.push('drums');
        } 
        if ($('.direction-production').prop('checked')) {
          directions.push('production');
        }

        $.ajax({
          type: 'GET',
          url:  'handle.php',
          data:  {
            // page 1
            material1: $('.material1-input').val(),
            material2: $('.material2-input').val(),
            material3: $('.material3-input').val(),
            // page 2
            name:     $('.name-input').val(),
            birthday: birthday,
            phone:    '+7 ' + $('.phone-input').val(),
            email:    $('.email-input').val(),
            // page 3
            inst: $('.insta-page-input').val(),
            vkfb: $('.vkfb-page-input').val(),
            // page 4
            account1: $('.account1-input').val(),
            account2: $('.account2-input').val(),
            account3: $('.account3-input').val(),
            account4: $('.account4-input').val(),
            // page 5
            education:  $('.education-input').val(),
            directions: directions,
            // page 6
            essay: $('.essay-input').val(),
            // page 7
            infoSource: infoSource
          },
          success: function (data) {
            // console.warn("success");
          }
        });

        return;
      }
      
      $(this).attr('data-step', currentStep);
      $formCounter.text('Шаг 0' + (currentStep) + '/0' + event.item.count);
    });
  
  $('.js-form-reset').click(function(e) {
    e.preventDefault();
    $form.trigger('to.owl.carousel', 0);

    let $heading = $form.siblings('.section__heading');
    $heading.html('Заполни заявку,<br> чтобы принять участие');
    $formCounter.removeClass('invisible');

    // reset form
    $('.material1-input').val('');
    $('.material2-input').val('');
    $('.material3-input').val('');

    $('.name-input').val('');
    $('.birthday-day').val('');
    $('.birthday-month').attr('data-value', 'feb');
    $('.birthday-month span').text('февраль');
    $('.birthday-year').attr('data-value', '2000');
    $('.birthday-year').text('2000');
    $('.phone-input').val('');
    $('.email-input').val('');

    $('.insta-page-input').val('');
    $('.vkfb-page-input').val('');
    // page 4
    $('.account1-input').val('');
    $('.account2-input').val('');
    $('.account3-input').val('');
    $('.account4-input').val('');
    // page 5
    $('.education-input').val('');

    $('.direction-guitar').prop('checked', false);
    $('.direction-keys').prop('checked', false);
    $('.direction-drums').prop('checked', false);
    $('.direction-production').prop('checked', false);
    // page 6
    $('.essay-input').val('');
    // page 7
    $('.resource-socnet').prop('checked', false);
    $('.resource-vk').prop('checked', false);
    $('.resource-telegram').prop('checked', false);
    $('.resource-blogger').prop('checked', false);
    $('.resource-blogger-name').val('');
    $('.resource-media').prop('checked', false);
    $('.resource-poster-street').prop('checked', false);
    $('.resource-poster-school').prop('checked', false);
  });

  $('.js-form-next').click(function(e) {
    e.preventDefault();

    // Закрываем попапы
    $('.modal-months, .modal-years').removeClass('active');

    let errors = [];
    
    let step = +$(this).parents('.form').attr('data-step');
    switch (step) {
      case 1: {
        let $material1Input = $('.material1-input').val();
        let $material2Input = $('.material2-input').val();
        let $material3Input = $('.material3-input').val();

        if (
          $material1Input.length == 0 ||
          $material2Input.length == 0 ||
          $material3Input.length == 0
        ) {
          errors.push('Пожалуйста, укажите ссылки на 3 свои работы!');
        }
        break;
      }
      case 2: {
        let $nameText      = $('.name-input').val();
        let $birthdayDay   = $('.birthday-day').val();
        let $birthdayMonth = $('.birthday-month').val();
        let $birthdayYear  = $('.birthday-year').val();
        let $phoneNumber   = $('.phone-input').val();
        let $emailAddress  = $('.email-input').val();

        // Имя
        if ($nameText.length == 0) {
          errors.push('Введите имя!');
        }
        else if ($nameText.length < 2) {
          errors.push('Имя не должно быть короче 2 букв!');
        }
        
        // Дата рождения
        if ($birthdayDay.length == 0) {
          errors.push('Введите день своего рождения!');
        }
        else if ($birthdayDay > 31) {
          errors.push('В месяце может быть максимум 31 день');
        }
        
        // Номер телефона
        if ($phoneNumber.length == 0) {
          errors.push('Введите номер телефона!');
        }
        
        // E-mail
        if ($emailAddress.length == 0) {
          errors.push('Введите e-mail!');
        }
        else if (!/\b[\w\.-]+@[\w\.-]+\.\w{2,4}\b/g.test($emailAddress)) {
          errors.push('Введите корректный e-mail адрес!');
        }

        break;
      }
      case 3: {
        let $instaPage = $('.insta-page-input').val();
        let $vkfbPage  = $('.vkfb-page-input').val();

        if ($instaPage.length == 0 && $vkfbPage.length == 0) {
          errors.push('Пожалуйста, укажите хотя бы одну ссылку!');
        }

        break;
      }
      case 4: {
        break;
      }
      case 5: {
        let $education           = $('.education-input').val();
        let $directionGuitar     = $('.direction-guitar').prop('checked');
        let $directionKeys       = $('.direction-keys').prop('checked');
        let $directionDrums      = $('.direction-drums').prop('checked');
        let $directionProduction = $('.direction-production').prop('checked');

        // Образование
        if ($education.length == 0) {
          errors.push('Пожалуйста, расскажите о своем образовании!');
        }

        if (
          !$directionGuitar &&
          !$directionKeys   &&
          !$directionDrums  &&
          !$directionProduction
        ) {
          errors.push('Пожалуйста, выберете свое направление!');
        }

        break;
      }
      case 6: {
        let $essay = $('.essay-input').val();

        // Эссе
        if ($essay.length == 0) {
          errors.push('Пожалуйста, дайте ответ на вопрос');
        }
        else if ($essay.split(/[\s,]+/g).length < 50) {
          errors.push('Длина ответа должна быть не менее 50 слов!');
        }

        break;
      }
      case 7: {
        let $resourceSocnet       = $('.resource-socnet').prop('checked');
        let $resourceVK           = $('.resource-vk').prop('checked');
        let $resourceTelegram     = $('.resource-telegram').prop('checked');
        let $resourceBlogger      = $('.resource-blogger').prop('checked');
        let $resourceBloggerName  = $('.resource-blogger-name').val();
        let $resourceMedia        = $('.resource-media').prop('checked');
        let $resourcePosterStreet = $('.resource-poster-street').prop('checked');
        let $resourcePosterSchool = $('.resource-poster-school').prop('checked');

        let $datauseAgree = $('.datause-agree').prop('checked');

        if ($resourceBlogger && $resourceBloggerName.length == 0) {
          errors.push('Пожалуйста, укажите имя музыканта/блогера');
        }

        if (
          !$resourceSocnet       &&
          !$resourceVK           &&
          !$resourceTelegram     &&
          !$resourceBlogger      &&
          !$resourceMedia        &&
          !$resourcePosterStreet &&
          !$resourcePosterSchool
        ) {
          errors.push('Выберете хотя бы один вариант');
        }
        
        if (!$datauseAgree) {
          errors.push('Необходимо дать согласие на обработку персональных данных');
        }

        break;
      }
    }

    let $errorHTML = $form.find('.page-content' + step).find('.error-msg');
    if (errors.length == 0) {
      $form.trigger('next.owl.carousel');
      $errorHTML.text('');
    }
    else {
      console.error(errors[0]);
      $errorHTML.text(errors[0]);
    }

  });

  // Формы и инпуты
  $('.js-month-select').click(function() {
    $('.modal-months')
      .toggleClass('active')
      .css({
        left: $(this).offset().left - 2 + 'px',
        top:  $(this).offset().top
      });
  });
  
  $('.js-year-select').click(function() {
    $('.modal-years')
      .toggleClass('active')
      .css({
        left:  $(this).offset().left - 2 + 'px',
        top:   $(this).offset().top
      });
  });

  $('.modal-months__item').click(function() {
    let val = $(this).attr('data-value');

    let $select = $('.birthday-month');
    $select.attr('data-value', val);
    $select.find('.form-select__title').text($(this).text());

    $(this).parent()
      .removeClass('active');
  });
  
  $('.modal-years__item').click(function() {
    let val = $(this).attr('data-value');

    let $select = $('.birthday-year');
    $select.attr('data-value', val);
    $select.find('.form-select__title').text($(this).text());

    $(this).parent()
      .removeClass('active');
  });

});
