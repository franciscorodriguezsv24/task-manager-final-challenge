import { createPortal } from "react-dom";
import { Button } from "../../ui/button/Button";
import { useMutation, type Reference } from "@apollo/client";
import { DELETE_TASK } from "../../../api/graphql/queries.graphql";
import { Modal } from "../../ui/modal/Modal";
import styles from "./deleteTask.module.scss";
import { Text } from "../../ui/text/Text";
import { useCustomToast } from "../../../hooks/UseCustomToast";

export const DeleteTask = ({
  onClose,
  id,
}: {
  onClose: () => void;
  id: string;
}) => {
  const { showToast } = useCustomToast();

  const [deleteTask, { loading: isLoading }] = useMutation(DELETE_TASK, {
    update(cache, { data }) {
      if (!data?.deleteTask) return;

      cache.modify({
        fields: {
          tasks(existingTasks: readonly Reference[] = [], { readField }) {
            return existingTasks.filter(
              (taskRef) => readField("id", taskRef) !== data.deleteTask.id,
            );
          },
        },
      });
    },
  });

  const handleDelete = () => {
    deleteTask({
      variables: { input: { id: id } },
      optimisticResponse: {
        deleteTask: {
          __typename: "Task",
          id: id,
        },
      },
    });
    showToast("success", "Your task has been deleted");
  };

  return createPortal(
    <div className={styles.container}>
      <Modal.Container className={styles.modalContainer}>
        <Modal.Body className={styles.modalBody}>
          <Text variant="title">Delete Task</Text>
          <Text variant="subtitle">
            Are you sure you want to delete this Task?
          </Text>
        </Modal.Body>
        <Modal.Footer className={styles.modalFooter}>
          <Button
            variant="default"
            onClick={onClose}
            className={styles.buttonAction}
          >
            Go Back
          </Button>
          <Button
            variant="secondary"
            onClick={handleDelete}
            className={styles.buttonAction}
          >
            {isLoading ? "Deleting..." : "Delete"}
          </Button>
        </Modal.Footer>
      </Modal.Container>
    </div>,
    document.getElementById("modal-root")!,
  );
};
