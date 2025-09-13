import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react";
import { useState } from "react";
import styles from "./listCheckBox.module.scss";
import { RiPriceTag3Fill } from "@remixicon/react";

interface ListBoxProps<T> {
  data: T[];
  displayKey: keyof T;
  valueKey?: keyof T;
  placeholder?: string;
}

export const ListCheckBox = <T,>({
  data,
  displayKey,
  valueKey,
  placeholder = "Selecciona una opción",
}: ListBoxProps<T>) => {
  const [selectedItems, setSelectedItems] = useState<T[]>([]);

  const handleSelectionChange = (item: T) => {
    setSelectedItems((prevSelected) => {
      const isAlreadySelected = prevSelected.some((selected) =>
        valueKey ? selected[valueKey] === item[valueKey] : selected === item,
      );

      if (isAlreadySelected) {
        return prevSelected.filter((selected) =>
          valueKey ? selected[valueKey] !== item[valueKey] : selected !== item,
        );
      } else {
        return [...prevSelected, item];
      }
    });
  };

  const isItemSelected = (item: T): boolean => {
    return selectedItems.some((selected) =>
      valueKey ? selected[valueKey] === item[valueKey] : selected === item,
    );
  };

  const getDisplayText = (): string => {
    if (selectedItems.length === 0) return placeholder;
    if (selectedItems.length === 1) return String(selectedItems[0][displayKey]);
    return `${String(selectedItems[0][displayKey])} +${selectedItems.length - 1}`;
  };

  return (
    <Listbox value={selectedItems} onChange={() => {}} multiple>
      <ListboxButton className={styles.listButton}>
        <RiPriceTag3Fill />
        {getDisplayText()}
      </ListboxButton>
      <ListboxOptions anchor="bottom start" className={styles.optionsBox}>
        {data.map((item, index) => (
          <ListboxOption
            key={valueKey ? String(item[valueKey]) : index}
            value={item}
            className={styles.listBoxElements}
            onClick={() => handleSelectionChange(item)}
          >
            <input
              type="checkbox"
              checked={isItemSelected(item)}
              onChange={() => {}}
              className={styles.checkBoxElement}
            />
            {String(item[displayKey])}
          </ListboxOption>
        ))}
      </ListboxOptions>
    </Listbox>
  );
};
