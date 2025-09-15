import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react";
import { useState } from "react";
import styles from "./listAvatar.module.scss";
import { Avatar } from "../avatar/Avatar";
import { Text } from "../text/Text";
import { RiUser3Fill } from "@remixicon/react";

interface ListBoxProps<T> {
  data: T[];
  displayKey: keyof T;
  valueKey?: keyof T;
  placeholder?: string;
  image: keyof T;
}

export const ListAvatar = <T,>({
  data,
  displayKey,
  valueKey,
  image,
  placeholder = "Selecciona una opción",
}: ListBoxProps<T>) => {
  const [selectedItem, setSelectedItem] = useState<T | null>(null);

  return (
    <Listbox value={selectedItem} onChange={setSelectedItem}>
      <ListboxButton className={styles.listButtonAvatar}>
        {selectedItem ? (
          <Avatar
            imgUrl={String(selectedItem[image])}
            alt={String(selectedItem[displayKey])}
            className={styles.minusAvatar}
          />
        ) : (
          <RiUser3Fill />
        )}
        <Text variant="subtitle" className={styles.textStyle}>
          {selectedItem ? String(selectedItem[displayKey]) : placeholder}
        </Text>
      </ListboxButton>
      <ListboxOptions anchor="bottom start" className={styles.optionsBoxAvatar}>
        {data.map((item, index) => (
          <ListboxOption
            key={valueKey ? String(item[valueKey]) : index}
            value={item}
            className={styles.listBoxElementsAvatar}
          >
            <Avatar
              imgUrl={String(item[image])}
              alt={String(item[displayKey])}
              className={styles.minusAvatar}
            />
            <Text variant="subtitle" className={styles.textStyle}>
              {String(item[displayKey])}
            </Text>
          </ListboxOption>
        ))}
      </ListboxOptions>
    </Listbox>
  );
};
