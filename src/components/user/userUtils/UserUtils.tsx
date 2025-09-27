import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/react";
import {
  RiLogoutBoxRLine,
  RiMoonFill,
  RiSunFill,
  RiUserLine,
} from "@remixicon/react";
import { Avatar } from "../../ui/avatar/Avatar";
import styles from "./userUtils.module.scss";
import { Link } from "react-router";
import { Text } from "../../ui/text/Text";
import img from "../../../assets/profile.jpg";
import { useThemeStore } from "../../../store/useThemeManager";

export const UserUtils = () => {
  const { theme, toggleTheme } = useThemeStore();

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

          <MenuItem
            as="button"
            onClick={toggleTheme}
            className={styles.buttonDropdownUser}
          >
            {theme === "light" ? <RiMoonFill /> : <RiSunFill />} Switch
          </MenuItem>
        </MenuItems>
      </Menu>
    </div>
  );
};
