// thankyou :)
//  𝑀𝑎𝑑𝒉𝑎𝑣 𝑛𝑎𝑟𝑎𝑦𝑎𝑛: 
// ★彡 RiFtVulture 彡★
// ✏ 𝑂𝑛 𝑟𝑜𝑎𝑑 𝑜𝑓 𝑔𝑒𝑒𝑘 𝑡𝑜 𝑑𝑒𝑣𝑒𝑙𝑜𝑝𝑒𝑟 
// ✏ 𝑎𝑙𝑤𝑎𝑦𝑠 𝑙𝑒𝑎𝑟𝑛𝑖𝑛𝑔
// ✏ ɯσɾƙιɳɠ σɳ Fυʅʅ ʂƚαƈƙ
// ✏  || Pɾσԃυƈƚ ɱαɾƙҽƚιɳɠ ||
// COntact For Make Projects

import {
    BufferGeometry,
    Color,
    DoubleSide,
    Face3,
    Geometry,
    InstancedBufferAttribute,
    InstancedMesh,
    MathUtils,
    MeshBasicMaterial,
    Object3D,
    PerspectiveCamera,
    Scene,
    TextureLoader,
    Vector2,
    Vector3,
    WebGLRenderer
}from 'https://unpkg.com/three@0.119.0/build/three.module.js';

  function App() {
    const conf = {
      size: 10,
      images: [
        { src: '../img/1.jpg' },
        { src: '../img/2.jpg' },
        { src: '../img/3.jpg' },
        { src: '../img/4.jpg' }
      ]
    };

let renderer, scene, camera, cameraCtrl;
  const screen = {
    width: 0, height: 0,
    wWidth: 0, wHeight: 0,
    ratio: 0
  };

  const loader = new TextureLoader();
  const textures = [];
  let planes, plane1, plane2;
  let progress = 0, targetProgress = 0;

  const mouse = new Vector2();

  init();

  function init() {
    renderer = new WebGLRenderer({ canvas: document.getElementById('canvas'), antialias: true });

    camera = new PerspectiveCamera(50);
    camera.position.z = 150;

    updateSize();
    window.addEventListener('resize', onResize);

    Promise.all(conf.images.map(loadTexture)).then(responses => {
      initScene();
      initListeners();

      gsap.fromTo(plane1.uProgress,
        {
          value: -2
        },
        {
          value: 0,
          duration: 2.5,
          ease: Power4.easeOut
        }
      );

      requestAnimationFrame(animate);
    });
  }

  function initScene() {
    scene = new Scene();
    scene.background = new Color(0);

    plane1 = new AnimatedPlane({
      renderer, screen,
      size: conf.size,
      anim: 1,
      texture: textures[0]
    });

    plane2 = new AnimatedPlane({
      renderer, screen,
      size: conf.size,
      anim: 2,
      texture: textures[1]
    });

    setPlanesProgress(0);

    planes = new Object3D();
    planes.add(plane1.o3d);
    planes.add(plane2.o3d);
    scene.add(planes);
  }

  function initListeners() {
    document.addEventListener('mousemove', e => {
      mouse.x = (e.clientX / screen.width) * 2 - 1;
      mouse.y = -(e.clientY / screen.height) * 2 + 1;
    });

    window.addEventListener('wheel', e => {
      e.preventDefault();
      if (e.deltaY > 0) {
        targetProgress = limit(targetProgress + 1 / 20, 0, conf.images.length - 1);
      } else {
        targetProgress = limit(targetProgress - 1 / 20, 0, conf.images.length - 1);
      }
    });

    document.addEventListener('click', e => {
      if (e.clientY < screen.height / 2) {
        navPrevious();
      } else {
        navNext();
      }
    });

    document.addEventListener('keyup', e => {
      if (e.keyCode === 37 || e.keyCode === 38) {
        navPrevious();
      } else if (e.keyCode === 39 || e.keyCode === 40) {
        navNext();
      }
    });
  }

  function navNext() {
    if (Number.isInteger(targetProgress)) targetProgress += 1;
    else targetProgress = Math.ceil(targetProgress);
    targetProgress = limit(targetProgress, 0, conf.images.length - 1);
  }

  function navPrevious() {
    if (Number.isInteger(targetProgress)) targetProgress -= 1;
    else targetProgress = Math.floor(targetProgress);
    targetProgress = limit(targetProgress, 0, conf.images.length - 1);
  }

  function updateProgress() {
    const progress1 = lerp(progress, targetProgress, 0.1);
    const pdiff = progress1 - progress;
    if (pdiff === 0) return;

    const p0 = progress % 1;
    const p1 = progress1 % 1;
    if ((pdiff > 0 && p1 < p0) || (pdiff < 0 && p0 < p1)) {
      const i = Math.floor(progress1);
      plane1.setTexture(textures[i]);
      plane2.setTexture(textures[i + 1]);
    }

    progress = progress1;
    setPlanesProgress(progress % 1);
  }

  function setPlanesProgress(progress) {
    plane1.uProgress.value = progress;
    plane2.uProgress.value = -1 + progress;
    plane1.material.opacity = 1 - progress;
    plane2.material.opacity = progress;
    plane1.o3d.position.z = progress;
    plane2.o3d.position.z = progress - 1;
  }

  function animate() {
    requestAnimationFrame(animate);

    updateProgress();

    const tiltX = lerp(planes.rotation.x, -mouse.y * 0.2, 0.1);
    const tiltY = lerp(planes.rotation.y, mouse.x * 0.2, 0.1);
    planes.rotation.set(tiltX, tiltY, 0);

    renderer.render(scene, camera);
  }

  let resizeTimeout;
  function onResize() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(updateSize, 200);
  }

  function updateSize() {
    screen.width = window.innerWidth;
    screen.height = window.innerHeight;
    screen.ratio = screen.width / screen.height;
    if (renderer && camera) {
      renderer.setSize(screen.width, screen.height);
      camera.aspect = screen.ratio;
      camera.updateProjectionMatrix();
      const wsize = getRendererSize();
      screen.wWidth = wsize[0]; screen.wHeight = wsize[1];
    }
    if (plane1) plane1.resize();
    if (plane2) plane2.resize();
  }

  function getRendererSize() {
    const vFOV = (camera.fov * Math.PI) / 180;
    const h = 2 * Math.tan(vFOV / 2) * Math.abs(camera.position.z);
    const w = h * camera.aspect;
    return [w, h];
  }

  function loadTexture(img, index) {
    return new Promise(resolve => {
      loader.load(
        img.src,
        texture => {
          textures[index] = texture;
          resolve(texture);
        }
      );
    });
  }
}

