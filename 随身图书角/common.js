/* 随身图书角 · 共享数据与确认弹窗 */
var YUXIU_STORAGE = {
  BOOKS: 'yuxiu_books_data',
  LOGS: 'yuxiu_logs_data'
};

function loadStoredData(key, embeddedDefault) {
  try {
    var raw = localStorage.getItem(key);
    if (raw !== null) {
      var parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {}
  return embeddedDefault && embeddedDefault.slice ? embeddedDefault.slice() : (embeddedDefault || []);
}

function writeDataCache(key, data, showToast) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    sessionStorage.setItem(key, JSON.stringify(data));
    if (showToast) showSaveToast();
    return true;
  } catch (e) {
    alert('保存失败：浏览器存储空间可能已满');
    return false;
  }
}

function saveStoredData(key, data) {
  return writeDataCache(key, data, true);
}

function seedDataCacheIfEmpty(key, data) {
  if (localStorage.getItem(key) !== null) return;
  writeDataCache(key, data, false);
}

function loadLogsDataset(embeddedDefault) {
  var data = loadStoredData(YUXIU_STORAGE.LOGS, embeddedDefault);
  if (data.length) return data;
  try {
    var raw = sessionStorage.getItem(YUXIU_STORAGE.LOGS);
    if (raw) {
      var parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length) return parsed;
    }
  } catch (e) {}
  return data;
}

function injectConfirmDialogStyles() {
  if (document.getElementById('confirm-dialog-style')) return;
  var style = document.createElement('style');
  style.id = 'confirm-dialog-style';
  style.textContent =
    '.confirm-overlay{' +
      'position:fixed;top:0;left:0;right:0;bottom:0;width:100vw;height:100vh;' +
      'margin:0;padding:1.25rem;box-sizing:border-box;' +
      'background:rgba(22,42,62,0.52);backdrop-filter:blur(4px);-webkit-backdrop-filter:blur(4px);' +
      'z-index:100050;display:flex;align-items:center;justify-content:center;' +
      'animation:confirmOverlayIn 0.22s ease;}' +
    '@keyframes confirmOverlayIn{from{opacity:0}to{opacity:1}}' +
    '@keyframes confirmBoxIn{from{opacity:0;transform:translateY(12px) scale(0.96)}to{opacity:1;transform:translateY(0) scale(1)}}' +
    '.confirm-box{' +
      'position:relative;width:min(100%,400px);margin:auto;' +
      'background:rgba(255,255,255,0.98);border:1px solid #8fafc8;border-radius:6px;' +
      'padding:2rem 1.75rem 1.5rem;text-align:center;' +
      'box-shadow:0 12px 40px rgba(30,70,110,0.22),inset 0 1px 0 rgba(255,255,255,0.9);' +
      'animation:confirmBoxIn 0.28s ease;}' +
    '.confirm-box::after{' +
      'content:"";position:absolute;bottom:0;left:14%;right:14%;height:1px;' +
      'background:linear-gradient(90deg,transparent,#b8cfe0,transparent);}' +
    '.confirm-icon{' +
      'width:48px;height:48px;margin:0 auto 1rem;border-radius:50%;' +
      'background:linear-gradient(180deg,#eef4f8,#dce8f4);border:1px solid #b8cfe0;' +
      'display:flex;align-items:center;justify-content:center;' +
      'font-family:"Noto Serif SC",serif;font-size:1.35rem;color:#2e5a7a;line-height:1;}' +
    '.confirm-title{' +
      'font-family:"Noto Serif SC",serif;font-size:1.2rem;font-weight:500;' +
      'color:#2e5a7a;margin:0 0 0.75rem;letter-spacing:0.12em;}' +
    '.confirm-msg{' +
      'margin:0 0 1.5rem;color:#4a6278;font-size:0.95rem;line-height:1.65;}' +
    '.confirm-actions{display:flex;gap:0.75rem;justify-content:center;flex-wrap:wrap;}' +
    '.confirm-actions button{' +
      'min-width:96px;padding:0.58rem 1.35rem;border-radius:4px;font-size:0.92rem;' +
      'cursor:pointer;font-family:inherit;transition:filter 0.2s,transform 0.15s,box-shadow 0.2s;}' +
    '.confirm-actions button:hover{filter:brightness(1.04);transform:translateY(-1px);}' +
    '.confirm-no{' +
      'background:#fff;color:#4a6278;border:1px solid #b8cfe0;box-shadow:0 2px 6px rgba(30,70,110,0.06);}' +
    '.confirm-yes{' +
      'background:linear-gradient(180deg,#3d6b94,#2e5a7a);color:#f5f9fc;' +
      'border:1px solid #2e5a7a;box-shadow:0 3px 10px rgba(46,90,122,0.25);}' +
    '.confirm-yes.danger{' +
      'background:linear-gradient(180deg,#a85c5c,#8b3a3a);border-color:#8b3a3a;' +
      'box-shadow:0 3px 10px rgba(139,58,58,0.22);}';
  document.head.appendChild(style);
}

