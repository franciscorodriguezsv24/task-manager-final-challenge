import { RiCloseLine } from "@remixicon/react";
import { Button } from "react-aria-components";
import styles from "./filterBadge.module.scss";
import useCardStore from "../../../../store/useEditManager";
import { pointEstimate } from "../../../../hooks/PointEstimate";
import { tagToValue } from "../../../../hooks/TagValue";
import { columnName } from "../../../../hooks/columnName";
import { formatDate } from "../../../../hooks/FormatedDate";
import { useGetUsersQuery } from "../../../../generated/graphql";
import { TooltipTrigger } from "react-aria-components";
import { Tooltip } from "../../../ui/tooltip/Tooltip";

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
            className={
              !filtersElement.pointEstimate ? styles.button : styles.filter
            }
            onClick={pointDelete}
          >
            {pointEstimate[filtersElement.pointEstimate]}
            <RiCloseLine />
          </Button>
          <Button
            className={
              !filtersElement.assigneeId ? styles.button : styles.filter
            }
            onClick={userDelete}
          >
            {getUserName(filtersElement.assigneeId)}
            <RiCloseLine />
          </Button>
          <TooltipTrigger>
            <Button
              className={
                filtersElement.tags.length <= 0 ? styles.button : styles.filter
              }
              onClick={tagsDelete}
            >
              {tagToValue[filtersElement.tags[0]]}
              {filtersElement.tags.length > 1 &&
                ` +${filtersElement.tags.length - 1}`}
              <RiCloseLine />
            </Button>
            <Tooltip>
              {filtersElement.tags.slice(1).map((tag, index) => (
                <span key={index}>{tagToValue[tag]}</span>
              ))}
            </Tooltip>
          </TooltipTrigger>

          <Button
            className={!filtersElement.status ? styles.button : styles.filter}
            onClick={statusDelete}
          >
            {columnName[filtersElement.status]}
            <RiCloseLine />
          </Button>
          <Button
            className={!filtersElement.dueDate ? styles.button : styles.filter}
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
