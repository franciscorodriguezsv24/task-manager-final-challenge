import { RiCloseLine } from "@remixicon/react";
import { Button } from "../../../ui/button/Button";
import styles from "./filterBadge.module.scss";
import useCardStore from "../../../../store/useEditManager";
import { pointEstimate } from "../../../../hooks/PointEstimate";
import { tagToValue } from "../../../../hooks/TagValue";
import { columnName } from "../../../../hooks/columnName";
import { formatDate } from "../../../../hooks/FormatedDate";
import { useGetUsersQuery } from "../../../../generated/graphql";

export const FilterBadge = () => {
  const { filtersSelected, filtersElement } = useCardStore();

  const { data: dataUsers } = useGetUsersQuery();

  const getUserName = (userId: string) => {
    const user = dataUsers?.users.find((user) => user.id === userId);
    return user?.fullName || "Unknown User";
  };

  const pointDelete = () => {
    if (!filtersElement) return;

    filtersSelected({
      ...filtersElement,
      pointEstimate: "",
    });
  };

  const userDelete = () => {
    if (!filtersElement) return;

    filtersSelected({
      ...filtersElement,
      assigneeId: "",
    });
  };

  const tagsDelete = () => {
    if (!filtersElement) return;

    filtersSelected({
      ...filtersElement,
      tags: [],
    });
  };

  const statusDelete = () => {
    if (!filtersElement) return;

    filtersSelected({
      ...filtersElement,
      status: "",
    });
  };

  const dateDelete = () => {
    if (!filtersElement) return;

    filtersSelected({
      ...filtersElement,
      dueDate: null,
    });
  };
  return (
    <>
      {filtersElement && (
        <div className={styles.containerButtons}>
          <Button
            variant="filter"
            className={
              !filtersElement.pointEstimate ? styles.button : undefined
            }
            onClick={pointDelete}
          >
            {pointEstimate[filtersElement.pointEstimate]}
            <RiCloseLine />
          </Button>
          <Button
            variant="filter"
            className={!filtersElement.assigneeId ? styles.button : undefined}
            onClick={userDelete}
          >
            {getUserName(filtersElement.assigneeId)}
            <RiCloseLine />
          </Button>
          <Button
            variant="filter"
            className={
              filtersElement.tags.length <= 0 ? styles.button : undefined
            }
            onClick={tagsDelete}
          >
            {tagToValue[filtersElement.tags[0]]}
            <RiCloseLine />
          </Button>
          <Button
            variant="filter"
            className={!filtersElement.status ? styles.button : undefined}
            onClick={statusDelete}
          >
            {columnName[filtersElement.status]}
            <RiCloseLine />
          </Button>
          <Button
            variant="filter"
            className={!filtersElement.dueDate ? styles.button : undefined}
            onClick={dateDelete}
          >
            {formatDate(filtersElement.dueDate)}
            <RiCloseLine />
          </Button>
        </div>
      )}
    </>
  );
};
