import { Avatar } from "../../ui/avatar/Avatar";
import styles from "./searchbar.module.scss";
import { RiNotification3Line, RiSearch2Line } from "@remixicon/react";

export const SearchBar = () => {
  return (
    <div className={styles.navbarContainer}>
      <div className={styles.inputSearchContainer}>
        <RiSearch2Line className={styles.iconSearch} />
        <label htmlFor="searchStore" className={styles.visuallyHidden}>
          Search
        </label>
        <input
          type="text"
          //   value={searchTerm}
          //   onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="search"
          className={styles.homeInput}
        />
        <div className={styles.avatarContainer}>
          <RiNotification3Line />
          <Avatar imgUrl="https://picsum.photos/200/300" alt="testing" />
        </div>
      </div>
    </div>
  );
};
