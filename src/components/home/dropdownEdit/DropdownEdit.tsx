import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/react";
import { RiDeleteBinLine, RiMoreFill, RiPencilLine } from "@remixicon/react";
import styles from "./dropdownedit.module.scss";
import { Text } from "../../ui/text/Text";

export const DropdownEdit = () => {
  return (
    <div className={styles.container}>
      <Menu>
        <MenuButton className={styles.buttonAction}>
          <RiMoreFill />
        </MenuButton>
        <MenuItems anchor="bottom end" className={styles.mainButton}>
          <MenuItem as="button" className={styles.buttonDropdown}>
            <RiPencilLine />
            <Text variant="subtitle">Edit</Text>
          </MenuItem>
          <MenuItem as="button" className={styles.buttonDropdown}>
            <RiDeleteBinLine />

            <Text variant="subtitle">Delete</Text>
          </MenuItem>
        </MenuItems>
      </Menu>
    </div>
  );
};
