import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react";
import styles from "./listAvatar.module.scss";
import { Avatar } from "../avatar/Avatar";
import { Text } from "../text/Text";
import { RiUser3Fill } from "@remixicon/react";

interface ListBoxProps<T> {
  data: T[];
  displayKey: keyof T;
  valueKey: keyof T;
  placeholder?: string;
  image?: string;
  value: string | null;
  onChange: (value: string | null) => void;
}

export const ListAvatar = <T,>({
  data,
  displayKey,
  valueKey,
  image = "https://picsum.photos/200/300",
  placeholder = "Selecciona una opción",
  value,
  onChange,
}: ListBoxProps<T>) => {
  const selectedItem =
    data.find((item) => String(item[valueKey]) === value) || null;

  const handleChange = (item: T | null) => {
    if (item) {
      onChange(String(item[valueKey]));
    } else {
      onChange(null);
    }
  };

  return (
    <Listbox value={selectedItem} onChange={handleChange}>
      <ListboxButton className={styles.listButtonAvatar}>
        {selectedItem ? (
          <Avatar
            imgUrl={image}
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
        {data.map((item) => (
          <ListboxOption
            key={String(item[valueKey])}
            value={item}
            className={styles.listBoxElementsAvatar}
          >
            <Avatar
              imgUrl={image}
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
