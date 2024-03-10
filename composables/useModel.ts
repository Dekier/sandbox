import { Object3D } from "three";
import { Color, MeshLambertMaterial } from "three";
export const useModelSettings = () => {
  const newSetModel = (model: Object3D) => {
    model.traverse((child: any) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        const color = child.material.color;
        child.material.dispose();
        child.material = new MeshLambertMaterial({
          color: new Color(color.r, color.g, color.b),
        });
      }
    });
  };

  return { newSetModel };
};
