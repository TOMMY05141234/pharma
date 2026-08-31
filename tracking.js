/*
 * 計測タグ（薬剤師キャリア相談室 LP）
 *
 * 【重要】Google広告のコンバージョンは「ページ読み込み時」ではなく
 * 「A8アフィリエイトリンクのクリック時」に発火させています。
 *
 * 理由：成果地点（ファルマスタッフの申込完了ページ）は広告主側のドメインで、
 * こちらからタグを設置できません。そのため PPCアフィリでは
 * 「アフィリリンクのクリック＝成果地点」として計測するのが定石です。
 * 発行タグをそのまま <head> に貼ると、訪問者全員が
 * コンバージョン扱いになり、入札最適化が壊れます。
 */
(function () {
  'use strict';

  var CONVERSION_ID = 'AW-18146496318/FSoQCOX6quscEL6e9sxD';
  var AFFILIATE_HOST = 'px.a8.net';

  function gtagSafe() {
    if (typeof window.gtag === 'function') {
      window.gtag.apply(null, arguments);
    }
  }

  // アフィリリンクのクリックを Google広告コンバージョン + GA4イベントとして送信
  document.addEventListener(
    'click',
    function (event) {
      var link = event.target.closest && event.target.closest('a[href*="' + AFFILIATE_HOST + '"]');
      if (!link) return;

      var position = link.getAttribute('data-cta') || 'unknown';

      // Google広告 コンバージョン（購入）
      gtagSafe('event', 'conversion', {
        send_to: CONVERSION_ID,
        transaction_id: ''
      });

      // GA4 側でも、どのCTAが押されたか分かるように記録
      gtagSafe('event', 'affiliate_click', {
        cta_position: position,
        link_url: link.href,
        advertiser: 'pharmastaff'
      });
    },
    true
  );

  // スクロール到達率（GA4のみ・広告のコンバージョンには影響しません）
  var depths = [25, 50, 75, 90];
  var fired = {};
  var ticking = false;

  function checkDepth() {
    ticking = false;
    var doc = document.documentElement;
    var scrollable = doc.scrollHeight - window.innerHeight;
    if (scrollable <= 0) return;
    var percent = ((window.scrollY || doc.scrollTop) / scrollable) * 100;

    for (var i = 0; i < depths.length; i++) {
      var d = depths[i];
      if (!fired[d] && percent >= d) {
        fired[d] = true;
        gtagSafe('event', 'scroll_depth', { percent_scrolled: d });
      }
    }
  }

  window.addEventListener(
    'scroll',
    function () {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(checkDepth);
    },
    { passive: true }
  );
})();
