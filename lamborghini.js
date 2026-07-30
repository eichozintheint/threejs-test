import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { OBJLoader } from "three/addons/loaders/OBJLoader.js";
import { MTLLoader } from 'three/addons/loaders/MTLLoader.js';

// レンダラーを作成
const renderer = new THREE.WebGLRenderer({
    antialias: true
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

// シーンを作成
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

// カメラを作成
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 2, 5);

document.body.appendChild(renderer.domElement);

// ライティング作成
scene.add(new THREE.AmbientLight(0xffffff, 2));

const dirLight = new THREE.DirectionalLight(0xff0000, 3);
dirLight.position.set(5, 10, 5);
scene.add(dirLight);

scene.add(new THREE.AxesHelper(2));

//　カメラコントローラーを作成
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.02;

let product;

// モデルローダー
const mtlLoader = new MTLLoader();

mtlLoader.load('./models/obj/Lamborghini_Aventador.mtl', (materials) => {

    materials.preload();

    const objLoader = new OBJLoader();
    objLoader.setMaterials(materials);

    objLoader.load(
        './models/obj/Lamborghini_Aventador.obj',

        (obj) => {
            product = obj;
            scene.add(product);

            const box = new THREE.Box3().setFromObject(product);
            const center = box.getCenter(new THREE.Vector3());

            product.position.sub(center);
            box.setFromObject(product);
            const size = box.getSize(new THREE.Vector3());
            const maxDim = Math.max(size.x, size.y, size.z);
            const fov = THREE.MathUtils.degToRad(camera.fov);
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
});

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