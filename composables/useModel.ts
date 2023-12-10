import { Object3D } from "three";
import { MeshBasicMaterial, Color, MeshLambertMaterial } from "three";
export const useModelSettings = () => {
  const hudStore = useHudStore();
  const characterStore = useCharacterStore();

  const { isActiveOutline, colorOutline } = storeToRefs(hudStore);

  const setModel = (model: Object3D) => {
    model.children[model.children.length - 1].material.dispose();
    model.children[model.children.length - 1].material = new MeshBasicMaterial({
      color: colorOutline.value,
      transparent: true,
      opacity: 0,
    });
    model.traverse((child: any) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });

    watch(isActiveOutline, (value) => {
      if (!model.children[model.children.length - 1].material) return;
      if (value) {
        model.children[model.children.length - 1].material.opacity = 1;
      } else {
        model.children[model.children.length - 1].material.opacity = 0;
      }
    });

    watch(colorOutline, (value) => {
      if (value) {
        model.children[model.children.length - 1].material.color = new Color(
          value
        );
      }
    });
  };

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

  return { setModel, newSetModel };
};
