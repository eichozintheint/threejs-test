import * as THREE from "three";
import { WebGPURenderer } from "three/webgpu";

//　サイズを設定
let width = window.innerWidth;
let height = window.innerHeight;

// シーンを作成
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x101018);

// カメラを作成
const camera = new THREE.PerspectiveCamera(45, width / height, 1, 1000);
camera.position.set(0, 0, 6);

// レンダラーを作成
const renderer = new WebGPURenderer({
  antialias: true
});
renderer.setSize(width, height);
renderer.setPixelRatio(
  Math.min(window.devicePixelRatio, 2)
);
renderer.shadowMap.enabled = true;

document.body.appendChild(renderer.domElement);

// Diceのオブジェクトを作成
const diceGeometry = new THREE.BoxGeometry(1, 1, 1);
const diceMaterial = new THREE.MeshStandardMaterial({
  color: 0xffffff,
  roughness: 0.3,
  metalness: 0.1
});
const dice = new THREE.Mesh(diceGeometry, diceMaterial);
dice.castShadow = true;
scene.add(dice);

// 床のオブジェクトを作成
const floorGeometry = new THREE.PlaneGeometry(20, 20);
const floorMaterial = new THREE.MeshStandardMaterial({
  color: 0x222222,
  roughness: 0.8
});
const floor = new THREE.Mesh(floorGeometry, floorMaterial);

floor.rotation.x = -Math.PI / 2;
floor.position.y = -1.5;
floor.receiveShadow = true;
scene.add(floor);

// ライティングを作成
const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);

const directionalLight =new THREE.DirectionalLight(0xffffff, 3);
directionalLight.position.set(5, 6, 5);
directionalLight.castShadow = true;
scene.add(directionalLight);

let isRolling = false;
let rotationSpeedX = 0;
let rotationSpeedY = 0;
let rotationSpeedZ = 0;


// ボタン
const rollButton =
  document.getElementById(
    "rollButton"
  );

const resultElement =
  document.getElementById(
    "result"
  );

rollButton.addEventListener(
  "click",
  () => {
    if (isRolling) {
      return;
    }
    isRolling = true;
    rotationSpeedX = 0.08;
    rotationSpeedY = 0.12;
    rotationSpeedZ = 0.05;
    const result =
      Math.floor(
        Math.random() * 6
      ) + 1;
    resultElement.textContent ="ローリング......";
    rollButton.disabled =
      true;
    setTimeout(
      () => {
        isRolling = false;
        rotationSpeedX = 0;
        rotationSpeedY = 0;
        rotationSpeedZ = 0;
        dice.position.y = 0;
        resultElement.textContent =
          `結果: ${result}`;
        rollButton.disabled =
          false;
      },
      1500
    );
  }
);

// アニメーション
function animate() {
  requestAnimationFrame(animate);
  // 回転
  if (isRolling) {
    dice.rotation.x +=rotationSpeedX;
    dice.rotation.y +=rotationSpeedY;
    dice.rotation.z +=rotationSpeedZ;
  }
  renderer.render(scene, camera);
}
// WEBGPU
async function init() {
  try {
    await renderer.init();
    animate();
  }
  catch (error) {
    console.error(
      "WebGPU エラー:",
      error
    );
    resultElement.textContent = "WebGPU 失敗";
  }
}

// リサイズ
window.addEventListener(
  "resize",
  () => {
    let width = window.innerWidth;
    let height = window.innerHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
    renderer.setPixelRatio(
      Math.min(window.devicePixelRatio,2)
    );
  }
);
init();