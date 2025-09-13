import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react";
import { useState } from "react";
import styles from "./listBox.module.scss";

interface ListBoxProps<T> {
  data: T[];
  displayKey: keyof T;
  valueKey?: keyof T;
  placeholder?: string;
}

export const ListBox = <T,>({
  data,
  displayKey,
  valueKey,
  placeholder = "Selecciona una opción",
}: ListBoxProps<T>) => {
  const [selectedItem, setSelectedItem] = useState<T | null>(null);

  return (
    <Listbox value={selectedItem} onChange={setSelectedItem}>
      <ListboxButton className={styles.listButton}>
        <div className={styles.iconContainer}>+-</div>
        {selectedItem ? String(selectedItem[displayKey]) : placeholder}
      </ListboxButton>
      <ListboxOptions anchor="bottom" className={styles.optionsBox}>
        {data.map((item, index) => (
          <ListboxOption
            key={valueKey ? String(item[valueKey]) : index}
            value={item}
            className={styles.listBoxElements}
          >
            <div className={styles.iconContainer}>+-</div>

            {String(item[displayKey])}
          </ListboxOption>
        ))}
      </ListboxOptions>
    </Listbox>
  );
};
