import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react";
import styles from "./listBox.module.scss";
import { RiStairsFill } from "@remixicon/react";

interface ListBoxProps<T> {
  data: T[];
  displayKey: keyof T;
  valueKey: keyof T;
  placeholder?: string;
  value: string | null;
  onChange: (value: string | null) => void;
}

export const ListBox = <T,>({
  data,
  displayKey,
  valueKey,
  placeholder = "Selecciona una opción",
  value,
  onChange,
}: ListBoxProps<T>) => {
  const selectedItem =
    data.find((item) => String(item[valueKey]) === value) ?? null;

  const handleChange = (item: T | null) => {
    if (item) {
      onChange(String(item[valueKey]));
    } else {
      onChange(null);
    }
  };

  return (
    <Listbox value={selectedItem} onChange={handleChange}>
      <ListboxButton className={styles.listButton}>
        {placeholder === "Status" ? (
          <RiStairsFill />
        ) : (
          <div className={styles.iconContainer}>+-</div>
        )}
        {selectedItem ? String(selectedItem[displayKey]) : placeholder}
      </ListboxButton>
      <ListboxOptions anchor="bottom start" className={styles.optionsBox}>
        {data.map((item) => (
          <ListboxOption
            key={String(item[valueKey])}
            value={item}
            className={
              placeholder === "Status"
                ? styles.listBoxElementsStats
                : styles.listBoxElements
            }
          >
            {placeholder === "Status" ? (
              <RiStairsFill />
            ) : (
              <div className={styles.iconContainer}>+-</div>
            )}
            {String(item[displayKey])}
          </ListboxOption>
        ))}
      </ListboxOptions>
    </Listbox>
  );
};