function showSaveToast() {
  var el = document.getElementById('saveToast');
  if (!el) {
    el = document.createElement('div');
    el.id = 'saveToast';
    el.textContent = '已自动保存';
    el.style.cssText = 'position:fixed;bottom:24px;left:50%;transform:translateX(-50%) translateY(80px);' +
      'background:rgba(30,70,110,0.92);color:#f5f9fc;padding:0.55rem 1.2rem;border-radius:4px;' +
      'font-size:0.88rem;z-index:10000;opacity:0;transition:opacity 0.25s, transform 0.25s;pointer-events:none;';
    document.body.appendChild(el);
  }
  el.style.opacity = '1';
  el.style.transform = 'translateX(-50%) translateY(0)';
  clearTimeout(el._hideTimer);
  el._hideTimer = setTimeout(function() {
    el.style.opacity = '0';
    el.style.transform = 'translateX(-50%) translateY(80px)';
  }, 1600);
}

function showConfirmDialog(message, options) {
  options = options || {};
  var title = options.title || (message.indexOf('删除') >= 0 ? '确认删除' : '请确认');
  var isDelete = options.danger !== false && message.indexOf('删除') >= 0;

  return new Promise(function(resolve) {
    injectConfirmDialogStyles();

    var prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    var overlay = document.createElement('div');
    overlay.className = 'confirm-overlay';
    overlay.setAttribute('role', 'presentation');
    overlay.innerHTML =
      '<div class="confirm-box" role="dialog" aria-modal="true" aria-labelledby="confirmDialogTitle">' +
        '<div class="confirm-icon" aria-hidden="true">？</div>' +
        '<h2 class="confirm-title" id="confirmDialogTitle"></h2>' +
        '<p class="confirm-msg"></p>' +
        '<div class="confirm-actions">' +
          '<button type="button" class="confirm-no">否</button>' +
          '<button type="button" class="confirm-yes">是</button>' +
        '</div></div>';

    overlay.querySelector('.confirm-title').textContent = title;
    overlay.querySelector('.confirm-msg').textContent = message;
    var yesBtn = overlay.querySelector('.confirm-yes');
    if (isDelete) yesBtn.classList.add('danger');

    function close(result) {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener('keydown', onKeydown);
      overlay.remove();
      resolve(result);
    }

    function onKeydown(e) {
      if (e.key === 'Escape') close(false);
    }

    yesBtn.onclick = function() { close(true); };
    overlay.querySelector('.confirm-no').onclick = function() { close(false); };
    overlay.addEventListener('click', function(e) { if (e.target === overlay) close(false); });
    overlay.querySelector('.confirm-box').addEventListener('click', function(e) { e.stopPropagation(); });

    document.addEventListener('keydown', onKeydown);
    document.body.appendChild(overlay);
    overlay.querySelector('.confirm-no').focus();
  });
}

function brandHtml() {
  return '随身图书角 <span class="brand-sign">yyx</span>';
}

if (!document.getElementById('brand-sign-style')) {
  var brandStyle = document.createElement('style');
  brandStyle.id = 'brand-sign-style';
  brandStyle.textContent =
    '.brand-sign{font-size:0.62em;font-weight:400;opacity:0.72;letter-spacing:0.12em;vertical-align:baseline;margin-left:0.15em;}';
  document.head.appendChild(brandStyle);
}
