(function () {
  const canvas = document.getElementById('canvas');
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xb4e4f7);

  const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 1000);
  camera.position.set(0, 0.8, 2.2);
  camera.lookAt(0, 0.4, 0);

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

  // Materiali – stile Bing, un po' più scuri
  const skin = new THREE.MeshStandardMaterial({ color: 0xc4956a, roughness: 0.9, metalness: 0.05 });
  const bodyMat = new THREE.MeshStandardMaterial({ color: 0x4a8a3d, roughness: 0.85, metalness: 0.05 });
  const earMat = new THREE.MeshStandardMaterial({ color: 0xc4956a, roughness: 0.9 });
  const eyeWhite = new THREE.MeshStandardMaterial({ color: 0xe8e4dc, roughness: 0.8 });
  const eyePupil = new THREE.MeshStandardMaterial({ color: 0x2c1810 });
  const noseMat = new THREE.MeshStandardMaterial({ color: 0xb87850, roughness: 0.9 });

  // Luigi – pupazzo animalesco (orecchie lunghe, musetto)
  const puppet = new THREE.Group();
  puppet.position.set(0, 0.35, 0);

  // Testa (sfera un po' schiacciata)
  const headGeo = new THREE.SphereGeometry(0.26, 32, 32);
  const head = new THREE.Mesh(headGeo, skin);
  head.position.y = 0.48;
  head.scale.y = 1.05;
  head.castShadow = true;
  puppet.add(head);

  // Orecchie (coni lunghi – stile coniglietto/animale)
  const earGeo = new THREE.CylinderGeometry(0.06, 0.12, 0.4, 16);
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

  // Corpo (maglia)
  const bodyGeo = new THREE.SphereGeometry(0.3, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.55);
  const body = new THREE.Mesh(bodyGeo, bodyMat);
  body.position.y = 0.08;
  body.castShadow = true;
  puppet.add(body);

  const armGeo = new THREE.SphereGeometry(0.07, 16, 16);
  const armL = new THREE.Mesh(armGeo, skin);
  armL.position.set(-0.26, 0.32, 0.06);
  puppet.add(armL);
  const armR = new THREE.Mesh(armGeo, skin);
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

  var floorGeo = new THREE.PlaneGeometry(20, 20);
  var floor = new THREE.Mesh(floorGeo, grassMat);
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  scene.add(floor);

  // Rotazione: Luigi si gira (interpolata)
  let targetRotationY = 0;
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

    // Luigi si gira verso targetRotationY
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

    // Pupille: guardano in giro (idle) o al centro (in reazione)
    var px = leftPupilBase.x + (inReazione ? 0 : pupilLookX);
    var py = leftPupilBase.y + (inReazione ? 0 : pupilLookY);
    leftPupil.position.set(px, py, leftPupil.position.z);
    rightPupil.position.set(rightPupilBase.x + (inReazione ? 0 : pupilLookX), rightPupilBase.y + (inReazione ? 0 : pupilLookY), rightPupil.position.z);

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

    renderer.render(scene, camera);
  }

  function resize() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    canvas.width = w;
    canvas.height = h;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  }
  window.addEventListener('resize', resize);

  // —— Regole e risposte (caricate da risposte.json) ——
  const regoleDefault = [
    { trigger: ["ciao", "salve", "ehi", "hey", "buongiorno", "buonasera"], risposta: "Ciao! Sono Luigi, piacere di conoscerti!" },
    { trigger: ["come ti chiami", "chi sei"], risposta: "Sono Luigi, il tuo amico pupazzo! Sono qui per chiacchierare con te." },
    { trigger: ["come stai", "come va", "tutto bene"], risposta: "Io sto benissimo, grazie! E tu come stai oggi?" },
    { trigger: ["grazie", "grazie mille"], risposta: "Prego! Sono sempre qui se hai bisogno." },
    { trigger: ["ti voglio bene", "ti amo", "sei simpatico"], risposta: "Anch'io ti voglio bene! Mi fai tanto felice!" },
    { trigger: ["ciao ciao", "arrivederci", "a dopo", "devo andare"], risposta: "Ciao ciao! Torna quando vuoi, ti aspetto!" },
    { trigger: ["che fai", "cosa fai"], risposta: "Sto qui con te! Mi piace parlare e ascoltare. Tu che cosa stai facendo?" },
    { trigger: ["racconta", "raccontami", "una storia"], risposta: "Mi piace tantissimo ascoltare! Raccontami tu qualcosa." },
    { trigger: ["bene", "benissimo", "felice", "contento"], risposta: "Che bello! Sono proprio contento per te!" },
    { trigger: ["male", "triste", "arrabbiato", "stanco"], risposta: "Mi dispiace. Se vuoi parlare sono qui, ti ascolto. Ti mando un abbraccio!" }
  ];

  let regole = regoleDefault.slice();
  let fallback = "Mmh, non ho capito bene. Puoi ripetere? Oppure dimmi ciao!";

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
    if (!t) return fallback;
    for (var i = 0; i < elenco.length; i++) {
      var triggers = elenco[i].trigger || [];
      for (var j = 0; j < triggers.length; j++) {
        if (t.indexOf(triggers[j].toLowerCase()) !== -1) return elenco[i].risposta || fallback;
      }
    }
    return fallback;
  }

  // —— Voce italiana (risposta di Luigi) ——
  let italianVoice = null;
  function initVoices() {
    var voices = window.speechSynthesis.getVoices();
    italianVoice = voices.find(function (v) { return v.lang === 'it-IT' || v.lang.startsWith('it_'); }) || voices.find(function (v) { return v.lang.startsWith('it'); }) || null;
  }
  if ('speechSynthesis' in window) {
    initVoices();
    if (window.speechSynthesis.onvoiceschanged) window.speechSynthesis.onvoiceschanged = initVoices;
  }

  function parla(testo) {
    if (!('speechSynthesis' in window) || !testo) return;
    window.speechSynthesis.cancel();
    var u = new SpeechSynthesisUtterance(testo);
    u.lang = 'it-IT';
    u.rate = 0.92;
    u.pitch = 1.05;
    if (italianVoice) u.voice = italianVoice;
    u.onstart = function () { reagisci(); giraVerso(0); };
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
        var risposta = trovaRisposta(testo);
        giraVerso(0);
        parla(risposta);
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

  // Tocco sullo schermo: Luigi reagisce (salto, ondeggio) e si gira verso il lato toccato
  function onTapOrTouch(xNorm) {
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
