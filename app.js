(function () {
  const canvas = document.getElementById('canvas');
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xb4e4f7);

  const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 1000);
  camera.position.set(0, 0.8, 2.2);
  camera.lookAt(0, 0.4, 0);

  function updateCameraForViewport() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const aspect = w / h;
    const isPortrait = aspect < 1;
    if (isPortrait) {
      camera.fov = 58;
      camera.position.set(0, 0.45, 3.4);
      camera.lookAt(0, 0.25, 0);
    } else {
      camera.fov = 50;
      camera.position.set(0, 0.8, 2.2);
      camera.lookAt(0, 0.4, 0);
    }
    camera.updateProjectionMatrix();
  }

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  resize();

  const ambient = new THREE.AmbientLight(0xffffff, 0.85);
  scene.add(ambient);
  const dir = new THREE.DirectionalLight(0xffffff, 0.8);
  dir.position.set(2, 4, 3);
  dir.castShadow = true;
  dir.shadow.mapSize.width = 512;
  dir.shadow.mapSize.height = 512;
  scene.add(dir);
  const fill = new THREE.DirectionalLight(0xffeedd, 0.4);
  fill.position.set(-1, 1, 2);
  scene.add(fill);

  // —— Sfondo natura in stile cartone animato ——
  var skyCanvas = document.createElement('canvas');
  skyCanvas.width = 1;
  skyCanvas.height = 256;
  var ctx = skyCanvas.getContext('2d');
  var grd = ctx.createLinearGradient(0, 0, 0, 256);
  grd.addColorStop(0, '#87CEEB');
  grd.addColorStop(0.5, '#B4E4F7');
  grd.addColorStop(1, '#E8F5E0');
  ctx.fillStyle = grd;
  ctx.fillRect(0, 0, 1, 256);
  var skyTex = new THREE.CanvasTexture(skyCanvas);
  skyTex.needsUpdate = true;
  var skyGeo = new THREE.SphereGeometry(80, 24, 24, 0, Math.PI * 2, 0, Math.PI * 0.5);
  var skyMat = new THREE.MeshBasicMaterial({
    map: skyTex,
    side: THREE.BackSide,
    depthWrite: false,
    depthTest: true
  });
  var sky = new THREE.Mesh(skyGeo, skyMat);
  sky.position.y = 30;
  sky.renderOrder = -1;
  scene.add(sky);

  // Colline morbide (stile cartone) – dietro la camera (z negativo lontano)
  var hillMat1 = new THREE.MeshStandardMaterial({ color: 0x8bc96a, roughness: 0.95, metalness: 0 });
  var hillMat2 = new THREE.MeshStandardMaterial({ color: 0x7ab86a, roughness: 0.95, metalness: 0 });
  var hillMat3 = new THREE.MeshStandardMaterial({ color: 0x9bd87a, roughness: 0.95, metalness: 0 });
  var hillGeo = new THREE.SphereGeometry(8, 24, 16, 0, Math.PI * 2, 0, Math.PI * 0.45);
  var hill1 = new THREE.Mesh(hillGeo, hillMat1);
  hill1.position.set(-5, -2, -18);
  hill1.scale.set(1.2, 0.6, 1);
  scene.add(hill1);
  var hill2 = new THREE.Mesh(hillGeo, hillMat2);
  hill2.position.set(6, -2.2, -16);
  hill2.scale.set(1, 0.5, 0.9);
  scene.add(hill2);
  var hill3 = new THREE.Mesh(hillGeo, hillMat3);
  hill3.position.set(0, -2.5, -22);
  hill3.scale.set(1.5, 0.55, 1.2);
  scene.add(hill3);

  // Alberi – dietro il pupazzo (z negativo)
  var trunkMat = new THREE.MeshStandardMaterial({ color: 0x8b6914, roughness: 0.9 });
  var leafMat = new THREE.MeshStandardMaterial({ color: 0x2d5a27, roughness: 0.9 });
  var trunkGeo = new THREE.CylinderGeometry(0.15, 0.22, 0.8, 8);
  var leafGeo = new THREE.SphereGeometry(0.6, 12, 12);
  var tree1 = new THREE.Group();
  tree1.position.set(-2.2, 0.1, -4);
  var t1 = new THREE.Mesh(trunkGeo, trunkMat);
  t1.position.y = 0.4;
  tree1.add(t1);
  var leaf1 = new THREE.Mesh(leafGeo, leafMat);
  leaf1.position.y = 0.95;
  tree1.add(leaf1);
  scene.add(tree1);
  var tree2 = new THREE.Group();
  tree2.position.set(2.4, 0.05, -4.2);
  tree2.scale.setScalar(0.85);
  var t2 = new THREE.Mesh(trunkGeo, trunkMat);
  t2.position.y = 0.4;
  tree2.add(t2);
  var leaf2 = new THREE.Mesh(leafGeo, leafMat);
  leaf2.position.y = 0.95;
  tree2.add(leaf2);
  scene.add(tree2);

  // Prato (piano sotto)
  var grassMat = new THREE.MeshStandardMaterial({ color: 0x6ab84a, roughness: 0.95, metalness: 0 });

  // Materiali – stile Bing (coniglietto nero, body rosso)
  const blackFur = new THREE.MeshStandardMaterial({ color: 0x1e1e1e, roughness: 0.95, metalness: 0 });
  const bodyMat = new THREE.MeshStandardMaterial({ color: 0xb71c1c, roughness: 0.9, metalness: 0.05 });
  const earMat = new THREE.MeshStandardMaterial({ color: 0x1e1e1e, roughness: 0.95, metalness: 0 });
  const eyeWhite = new THREE.MeshStandardMaterial({ color: 0xfafafa, roughness: 0.7 });
  const eyePupil = new THREE.MeshStandardMaterial({ color: 0x1a1a1a });
  const noseMat = new THREE.MeshStandardMaterial({ color: 0xe57373, roughness: 0.9 });
  const buttonMat = new THREE.MeshStandardMaterial({ color: 0xffeb3b, roughness: 0.6, metalness: 0.1 });

  // Bing – coniglietto nero (stile serie animata)
  const puppet = new THREE.Group();
  puppet.position.set(0, 0.35, 0);

  // Testa nera rotonda
  const headGeo = new THREE.SphereGeometry(0.26, 32, 32);
  const head = new THREE.Mesh(headGeo, blackFur);
  head.position.y = 0.48;
  head.scale.y = 1.08;
  head.scale.x = 0.98;
  head.castShadow = true;
  puppet.add(head);

  // Orecchie lunghe nere
  const earGeo = new THREE.CylinderGeometry(0.055, 0.11, 0.42, 16);
  const earL = new THREE.Mesh(earGeo, earMat);
  earL.position.set(-0.14, 0.78, 0);
  earL.rotation.z = 0.15;
  earL.castShadow = true;
  puppet.add(earL);
  const earR = new THREE.Mesh(earGeo, earMat);
  earR.position.set(0.14, 0.78, 0);
  earR.rotation.z = -0.15;
  earR.castShadow = true;
  puppet.add(earR);

  // Occhi
  const eyeGeo = new THREE.SphereGeometry(0.055, 16, 16);
  const leftEye = new THREE.Mesh(eyeGeo, eyeWhite);
  leftEye.position.set(-0.09, 0.52, 0.2);
  puppet.add(leftEye);
  const rightEye = new THREE.Mesh(eyeGeo, eyeWhite);
  rightEye.position.set(0.09, 0.52, 0.2);
  puppet.add(rightEye);
  const pupilGeo = new THREE.SphereGeometry(0.028, 12, 12);
  const leftPupil = new THREE.Mesh(pupilGeo, eyePupil);
  leftPupil.position.set(-0.09, 0.52, 0.255);
  puppet.add(leftPupil);
  const rightPupil = new THREE.Mesh(pupilGeo, eyePupil);
  rightPupil.position.set(0.09, 0.52, 0.255);
  puppet.add(rightPupil);

  // Muso / naso (piccola sfera)
  const noseGeo = new THREE.SphereGeometry(0.045, 16, 16);
  const nose = new THREE.Mesh(noseGeo, noseMat);
  nose.position.set(0, 0.44, 0.24);
  puppet.add(nose);

  // Corpo (tuta rossa tipo onesie Bing)
  const bodyGeo = new THREE.SphereGeometry(0.3, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.55);
  const body = new THREE.Mesh(bodyGeo, bodyMat);
  body.position.y = 0.08;
  body.castShadow = true;
  puppet.add(body);

  // Bottone grande al centro (stile Bing)
  const buttonGeo = new THREE.SphereGeometry(0.055, 16, 16);
  const button = new THREE.Mesh(buttonGeo, buttonMat);
  button.position.set(0, 0.12, 0.28);
  puppet.add(button);

  const armGeo = new THREE.SphereGeometry(0.07, 16, 16);
  const armL = new THREE.Mesh(armGeo, blackFur);
  armL.position.set(-0.26, 0.32, 0.06);
  puppet.add(armL);
  const armR = new THREE.Mesh(armGeo, blackFur);
  armR.position.set(0.26, 0.32, 0.06);
  puppet.add(armR);

  const legGeo = new THREE.SphereGeometry(0.09, 20, 20, 0, Math.PI * 2, 0, Math.PI * 0.5);
  const legL = new THREE.Mesh(legGeo, bodyMat);
  legL.position.set(-0.11, -0.1, 0.04);
  puppet.add(legL);
  const legR = new THREE.Mesh(legGeo, bodyMat);
  legR.position.set(0.11, -0.1, 0.04);
  puppet.add(legR);

  scene.add(puppet);

  // —— Cagnolino al guinzaglio (stylized, animato) ——
  const dogBodyMat = new THREE.MeshStandardMaterial({ color: 0x8d6e63, roughness: 0.9, metalness: 0 });
  const dogNoseMat = new THREE.MeshStandardMaterial({ color: 0x2d2d2d, roughness: 0.8 });
  const dogEyeMat = new THREE.MeshStandardMaterial({ color: 0x1a1a1a });
  const leashMat = new THREE.MeshStandardMaterial({ color: 0x795548, roughness: 0.95 });

  const dog = new THREE.Group();
  dog.position.set(0.5, 0.18, 0.12);
  dog.rotation.y = -0.2;

  const dogBodyGeo = new THREE.SphereGeometry(0.12, 16, 16);
  const dogBody = new THREE.Mesh(dogBodyGeo, dogBodyMat);
  dogBody.position.y = 0.02;
  dogBody.castShadow = true;
  dog.add(dogBody);

  const dogHeadGeo = new THREE.SphereGeometry(0.08, 12, 12);
  const dogHead = new THREE.Mesh(dogHeadGeo, dogBodyMat);
  dogHead.position.set(0, 0.14, 0.1);
  dogHead.castShadow = true;
  dog.add(dogHead);

  const dogNoseGeo = new THREE.SphereGeometry(0.025, 8, 8);
  const dogNose = new THREE.Mesh(dogNoseGeo, dogNoseMat);
  dogNose.position.set(0, 0.14, 0.165);
  dog.add(dogNose);

  const dogEyeGeo = new THREE.SphereGeometry(0.015, 8, 8);
  const dogEyeL = new THREE.Mesh(dogEyeGeo, dogEyeMat);
  dogEyeL.position.set(-0.025, 0.16, 0.14);
  dog.add(dogEyeL);
  const dogEyeR = new THREE.Mesh(dogEyeGeo, dogEyeMat);
  dogEyeR.position.set(0.025, 0.16, 0.14);
  dog.add(dogEyeR);

  const dogEarGeo = new THREE.SphereGeometry(0.04, 8, 8, 0, Math.PI * 2, 0, Math.PI * 0.5);
  const dogEarL = new THREE.Mesh(dogEarGeo, dogBodyMat);
  dogEarL.position.set(-0.055, 0.2, 0.08);
  dogEarL.rotation.z = 0.3;
  dog.add(dogEarL);
  const dogEarR = new THREE.Mesh(dogEarGeo, dogBodyMat);
  dogEarR.position.set(0.055, 0.2, 0.08);
  dogEarR.rotation.z = -0.3;
  dog.add(dogEarR);

  const dogTailGeo = new THREE.CylinderGeometry(0.015, 0.03, 0.12, 6);
  const dogTail = new THREE.Mesh(dogTailGeo, dogBodyMat);
  dogTail.position.set(0, 0.02, -0.14);
  dogTail.rotation.x = 0.4;
  dog.add(dogTail);

  const dogLegGeo = new THREE.CylinderGeometry(0.02, 0.022, 0.08, 6);
  const dogLegFL = new THREE.Mesh(dogLegGeo, dogBodyMat);
  dogLegFL.position.set(-0.06, -0.06, 0.08);
  dog.add(dogLegFL);
  const dogLegFR = new THREE.Mesh(dogLegGeo, dogBodyMat);
  dogLegFR.position.set(0.06, -0.06, 0.08);
  dog.add(dogLegFR);
  const dogLegBL = new THREE.Mesh(dogLegGeo, dogBodyMat);
  dogLegBL.position.set(-0.06, -0.06, -0.08);
  dog.add(dogLegBL);
  const dogLegBR = new THREE.Mesh(dogLegGeo, dogBodyMat);
  dogLegBR.position.set(0.06, -0.06, -0.08);
  dog.add(dogLegBR);

  scene.add(dog);

  // Guinzaglio (cilindro tra mano di Bing e collare del cane)
  const leashGeo = new THREE.CylinderGeometry(0.008, 0.008, 0.5, 6);
  const leash = new THREE.Mesh(leashGeo, leashMat);
  leash.visible = true;
  scene.add(leash);

  var floorGeo = new THREE.PlaneGeometry(20, 20);
  var floor = new THREE.Mesh(floorGeo, grassMat);
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  scene.add(floor);

  // —— Ambiente stile serie: casetta e recinto ——
  const houseMat = new THREE.MeshStandardMaterial({ color: 0xf5deb3, roughness: 0.9 });
  const roofMat = new THREE.MeshStandardMaterial({ color: 0x8b4513, roughness: 0.85 });
  const fenceMat = new THREE.MeshStandardMaterial({ color: 0xdeb887, roughness: 0.9 });
  const houseBase = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.9, 0.8), houseMat);
  houseBase.position.set(-1.8, 0.55, -3.5);
  houseBase.castShadow = true;
  scene.add(houseBase);
  const roofGeo = new THREE.ConeGeometry(0.85, 0.5, 4);
  const roof = new THREE.Mesh(roofGeo, roofMat);
  roof.position.set(-1.8, 1.15, -3.5);
  roof.rotation.y = Math.PI / 4;
  roof.castShadow = true;
  scene.add(roof);
  const fence1 = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.35, 1.5), fenceMat);
  fence1.position.set(-2.6, 0.22, -3.2);
  scene.add(fence1);
  const fence2 = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.35, 1.5), fenceMat);
  fence2.position.set(-1.0, 0.22, -3.2);
  scene.add(fence2);

  // —— Carota 3D (sul prato, Bing può "mangiarla") ——
  const carrotMat = new THREE.MeshStandardMaterial({ color: 0xff8c00, roughness: 0.9 });
  const carrotTopMat = new THREE.MeshStandardMaterial({ color: 0x228b22, roughness: 0.95 });
  const carrotGroup = new THREE.Group();
  carrotGroup.position.set(-0.38, 0.07, 0.25);
  const carrotBody = new THREE.Mesh(new THREE.CylinderGeometry(0, 0.035, 0.14, 8), carrotMat);
  carrotBody.rotation.x = Math.PI / 2;
  carrotBody.position.z = 0.04;
  carrotGroup.add(carrotBody);
  const carrotTop = new THREE.Mesh(new THREE.SphereGeometry(0.045, 8, 8), carrotTopMat);
  carrotTop.position.set(0, 0, -0.04);
  carrotGroup.add(carrotTop);
  scene.add(carrotGroup);
  const carrotBasePos = carrotGroup.position.clone();

  // —— Hoppity Voosh (pupazzo coniglietto amico di Bing) – per terra a sinistra ——
  const hoppityMat = new THREE.MeshStandardMaterial({ color: 0x2d2d2d, roughness: 0.95 });
  const hoppityGroup = new THREE.Group();
  hoppityGroup.position.set(-0.32, 0.08, 0.22);
  hoppityGroup.scale.setScalar(0.35);
  const hvBody = new THREE.Mesh(new THREE.SphereGeometry(0.2, 12, 12), hoppityMat);
  hvBody.position.y = 0.15;
  hoppityGroup.add(hvBody);
  const hvHead = new THREE.Mesh(new THREE.SphereGeometry(0.18, 12, 12), hoppityMat);
  hvHead.position.y = 0.38;
  hoppityGroup.add(hvHead);
  const hvEarL = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.06, 0.2, 8), hoppityMat);
  hvEarL.position.set(-0.08, 0.52, 0);
  hvEarL.rotation.z = 0.2;
  hoppityGroup.add(hvEarL);
  const hvEarR = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.06, 0.2, 8), hoppityMat);
  hvEarR.position.set(0.08, 0.52, 0);
  hvEarR.rotation.z = -0.2;
  hoppityGroup.add(hvEarR);
  scene.add(hoppityGroup);
  const hoppityBaseY = hoppityGroup.position.y;

  // —— Flop (figura adulta sullo sfondo, vicino alla casa) ——
  const flopMat = new THREE.MeshStandardMaterial({ color: 0x5d4e37, roughness: 0.9 });
  const flopGroup = new THREE.Group();
  flopGroup.position.set(-1.65, 0.55, -3.1);
  flopGroup.scale.setScalar(0.7);
  const flopHead = new THREE.Mesh(new THREE.SphereGeometry(0.2, 12, 12), flopMat);
  flopHead.position.y = 0.5;
  flopGroup.add(flopHead);
  const flopBody = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.22, 0.5, 12), flopMat);
  flopBody.position.y = 0.15;
  flopGroup.add(flopBody);
  const flopLegL = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.35, 8), flopMat);
  flopLegL.position.set(-0.1, -0.2, 0);
  flopGroup.add(flopLegL);
  const flopLegR = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.35, 8), flopMat);
  flopLegR.position.set(0.1, -0.2, 0);
  flopGroup.add(flopLegR);
  scene.add(flopGroup);

  // —— Pando e Coco (comparse stilizzate vicino al recinto) ——
  const pandoMat = new THREE.MeshStandardMaterial({ color: 0x4a7c59, roughness: 0.9 });
  const cocoMat = new THREE.MeshStandardMaterial({ color: 0xc9a227, roughness: 0.9 });
  const pandoGroup = new THREE.Group();
  pandoGroup.position.set(-2.15, 0.2, -2.7);
  pandoGroup.scale.setScalar(0.4);
  const pandoBody = new THREE.Mesh(new THREE.SphereGeometry(0.25, 10, 10), pandoMat);
  pandoBody.position.y = 0.2;
  pandoGroup.add(pandoBody);
  const pandoHead = new THREE.Mesh(new THREE.SphereGeometry(0.15, 8, 8), pandoMat);
  pandoHead.position.y = 0.45;
  pandoGroup.add(pandoHead);
  scene.add(pandoGroup);
  const cocoGroup = new THREE.Group();
  cocoGroup.position.set(-1.45, 0.2, -2.7);
  cocoGroup.scale.setScalar(0.38);
  const cocoBody = new THREE.Mesh(new THREE.SphereGeometry(0.25, 10, 10), cocoMat);
  cocoBody.position.y = 0.2;
  cocoGroup.add(cocoBody);
  const cocoHead = new THREE.Mesh(new THREE.SphereGeometry(0.15, 8, 8), cocoMat);
  cocoHead.position.y = 0.45;
  cocoGroup.add(cocoHead);
  scene.add(cocoGroup);

  // —— Oggetti 3D: palla, secchiello, libro (Bing può guardarli quando li nomini) ——
  const ballMat = new THREE.MeshStandardMaterial({ color: 0xe53935, roughness: 0.8 });
  const ball = new THREE.Mesh(new THREE.SphereGeometry(0.08, 16, 16), ballMat);
  ball.position.set(0.38, 0.08, -0.12);
  ball.castShadow = true;
  scene.add(ball);
  const bucketMat = new THREE.MeshStandardMaterial({ color: 0x2196f3, roughness: 0.85 });
  const bucket = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.09, 0.12, 12), bucketMat);
  bucket.position.set(-0.52, 0.1, -0.18);
  bucket.rotation.x = 0.15;
  bucket.castShadow = true;
  scene.add(bucket);
  const bookMat = new THREE.MeshStandardMaterial({ color: 0x8d6e63, roughness: 0.9 });
  const book = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.02, 0.18), bookMat);
  book.position.set(0.28, 0.04, 0.38);
  book.rotation.y = 0.3;
  book.castShadow = true;
  scene.add(book);

  // Angoli per "guardare" gli oggetti (Bing si gira verso di loro)
  const ANGLE_BALLA = Math.atan2(0.38, -0.12);
  const ANGLE_SECCHIELLO = Math.atan2(-0.52, -0.18);
  const ANGLE_LIBRO = Math.atan2(0.28, 0.38);

  // Rotazione: Bing si gira (interpolata)
  let targetRotationY = 0;
  let lookAtUntil = 0;
  const ROTATION_SPEED = 4;

  const clock = new THREE.Clock();
  const armLBase = armL.position.clone();
  const armRBase = armR.position.clone();
  const legLBase = legL.position.clone();
  const legRBase = legR.position.clone();
  const headBaseY = head.position.y;
  const leftPupilBase = leftPupil.position.clone();
  const rightPupilBase = rightPupil.position.clone();

  let reazioneFine = 0;
  let tipoReazione = 0; // 0=salto+onda, 1=doppio salto, 2=orecchie, 3=scuotimento, 4=inchino, 5=stretch
  const DURATA_REAZIONE = 1.4;

  let currentMood = 'neutral'; // neutral | happy | sad | surprised
  let moodFine = 0;
  let carrotEatStart = 0; // 0 = non in corso
  const DURATA_MANGIA_CAROTA = 1.5;
  let carrotRespawnTime = 0;
  let danceFine = 0;
  const DURATA_BALLO = 3.2;

  function reagisci() {
    reazioneFine = clock.getElapsedTime() + DURATA_REAZIONE;
    tipoReazione = Math.floor(Math.random() * 6);
  }

  function giraVerso(angoloRad) {
    targetRotationY = angoloRad;
  }

  function animate() {
    requestAnimationFrame(animate);
    const t = clock.getElapsedTime();
    const dt = Math.min(clock.getDelta(), 0.1);
    const inReazione = t < reazioneFine;
    const progressReazione = inReazione ? 1 - (reazioneFine - t) / DURATA_REAZIONE : 0;

    // Bing si gira verso targetRotationY
    puppet.rotation.y += (targetRotationY - puppet.rotation.y) * dt * ROTATION_SPEED;

    // —— Base: respiro e dondolio ——
    let baseY = 0.35 + Math.sin(t * 1.2) * 0.04;
    let scale = 1;
    let bodyTiltX = 0;
    let bodyTiltZ = Math.sin(t * 0.8) * 0.03;
    let headNod = Math.sin(t * 1.1) * 0.06;
    let headTilt = Math.sin(t * 0.7 + 1) * 0.04;
    let earWiggleL = 0.15 + Math.sin(t * 4) * 0.06;
    let earWiggleR = -0.15 - Math.sin(t * 4 + 0.3) * 0.06;
    let earDroop = 0;
    let pupilLookX = Math.sin(t * 0.5) * 0.012;
    let pupilLookY = Math.sin(t * 0.35 + 2) * 0.008;
    let headBob = 0;
    let puppetShake = 0;
    let armStretch = 0;

    if (inReazione) {
      const p = progressReazione;
      const jump = Math.sin(p * Math.PI);
      const jump2 = Math.sin(p * Math.PI * 2) * (1 - p);

      switch (tipoReazione) {
        case 0: // Salto + onda braccia
          baseY += jump * 0.18;
          scale = 1 + jump * 0.12;
          break;
        case 1: // Doppio saltino
          baseY += jump * 0.12 + jump2 * 0.08;
          scale = 1 + Math.sin(p * Math.PI * 2) * 0.06;
          headBob = jump * 0.05;
          break;
        case 2: // Orecchie su e giù
          earDroop = (1 - jump) * 0.25;
          earWiggleL = 0.15 + Math.sin(p * Math.PI * 4) * 0.15;
          earWiggleR = -0.15 - Math.sin(p * Math.PI * 4 + 0.2) * 0.15;
          baseY += jump * 0.06;
          break;
        case 3: // Scuotimento
          puppetShake = Math.sin(p * Math.PI * 8) * (1 - p) * 0.25;
          scale = 1 + jump * 0.05;
          break;
        case 4: // Inchino (tilt avanti)
          bodyTiltX = jump * 0.35;
          headNod = jump * 0.2;
          baseY += jump * 0.08;
          break;
        case 5: // Stretch braccia in alto
          armStretch = jump * 0.35;
          baseY += jump * 0.1;
          scale = 1 + jump * 0.08;
          break;
      }
    }

    puppet.position.y = baseY;
    puppet.scale.setScalar(scale);
    puppet.rotation.z = puppetShake;

    // Corpo: tilt (respirazione + reazione)
    body.rotation.x = bodyTiltX;
    body.rotation.z = bodyTiltZ;

    // Testa: cenno, inclinazione, bob
    head.rotation.x = headNod;
    head.rotation.z = headTilt;
    head.position.y = headBaseY + headBob;

    // Orecchie: movimento base + reazione
    earL.rotation.z = earWiggleL - earDroop * 0.5;
    earR.rotation.z = earWiggleR - earDroop * 0.5;

    // Emozioni: scala occhi e offset pupille (happy / sad / surprised)
    var eyeScale = 1;
    var moodPupilX = 0, moodPupilY = 0;
    if (t < moodFine) {
      if (currentMood === 'happy') { eyeScale = 1.14; moodPupilY = 0.01; }
      else if (currentMood === 'sad') { eyeScale = 0.92; moodPupilY = -0.012; }
      else if (currentMood === 'surprised') { eyeScale = 1.28; }
    }
    leftEye.scale.setScalar(eyeScale);
    rightEye.scale.setScalar(eyeScale);
    // Pupille: guardano in giro (idle) o al centro (in reazione) + mood
    var px = leftPupilBase.x + (inReazione ? 0 : pupilLookX) + moodPupilX;
    var py = leftPupilBase.y + (inReazione ? 0 : pupilLookY) + moodPupilY;
    leftPupil.position.set(px, py, leftPupil.position.z);
    rightPupil.position.set(rightPupilBase.x + (inReazione ? 0 : pupilLookX) + moodPupilX, rightPupilBase.y + (inReazione ? 0 : pupilLookY) + moodPupilY, rightPupil.position.z);

    // Braccia
    let armLY = armLBase.y, armRY = armRBase.y, armLX = armLBase.x, armRX = armRBase.x;
    if (inReazione) {
      const wave = Math.sin(progressReazione * Math.PI);
      if (tipoReazione === 5) {
        armLY += armStretch;
        armRY += armStretch;
        armLX -= wave * 0.02;
        armRX += wave * 0.02;
      } else {
        armLY += wave * 0.12;
        armRY += wave * 0.12;
        armLX -= wave * 0.04;
        armRX += wave * 0.04;
      }
    } else {
      armLX += Math.sin(t * 1.5) * 0.03;
      armLY += Math.abs(Math.sin(t * 1.8)) * 0.02;
      armRX -= Math.sin(t * 1.5 + 0.5) * 0.03;
      armRY += Math.abs(Math.sin(t * 1.8 + 0.5)) * 0.02;
    }
    armL.position.set(armLX, armLY, armL.position.z);
    armR.position.set(armRX, armRY, armR.position.z);

    // Gambe: passo leggero + peso
    const legSwing = Math.sin(t * 1.3) * 0.02;
    const legSwingR = Math.sin(t * 1.3 + 0.8) * 0.02;
    legL.position.y = legLBase.y + Math.sin(t * 1.3) * 0.015 + (inReazione ? Math.sin(progressReazione * Math.PI) * 0.03 : 0);
    legR.position.y = legRBase.y + Math.sin(t * 1.3 + 0.8) * 0.015 + (inReazione ? Math.sin(progressReazione * Math.PI) * 0.03 : 0);
    legL.position.x = legLBase.x - legSwing;
    legR.position.x = legRBase.x + legSwingR;
    legL.rotation.z = Math.sin(t * 1.1) * 0.04;
    legR.rotation.z = Math.sin(t * 1.1 + 0.7) * 0.04;

    // Naso: micro-movimento
    nose.position.z = 0.24 + Math.sin(t * 2) * 0.008;

    // —— Cagnolino: animazione (coda, dondolio, orecchie) ——
    const tailWag = Math.sin(t * 8) * 0.35;
    dogTail.rotation.z = tailWag;
    dogTail.rotation.x = 0.4 + Math.sin(t * 2) * 0.05;
    dogHead.rotation.y = Math.sin(t * 1.5) * 0.1;
    dogHead.rotation.x = Math.sin(t * 1.2) * 0.05;
    dog.position.x = 0.5 + Math.sin(t * 0.8) * 0.02;
    dog.position.y = 0.18 + Math.abs(Math.sin(t * 3)) * 0.015;
    dogEarL.rotation.z = 0.3 + Math.sin(t * 4) * 0.08;
    dogEarR.rotation.z = -0.3 - Math.sin(t * 4 + 0.5) * 0.08;
    dogLegFL.position.y = -0.06 + Math.sin(t * 5) * 0.01;
    dogLegFR.position.y = -0.06 + Math.sin(t * 5 + 1.5) * 0.01;
    dogLegBL.position.y = -0.06 + Math.sin(t * 5 + 0.8) * 0.01;
    dogLegBR.position.y = -0.06 + Math.sin(t * 5 + 2.3) * 0.01;

    // —— Guinzaglio: da mano di Bing al collare del cane ——
    var handWorld = new THREE.Vector3();
    var collarWorld = new THREE.Vector3();
    armR.getWorldPosition(handWorld);
    dog.getWorldPosition(collarWorld);
    collarWorld.y += 0.06;
    var leashDir = handWorld.clone().sub(collarWorld);
    var leashLen = leashDir.length();
    if (leashLen > 0.01) {
      leashDir.normalize();
      leash.scale.set(1, Math.max(0.2, leashLen / 0.5), 1);
      leash.position.copy(collarWorld).add(handWorld).multiplyScalar(0.5);
      leash.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), leashDir);
      leash.visible = true;
    } else {
      leash.visible = false;
    }

    // —— Carota: animazione "mangia" e respawn ——
    if (carrotEatStart > 0) {
      var prog = (t - carrotEatStart) / DURATA_MANGIA_CAROTA;
      if (prog < 1) {
        var targetCarrot = new THREE.Vector3(0, 0.52, 0.32);
        carrotGroup.position.lerpVectors(carrotBasePos, targetCarrot, prog);
        carrotGroup.scale.setScalar(1 - prog * 0.95);
      } else {
        carrotGroup.visible = false;
        carrotGroup.scale.setScalar(1);
        if (carrotRespawnTime === 0) carrotRespawnTime = t + 2.5;
      }
    }
    if (carrotRespawnTime > 0 && t > carrotRespawnTime) {
      carrotGroup.position.copy(carrotBasePos);
      carrotGroup.visible = true;
      carrotRespawnTime = 0;
      carrotEatStart = 0;
    }

    // —— Ballo: animazione quando l'utente dice "balla" o "danza" ——
    var isDancing = t < danceFine;
    if (isDancing) {
      var bounce = Math.abs(Math.sin(t * 12)) * 0.08;
      var sway = Math.sin(t * 8) * 0.25;
      puppet.position.y = baseY + bounce;
      puppet.rotation.y += sway * dt * 3;
      armL.position.x = armLBase.x - 0.08 - Math.sin(t * 10) * 0.06;
      armR.position.x = armRBase.x + 0.08 + Math.sin(t * 10 + 0.5) * 0.06;
      armL.position.y = armLBase.y + Math.abs(Math.sin(t * 10)) * 0.1;
      armR.position.y = armRBase.y + Math.abs(Math.sin(t * 10 + 0.5)) * 0.1;
    }

    // —— Hoppity Voosh: saltello quando Bing reagisce o parla ——
    var hoppityBounce = inReazione ? Math.sin(progressReazione * Math.PI) * 0.04 : Math.abs(Math.sin(t * 3)) * 0.01;
    hoppityGroup.position.y = hoppityBaseY + hoppityBounce;
    hoppityGroup.rotation.y = Math.sin(t * 0.8) * 0.1;

    // —— Flop / Pando / Coco: micro-animazione idle ——
    flopGroup.rotation.y = Math.sin(t * 0.4) * 0.03;
    pandoGroup.position.y = 0.2 + Math.sin(t * 1.2) * 0.02;
    cocoGroup.position.y = 0.2 + Math.sin(t * 1.2 + 0.7) * 0.02;

    renderer.render(scene, camera);
  }

  function resize() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    canvas.width = w;
    canvas.height = h;
    camera.aspect = w / h;
    updateCameraForViewport();
    renderer.setSize(w, h);
  }
  window.addEventListener('resize', resize);
  updateCameraForViewport();

  // —— Regole e risposte (caricate da risposte.json) ——
  const regoleDefault = [
    { trigger: ["ciao", "salve", "ehi", "hey", "buongiorno", "buonasera"], risposta: "Ciao! Sono Bing, piacere di conoscerti!" },
    { trigger: ["come ti chiami", "chi sei"], risposta: "Sono Bing, il coniglietto! Sono qui per chiacchierare con te." },
    { trigger: ["palla", "pallone"], risposta: "Ecco la palla! È rossa!" },
    { trigger: ["secchiello", "secchio"], risposta: "Il secchiello è blu!" },
    { trigger: ["libro", "libri"], risposta: "Quel libro ha delle storie bellissime!" },
    { trigger: ["hoppity", "voosh", "pupazzo"], risposta: "Questo è Hoppity Voosh, il mio amico!" },
    { trigger: ["balla", "danza", "ballare", "danzare"], risposta: "Guarda guarda! Ballo per te!" },
    { trigger: ["consiglio", "cosa faccio", "aiutami a decidere", "flop"], risposta: "Flop dice sempre che ogni giorno è un giorno Bing!" },
    { trigger: ["come stai", "come va", "tutto bene"], risposta: "Io sto benissimo, grazie! E tu come stai oggi?" },
    { trigger: ["grazie", "grazie mille"], risposta: "Prego! Sono sempre qui se hai bisogno." },
    { trigger: ["ti voglio bene", "ti amo", "sei simpatico"], risposta: "Anch'io ti voglio bene! Mi fai tanto felice!" },
    { trigger: ["ciao ciao", "arrivederci", "a dopo", "devo andare"], risposta: "Ciao ciao! Torna quando vuoi, ti aspetto!" },
    { trigger: ["che fai", "cosa fai"], risposta: "Sto qui con te! Mi piace parlare e ascoltare. Tu che cosa stai facendo?" },
    { trigger: ["racconta", "raccontami", "una storia", "favola"], risposta: "" },
    { trigger: ["bene", "benissimo", "felice", "contento"], risposta: "Che bello! Sono proprio contento per te!" },
    { trigger: ["male", "triste", "arrabbiato", "stanco"], risposta: "Mi dispiace. Se vuoi parlare sono qui, ti ascolto. Ti mando un abbraccio!" }
  ];

  let regole = regoleDefault.slice();
  let fallback = "Mmh, non ho capito bene. Puoi ripetere? Oppure dimmi ciao!";

  const STORIE_BING = [
    "Oggi è un giorno Bing! Tutto può succedere quando sei con i tuoi amici.",
    "Una volta Bing e Flop andarono nel giardino. Bing trovò una carota gigante! Crunch crunch!",
    "Bing ama le storie. La sua preferita? Quella del coniglietto che incontra un nuovo amico ogni giorno!",
    "Flop dice che ogni giorno è speciale. E oggi è un giorno Bing!",
    "C'era una volta un coniglietto nero che adorava le carote e i suoi amici. Era Bing!"
  ];

  const FRASI_FLOP = [
    "È un Bing thing! Flop dice sempre che le cose si risolvono con calma.",
    "Flop dice sempre che ogni giorno è un giorno Bing! Provaci e vedrai.",
    "Flop direbbe: prendi il tuo tempo, un passo alla volta. È un Bing thing!",
    "Flop dice che quando non sai cosa fare, basta fare un respiro e provare. È un Bing thing!"
  ];

  function caricaRegole() {
    fetch('risposte.json')
      .then(function (r) { return r.ok ? r.json() : Promise.reject(); })
      .then(function (data) {
        if (data.regole && data.regole.length) regole = data.regole;
        if (data.fallback) fallback = data.fallback;
      })
      .catch(function () {
        regole = regoleDefault.slice();
      });
  }
  caricaRegole();

  function trovaRisposta(testoUtente) {
    const t = (testoUtente || '').toLowerCase().trim();
    var elenco = regole.length ? regole : regoleDefault;
    var defaultRes = { risposta: fallback, mood: 'neutral', action: null };

    if (!t) return defaultRes;

    for (var i = 0; i < elenco.length; i++) {
      var triggers = elenco[i].trigger || [];
      for (var j = 0; j < triggers.length; j++) {
        var trig = triggers[j].toLowerCase();
        if (t.indexOf(trig) === -1) continue;

        var risposta = elenco[i].risposta || fallback;
        var mood = 'neutral';
        var action = null;

        if (t.indexOf('balla') !== -1 || t.indexOf('danza') !== -1) {
          risposta = "Guarda guarda! Ballo per te!";
          mood = 'happy';
          action = 'balla';
          return { risposta: risposta, mood: mood, action: action };
        }
        if (t.indexOf('carota') !== -1 || t.indexOf('carote') !== -1) {
          mood = 'happy';
          action = 'carota';
          return { risposta: risposta, mood: mood, action: action };
        }
        if (t.indexOf('palla') !== -1 || t.indexOf('pallone') !== -1) {
          risposta = "Ecco la palla! È rossa, mi piace giocarci!";
          action = 'guarda_palla';
          return { risposta: risposta, mood: 'happy', action: action };
        }
        if (t.indexOf('secchiello') !== -1 || t.indexOf('secchio') !== -1) {
          risposta = "Il secchiello è blu! Serviva per il castello di sabbia.";
          action = 'guarda_secchiello';
          return { risposta: risposta, mood: 'happy', action: action };
        }
        if (t.indexOf('libro') !== -1 || t.indexOf('libri') !== -1) {
          risposta = "Quel libro ha delle storie bellissime! Me lo leggi?";
          action = 'guarda_libro';
          return { risposta: risposta, mood: 'happy', action: action };
        }
        if (t.indexOf('hoppity') !== -1 || t.indexOf('voosh') !== -1 || t.indexOf('pupazzo') !== -1) {
          risposta = "Questo è Hoppity Voosh, il mio amico coniglietto! Gli voglio tanto bene.";
          mood = 'happy';
          return { risposta: risposta, mood: mood, action: null };
        }
        if (t.indexOf('racconta') !== -1 || t.indexOf('storia') !== -1 || t.indexOf('favola') !== -1) {
          risposta = STORIE_BING[Math.floor(Math.random() * STORIE_BING.length)];
          mood = 'surprised';
          return { risposta: risposta, mood: mood, action: null };
        }
        if (t.indexOf('consiglio') !== -1 || t.indexOf('cosa faccio') !== -1 || t.indexOf('aiutami a decidere') !== -1 || t.indexOf('flop') !== -1) {
          risposta = FRASI_FLOP[Math.floor(Math.random() * FRASI_FLOP.length)];
          mood = 'neutral';
          return { risposta: risposta, mood: mood, action: null };
        }

        if (t.indexOf('bene') !== -1 || t.indexOf('felice') !== -1 || t.indexOf('contento') !== -1 || t.indexOf('ti voglio bene') !== -1) mood = 'happy';
        else if (t.indexOf('triste') !== -1 || t.indexOf('male') !== -1 || t.indexOf('dispiace') !== -1) mood = 'sad';
        else if (t.indexOf('ciao') !== -1 || t.indexOf('stupito') !== -1) mood = 'happy';

        return { risposta: risposta, mood: mood, action: action };
      }
    }
    return defaultRes;
  }

  // —— Voce italiana (risposta di Bing) ——
  let italianVoice = null;
  function initVoices() {
    var voices = window.speechSynthesis.getVoices();
    italianVoice = voices.find(function (v) { return v.lang === 'it-IT' || v.lang.startsWith('it_'); }) || voices.find(function (v) { return v.lang.startsWith('it'); }) || null;
  }
  if ('speechSynthesis' in window) {
    initVoices();
    if (window.speechSynthesis.onvoiceschanged) window.speechSynthesis.onvoiceschanged = initVoices;
  }

  // —— Suoni (Web Audio): tocco e quando parla ——
  var audioCtx = null;
  function getAudioCtx() {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    return audioCtx;
  }
  function playSound(type) {
    try {
      var ctx = getAudioCtx();
      var osc = ctx.createOscillator();
      var gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
      if (type === 'tap') {
        osc.frequency.setValueAtTime(523.25, ctx.currentTime);
        osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.08);
      } else {
        osc.frequency.setValueAtTime(392, ctx.currentTime);
        osc.type = 'sine';
      }
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.2);
    } catch (e) {}
  }

  function parla(testo) {
    if (!('speechSynthesis' in window) || !testo) return;
    window.speechSynthesis.cancel();
    var u = new SpeechSynthesisUtterance(testo);
    u.lang = 'it-IT';
    u.rate = 0.92;
    u.pitch = 1.05;
    if (italianVoice) u.voice = italianVoice;
    u.onstart = function () { reagisci(); giraVerso(0); playSound('speak'); };
    window.speechSynthesis.speak(u);
  }

  // —— Riconoscimento vocale (voce umana) ——
  const micBtn = document.getElementById('micBtn');
  var recognition = null;
  var ascoltando = false;

  try {
    var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'it-IT';
      recognition.onresult = function (e) {
        var testo = (e.results[0] && e.results[0][0]) ? e.results[0][0].transcript : '';
        var r = trovaRisposta(testo);
        currentMood = r.mood;
        moodFine = clock.getElapsedTime() + 4;
        if (r.action === 'carota') carrotEatStart = clock.getElapsedTime();
        if (r.action === 'balla') danceFine = clock.getElapsedTime() + DURATA_BALLO;
        if (r.action === 'guarda_palla') { targetRotationY = ANGLE_BALLA; lookAtUntil = clock.getElapsedTime() + 2.5; }
        if (r.action === 'guarda_secchiello') { targetRotationY = ANGLE_SECCHIELLO; lookAtUntil = clock.getElapsedTime() + 2.5; }
        if (r.action === 'guarda_libro') { targetRotationY = ANGLE_LIBRO; lookAtUntil = clock.getElapsedTime() + 2.5; }
        if (r.action !== 'guarda_palla' && r.action !== 'guarda_secchiello' && r.action !== 'guarda_libro') giraVerso(0);
        parla(r.risposta);
      };
      recognition.onend = function () {
        ascoltando = false;
        micBtn.classList.remove('ascolto');
      };
      recognition.onerror = function () {
        ascoltando = false;
        micBtn.classList.remove('ascolto');
      };
    }
  } catch (err) {}

  function toggleMic() {
    if (!recognition) {
      parla("Qui non posso sentire la tua voce. Prova su Chrome e concedi l'accesso al microfono.");
      return;
    }
    if (ascoltando) {
      recognition.stop();
      return;
    }
    ascoltando = true;
    micBtn.classList.add('ascolto');
    giraVerso(0);
    recognition.start();
  }

  micBtn.addEventListener('click', toggleMic);

  // Tocco sullo schermo: Bing reagisce (salto, ondeggio) e si gira verso il lato toccato
  function onTapOrTouch(xNorm) {
    playSound('tap');
    reagisci();
    giraVerso((xNorm - 0.5) * 0.6);
  }
  canvas.addEventListener('click', function (e) {
    e.preventDefault();
    var x = e.clientX / window.innerWidth;
    onTapOrTouch(x);
  });
  canvas.addEventListener('touchend', function (e) {
    if (e.changedTouches && e.changedTouches[0]) {
      e.preventDefault();
      var x = e.changedTouches[0].clientX / window.innerWidth;
      onTapOrTouch(x);
    }
  }, { passive: false });

  animate();
})();
