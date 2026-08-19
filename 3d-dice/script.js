import * as THREE from "three";
import { WebGPURenderer } from "three/webgpu";

//　サイズを設定
const width = window.innerWidth;
const height = window.innerHeight;

// シーンを作成
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x101018);

// カメラを作成
const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
camera.position.set(0, 2, 6);

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
const diceGeometry = new THREE.BoxGeometry(2, 2, 2);
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

// ボタン動作
const rollButton = document.getElementById("rollButton");
const resultElement = document.getElementById("result");

rollButton.addEventListener("click", () => {
  console.log("ROLL!");
});

async function init() {
  await renderer.init();
  animate();
}

// アニメーションを作成
function animate() {
  requestAnimationFrame(animate);
  // dice.rotation.x += 0.01;
  // dice.rotation.y += 0.01;
  renderer.render(scene, camera);
}
init();