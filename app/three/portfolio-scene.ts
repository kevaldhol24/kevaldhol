import * as THREE from "three";

/**
 * The centrepiece: a noise-displaced iridescent core wrapped in a wireframe shell, three
 * orbital rings and a particle field. The page feeds it a continuous scroll position
 * (`section index + progress through it`) and it eases between per-section keyframes.
 */

export type SceneKeyframe = {
  /** Horizontal offset in viewport-widths (-0.5 … 0.5); ignored on narrow screens. */
  x: number;
  y: number;
  scale: number;
  distort: number;
  /** Ring spread: 1 = hugging the core, >1 = flung outward. */
  spread: number;
  /** Ring tilt in radians. */
  tilt: number;
  colorA: string;
  colorB: string;
};

const NOISE_GLSL = /* glsl */ `
vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
float snoise(vec3 v){
  const vec2 C=vec2(1.0/6.0,1.0/3.0);
  const vec4 D=vec4(0.0,0.5,1.0,2.0);
  vec3 i=floor(v+dot(v,C.yyy));
  vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz);
  vec3 l=1.0-g;
  vec3 i1=min(g.xyz,l.zxy);
  vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx;
  vec3 x2=x0-i2+C.yyy;
  vec3 x3=x0-D.yyy;
  i=mod289(i);
  vec4 p=permute(permute(permute(i.z+vec4(0.0,i1.z,i2.z,1.0))+i.y+vec4(0.0,i1.y,i2.y,1.0))+i.x+vec4(0.0,i1.x,i2.x,1.0));
  float n_=0.142857142857;
  vec3 ns=n_*D.wyz-D.xzx;
  vec4 j=p-49.0*floor(p*ns.z*ns.z);
  vec4 x_=floor(j*ns.z);
  vec4 y_=floor(j-7.0*x_);
  vec4 x=x_*ns.x+ns.yyyy;
  vec4 y=y_*ns.x+ns.yyyy;
  vec4 h=1.0-abs(x)-abs(y);
  vec4 b0=vec4(x.xy,y.xy);
  vec4 b1=vec4(x.zw,y.zw);
  vec4 s0=floor(b0)*2.0+1.0;
  vec4 s1=floor(b1)*2.0+1.0;
  vec4 sh=-step(h,vec4(0.0));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;
  vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x);
  vec3 p1=vec3(a0.zw,h.y);
  vec3 p2=vec3(a1.xy,h.z);
  vec3 p3=vec3(a1.zw,h.w);
  vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
  vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0);
  m=m*m;
  return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}
`;

const CORE_VERTEX = /* glsl */ `
uniform float uTime;
uniform float uDistort;
varying vec3 vNormal;
varying vec3 vView;
varying float vNoise;
${NOISE_GLSL}
void main(){
  float n = snoise(position * 1.6 + vec3(uTime * 0.22));
  float n2 = snoise(position * 3.4 - vec3(uTime * 0.15)) * 0.35;
  float d = (n + n2) * uDistort;
  vec3 displaced = position + normal * d;
  vNoise = n;
  vec4 mv = modelViewMatrix * vec4(displaced, 1.0);
  vView = normalize(-mv.xyz);
  vNormal = normalize(normalMatrix * normal);
  gl_Position = projectionMatrix * mv;
}
`;

const CORE_FRAGMENT = /* glsl */ `
uniform vec3 uColorA;
uniform vec3 uColorB;
uniform float uTime;
varying vec3 vNormal;
varying vec3 vView;
varying float vNoise;
void main(){
  float fresnel = pow(1.0 - max(dot(normalize(vNormal), normalize(vView)), 0.0), 2.4);
  float bands = 0.5 + 0.5 * sin(vNoise * 6.0 + uTime * 0.6);
  vec3 base = mix(uColorA, uColorB, bands);
  vec3 deep = base * 0.18;
  vec3 col = mix(deep, base, smoothstep(0.0, 1.0, fresnel * 1.4 + bands * 0.25));
  col += fresnel * mix(uColorB, vec3(1.0), 0.35) * 0.9;
  gl_FragColor = vec4(col, 1.0);
}
`;

const POINTS_VERTEX = /* glsl */ `
uniform float uTime;
uniform float uPixelRatio;
attribute float aScale;
varying float vAlpha;
void main(){
  vec3 p = position;
  p.y += sin(uTime * 0.3 + position.x * 2.0) * 0.06;
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_PointSize = aScale * uPixelRatio * (14.0 / -mv.z);
  vAlpha = smoothstep(14.0, 2.0, -mv.z);
  gl_Position = projectionMatrix * mv;
}
`;

const POINTS_FRAGMENT = /* glsl */ `
uniform vec3 uColor;
varying float vAlpha;
void main(){
  float d = length(gl_PointCoord - 0.5);
  float a = smoothstep(0.5, 0.0, d) * vAlpha * 0.75;
  gl_FragColor = vec4(uColor, a);
}
`;

