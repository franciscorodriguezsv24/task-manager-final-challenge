import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/react";
import { RiLogoutBoxRLine, RiUserLine } from "@remixicon/react";
import { Avatar } from "../../ui/avatar/Avatar";
import styles from "./userUtils.module.scss";
import { Link } from "react-router";
import { Text } from "../../ui/text/Text";
import img from "../../../assets/profile.jpg";

export const UserUtils = () => {
  return (
    <div>
      <Menu>
        <MenuButton className={styles.buttonActionUser}>
          <Avatar imgUrl={img} alt="profile.img" />
        </MenuButton>
        <MenuItems className={styles.mainButtonUser} anchor="bottom end">
          <MenuItem>
            <Link to="/user-info" className={styles.buttonDropdownUser}>
              <RiUserLine />
              <Text variant="subtitle">Profile</Text>
            </Link>
          </MenuItem>

          <MenuItem as="button" className={styles.buttonDropdownUser}>
            <RiLogoutBoxRLine />
            <Text variant="subtitle">Logout</Text>
          </MenuItem>
        </MenuItems>
      </Menu>
    </div>
  );
};
