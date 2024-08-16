import "@babylonjs/core/Materials/standardMaterial";
import "@babylonjs/core/Rendering/depthRendererSceneComponent";
import "@babylonjs/core/Engines/WebGPU/Extensions/engine.alpha";
import "@babylonjs/core/Engines/WebGPU/Extensions/engine.renderTarget";
import "@babylonjs/core/Rendering/prePassRendererSceneComponent";
import "@babylonjs/core/Engines/WebGPU/Extensions/engine.multiRender";
import "@babylonjs/core/Rendering/geometryBufferRendererSceneComponent";

// uncomment the following lines will resolve the issue
// import "@babylonjs/core/ShadersWGSL/screenSpaceReflection2.fragment";
// import "@babylonjs/core/ShadersWGSL/screenSpaceReflection2Blur.fragment";
// import "@babylonjs/core/ShadersWGSL/screenSpaceReflection2BlurCombiner.fragment";
import { ArcRotateCamera } from "@babylonjs/core/Cameras/arcRotateCamera";
import { Constants } from "@babylonjs/core/Engines/constants";
import { WebGPUEngine } from "@babylonjs/core/Engines/webgpuEngine";
import { HemisphericLight } from "@babylonjs/core/Lights/hemisphericLight";
import { StandardMaterial } from "@babylonjs/core/Materials/standardMaterial";
import { Color3 } from "@babylonjs/core/Maths/math.color";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { CreateCapsule } from "@babylonjs/core/Meshes/Builders/capsuleBuilder";
import { CreateGround } from "@babylonjs/core/Meshes/Builders/groundBuilder";
import { SSRRenderingPipeline } from "@babylonjs/core/PostProcesses/RenderPipeline/Pipelines/ssrRenderingPipeline";
import { Scene } from "@babylonjs/core/scene";

const canvas = document.createElement("canvas");
canvas.style.width = "100%";
canvas.style.height = "100%";
canvas.style.display = "block";
document.body.appendChild(canvas);

const engine = new WebGPUEngine(canvas);
await engine.initAsync();

const scene = new Scene(engine);
const camera = new ArcRotateCamera("Camera", Math.PI / 4, 0, 100, new Vector3(0, 0, 0), scene);
camera.attachControl(canvas, true);
camera.setPosition(new Vector3(0, 20, 100));

new HemisphericLight("light", new Vector3(0, 1, 0), scene);

CreateCapsule("capsule", { radius: 5, height: 15, tessellation: 20 }, scene);

const ground = CreateGround("ground1", { width: 120, height: 120, subdivisions: 2, updatable: false }, scene);
const groundMaterial = ground.material = new StandardMaterial("groundMaterial", scene);
groundMaterial.diffuseColor = new Color3(1.02, 1.02, 1.02);
ground.receiveShadows = true;
ground.position.y = -10;

const ssr = new SSRRenderingPipeline(
    "ssr",
    scene,
    undefined,
    false,
    Constants.TEXTURETYPE_UNSIGNED_BYTE
);
ssr.step = 32;
ssr.maxSteps = 128;
ssr.maxDistance = 500;
ssr.enableSmoothReflections = true;
ssr.enableAutomaticThicknessComputation = true;
ssr.blurDownsample = 0;
ssr.ssrDownsample = 0;
ssr.thickness = 0.1;
ssr.selfCollisionNumSkip = 2;
ssr.blurDispersionStrength = 0;
ssr.roughnessFactor = 0.1;
ssr.reflectivityThreshold = 0.9;
ssr.samples = 4;

engine.runRenderLoop(() => scene.render());
