import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { OBJLoader } from "three/addons/loaders/OBJLoader.js";

// レンダラーを作成
const renderer = new THREE.WebGLRenderer({
    antialias: true
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

// シーンを作成
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xF5F5F5);

// カメラを作成
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 2, 5);

document.body.appendChild(renderer.domElement);

// ライティング作成
scene.add(new THREE.AmbientLight(0xffffff, 2));

const dirLight = new THREE.DirectionalLight(0xffffff, 3);
dirLight.position.set(5, 10, 5);
scene.add(dirLight);

scene.add(new THREE.AxesHelper(2));

//　カメラコントローラーを作成
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.02;

let product;

// モデルローダー
const loader = new OBJLoader();
loader.load(
    "./models/lamborghini.obj",
    (obj) => {
        product = obj;
        product.traverse((child) => {
            if (child.isMesh) {
                child.material = new THREE.MeshStandardMaterial({
                    color: 0x8b0000,
                    metalness: 0.8,
                    roughness: 0.2
                });
            }
        });
        scene.add(product);
        const box = new THREE.Box3().setFromObject(product);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());

        console.log("Size:", size);
        console.log("Center:", center);

        // モデルを原点座標に移動
        product.position.x -= center.x;
        product.position.y -= center.y;
        product.position.z -= center.z;

        // 移動後に再計算
        box.setFromObject(product);

        const newSize = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(
            newSize.x,
            newSize.y,
            newSize.z
        );

        // カメラ距離
        const fov = camera.fov * (Math.PI / 180);
        let distance = maxDim / (2 * Math.tan(fov / 2));
        distance *= 1.8;
        camera.position.set(0, maxDim * 0.5, distance);

        controls.target.set(0, 0, 0);
        controls.update();
        console.log("Model loaded!");
    },

    undefined,
    (error) => {
        console.error(error);
    }
);

// アニメーションループ
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}
animate();

// リサイズ
window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(
        window.innerWidth,
        window.innerHeight
    );
});