import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react";
import styles from "./listCheckBox.module.scss";
import { RiPriceTag3Fill } from "@remixicon/react";

interface ListBoxProps<T> {
  data: T[];
  displayKey: keyof T;
  valueKey: keyof T;
  placeholder?: string;
  value: string[];
  onChange: (value: string[]) => void;
}

export const ListCheckBox = <T,>({
  data,
  displayKey,
  valueKey,
  placeholder = "Selecciona una opción",
  value,
  onChange,
}: ListBoxProps<T>) => {
  const handleSelectionChange = (item: T) => {
    const itemString = String(item[valueKey]);
    const isAlreadySelected = value.includes(itemString);

    let newValue: string[];
    if (isAlreadySelected) {
      newValue = value.filter((selected) => selected !== itemString);
    } else {
      newValue = [...value, itemString];
    }

    onChange(newValue);
  };

  const isItemSelected = (item: T): boolean => {
    const itemString = String(item[valueKey]);
    return value.includes(itemString);
  };

  const getDisplayText = (): string => {
    if (value.length === 0) return placeholder;

    const firstItem = data.find((item) => String(item[valueKey]) === value[0]);
    const firstLabel = firstItem ? String(firstItem[displayKey]) : value[0];

    if (value.length === 1) return firstLabel;
    return `${firstLabel} +${value.length - 1}`;
  };

  return (
    <Listbox value={value} onChange={() => {}} multiple>
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
            onClick={(e) => {
              e.preventDefault();
              handleSelectionChange(item);
            }}
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
