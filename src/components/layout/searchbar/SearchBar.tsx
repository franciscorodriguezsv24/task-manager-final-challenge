import useCardStore from "../../../store/useEditManager";
import { Filters } from "../../home/filters/Filters";
import { UserUtils } from "../../user/userUtils/UserUtils";
import styles from "./searchbar.module.scss";
import { RiNotification3Line, RiSearch2Line } from "@remixicon/react";

export const SearchBar = () => {
  const { searchCardElement, searchCard } = useCardStore();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    searchCard(e.target.value);
  };

  return (
    <div className={styles.navbarContainer}>
      <div className={styles.inputSearchContainer}>
        <RiSearch2Line className={styles.iconSearch} />
        <label htmlFor="searchStore" className={styles.visuallyHidden}>
          Search
        </label>
        <input
          id="searchStore"
          type="text"
          value={searchCardElement || ""}
          onChange={handleInputChange}
          placeholder="search"
          className={styles.homeInput}
        />
        <div className={styles.avatarContainer}>
          <div className={styles.filterContainer}>
            <Filters />
          </div>
          <RiNotification3Line className={styles.notificationIcon} />
          <UserUtils />
        </div>
      </div>
    </div>
  );
};
