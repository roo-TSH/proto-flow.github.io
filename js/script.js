/* global $ */
$(function () {

  /* ─────────────────────────────────────────────────
     ハンバーガーメニュー
  ───────────────────────────────────────────────── */
  var $toggle  = $('#js-menu-toggle');
  var $header  = $('.site-header');
  var $overlay = $('#js-nav-overlay');

  function openMenu() {
    $header.addClass('is-open');
    $toggle.attr('aria-expanded', 'true');
    $overlay.addClass('is-visible').attr('aria-hidden', 'false');
  }

  function closeMenu() {
    $header.removeClass('is-open');
    $toggle.attr('aria-expanded', 'false');
    $overlay.removeClass('is-visible').attr('aria-hidden', 'true');
  }

  $toggle.on('click', function () {
    $header.hasClass('is-open') ? closeMenu() : openMenu();
  });

  // オーバーレイクリックで閉じる
  $overlay.on('click', closeMenu);

  // md(768px)以上にリサイズされたら強制クローズ
  $(window).on('resize.menu', function () {
    if ($(window).width() >= 768) closeMenu();
  });

  // ナビ内リンクをクリックしたら閉じる
  $('#js-global-nav').on('click', 'a', closeMenu);

  /* ─────────────────────────────────────────────────
     スムーズスクロール
  ───────────────────────────────────────────────── */
  $(document).on('click', 'a[href^="#"]', function (e) {
    var href    = $(this).attr('href');
    if (href === '#') return;

    var $target = $(href);
    if (!$target.length) return;

    e.preventDefault();
    var offset    = $('.site-header').outerHeight() + 16;
    var targetTop = Math.max(0, $target.offset().top - offset);
    $('html, body').animate({ scrollTop: targetTop }, 400);
  });

  /* ─────────────────────────────────────────────────
     ヘッダースクロール制御
  ───────────────────────────────────────────────── */
  var $siteHeader = $('.site-header');

  function updateHeaderScroll() {
    $siteHeader.toggleClass('is-scrolled', $(window).scrollTop() > 40);
  }

  $(window).on('scroll.header', updateHeaderScroll);
  updateHeaderScroll();

  /* ─────────────────────────────────────────────────
     スクロールフェードイン（IntersectionObserver）
  ───────────────────────────────────────────────── */
  if ('IntersectionObserver' in window) {
    var fadeObserver = new IntersectionObserver(
      function (entries) {
        $.each(entries, function (_, entry) {
          if (entry.isIntersecting) {
            $(entry.target).addClass('is-visible');
            fadeObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    $('.js-fade').each(function () {
      fadeObserver.observe(this);
    });
  } else {
    // フォールバック: IntersectionObserver 非対応環境
    $('.js-fade').addClass('is-visible');
  }

  /* ─────────────────────────────────────────────────
     FAQアコーディオン
  ───────────────────────────────────────────────── */
  $(document).on('click', '.faq__question', function () {
    var $btn    = $(this);
    var $answer = $btn.next('.faq__answer');
    var isOpen  = $btn.attr('aria-expanded') === 'true';

    // 他の開いているアイテムを閉じる
    $('.faq__question[aria-expanded="true"]').not($btn).each(function () {
      $(this).attr('aria-expanded', 'false')
             .next('.faq__answer').slideUp(280);
    });

    // クリックしたアイテムをトグル
    if (isOpen) {
      $btn.attr('aria-expanded', 'false');
      $answer.slideUp(280);
    } else {
      $btn.attr('aria-expanded', 'true');
      $answer.slideDown(280);
    }
  });

  /* ─────────────────────────────────────────────────
     タブUI（現在タブUIなし・将来の実装箇所）
  ───────────────────────────────────────────────── */
  // $('.js-tab-btn').on('click', function () {
  //   var target = $(this).data('target');
  //   $('.js-tab-btn').attr('aria-selected', 'false').removeClass('is-active');
  //   $('.js-tab-panel').addClass('is-hidden').attr('hidden', true);
  //   $(this).attr('aria-selected', 'true').addClass('is-active');
  //   $(target).removeClass('is-hidden').removeAttr('hidden');
  // });

});
