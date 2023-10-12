import { Object3D } from "three";
import { MeshBasicMaterial, Color } from "three";
export const useModelSettings = () => {
  const hudStore = useHudStore();
  const characterStore = useCharacterStore();

  const { isActiveOutline, colorOutline } = storeToRefs(hudStore);

  const setModel = (model: Object3D) => {
    model.children[model.children.length - 1].material.dispose();
    model.children[model.children.length - 1].material = new MeshBasicMaterial({
      color: colorOutline.value,
      transparent: true,
      opacity: 1,
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

  return { setModel };
};
