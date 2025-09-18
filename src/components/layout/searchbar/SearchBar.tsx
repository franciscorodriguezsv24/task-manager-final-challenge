import useCardStore from "../../../store/useEditManager";
import { Avatar } from "../../ui/avatar/Avatar";
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
          type="text"
          value={searchCardElement || ""}
          onChange={handleInputChange}
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
