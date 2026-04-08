import { useEffect, useRef } from 'react'
import './WebGLBackground.css'

/* ------------------------------------------------------------------ */
/*  Vertex shader — full-screen quad                                   */
/* ------------------------------------------------------------------ */
const VERT = `
attribute vec2 a_position;
void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`

/* ------------------------------------------------------------------ */
/*  Fragment shader                                                     */
/*  Cinematic dark noise + slow drifting red veins                      */
/* ------------------------------------------------------------------ */
const FRAG = `
precision highp float;

uniform vec2  u_resolution;
uniform float u_time;
uniform vec2  u_mouse;

// --- Hash & noise helpers ---
vec2 hash2(vec2 p) {
  p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
  return fract(sin(p) * 43758.5453);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);

  float a = dot(hash2(i),             f - vec2(0,0));
  float b = dot(hash2(i + vec2(1,0)), f - vec2(1,0));
  float c = dot(hash2(i + vec2(0,1)), f - vec2(0,1));
  float d = dot(hash2(i + vec2(1,1)), f - vec2(1,1));

  return 0.5 + 0.5 * mix(mix(a,b,u.x), mix(c,d,u.x), u.y);
}

float fbm(vec2 p) {
  float v = 0.0;
  float amp = 0.5;
  float freq = 1.0;
  for (int i = 0; i < 6; i++) {
    v += amp * noise(p * freq);
    freq *= 2.1;
    amp  *= 0.48;
  }
  return v;
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution;
  vec2 uv2 = uv * 2.0 - 1.0;
  uv2.x *= u_resolution.x / u_resolution.y;

  float t = u_time * 0.12;

  // Mouse parallax
  vec2 mouse = (u_mouse / u_resolution) * 2.0 - 1.0;
  uv2 += mouse * 0.06;

  // Base organic noise
  float n = fbm(uv2 * 1.8 + vec2(t, t * 0.6));
  float n2 = fbm(uv2 * 3.5 - vec2(t * 0.7, t * 1.1) + n * 0.6);

  // Visible smoke/texture layer
  float smoke = fbm(uv2 * 0.9 + vec2(t * 0.4, -t * 0.3));

  // Red vein factor — wider bands, stronger
  float vein = smoothstep(0.48, 0.56, n2);
  vein = pow(vein, 1.8);

  // Radial vignette
  float vignette = 1.0 - smoothstep(0.2, 1.2, length(uv2 * vec2(0.6, 0.9)));

  // Base colour: dark charcoal with visible smoke variation
  vec3 col = vec3(0.05, 0.03, 0.03) + smoke * vec3(0.08, 0.04, 0.04);

  // Inject glowing red veins
  vec3 red = vec3(1.0, 0.19, 0.19);
  col = mix(col, red, vein * 0.55 * vignette);

  // Subtle scanline texture
  float scanline = 0.97 + 0.03 * sin(gl_FragCoord.y * 3.14159 * 2.0 / 3.0);
  col *= scanline;

  // Vignette darkens edges
  col *= mix(0.5, 1.0, vignette);

  gl_FragColor = vec4(col, 1.0);
}
`

function compileShader(gl, type, src) {
  const shader = gl.createShader(type)
  gl.shaderSource(shader, src)
  gl.compileShader(shader)
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error('Shader error:', gl.getShaderInfoLog(shader))
    gl.deleteShader(shader)
    return null
  }
  return shader
}

export default function WebGLBackground() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const gl = canvas.getContext('webgl', { antialias: false, alpha: false })
    if (!gl) return

    // Compile
    const vert = compileShader(gl, gl.VERTEX_SHADER, VERT)
    const frag = compileShader(gl, gl.FRAGMENT_SHADER, FRAG)
    if (!vert || !frag) return

    const program = gl.createProgram()
    gl.attachShader(program, vert)
    gl.attachShader(program, frag)
    gl.linkProgram(program)
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Program link error:', gl.getProgramInfoLog(program))
      return
    }
    gl.useProgram(program)

    // Full-screen quad
    const buf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW
    )
    const posLoc = gl.getAttribLocation(program, 'a_position')
    gl.enableVertexAttribArray(posLoc)
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0)

    // Uniforms
    const uRes   = gl.getUniformLocation(program, 'u_resolution')
    const uTime  = gl.getUniformLocation(program, 'u_time')
    const uMouse = gl.getUniformLocation(program, 'u_mouse')

    let mouse = { x: 0, y: 0 }
    let raf = null
    let startTime = performance.now()

    const onMouse = (e) => {
      mouse.x = e.clientX
      mouse.y = canvas.height - e.clientY
    }
    window.addEventListener('mousemove', onMouse)

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width  = canvas.offsetWidth  * dpr
      canvas.height = canvas.offsetHeight * dpr
      gl.viewport(0, 0, canvas.width, canvas.height)
    }
    resize()
    window.addEventListener('resize', resize)

    const render = () => {
      const t = (performance.now() - startTime) / 1000
      gl.uniform2f(uRes, canvas.width, canvas.height)
      gl.uniform1f(uTime, t)
      gl.uniform2f(uMouse, mouse.x, mouse.y)
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
      raf = requestAnimationFrame(render)
    }
    render()

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('mousemove', onMouse)
      window.removeEventListener('resize', resize)
      gl.deleteProgram(program)
    }
  }, [])

  return <canvas className="webgl-bg" ref={canvasRef} />
}
