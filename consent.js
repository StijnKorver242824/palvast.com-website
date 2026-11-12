/* Consent notice. Stores the visitor's choice in localStorage (not a cookie).
 *
 * Today the site has no optional services, so the choice changes nothing yet.
 * To add an optional service later, add it to the page as:
 *   <script type="text/plain" data-consent="optional" src="..."></script>
 * It stays inactive until the visitor accepts. After "Reject optional" it never loads.
 *
 * A stored choice only counts for the version it was made under (consent_version in _config.yml).
 * Raise the version when optional services change: everyone is asked again, and nothing optional
 * runs until they choose. A "yes" given before a service existed is never reused for it.
 */
(function () {
  "use strict";
  var KEY = "palvast-consent";
  var banner = document.getElementById("consent-banner");
  if (!banner) { return; }
  var VERSION = banner.getAttribute("data-consent-version") || "1";

  function read() {
    try {
      var v = JSON.parse(localStorage.getItem(KEY));
      // A choice made under another version is ignored, so the visitor is asked again
      return v && String(v.v) === VERSION && (v.optional === "accepted" || v.optional === "rejected") ? v.optional : null;
    } catch (e) { return null; }
  }

  function write(choice) {
    try {
      localStorage.setItem(KEY, JSON.stringify({ v: VERSION, optional: choice, date: new Date().toISOString() }));
    } catch (e) { /* storage unavailable: the notice simply shows again next time */ }
  }

  function activateOptional() {
    var nodes = document.querySelectorAll('script[type="text/plain"][data-consent="optional"]');
    Array.prototype.forEach.call(nodes, function (old) {
      var s = document.createElement("script");
      Array.prototype.forEach.call(old.attributes, function (a) {
        if (a.name !== "type" && a.name !== "data-consent") { s.setAttribute(a.name, a.value); }
      });
      s.text = old.text;
      old.parentNode.replaceChild(s, old);
    });
  }

  function choose(choice) {
    var previous = read();
    write(choice);
    banner.hidden = true;
    if (choice === "accepted") { activateOptional(); }
    // Scripts that already ran cannot be unloaded, so reload after a change from accepted to rejected.
    if (choice === "rejected" && previous === "accepted") { window.location.reload(); }
  }

  var stored = read();
  if (stored === null) { banner.hidden = false; }
  if (stored === "accepted") { activateOptional(); }

  Array.prototype.forEach.call(banner.querySelectorAll("[data-consent-choice]"), function (b) {
    b.addEventListener("click", function () { choose(b.getAttribute("data-consent-choice")); });
  });

  // The footer link to change the choice only works with JavaScript, so it is shown only then.
  Array.prototype.forEach.call(document.querySelectorAll("[data-consent-settings]"), function (el) { el.hidden = false; });
  Array.prototype.forEach.call(document.querySelectorAll("[data-consent-open]"), function (b) {
    b.addEventListener("click", function () { banner.hidden = false; banner.focus(); });
  });
})();