class AnimatedPlane {
  constructor(params) {
    for (const [key, value] of Object.entries(params)) {
      this[key] = value;
    }
    this.o3d = new Object3D();
    this.uProgress = { value: 0 };
    this.uvScale = new Vector2();

    this.initMaterial();
    this.initPlane();
  }

  initMaterial() {
    this.material = new MeshBasicMaterial({
      side: DoubleSide,
      transparent: true,
      map: this.texture,
      onBeforeCompile: shader => {
        shader.uniforms.progress = this.uProgress;
        shader.uniforms.uvScale = { value: this.uvScale };
        shader.vertexShader = `
          uniform float progress;
          uniform vec2 uvScale;

          attribute vec3 offset;
          attribute vec3 rotation;
          attribute vec2 uvOffset;

          mat3 rotationMatrixXYZ(vec3 r)
          {
            float cx = cos(r.x);
            float sx = sin(r.x);
            float cy = cos(r.y);
            float sy = sin(r.y);
            float cz = cos(r.z);
            float sz = sin(r.z);

            return mat3(
               cy * cz, cx * sz + sx * sy * cz, sx * sz - cx * sy * cz,
              -cy * sz, cx * cz - sx * sy * sz, sx * cz + cx * sy * sz,
                    sy,               -sx * cy,                cx * cy
            );
          }
        ` + shader.vertexShader;

        shader.vertexShader = shader.vertexShader.replace('#include <uv_vertex>', `
          #include <uv_vertex>
          vUv = vUv * uvScale + uvOffset;
        `);

        shader.vertexShader = shader.vertexShader.replace('#include <project_vertex>', `
          mat3 rotMat = rotationMatrixXYZ(progress * rotation);
          transformed = rotMat * transformed;

          vec4 mvPosition = vec4(transformed, 1.0);
          #ifdef USE_INSTANCING
            mvPosition = instanceMatrix * mvPosition;
          #endif

          mvPosition.xyz += progress * offset;

          mvPosition = modelViewMatrix * mvPosition;
          gl_Position = projectionMatrix * mvPosition;
        `);
      }
    });
  }
}