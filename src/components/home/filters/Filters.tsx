import { createPortal } from "react-dom";
import { Modal } from "../../ui/modal/Modal";
import styles from "./filters.module.scss";
import { Button } from "../../ui/button/Button";
import { RiEqualizerLine } from "@remixicon/react";
import { useState } from "react";
import {
  useGetLabelsQuery,
  useGetPointEstimatesQuery,
  useGetStatusQuery,
  useGetUsersQuery,
} from "../../../generated/graphql";
import { pointEstimate } from "../../../hooks/PointEstimate";
import { tagToValue } from "../../../hooks/TagValue";
import { ListAvatar } from "../../ui/listAvatar/ListAvatar";
import { ListCheckBox } from "../../ui/listChexkbox/ListCheckBox";
import { CalendarC } from "../../ui/calendar/Calendar";
import { ListBox } from "../../ui/listBox/ListBox";
import useCardStore from "../../../store/useEditManager";
import { useCustomToast } from "../../../hooks/UseCustomToast";
import { Text } from "../../ui/text/Text";
import { columnName } from "../../../hooks/columnName";

export const Filters = () => {
  const [isShowModalFilter, setIsShowModalFilter] = useState<boolean>(false);

  const { showToast } = useCustomToast();

  const [selectedPointEstimate, setSelectedPointEstimate] =
    useState<string>("");
  const [selectedAssignee, setSelectedAssignee] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedDueDate, setSelectedDueDate] = useState<Date | null>();

  const { filtersSelected, filtersElement } = useCardStore();

  const {
    loading: isLoadingUsers,
    data: dataUsers,
    error: errorUsers,
  } = useGetUsersQuery();

  const {
    loading: isLoadingEstimate,
    data: dataEstimate,
    error: errorEstimate,
  } = useGetPointEstimatesQuery();

  const {
    data: dateLabels,
    loading: isLoadingLabels,
    error: errorLabel,
  } = useGetLabelsQuery();

  const {
    data: dataStatus,
    loading: isLoadingStatus,
    error: errorStatus,
  } = useGetStatusQuery();

  const order = Object.keys(pointEstimate);

  const points =
    dataEstimate?.__type?.enumValues
      ?.map((item, index) => ({
        id: String(index + 1),
        name: pointEstimate[item.name],
        value: item.name,
      }))
      .sort((a, b) => order.indexOf(a.value) - order.indexOf(b.value)) || [];

  const labels =
    dateLabels?.__type?.enumValues?.map((item, index) => ({
      id: String(index + 1),
      name: tagToValue[item.name],
      value: item.name,
    })) || [];

  const status = dataStatus?.__type?.enumValues?.map((item, index) => ({
    id: String(index + 1),
    name: columnName[item.name],
    value: item.name,
  }));

  const handleApplyFilters = () => {
    const filters = {
      dueDate: selectedDueDate || null,
      assigneeId: selectedAssignee,
      pointEstimate: selectedPointEstimate,
      status: selectedStatus,
      tags: selectedTags,
    };

    filtersSelected(filters);
    setIsShowModalFilter(false);
    console.warn("Filtros aplicados:", filters);
  };

  const handleClearFilters = () => {
    setSelectedPointEstimate("");
    setSelectedAssignee("");
    setSelectedStatus("");
    setSelectedTags([]);
    setSelectedDueDate(null);
  };

  if (isLoadingEstimate || isLoadingLabels || isLoadingUsers || isLoadingStatus)
    return <p>loading</p>;

  if (errorEstimate || errorLabel || errorUsers || errorStatus)
    return showToast("error", "failed to load elements");

  const handleCancel = () => {
    setIsShowModalFilter(false);
    if (filtersElement) {
      setSelectedStatus(filtersElement.status);
      setSelectedPointEstimate(filtersElement.pointEstimate);
      setSelectedAssignee(filtersElement.assigneeId);
      setSelectedTags(filtersElement.tags);
      setSelectedDueDate(
        filtersElement.dueDate ? new Date(filtersElement.dueDate) : null,
      );
    }
  };

  return (
    <div>
      <Button
        variant="default"
        onClick={() => setIsShowModalFilter(true)}
        className={styles.filterButton}
      >
        <RiEqualizerLine />
      </Button>

      {isShowModalFilter &&
        createPortal(
          <div className={styles.container}>
            <Modal.Container className={styles.modalContainer}>
              <Modal.Header className={styles.modalHeader}>
                <Text variant="title">Filters</Text>
              </Modal.Header>
              <Modal.Body className={styles.modalBody}>
                <div>
                  <ListBox
                    data={points}
                    displayKey="name"
                    valueKey="value"
                    placeholder="Estimate"
                    value={selectedPointEstimate}
                    onChange={(value: string | null) =>
                      setSelectedPointEstimate(value || "")
                    }
                  />
                </div>
                <div>
                  <ListAvatar
                    data={dataUsers?.users || []}
                    displayKey="fullName"
                    valueKey="id"
                    placeholder="Assignee"
                    value={selectedAssignee}
                    onChange={(value: string | null) =>
                      setSelectedAssignee(value || "")
                    }
                  />
                </div>
                <div>
                  <ListCheckBox
                    data={labels}
                    displayKey="name"
                    valueKey="value"
                    placeholder="Label"
                    value={selectedTags}
                    onChange={(values: string[]) => setSelectedTags(values)}
                  />
                </div>
                <div>
                  <ListBox
                    data={status || []}
                    displayKey="name"
                    valueKey="value"
                    placeholder="Status"
                    value={selectedStatus}
                    onChange={(value: string | null) =>
                      setSelectedStatus(value || "")
                    }
                  />
                </div>
                <div>
                  <CalendarC
                    value={selectedDueDate}
                    onChange={(date: Date | null) => setSelectedDueDate(date)}
                    placeholder="Due Date"
                  />
                </div>
              </Modal.Body>
              <Modal.Footer className={styles.modalFooter}>
                <Button
                  variant="default"
                  onClick={handleClearFilters}
                  className={styles.filterAction}
                >
                  Clear filters
                </Button>
                <Button
                  variant="primary"
                  onClick={handleCancel}
                  className={styles.filterAction}
                >
                  cancel
                </Button>
                <Button
                  variant="secondary"
                  onClick={handleApplyFilters}
                  className={styles.filterAction}
                >
                  Filter
                </Button>
              </Modal.Footer>
            </Modal.Container>
          </div>,
          document.getElementById("modal-root")!,
        )}
    </div>
  );
};
