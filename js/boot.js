/* Cargador de la app: usa los archivos descargados por la actualización (si existen)
   o los que vienen dentro del APK. Así la actualización no depende de ninguna
   función especial del WebView. */
(function () {
  var A = window.Android, over = false;
  var FILES = ['css/app.css', 'js/version.js', 'js/figure.js', 'js/data.js', 'js/config.js', 'js/app.js'];
  try { over = !!(A && A.hasOverride && A.hasOverride()); } catch (e) { }
  try { if (over) { var o = JSON.parse(A.readFile('version.json')); if (o.load && o.load.length) FILES = o.load; } } catch (e) { }
  window.__src = over ? 'ota' : 'apk';
  function get(p) { if (!over) return ''; try { return A.readFile(p) || ''; } catch (e) { return ''; } }
  function next(i) {
    if (i >= FILES.length) return;
    var p = FILES[i], txt = get(p), css = /\.css$/.test(p), el;
    if (css) {                       // el CSS del APK ya está enlazado en index.html; el descargado va encima
      if (txt) { el = document.createElement('style'); el.textContent = txt; document.head.appendChild(el); }
      next(i + 1);
    } else if (txt) {                // script descargado: se ejecuta en línea (mismo origen, mismos datos)
      el = document.createElement('script'); el.textContent = txt; document.body.appendChild(el); next(i + 1);
    } else {                         // script del APK
      el = document.createElement('script'); el.src = p;
      el.onload = el.onerror = function () { next(i + 1); };
      document.body.appendChild(el);
    }
  }
  next(0);
})();
