export const useEquipmentUtils = () => {
  const equipmentStore = useEquipmentStore();
  const { isActiveHandItemTitle, itemSrcList } = storeToRefs(equipmentStore);
  const storeEquipmentDescription = useEquipmentDescriptionsStore();
  const { equipmentDescriptionsList } = storeToRefs(storeEquipmentDescription);

  const setMinusHealth = (): number => {
    const index = equipmentDescriptionsList.value.findIndex(
      (data) => data.title === isActiveHandItemTitle.value
    );

    return equipmentDescriptionsList.value[index].power || 1;
  };

  const getSrcItem = (title: string): string => {
    const data = itemSrcList.value.find((data) => data.title === title);
    return data.src || "";
  };

  return { getSrcItem, setMinusHealth };
};
