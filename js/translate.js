/* Google Translate Element Initialization */
function initTranslate() {
  const translateBtn = document.getElementById('translate-btn');
  const translateDropdown = document.getElementById('translate-dropdown');

  if (translateBtn && translateDropdown) {
    translateBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      translateDropdown.classList.toggle('open');
    });

    document.addEventListener('click', (e) => {
      if (!translateDropdown.contains(e.target) && e.target !== translateBtn) {
        translateDropdown.classList.remove('open');
      }
    });
  }
}

window.googleTranslateElementInit = function () {
  new google.translate.TranslateElement({
    pageLanguage: 'en',
    includedLanguages: 'es,fr,de,zh-CN,ja,hi,ar,pt,ru,ko',
    layout: google.translate.TranslateElement.InlineLayout.SIMPLE
  }, 'google_translate_element');
};

// Dynamically inject Google Translate script
(function loadGoogleTranslateScript() {
  const script = document.createElement('script');
  script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
  document.head.appendChild(script);
})();
