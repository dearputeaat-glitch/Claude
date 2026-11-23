(function () {
  var screens = document.querySelectorAll('.screen');
  var timers = [];

  function clearTimers() { timers.forEach(clearTimeout); timers = []; }

  function show(name) {
    clearTimers();
    screens.forEach(function (s) { s.classList.toggle('is-active', s.dataset.screen === name); });
    window.scrollTo(0, 0);
    if (location.hash !== '#' + name) history.replaceState(null, '', '#' + name);
    if (name === 'sso') runSso();
    if (name === 'login') {
      var pw = document.getElementById('pw');
      if (pw) setTimeout(function () { pw.focus(); }, 50);
    }
  }

  function runSso() {
    var steps = document.querySelectorAll('.sso-step');
    var fill = document.querySelector('.sso-fill');
    steps.forEach(function (s) { s.classList.add('pending'); });
    fill.style.transition = 'none';
    fill.style.width = '0';
    void fill.offsetWidth;
    fill.style.transition = 'width 2.4s linear';
    fill.style.width = '100%';
    steps.forEach(function (s, i) {
      timers.push(setTimeout(function () { s.classList.remove('pending'); }, 500 + i * 700));
    });
    // setelah SSO selesai, kembali ke portal (halaman JDIH belum dibuat)
    timers.push(setTimeout(function () { show('portal'); }, 3200));
  }

  document.addEventListener('click', function (e) {
    var t = e.target.closest('[data-go]');
    if (t) { e.preventDefault(); show(t.dataset.go); return; }

    var seg = e.target.closest('.seg');
    if (seg) {
      document.querySelectorAll('.seg').forEach(function (b) { b.classList.toggle('active', b === seg); });
      var f = seg.dataset.f;
      document.querySelectorAll('#appgrid .app').forEach(function (a) {
        a.classList.toggle('hide', f !== 'all' && a.dataset.cat.split(' ').indexOf(f) < 0);
      });
      return;
    }

    var star = e.target.closest('.star');
    if (star) {
      e.preventDefault(); e.stopPropagation();
      var on = star.getAttribute('src').indexOf('filled') > -1;
      star.setAttribute('src', on ? 'assets/star-outline.svg' : 'assets/star-filled.svg');
      return;
    }

    var aj = e.target.closest('button.btn-aj');
    if (aj && !aj.classList.contains('sent')) {
      aj.classList.add('sent');
      aj.innerHTML = '<img src="assets/icon-clock.svg" width="13" height="13" alt="">Dalam pemeriksaan';
    }
  });

  document.getElementById('login-form').addEventListener('submit', function (e) {
    e.preventDefault();
    show('portal');
  });

  var start = location.hash.slice(1);
  show(['login', 'sso', 'portal'].indexOf(start) > -1 ? start : 'login');
})();
