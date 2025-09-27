import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import { RiArrowDownSLine, RiCloseCircleLine } from "@remixicon/react";
import { Text } from "../../ui/text/Text";
import styles from "./taskList.module.scss";
import useCardStore from "../../../store/useEditManager";
import {
  useGetTasksQuery,
  type FilterTaskInput,
} from "../../../generated/graphql";
import { ListCard } from "../../myTask/ListCard/ListCard";
import { columnName } from "../../../hooks/columnName";
import { LoadingComponent } from "../../ui/loading/Loading";
import { useMemo } from "react";

export const TaskList = () => {
  const { searchCardElement, filtersElement } = useCardStore();

  const queryInput = useMemo(() => {
    const input: FilterTaskInput = {};

    if (searchCardElement) {
      input.name = searchCardElement;
    }

    if (filtersElement) {
      if (filtersElement.assigneeId) {
        input.assigneeId = filtersElement.assigneeId;
      }
      if (filtersElement.dueDate) {
        input.dueDate = filtersElement.dueDate;
      }
      if (filtersElement.pointEstimate) {
        input.pointEstimate = filtersElement.pointEstimate;
      }
      if (filtersElement.tags && filtersElement.tags.length > 0) {
        input.tags = filtersElement.tags;
      }
      if (filtersElement.status) {
        input.status = filtersElement.status;
      }
    }

    return input;
  }, [searchCardElement, filtersElement]);

  const {
    loading: isloadingTasks,
    data: tasksData,
    error: errorData,
  } = useGetTasksQuery({
    variables: {
      input: queryInput,
    },
    context: {
      debounceKey: "1",
    },
    errorPolicy: "all",
  });

  if (isloadingTasks) {
    return <LoadingComponent />;
  }

  if (errorData) return <p>Unexpected Error</p>;

  const tasksByStatus =
    tasksData?.tasks?.reduce(
      (acc, task) => {
        acc[task.status] = acc[task.status]
          ? [...acc[task.status], task]
          : [task];
        return acc;
      },
      {} as Record<string, typeof tasksData.tasks>,
    ) || {};

  const orderedColumns = Object.keys(columnName).map((key) => ({ name: key }));
  return (
    <div className={styles.container}>
      <div className={styles.containerTitle}>
        <div className={styles.label}>
          <Text variant="subtitle"># Task Name</Text>
        </div>
        <div className={styles.label}>
          <Text variant="subtitle">Task Tags</Text>
        </div>
        <div className={styles.label}>
          <Text variant="subtitle">Estimate</Text>
        </div>
        <div className={styles.label}>
          <Text variant="subtitle">Assignee Name</Text>
        </div>

        <div className={styles.label}>
          <Text variant="subtitle">Due Date</Text>
        </div>
      </div>
      <div className={styles.containerAccordion}>
        {orderedColumns.map((acord) => (
          <Disclosure
            as="div"
            defaultOpen={true}
            key={acord.name}
            className={styles.accordion}
          >
            <DisclosureButton className={styles.accordionButton}>
              <span className={styles.accordionTitle}>
                {columnName[acord.name]} (
                {tasksByStatus[acord.name]?.length || 0})
              </span>
              <RiArrowDownSLine className={styles.accordionIcon} />
            </DisclosureButton>
            <DisclosurePanel className={styles.accordionPanel}>
              {tasksByStatus[acord.name]?.length >= 0 ? (
                tasksByStatus[acord.name].map((task) => (
                  <ListCard key={task.id} task={task} />
                ))
              ) : (
                <div className={styles.textUnavailable}>
                  <RiCloseCircleLine />
                  <Text variant="subtitle" className={styles.textError}>
                    No tasks available
                  </Text>
                </div>
              )}
            </DisclosurePanel>
          </Disclosure>
        ))}
      </div>
    </div>
  );
};