type State = Omit<SceneKeyframe, "colorA" | "colorB"> & {
  colorA: THREE.Color;
  colorB: THREE.Color;
};

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const smooth = (t: number) => t * t * (3 - 2 * t);

export class PortfolioScene {
  private renderer: THREE.WebGLRenderer;
  private scene = new THREE.Scene();
  private camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
  private rig = new THREE.Group();
  private core: THREE.Mesh<THREE.IcosahedronGeometry, THREE.ShaderMaterial>;
  private shell: THREE.LineSegments<THREE.WireframeGeometry, THREE.LineBasicMaterial>;
  private rings: THREE.Mesh<THREE.TorusGeometry, THREE.MeshBasicMaterial>[] = [];
  private points: THREE.Points<THREE.BufferGeometry, THREE.ShaderMaterial>;
  private clock = new THREE.Clock();
  private frame = 0;
  private keyframes: SceneKeyframe[];
  private scrollPos = 0;
  private pointer = new THREE.Vector2();
  private pointerEased = new THREE.Vector2();
  private current: State;
  private width = 1;
  private height = 1;
  private reducedMotion: boolean;
  private introStart = performance.now();

  constructor(
    private canvas: HTMLCanvasElement,
    keyframes: SceneKeyframe[]
  ) {
    this.keyframes = keyframes;
    this.reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mobile = window.matchMedia("(max-width: 767px)").matches;

    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setClearColor(0x000000, 0);

    this.camera.position.set(0, 0, 9);
    this.scene.add(this.rig);

    const first = keyframes[0];
    this.current = {
      ...first,
      colorA: new THREE.Color(first.colorA),
      colorB: new THREE.Color(first.colorB),
    };

    // Core
    const coreMaterial = new THREE.ShaderMaterial({
      vertexShader: CORE_VERTEX,
      fragmentShader: CORE_FRAGMENT,
      uniforms: {
        uTime: { value: 0 },
        uDistort: { value: first.distort },
        uColorA: { value: this.current.colorA.clone() },
        uColorB: { value: this.current.colorB.clone() },
      },
    });
    this.core = new THREE.Mesh(new THREE.IcosahedronGeometry(1.25, mobile ? 28 : 56), coreMaterial);
    this.rig.add(this.core);

    // Wireframe shell
    this.shell = new THREE.LineSegments(
      new THREE.WireframeGeometry(new THREE.IcosahedronGeometry(1.75, 2)),
      new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.07 })
    );
    this.rig.add(this.shell);

    // Rings
    const ringRadii = [2.2, 2.65, 3.15];
    ringRadii.forEach((radius, i) => {
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(radius, 0.006 + i * 0.002, 8, 220),
        new THREE.MeshBasicMaterial({
          color: 0xffffff,
          transparent: true,
          opacity: 0.35 - i * 0.08,
        })
      );
      ring.rotation.x = Math.PI / 2;
      // A small satellite bead riding each ring.
      const bead = new THREE.Mesh(
        new THREE.SphereGeometry(0.045 + i * 0.01, 16, 16),
        new THREE.MeshBasicMaterial({ color: 0xffffff })
      );
      bead.position.x = radius;
      ring.add(bead);
      this.rings.push(ring);
      this.rig.add(ring);
    });

    // Particle field
    const count = mobile ? 700 : 1600;
    const positions = new Float32Array(count * 3);
    const scales = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const r = 3.5 + Math.random() * 6;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.7;
      positions[i * 3 + 2] = r * Math.cos(phi);
      scales[i] = 0.4 + Math.random() * 1.6;
    }
    const pointsGeometry = new THREE.BufferGeometry();
    pointsGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    pointsGeometry.setAttribute("aScale", new THREE.BufferAttribute(scales, 1));
    this.points = new THREE.Points(
      pointsGeometry,
      new THREE.ShaderMaterial({
        vertexShader: POINTS_VERTEX,
        fragmentShader: POINTS_FRAGMENT,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: {
          uTime: { value: 0 },
          uPixelRatio: { value: this.renderer.getPixelRatio() },
          uColor: { value: new THREE.Color(0xffffff) },
        },
      })
    );
    this.scene.add(this.points);

    this.resize();
    window.addEventListener("resize", this.resize);
    window.addEventListener("pointermove", this.onPointer, { passive: true });
    this.tick();
  }

  /** `pos` is `sectionIndex + progressWithinSection` (0 … keyframes.length - 1). */
  setScroll(pos: number) {
    this.scrollPos = Math.max(0, Math.min(this.keyframes.length - 1, pos));
  }

  dispose() {
    cancelAnimationFrame(this.frame);
    window.removeEventListener("resize", this.resize);
    window.removeEventListener("pointermove", this.onPointer);
    this.scene.traverse((obj) => {
      const mesh = obj as THREE.Mesh;
      mesh.geometry?.dispose();
      const material = mesh.material as THREE.Material | THREE.Material[] | undefined;
      if (Array.isArray(material)) material.forEach((m) => m.dispose());
      else material?.dispose();
    });
    this.renderer.dispose();
  }

  private onPointer = (e: PointerEvent) => {
    this.pointer.set(
      (e.clientX / window.innerWidth) * 2 - 1,
      (e.clientY / window.innerHeight) * 2 - 1
    );
  };

  private resize = () => {
    this.width = this.canvas.clientWidth || window.innerWidth;
    this.height = this.canvas.clientHeight || window.innerHeight;
    this.renderer.setSize(this.width, this.height, false);
    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();
  };

  private target(): State {
    const i = Math.floor(this.scrollPos);
    const a = this.keyframes[i];
    const b = this.keyframes[Math.min(i + 1, this.keyframes.length - 1)];
    const t = smooth(this.scrollPos - i);
    return {
      x: lerp(a.x, b.x, t),
      y: lerp(a.y, b.y, t),
      scale: lerp(a.scale, b.scale, t),
      distort: lerp(a.distort, b.distort, t),
      spread: lerp(a.spread, b.spread, t),
      tilt: lerp(a.tilt, b.tilt, t),
      colorA: new THREE.Color(a.colorA).lerp(new THREE.Color(b.colorA), t),
      colorB: new THREE.Color(a.colorB).lerp(new THREE.Color(b.colorB), t),
    };
  }

  private tick = () => {
    this.frame = requestAnimationFrame(this.tick);
    const dt = Math.min(this.clock.getDelta(), 0.05);
    const time = this.clock.elapsedTime;
    const speed = this.reducedMotion ? 0.15 : 1;
    const ease = 1 - Math.pow(0.0015, dt); // frame-rate independent damping

    const target = this.target();
    const c = this.current;
    c.x = lerp(c.x, target.x, ease);
    c.y = lerp(c.y, target.y, ease);
    c.scale = lerp(c.scale, target.scale, ease);
    c.distort = lerp(c.distort, target.distort, ease);
    c.spread = lerp(c.spread, target.spread, ease);
    c.tilt = lerp(c.tilt, target.tilt, ease);
    c.colorA.lerp(target.colorA, ease);
    c.colorB.lerp(target.colorB, ease);

    this.pointerEased.lerp(this.pointer, 1 - Math.pow(0.02, dt));

    // Intro: grow in from nothing over the first ~1.6s.
    const intro = smooth(Math.min((performance.now() - this.introStart) / 1600, 1));

    // Convert the x keyframe (viewport widths) into world units at the rig's depth.
    const visibleHeight = 2 * Math.tan(THREE.MathUtils.degToRad(this.camera.fov / 2)) * 9;
    const visibleWidth = visibleHeight * this.camera.aspect;
    const narrow = this.width < 768;
    const x = narrow ? 0 : c.x * visibleWidth;
    const fit = narrow ? 0.62 : Math.min(1, this.camera.aspect / 1.2);

    this.rig.position.set(
      x + this.pointerEased.x * 0.25,
      c.y * visibleHeight - this.pointerEased.y * 0.2,
      0
    );
    this.rig.scale.setScalar(c.scale * fit * intro);
    this.rig.rotation.y = this.pointerEased.x * 0.35 + this.scrollPos * 0.6;
    this.rig.rotation.x = this.pointerEased.y * 0.2;

    const u = this.core.material.uniforms;
    u.uTime.value = time * speed;
    u.uDistort.value = c.distort;
    (u.uColorA.value as THREE.Color).copy(c.colorA);
    (u.uColorB.value as THREE.Color).copy(c.colorB);
    this.core.rotation.y += dt * 0.18 * speed;
    this.core.rotation.z += dt * 0.05 * speed;

    this.shell.rotation.y -= dt * 0.08 * speed;
    this.shell.rotation.x += dt * 0.03 * speed;
    this.shell.scale.setScalar(1 + c.distort * 0.4);

    this.rings.forEach((ring, i) => {
      const dir = i % 2 === 0 ? 1 : -1;
      ring.scale.setScalar(1 + (c.spread - 1) * (0.6 + i * 0.35));
      ring.rotation.x = Math.PI / 2 + c.tilt * (i + 1) * 0.55 * dir;
      ring.rotation.y = c.tilt * 0.4 * (i - 1);
      ring.rotation.z += dt * (0.25 + i * 0.12) * dir * speed;
      (ring.material as THREE.MeshBasicMaterial).color
        .copy(i === 1 ? c.colorA : c.colorB)
        .lerp(new THREE.Color(0xffffff), 0.45);
    });

    const pu = this.points.material.uniforms;
    pu.uTime.value = time * speed;
    (pu.uColor.value as THREE.Color).copy(c.colorB).lerp(new THREE.Color(0xffffff), 0.6);
    this.points.rotation.y = time * 0.015 * speed + this.scrollPos * 0.35;
    this.points.rotation.x = this.scrollPos * 0.08;

    this.renderer.render(this.scene, this.camera);
  };
}
