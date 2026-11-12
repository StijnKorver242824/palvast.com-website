/* Pixelated gradient for the hero and page headers (decoration only).
   The gradient is painted at one pixel per grid cell, then scaled up without smoothing,
   so every cell is a flat colour that lines up with the grid lines in style.css.
   Without JavaScript the CSS gradient fallback is shown instead. */
(function () {
  "use strict";
  var hosts = document.querySelectorAll(".pixel-bg");
  if (!hosts.length) { return; }

  function setup(host) {
    var canvas = document.createElement("canvas");
    canvas.className = "pixel-canvas";
    canvas.setAttribute("aria-hidden", "true");
    host.insertBefore(canvas, host.firstChild);
    var ctx = canvas.getContext("2d");
    if (!ctx) { canvas.remove(); return; }

    function cellSize() {
      var v = parseFloat(getComputedStyle(host).getPropertyValue("--cell"));
      return v || 44;
    }

    // Elliptical radial gradient defined in unit space (0..1)
    function layer(cx, cy, rx, ry, color, cols, rows) {
      ctx.save();
      ctx.scale(cols, rows);
      var g = ctx.createRadialGradient(cx, cy, 0, cx, cy, 1);
      g.addColorStop(0, color);
      g.addColorStop(1, color.replace(/[\d.]+\)$/, "0)"));
      ctx.translate(cx, cy);
      ctx.scale(rx, ry);
      ctx.translate(-cx, -cy);
      ctx.fillStyle = g;
      ctx.fillRect(-2, -2, 5, 5);
      ctx.restore();
    }

    function draw() {
      // A whole number of columns and rows; cells stretch slightly so they divide the block exactly
      var target = cellSize();
      var w = host.clientWidth;
      var h = host.clientHeight;
      if (!w || !h) { return; }
      var cols = Math.max(1, Math.round(w / target));
      var rows = Math.max(1, Math.round(h / target));
      host.style.setProperty("--cell-x", (w / cols) + "px");
      host.style.setProperty("--cell-y", (h / rows) + "px");
      canvas.width = cols;
      canvas.height = rows;
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";

      // Base: Night -> Forest Deep -> Forest -> Forest Mid
      var base = ctx.createLinearGradient(0, 0, cols, rows);
      base.addColorStop(0, "#0e1a12");
      base.addColorStop(0.38, "#1d3a26");
      base.addColorStop(0.65, "#2f5d3a");
      base.addColorStop(1, "#4a8559");
      ctx.fillStyle = base;
      ctx.fillRect(0, 0, cols, rows);

      // Colour blooms (brand tokens only)
      layer(0.0, 0.0, 0.55, 0.5, "rgba(14,26,18,1)", cols, rows);
      layer(0.62, 0.0, 0.45, 0.45, "rgba(74,133,89,1)", cols, rows);
      layer(0.35, 1.0, 0.6, 0.45, "rgba(47,93,58,1)", cols, rows);
      layer(1.0, 1.0, 0.45, 0.6, "rgba(169,201,139,1)", cols, rows);

      // Night scrim behind the copy and the bottom row
      var scrim = ctx.createLinearGradient(0, 0, cols * 0.6, 0);
      scrim.addColorStop(0, "rgba(14,26,18,0.55)");
      scrim.addColorStop(1, "rgba(14,26,18,0)");
      ctx.fillStyle = scrim;
      ctx.fillRect(0, 0, cols, rows);

      var floor = ctx.createLinearGradient(0, rows * 0.7, 0, rows);
      floor.addColorStop(0, "rgba(14,26,18,0)");
      floor.addColorStop(1, "rgba(14,26,18,0.4)");
      ctx.fillStyle = floor;
      ctx.fillRect(0, 0, cols * 0.7, rows);
    }

    draw();
    if ("ResizeObserver" in window) { new ResizeObserver(draw).observe(host); }
    else { window.addEventListener("resize", draw); }
  }

  Array.prototype.forEach.call(hosts, setup);
})();
