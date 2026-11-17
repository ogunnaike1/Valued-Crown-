"use client";

import { useRef } from "react";
import { useIsoLayoutEffect } from "@/lib/gsap";

/**
 * Liquid trail that follows the pointer: a small WebGL2 fluid simulation (velocity + pressure solve,
 * vorticity, advected dye) drawn as a thin ribbon of sky-blue liquid that drifts toward aqua with speed.
 * Small and short-lived: it dissolves within about a second, so it never lingers over content.
 * Fine pointers + WebGL2 only; skipped for reduced motion.
 */

const SIM_RES = 80;
const DYE_RES = 256;
const DENSITY_DISSIPATION = 3.6;
const VELOCITY_DISSIPATION = 1.4;
const PRESSURE = 0.8;
const PRESSURE_ITERATIONS = 7;
const CURL = 22;
const SPLAT_RADIUS = 0.00058;
const SKY = [0.36, 0.72, 1.0];
const AQUA = [0.38, 0.95, 0.84];
const SPLAT_FORCE = 3400;

const VERT = `
precision highp float;
attribute vec2 aPosition;
varying vec2 vUv, vL, vR, vT, vB;
uniform vec2 texelSize;
void main () {
  vUv = aPosition * 0.5 + 0.5;
  vL = vUv - vec2(texelSize.x, 0.0);
  vR = vUv + vec2(texelSize.x, 0.0);
  vT = vUv + vec2(0.0, texelSize.y);
  vB = vUv - vec2(0.0, texelSize.y);
  gl_Position = vec4(aPosition, 0.0, 1.0);
}`;
const HEAD = "precision highp float; precision highp sampler2D; varying vec2 vUv, vL, vR, vT, vB;\n";
const FRAG = {
  clear: HEAD + `uniform sampler2D uTexture; uniform float value;
    void main () { gl_FragColor = value * texture2D(uTexture, vUv); }`,
  splat: HEAD + `uniform sampler2D uTarget; uniform float aspectRatio; uniform vec3 color; uniform vec2 point; uniform float radius;
    void main () {
      vec2 p = vUv - point.xy; p.x *= aspectRatio;
      vec3 s = exp(-dot(p, p) / radius) * color;
      gl_FragColor = vec4(texture2D(uTarget, vUv).xyz + s, 1.0);
    }`,
  advection: HEAD + `uniform sampler2D uVelocity; uniform sampler2D uSource; uniform vec2 texelSize; uniform float dt; uniform float dissipation;
    void main () {
      vec2 coord = vUv - dt * texture2D(uVelocity, vUv).xy * texelSize;
      gl_FragColor = texture2D(uSource, coord) / (1.0 + dissipation * dt);
    }`,
  divergence: HEAD + `uniform sampler2D uVelocity;
    void main () {
      float L = texture2D(uVelocity, vL).x; float R = texture2D(uVelocity, vR).x;
      float T = texture2D(uVelocity, vT).y; float B = texture2D(uVelocity, vB).y;
      vec2 C = texture2D(uVelocity, vUv).xy;
      if (vL.x < 0.0) L = -C.x; if (vR.x > 1.0) R = -C.x;
      if (vT.y > 1.0) T = -C.y; if (vB.y < 0.0) B = -C.y;
      gl_FragColor = vec4(0.5 * (R - L + T - B), 0.0, 0.0, 1.0);
    }`,
  curl: HEAD + `uniform sampler2D uVelocity;
    void main () {
      float L = texture2D(uVelocity, vL).y; float R = texture2D(uVelocity, vR).y;
      float T = texture2D(uVelocity, vT).x; float B = texture2D(uVelocity, vB).x;
      gl_FragColor = vec4(0.5 * (R - L - T + B), 0.0, 0.0, 1.0);
    }`,
  vorticity: HEAD + `uniform sampler2D uVelocity; uniform sampler2D uCurl; uniform float curl; uniform float dt;
    void main () {
      float L = texture2D(uCurl, vL).x; float R = texture2D(uCurl, vR).x;
      float T = texture2D(uCurl, vT).x; float B = texture2D(uCurl, vB).x;
      float C = texture2D(uCurl, vUv).x;
      vec2 force = 0.5 * vec2(abs(T) - abs(B), abs(R) - abs(L));
      force /= length(force) + 0.0001; force *= curl * C; force.y *= -1.0;
      vec2 v = texture2D(uVelocity, vUv).xy + force * dt;
      gl_FragColor = vec4(min(max(v, -1000.0), 1000.0), 0.0, 1.0);
    }`,
  pressure: HEAD + `uniform sampler2D uPressure; uniform sampler2D uDivergence;
    void main () {
      float L = texture2D(uPressure, vL).x; float R = texture2D(uPressure, vR).x;
      float T = texture2D(uPressure, vT).x; float B = texture2D(uPressure, vB).x;
      float d = texture2D(uDivergence, vUv).x;
      gl_FragColor = vec4((L + R + B + T - d) * 0.25, 0.0, 0.0, 1.0);
    }`,
  gradient: HEAD + `uniform sampler2D uPressure; uniform sampler2D uVelocity;
    void main () {
      float L = texture2D(uPressure, vL).x; float R = texture2D(uPressure, vR).x;
      float T = texture2D(uPressure, vT).x; float B = texture2D(uPressure, vB).x;
      vec2 v = texture2D(uVelocity, vUv).xy - vec2(R - L, T - B);
      gl_FragColor = vec4(v, 0.0, 1.0);
    }`,
  // crisp liquid edge: density is thresholded into a shape; the dye keeps its colour (premultiplied)
  display: HEAD + `uniform sampler2D uTexture;
    void main () {
      vec3 c = texture2D(uTexture, vUv).rgb;
      float d = max(c.r, max(c.g, c.b));
      float a = smoothstep(0.1, 0.36, d) * 0.9;
      vec3 col = c / max(d, 0.0001);
      gl_FragColor = vec4(col * a, a);
    }`,
};

