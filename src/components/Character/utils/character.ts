import * as THREE from "three";
import { DRACOLoader, GLTF, GLTFLoader } from "three-stdlib";
import { setCharTimeline, setAllTimeline } from "../../utils/GsapScroll";
import { decryptFile } from "./decrypt";

/**
 * Bare-skin meshes of the character. The exported model shares a single
 * material (`default`) between the skin, the clothes and the room props, so the
 * material is cloned for these meshes before tinting - otherwise the shirt,
 * pants, shoes, desk, chair and ground get repainted as well.
 */
const skinMeshNames = ["Ear001", "Neck", "Hand"];
const skinColor = 0xffccb4;

const setCharacter = (
  renderer: THREE.WebGLRenderer,
  scene: THREE.Scene,
  camera: THREE.PerspectiveCamera
) => {
  const loader = new GLTFLoader();
  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath("/draco/");
  loader.setDRACOLoader(dracoLoader);

  const loadCharacter = async (): Promise<GLTF | null> => {
    const encryptedBlob = await decryptFile(
      "/models/character.enc",
      "Character3D#@"
    );
    const blobUrl = URL.createObjectURL(new Blob([encryptedBlob]));

    return new Promise<GLTF | null>((resolve, reject) => {
      loader.load(
        blobUrl,
        async (gltf) => {
          const character: THREE.Object3D = gltf.scene;
          await renderer.compileAsync(character, camera, scene);
          character.traverse((child) => {
            const mesh = child as THREE.Mesh;
            if (!mesh.isMesh) return;
            mesh.castShadow = true;
            mesh.receiveShadow = true;
            mesh.frustumCulled = true;

            if (skinMeshNames.includes(mesh.name)) {
              const mat = mesh.material as THREE.MeshStandardMaterial;
              if (mat && mat.color) {
                const skinMaterial = mat.clone();
                skinMaterial.color.setHex(skinColor);
                mesh.material = skinMaterial;
              }
            }
          });
          resolve(gltf);
          setCharTimeline(character, camera);
          setAllTimeline();
          // The intro clip drives the feet every frame, so this only sets the
          // starting pose of the model (matches the rest pose of the mesh).
          const footR = character.getObjectByName("footR");
          const footL = character.getObjectByName("footL");
          if (footR) footR.position.y = 3.46;
          if (footL) footL.position.y = 3.46;
          dracoLoader.dispose();
        },
        undefined,
        (error) => {
          console.error("Error loading GLTF model:", error);
          reject(error);
        }
      );
    });
  };

  return { loadCharacter };
};

export default setCharacter;
