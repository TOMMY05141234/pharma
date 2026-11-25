/* 計測設定。IDが空の項目は、読み込まれず、何も送信されません。
   clarityId は、Clarityのプロジェクトを作成したら入れてください。 */
(function () {
  var CONFIG = {
    awId: "AW-18146496318",   // Google広告の「Googleタグ」のID
    ga4Id: "G-5M4MMZRL4E",    // GA4の測定ID
    clarityId: "zdlhiwjbzj",   // Microsoft ClarityのプロジェクトID
    // 広告主ごとのコンバージョンラベル（AW-ID/ラベル の「ラベル」部分）
    labels: {
      pharmastaff: "w88kCPjQtbgdEL6e9sxD", // ファルマスタッフ_click_比較LP（ID 7902947448）
      mediwell: "0XrLCOKYtbgdEL6e9sxD",    // メディウェル薬剤師_click_比較LP（ID 7902940258）
      oshigoto: "CMWOCN_StbgdEL6e9sxD",    // お仕事ラボ_click_比較LP（ID 7902947679）
      mc: "khZMCIDTtbgdEL6e9sxD"           // MC-ファーマネット_click_比較LP（ID 7902947712）
    }
  };

  // A8リンクの a8mat の先頭部分で、広告主を判別する
  var ADVERTISERS = [
    { key: "pharmastaff", match: "a8mat=4BAFPF+711DIA" },
    { key: "mediwell",    match: "a8mat=4BAGHG+9Q3142" },
    { key: "oshigoto",    match: "a8mat=4BAGHG+9RVBXE" },
    { key: "mc",          match: "a8mat=4BAGHG+9U92CI" }
  ];

  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = window.gtag || gtag;

  var baseId = CONFIG.ga4Id || CONFIG.awId;
  if (baseId) {
    var s = document.createElement("script");
    s.async = true;
    s.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(baseId);
    document.head.appendChild(s);
    gtag("js", new Date());
    if (CONFIG.ga4Id) gtag("config", CONFIG.ga4Id);
    if (CONFIG.awId) gtag("config", CONFIG.awId);
  }

  if (CONFIG.clarityId) {
    (function (c, l, a, r, i, t, y) {
      c[a] = c[a] || function () { (c[a].q = c[a].q || []).push(arguments); };
      t = l.createElement(r); t.async = 1; t.src = "https://www.clarity.ms/tag/" + i;
      y = l.getElementsByTagName(r)[0]; y.parentNode.insertBefore(t, y);
    })(window, document, "clarity", "script", CONFIG.clarityId);
  }

  function advertiserOf(href) {
    for (var i = 0; i < ADVERTISERS.length; i++) {
      if (href.indexOf(ADVERTISERS[i].match) !== -1) return ADVERTISERS[i].key;
    }
    return null;
  }

  function onClick(e) {
    var a = e.target.closest ? e.target.closest('a[href*="px.a8.net"]') : null;
    if (!a) return;
    var key = advertiserOf(a.href);
    if (!key) return;
    var place = a.getAttribute("data-cta") || (a.closest(".yk-rank__banner") ? "banner" : (a.closest(".closing") ? "closing" : "card"));
    if (window.clarity) { window.clarity("set", "affiliate_click", key); window.clarity("event", "click_" + key); }
    if (CONFIG.awId && CONFIG.labels[key]) {
      gtag("event", "conversion", { send_to: CONFIG.awId + "/" + CONFIG.labels[key], event_callback: function () {} });
    }
    if (CONFIG.ga4Id) gtag("event", "affiliate_click", { advertiser: key, cta_position: place, link_url: a.href });
    window.dataLayer.push({ event: "affiliate_click", advertiser: key, placement: place });
  }

  document.addEventListener("click", onClick, true);
  document.addEventListener("auxclick", onClick, true);
})();
