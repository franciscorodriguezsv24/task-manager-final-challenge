import styles from "./userElement.module.scss";
import img from "../../../assets/profile.jpg";
import { Button } from "../../ui/button/Button";
import { Text } from "../../ui/text/Text";
import {
  RiCalendarCheckLine,
  RiCalendarLine,
  RiMailLine,
  RiMapPinLine,
  RiPagesLine,
  RiStairsLine,
} from "@remixicon/react";
import { useQuery } from "@apollo/client";
import { GET_PROFILE } from "../../graphql/queries.graphql";
import { formatDate } from "../../../hooks/FormatedDate";

export const UserElement = () => {
  const { data, loading: isLoadingProfile, error } = useQuery(GET_PROFILE);

  if (isLoadingProfile) return <p>Cargando...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const user = data.profile;

  console.warn(user);

  return (
    <div className={styles.containerProfile}>
      <div className={styles.backgroundContainer}></div>
      <div className={styles.containerData}>
        <div className={styles.userInfo}>
          <img src={img} alt="profile-img" className={styles.imgUser} />

          <div className={styles.profileNameContainer}>
            <Text variant="title">{user.fullName}</Text>
            <Button variant="default" className={styles.manageButton}>
              <Text variant="subtitle">Manage your account</Text>
            </Button>
          </div>
          <div className={styles.aboutContainer}>
            <Text variant="title">About</Text>

            <div className={styles.infoContainer}>
              <div className={styles.containerInfoUser}>
                <RiStairsLine />
                <Text variant="subtitle">Nerd</Text>
              </div>

              <div className={styles.containerInfoUser}>
                <RiMailLine />
                <Text variant="subtitle">{user.email}</Text>
              </div>

              <div className={styles.containerInfoUser}>
                <RiPagesLine />
                <Text variant="subtitle">{user.type.toLowerCase()}</Text>
              </div>

              <div className={styles.containerInfoUser}>
                <RiCalendarLine />
                <Text variant="subtitle">{formatDate(user.createdAt)}</Text>
              </div>

              <div className={styles.containerInfoUser}>
                <RiCalendarCheckLine />
                <Text variant="subtitle">{formatDate(user.updatedAt)}</Text>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.projectInfo}>
          <div className={styles.containerInfoWorked}>
            <Text variant="title">Worked on</Text>
            <Text variant="subtitle">
              Others will only see what they can access
            </Text>
            <div className={styles.workedContainer}></div>
          </div>
          <div className={styles.placeWorkedContainer}>
            <Text variant="title">Places you work in</Text>
            <div className={styles.placesWorked}>
              <RiMapPinLine />
              <Text variant="title" className={styles.textPlace}>
                We don't have places to show here yet
              </Text>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
