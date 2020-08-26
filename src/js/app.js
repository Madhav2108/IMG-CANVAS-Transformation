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
        { src: '' },
        { src: '' },
        { src: '' },
        { src: '' }
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

}