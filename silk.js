/* ============================================================
   silk.js — "Liquid Silk" WebGL background for the hero.
   Raw WebGL1, zero dependencies. Exposes window.createSilk(canvas, opts).

   - Domain-warped simplex fbm → anisotropic silk folds + thin specular ridges
   - 4 runtime colour uniforms (base, base2, mid-glow, highlight) → any theme
   - Pauses when offscreen / tab hidden, respects prefers-reduced-motion
   - Adaptive DPR (per-frame cost sampling, re-armed periodically)
   - Survives WebGL context loss/restore
   ============================================================ */
(function () {
  'use strict';

  var VERT = 'attribute vec2 a;void main(){gl_Position=vec4(a,0.,1.);}';

  function FRAG(OCT) {
    return [
      'precision highp float;',
      'uniform vec2 u_res;uniform float u_time;uniform vec2 u_mouse;',
      'uniform vec3 u_c0,u_c1,u_c2,u_c3;uniform float u_grain,u_intensity,u_scale,u_speed,u_glow,u_dark;',
      'vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}',
      'vec4 mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}',
      'vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}',
      'vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}',
      'float snoise(vec3 v){',
      '  const vec2 C=vec2(1.0/6.0,1.0/3.0);const vec4 D=vec4(0.0,0.5,1.0,2.0);',
      '  vec3 i=floor(v+dot(v,C.yyy));vec3 x0=v-i+dot(i,C.xxx);',
      '  vec3 g=step(x0.yzx,x0.xyz);vec3 l=1.0-g;vec3 i1=min(g.xyz,l.zxy);vec3 i2=max(g.xyz,l.zxy);',
      '  vec3 x1=x0-i1+C.xxx;vec3 x2=x0-i2+C.yyy;vec3 x3=x0-D.yyy;',
      '  i=mod289(i);',
      '  vec4 p=permute(permute(permute(i.z+vec4(0.0,i1.z,i2.z,1.0))+i.y+vec4(0.0,i1.y,i2.y,1.0))+i.x+vec4(0.0,i1.x,i2.x,1.0));',
      '  float n_=0.142857142857;vec3 ns=n_*D.wyz-D.xzx;',
      '  vec4 j=p-49.0*floor(p*ns.z*ns.z);vec4 x_=floor(j*ns.z);vec4 y_=floor(j-7.0*x_);',
      '  vec4 x=x_*ns.x+ns.yyyy;vec4 y=y_*ns.x+ns.yyyy;vec4 h=1.0-abs(x)-abs(y);',
      '  vec4 b0=vec4(x.xy,y.xy);vec4 b1=vec4(x.zw,y.zw);',
      '  vec4 s0=floor(b0)*2.0+1.0;vec4 s1=floor(b1)*2.0+1.0;vec4 sh=-step(h,vec4(0.0));',
      '  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;',
      '  vec3 p0=vec3(a0.xy,h.x);vec3 p1=vec3(a0.zw,h.y);vec3 p2=vec3(a1.xy,h.z);vec3 p3=vec3(a1.zw,h.w);',
      '  vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));',
      '  p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;',
      '  vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0);m=m*m;',
      '  return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));',
      '}',
      'float fbm(vec3 p){float v=0.0;float a=0.5;for(int i=0;i<' + OCT + ';i++){v+=a*snoise(p);p=p*2.03+vec3(1.7,9.2,3.1);a*=0.5;}return v;}',
      'float fbm2(vec3 p){float v=0.0;float a=0.5;for(int i=0;i<2;i++){v+=a*snoise(p);p=p*2.03+vec3(1.7,9.2,3.1);a*=0.5;}return v;}',
      'void main(){',
      '  vec2 p=(gl_FragCoord.xy-0.5*u_res)/min(u_res.x,u_res.y);',
      '  float t=u_time*u_speed;',
      '  vec2 m=(u_mouse-0.5)*0.25;',
      '  vec2 sp=p*vec2(0.55,1.15)*u_scale+m;',
      '  vec3 q=vec3(sp,t);',
      '  float n1=fbm2(q);',
      '  float n2=fbm(q*1.15+vec3(n1*1.4,n1*0.9,t*0.5)+vec3(5.2,1.3,2.7));',
      '  float silk=fbm2(vec3(sp*1.35+n2*1.6,t*1.1+4.0));',
      '  float ridge=pow(max(0.0,1.0-abs(silk)*1.6),6.0);',
      '  float glow=smoothstep(0.1,0.8,n2*0.5+0.5);',
      '  float g=smoothstep(-0.9,0.9,p.y*0.7+n1*0.6);',
      '  vec3 col=mix(u_c0,u_c1,g);',
      '  col=mix(col,u_c2,glow*u_glow);',
      '  col+=u_c3*ridge*u_intensity;',
      '  col+=u_c3*glow*glow*0.05;',
      '  float vig=1.0-smoothstep(0.35,1.25,length(p));',
      '  col*=mix(u_dark,1.0,vig);',
      '  float gr=fract(sin(dot(gl_FragCoord.xy+vec2(u_time*60.0),vec2(12.9898,78.233)))*43758.5453);',
      '  col+=(gr-0.5)*u_grain;',
      '  gl_FragColor=vec4(col,1.0);',
      '}'
    ].join('\n');
  }

  function hexToRgb(h) {
    h = String(h).replace('#', '').trim();
    if (h.length === 3) h = h.split('').map(function (c) { return c + c; }).join('');
    var n = parseInt(h, 16);
    return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
  }

  var isCoarse = typeof matchMedia === 'function' && matchMedia('(pointer: coarse)').matches;
  var prefersReduced = typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;

  window.createSilk = function (canvas, userOpts) {
    var opts = Object.assign({
      colors: ['#050507', '#0E0C12', '#2A2017', '#D9B87A'],
      grain: 0.045,
      intensity: 0.42,
      glow: 0.45,
      dark: 0.55,
      scale: 1.0,
      speed: 0.08,
      maxDPR: isCoarse ? 1 : 1.5,
      octaves: isCoarse ? 3 : 4,
      reducedMotion: prefersReduced,
      mouse: !isCoarse
    }, userOpts || {});

    var gl = canvas.getContext('webgl', { antialias: false, alpha: false, depth: false, stencil: false, powerPreference: 'high-performance', preserveDrawingBuffer: false })
      || canvas.getContext('experimental-webgl');
    if (!gl) return null;

    var U = {};
    var w = 0, h = 0;
    var cssW = 0, cssH = 0;

    function compile(type, src) {
      var s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) { console.warn('[silk]', gl.getShaderInfoLog(s)); return null; }
      return s;
    }

    /** (Re)build program, buffers and uniform locations — also used after context restore. */
    function setup() {
      var vs = compile(gl.VERTEX_SHADER, VERT), fs = compile(gl.FRAGMENT_SHADER, FRAG(opts.octaves));
      if (!vs || !fs) return false;
      var prog = gl.createProgram(); gl.attachShader(prog, vs); gl.attachShader(prog, fs); gl.linkProgram(prog);
      if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) { console.warn('[silk]', gl.getProgramInfoLog(prog)); return false; }
      gl.useProgram(prog);
      var buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
      var aLoc = gl.getAttribLocation(prog, 'a'); gl.enableVertexAttribArray(aLoc); gl.vertexAttribPointer(aLoc, 2, gl.FLOAT, false, 0, 0);
      ['u_res', 'u_time', 'u_mouse', 'u_c0', 'u_c1', 'u_c2', 'u_c3', 'u_grain', 'u_intensity', 'u_scale', 'u_speed', 'u_glow', 'u_dark']
        .forEach(function (n) { U[n] = gl.getUniformLocation(prog, n); });
      w = h = 0; // force viewport re-init
      pushStatic();
      return true;
    }

    var state = {
      running: false, raf: 0, t0: performance.now(),
      mouse: [0.5, 0.5], target: [0.5, 0.5], inView: true, pageVisible: !document.hidden,
      cur: opts.colors.map(hexToRgb), intensity: opts.intensity, lost: false,
      // adaptive quality sampling
      last: 0, sum: 0, n: 0, nextProbeAt: 0
    };

    function resize() {
      var dpr = Math.min(window.devicePixelRatio || 1, opts.maxDPR);
      var cw = cssW || canvas.clientWidth || window.innerWidth, ch = cssH || canvas.clientHeight || window.innerHeight;
      var nw = Math.max(1, Math.floor(cw * dpr)), nh = Math.max(1, Math.floor(ch * dpr));
      if (nw !== w || nh !== h) { w = nw; h = nh; canvas.width = w; canvas.height = h; gl.viewport(0, 0, w, h); }
    }
    function pushStatic() {
      gl.uniform1f(U.u_grain, opts.grain); gl.uniform1f(U.u_scale, opts.scale); gl.uniform1f(U.u_speed, opts.speed);
      gl.uniform1f(U.u_glow, opts.glow); gl.uniform1f(U.u_dark, opts.dark);
    }
    function shouldLoop() { return state.running && state.inView && state.pageVisible && !opts.reducedMotion && !state.lost; }

    /* Sample per-frame deltas (ignoring the first frame after any pause); every ~2 s of
       samples decide whether to step the DPR cap down. Re-arms every 10 s so a busy
       first window (font loading, preloader) cannot permanently downgrade the quality. */
    function probe(now) {
      if (opts.reducedMotion) return;
      if (state.last) {
        var dt = now - state.last;
        if (dt > 0 && dt < 100 && now >= state.nextProbeAt) { state.sum += dt; state.n++; }
      }
      state.last = now;
      if (state.sum >= 2000 && state.n >= 30) {
        var avg = state.sum / state.n;
        state.sum = 0; state.n = 0;
        state.nextProbeAt = now + 10000;
        if (avg > 22) {                      // slower than ~45 fps → step down one notch
          var next = opts.maxDPR > 1.25 ? 1.25 : opts.maxDPR > 1 ? 1 : 0.75;
          if (next < opts.maxDPR) { opts.maxDPR = next; w = h = 0; }
        }
      }
    }

    function draw(now) {
      state.raf = 0;
      if (state.lost) return;
      probe(now);
      resize();
      state.mouse[0] += (state.target[0] - state.mouse[0]) * 0.04;
      state.mouse[1] += (state.target[1] - state.mouse[1]) * 0.04;
      var t = opts.reducedMotion ? 12.0 : (now - state.t0) / 1000;
      gl.uniform2f(U.u_res, w, h);
      gl.uniform1f(U.u_time, t);
      gl.uniform2f(U.u_mouse, state.mouse[0], state.mouse[1]);
      var c = state.cur;
      gl.uniform3f(U.u_c0, c[0][0], c[0][1], c[0][2]); gl.uniform3f(U.u_c1, c[1][0], c[1][1], c[1][2]);
      gl.uniform3f(U.u_c2, c[2][0], c[2][1], c[2][2]); gl.uniform3f(U.u_c3, c[3][0], c[3][1], c[3][2]);
      gl.uniform1f(U.u_intensity, state.intensity);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      if (shouldLoop()) state.raf = requestAnimationFrame(draw);
    }
    function kick() { if (!state.raf && !state.lost) state.raf = requestAnimationFrame(draw); }
    function resetSampling() { state.last = 0; }

    if (!setup()) return null;

    var api = {
      start: function () { state.running = true; kick(); return api; },
      stop: function () { state.running = false; if (state.raf) cancelAnimationFrame(state.raf); state.raf = 0; return api; },
      setInView: function (v) { state.inView = !!v; resetSampling(); if (v) kick(); },
      /** Crossfade to a new 4-colour theme. */
      setColors: function (cols, duration) {
        var from = state.cur.map(function (c) { return c.slice(); }), to = cols.map(hexToRgb);
        duration = duration || 0;
        if (!duration || opts.reducedMotion) { state.cur = to; kick(); return; }
        var t0 = performance.now();
        (function step(now) {
          var k = Math.min(1, (now - t0) / duration), e = 1 - Math.pow(1 - k, 3);
          state.cur = from.map(function (c, i) { return c.map(function (v, j) { return v + (to[i][j] - v) * e; }); });
          if (k < 1) requestAnimationFrame(step); else kick();
        })(t0);
      },
      setIntensity: function (v) { state.intensity = v; kick(); },
      setParams: function (p) { Object.assign(opts, p); pushStatic(); kick(); },
      pointer: function (x, y) { state.target = [x, y]; },
      renderOnce: function () { kick(); },
      destroy: function () {
        api.stop();
        window.removeEventListener('pointermove', onMove);
        document.removeEventListener('visibilitychange', onVis);
        if (ro) ro.disconnect(); else window.removeEventListener('resize', kick);
        var ext = gl.getExtension('WEBGL_lose_context'); if (ext) ext.loseContext();
      }
    };

    function onMove(e) { api.pointer(e.clientX / window.innerWidth, 1 - e.clientY / window.innerHeight); }
    function onVis() { state.pageVisible = !document.hidden; resetSampling(); if (state.pageVisible) kick(); }
    if (opts.mouse) window.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('visibilitychange', onVis);
    var ro = null;
    if (typeof ResizeObserver === 'function') {
      ro = new ResizeObserver(function (entries) {
        var r = entries[0] && entries[0].contentRect;
        if (r) { cssW = r.width; cssH = r.height; }
        kick();
      });
      ro.observe(canvas);
    } else {
      window.addEventListener('resize', kick);
    }
    canvas.addEventListener('webglcontextlost', function (e) {
      e.preventDefault();
      state.lost = true;
      if (state.raf) cancelAnimationFrame(state.raf);
      state.raf = 0;
    });
    canvas.addEventListener('webglcontextrestored', function () {
      state.lost = false;
      resetSampling();
      if (setup()) kick();
    });
    return api;
  };
})();
