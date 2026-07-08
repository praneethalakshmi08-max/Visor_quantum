/* 3D Bloch Sphere Construction using Three.js */
function makeBlochScene(canvas) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
  camera.position.set(3.4, 2.4, 3.6);

  const controls = new THREE.OrbitControls(camera, canvas);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.enablePan = false;
  controls.minDistance = 2.6;
  controls.maxDistance = 7;

  // Sphere wireframe
  const sphereGeo = new THREE.SphereGeometry(1.5, 24, 18);
  const sphereMat = new THREE.MeshBasicMaterial({ color: 0x00f6ff, wireframe: true, transparent: true, opacity: 0.14 });
  scene.add(new THREE.Mesh(sphereGeo, sphereMat));

  // Equator + Meridian Rings
  function ring(color, rotX, rotY) {
    const geo = new THREE.RingGeometry(1.499, 1.502, 64);
    const mat = new THREE.MeshBasicMaterial({ color, side: THREE.DoubleSide, transparent: true, opacity: 0.5 });
    const m = new THREE.Mesh(geo, mat);
    m.rotation.x = rotX;
    m.rotation.y = rotY;
    scene.add(m);
  }
  ring(0x00f6ff, Math.PI / 2, 0);
  ring(0xb26bff, 0, Math.PI / 2);

  // Axes
  function axisLine(dir, color) {
    const points = [dir.clone().multiplyScalar(-1.8), dir.clone().multiplyScalar(1.8)];
    const geo = new THREE.BufferGeometry().setFromPoints(points);
    const mat = new THREE.LineDashedMaterial({ color, dashSize: 0.08, gapSize: 0.05 });
    const line = new THREE.Line(geo, mat);
    line.computeLineDistances();
    scene.add(line);
  }
  axisLine(new THREE.Vector3(1, 0, 0), 0xffb454); // X: Amber
  axisLine(new THREE.Vector3(0, 1, 0), 0x00f6ff); // Z: Cyan
  axisLine(new THREE.Vector3(0, 0, 1), 0xb26bff); // Y: Violet

  // State Vector Arrow
  const arrow = new THREE.ArrowHelper(
    new THREE.Vector3(0, 1, 0),
    new THREE.Vector3(0, 0, 0),
    1.5,
    0x00f6ff,
    0.22,
    0.12
  );
  scene.add(arrow);

  let targetDir = new THREE.Vector3(0, 1, 0);
  let currentDir = new THREE.Vector3(0, 1, 0);

  function setTargetFromBloch({ x, y, z }) {
    targetDir.set(x, z, y).normalize(); // Swap Y and Z for Three.js orientation
    if (targetDir.lengthSq() < 0.0001) targetDir = currentDir.clone();
  }

  function animate() {
    requestAnimationFrame(animate);
    currentDir.lerp(targetDir, 0.12).normalize();
    arrow.setDirection(currentDir);
    controls.update();
    resizeIfNeeded();
    renderer.render(scene, camera);
  }

  function resizeIfNeeded() {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    if (canvas.width !== w || canvas.height !== h) {
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    }
  }

  animate();
  return { setTargetFromBloch };
}
