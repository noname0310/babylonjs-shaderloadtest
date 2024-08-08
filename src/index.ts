import "@babylonjs/core/Materials/standardMaterial";
import "@babylonjs/core/Rendering/depthRendererSceneComponent";
import "@babylonjs/core/Engines/WebGPU/Extensions/engine.alpha";
import "@babylonjs/core/Engines/WebGPU/Extensions/engine.renderTarget";

// uncomment the following lines will resolve the issue
// import "@babylonjs/core/ShadersWGSL/kernelBlur.fragment";
// import "@babylonjs/core/ShadersWGSL/kernelBlur.vertex";
import { ArcRotateCamera } from "@babylonjs/core/Cameras/arcRotateCamera";
import { WebGPUEngine } from "@babylonjs/core/Engines/webgpuEngine";
import { HemisphericLight } from "@babylonjs/core/Lights/hemisphericLight";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { CreateCapsule } from "@babylonjs/core/Meshes/Builders/capsuleBuilder";
import { DepthOfFieldEffectBlurLevel } from "@babylonjs/core/PostProcesses/depthOfFieldEffect";
import { DefaultRenderingPipeline } from "@babylonjs/core/PostProcesses/RenderPipeline/Pipelines/defaultRenderingPipeline";
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

new HemisphericLight("light", new Vector3(0, 1, 0), scene);

CreateCapsule("capsule", { radius: 5, height: 10, tessellation: 20 }, scene);

const defaultPipeline = new DefaultRenderingPipeline("default", true, scene, [camera]);
defaultPipeline.depthOfFieldEnabled = true;
defaultPipeline.depthOfFieldBlurLevel = DepthOfFieldEffectBlurLevel.High;

engine.runRenderLoop(() => scene.render());
