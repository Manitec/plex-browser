// Plex Observe Bookmarklet — decoded source
// Deploy target: https://plex-sable.vercel.app/api/observe
// Usage: drag observe.bookmarklet.txt to your bookmarks bar

(function () {
  var sel = window.getSelection().toString().trim();
  var body = document.body ? document.body.innerText.slice(0, 1500) : '';
  var payload = {
    url: location.href,
    title: document.title,
    selectedText: sel || undefined,
    pageText: sel ? undefined : body,
    source: 'bookmarklet',
    sessionId: 'joe',
  };
  fetch('https://plex-sable.vercel.app/api/observe', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
    .then(r => r.json())
    .then(d => {
      if (d.response) {
        var box = document.createElement('div');
        box.style.cssText = 'position:fixed;bottom:20px;right:20px;z-index:99999;max-width:340px;background:#0f1a1a;color:#a3e4d7;border:1px solid #2e6b62;border-radius:10px;padding:14px 16px;font:14px/1.5 system-ui;box-shadow:0 8px 32px rgba(0,0,0,.5)';
        box.innerHTML =
          '<div style="font-size:11px;color:#4fa18a;margin-bottom:6px;letter-spacing:.05em">PLEX</div>' +
          d.response +
          '<div style="margin-top:10px;text-align:right"><button onclick="this.closest(\'div\').remove()" style="background:none;border:none;color:#4fa18a;cursor:pointer;font-size:11px">dismiss</button></div>';
        document.body.appendChild(box);
        setTimeout(() => box.remove(), 15000);
      } else {
        alert('Plex: ' + (d.error || 'no response'));
      }
    })
    .catch(e => alert('Plex error: ' + e.message));
})();