type FBO = { tex: WebGLTexture; fbo: WebGLFramebuffer; w: number; h: number; tx: number; ty: number; attach: (id: number) => number };
type DFBO = { read: FBO; write: FBO; swap: () => void };

export default function FluidCursor() {
  const ref = useRef<HTMLCanvasElement>(null);

  useIsoLayoutEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    if (!matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const gl = canvas.getContext("webgl2", { alpha: true, premultipliedAlpha: true, antialias: false, depth: false, stencil: false, preserveDrawingBuffer: false });
    if (!gl) return;
    // request both: some drivers only make 16-bit float targets renderable when each extension was asked for
    const extFloat = gl.getExtension("EXT_color_buffer_float");
    const extHalf = gl.getExtension("EXT_color_buffer_half_float");
    if (!extFloat && !extHalf) return;

    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) { console.warn("[fluid] shader", gl.getShaderInfoLog(s)); return null; }
      return s;
    };
    const vs = compile(gl.VERTEX_SHADER, VERT);
    if (!vs) return;
    type Prog = { p: WebGLProgram; u: Record<string, WebGLUniformLocation | null> };
    const programs: Record<string, Prog> = {};
    for (const [name, src] of Object.entries(FRAG)) {
      const fs = compile(gl.FRAGMENT_SHADER, src);
      if (!fs) return;
      const p = gl.createProgram()!;
      gl.attachShader(p, vs); gl.attachShader(p, fs);
      gl.bindAttribLocation(p, 0, "aPosition");
      gl.linkProgram(p);
      if (!gl.getProgramParameter(p, gl.LINK_STATUS)) { console.warn("[fluid] link", gl.getProgramInfoLog(p)); return; }
      const u: Prog["u"] = {};
      const n = gl.getProgramParameter(p, gl.ACTIVE_UNIFORMS);
      for (let i = 0; i < n; i++) { const nm = gl.getActiveUniform(p, i)!.name; u[nm] = gl.getUniformLocation(p, nm); }
      programs[name] = { p, u };
    }

    const quad = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, quad);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    const blit = (target: FBO | null) => {
      if (target) { gl.bindFramebuffer(gl.FRAMEBUFFER, target.fbo); gl.viewport(0, 0, target.w, target.h); }
      else { gl.bindFramebuffer(gl.FRAMEBUFFER, null); gl.viewport(0, 0, canvas.width, canvas.height); }
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };

    const makeFBO = (w: number, h: number): FBO => {
      gl.activeTexture(gl.TEXTURE0);
      const tex = gl.createTexture()!;
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA16F, w, h, 0, gl.RGBA, gl.HALF_FLOAT, null);
      const fbo = gl.createFramebuffer()!;
      gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
      gl.viewport(0, 0, w, h);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      return { tex, fbo, w, h, tx: 1 / w, ty: 1 / h, attach: (id: number) => { gl.activeTexture(gl.TEXTURE0 + id); gl.bindTexture(gl.TEXTURE_2D, tex); return id; } };
    };
    const makeDouble = (w: number, h: number): DFBO => {
      let a = makeFBO(w, h), b = makeFBO(w, h);
      return { get read() { return a; }, get write() { return b; }, swap() { const t = a; a = b; b = t; } };
    };
    const resolution = (res: number) => {
      let aspect = gl.drawingBufferWidth / gl.drawingBufferHeight;
      if (aspect < 1) aspect = 1 / aspect;
      const min = Math.round(res), max = Math.round(res * aspect);
      return gl.drawingBufferWidth > gl.drawingBufferHeight ? { w: max, h: min } : { w: min, h: max };
    };

    let velocity!: DFBO, dye!: DFBO, divergence!: FBO, curl!: FBO, pressure!: DFBO;
    const init = () => {
      const dpr = 1; // the liquid is soft, so a 1x canvas looks the same and costs far less on retina screens
      canvas.width = Math.floor(innerWidth * dpr);
      canvas.height = Math.floor(innerHeight * dpr);
      const sim = resolution(SIM_RES), dr = resolution(DYE_RES);
      velocity = makeDouble(sim.w, sim.h);
      dye = makeDouble(dr.w, dr.h);
      divergence = makeFBO(sim.w, sim.h);
      curl = makeFBO(sim.w, sim.h);
      pressure = makeDouble(sim.w, sim.h);
    };
    init();
    const complete = (f: FBO) => { gl.bindFramebuffer(gl.FRAMEBUFFER, f.fbo); return gl.checkFramebufferStatus(gl.FRAMEBUFFER) === gl.FRAMEBUFFER_COMPLETE; };
    if (![velocity.read, velocity.write, dye.read, dye.write, divergence, curl, pressure.read].every(complete)) {
      gl.getExtension("WEBGL_lose_context")?.loseContext(); // unsupported target format: do nothing, page stays untouched
      return;
    }
    canvas.style.visibility = "visible";

    const use = (name: string) => { gl.useProgram(programs[name].p); return programs[name].u; };

    const splat = (x: number, y: number, dx: number, dy: number, strength: number, mixT: number) => {
      let u = use("splat");
      gl.uniform1i(u.uTarget, velocity.read.attach(0));
      gl.uniform1f(u.aspectRatio, canvas.width / canvas.height);
      gl.uniform2f(u.point, x, y);
      gl.uniform3f(u.color, dx, dy, 0);
      gl.uniform1f(u.radius, canvas.width / canvas.height > 1 ? SPLAT_RADIUS * (canvas.width / canvas.height) : SPLAT_RADIUS);
      blit(velocity.write); velocity.swap();
      u = use("splat");
      gl.uniform1i(u.uTarget, dye.read.attach(0));
      // sky blue that drifts toward aqua the faster the pointer moves
      gl.uniform3f(u.color, (SKY[0] + (AQUA[0] - SKY[0]) * mixT) * strength, (SKY[1] + (AQUA[1] - SKY[1]) * mixT) * strength, (SKY[2] + (AQUA[2] - SKY[2]) * mixT) * strength);
      blit(dye.write); dye.swap();
    };

    const step = (dt: number) => {
      gl.disable(gl.BLEND);
      let u = use("curl");
      gl.uniform2f(u.texelSize, velocity.read.tx, velocity.read.ty);
      gl.uniform1i(u.uVelocity, velocity.read.attach(0));
      blit(curl);

      u = use("vorticity");
      gl.uniform2f(u.texelSize, velocity.read.tx, velocity.read.ty);
      gl.uniform1i(u.uVelocity, velocity.read.attach(0));
      gl.uniform1i(u.uCurl, curl.attach(1));
      gl.uniform1f(u.curl, CURL); gl.uniform1f(u.dt, dt);
      blit(velocity.write); velocity.swap();

      u = use("divergence");
      gl.uniform2f(u.texelSize, velocity.read.tx, velocity.read.ty);
      gl.uniform1i(u.uVelocity, velocity.read.attach(0));
      blit(divergence);

      u = use("clear");
      gl.uniform1i(u.uTexture, pressure.read.attach(0));
      gl.uniform1f(u.value, PRESSURE);
      blit(pressure.write); pressure.swap();

      u = use("pressure");
      gl.uniform2f(u.texelSize, velocity.read.tx, velocity.read.ty);
      gl.uniform1i(u.uDivergence, divergence.attach(0));
      for (let i = 0; i < PRESSURE_ITERATIONS; i++) {
        gl.uniform1i(u.uPressure, pressure.read.attach(1));
        blit(pressure.write); pressure.swap();
      }

      u = use("gradient");
      gl.uniform2f(u.texelSize, velocity.read.tx, velocity.read.ty);
      gl.uniform1i(u.uPressure, pressure.read.attach(0));
      gl.uniform1i(u.uVelocity, velocity.read.attach(1));
      blit(velocity.write); velocity.swap();

      u = use("advection");
      gl.uniform2f(u.texelSize, velocity.read.tx, velocity.read.ty);
      gl.uniform1i(u.uVelocity, velocity.read.attach(0));
      gl.uniform1i(u.uSource, velocity.read.attach(0));
      gl.uniform1f(u.dt, dt); gl.uniform1f(u.dissipation, VELOCITY_DISSIPATION);
      blit(velocity.write); velocity.swap();

      gl.uniform2f(u.texelSize, dye.read.tx, dye.read.ty);
      gl.uniform1i(u.uVelocity, velocity.read.attach(0));
      gl.uniform1i(u.uSource, dye.read.attach(1));
      gl.uniform1f(u.dissipation, DENSITY_DISSIPATION);
      blit(dye.write); dye.swap();
    };

    const render = () => {
      gl.disable(gl.BLEND);
      const u = use("display");
      gl.uniform1i(u.uTexture, dye.read.attach(0));
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      blit(null);
    };

    // pointer input: moves are accumulated and applied once per animation frame, so a fast mouse (events can fire
    // faster than the screen refreshes) never queues up more GPU work than one frame can draw
    let lx = -1, ly = -1, lastActive = 0, raf = 0, last = performance.now(), running = false;
    let px = 0, py = 0, pdx = 0, pdy = 0, pending = false;
    const onMove = (e: PointerEvent) => {
      const x = e.clientX / innerWidth, y = 1 - e.clientY / innerHeight;
      if (lx < 0) { lx = x; ly = y; }
      pdx += x - lx; pdy += y - ly;
      lx = x; ly = y; px = x; py = y;
      pending = true;
      if (!running) { running = true; last = performance.now(); lastActive = last; raf = requestAnimationFrame(loop); }
    };
    const applyPending = (t: number) => {
      pending = false;
      const aspect = canvas.width / canvas.height;
      let dx = pdx, dy = pdy;
      pdx = 0; pdy = 0;
      if (aspect < 1) dx *= aspect; else dy /= aspect;
      const speed = Math.hypot(dx, dy);
      if (speed < 0.00005) return;
      splat(px, py, dx * SPLAT_FORCE, dy * SPLAT_FORCE, Math.min(0.14 + speed * 30, 0.62), Math.min(speed * 60, 1));
      lastActive = t;
    };
    // Speed limiter: if frames keep taking too long, first simulate every other frame, then switch the trail off
    // for good, so a slow machine never ends up with a stuttering pointer.
    let avg = 16.7, level = 0, slowRun = 0, frame = 0, dead = false;
    const loop = (t: number) => {
      const ms = t - last;
      const dt = Math.min(ms / 1000, 1 / 30);
      last = t;
      if (ms < 250) { // ignore tab-switch gaps
        avg += (ms - avg) * 0.1;
        slowRun = avg > (level === 0 ? 24 : 30) ? slowRun + 1 : 0;
        if (slowRun > 40) {
          slowRun = 0; avg = 16.7; level++;
          if (level >= 2) { // still too slow even at half rate: stop for good
            dead = true; running = false;
            window.removeEventListener("pointermove", onMove);
            gl.bindFramebuffer(gl.FRAMEBUFFER, null); gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT);
            return;
          }
        }
      }
      if (pending) applyPending(t);
      if (level === 0 || (++frame & 1) === 0) { step(dt * (level === 0 ? 1 : 2)); render(); }
      if (!dead && t - lastActive > 1800) { // fully dissolved: stop until the pointer moves again
        running = false;
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT);
        return;
      }
      raf = requestAnimationFrame(loop);
    };
    const onResize = () => { init(); };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("resize", onResize);
      // the context is deliberately not destroyed here: React Strict Mode re-runs this effect on the same canvas
    };
  }, []);

  return <canvas ref={ref} aria-hidden="true" className="fixed inset-0 w-screen h-screen z-[480] pointer-events-none" style={{ visibility: "hidden" }} />;
}
