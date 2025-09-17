import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/react";
import { RiDeleteBinLine, RiMoreFill, RiPencilLine } from "@remixicon/react";
import styles from "./dropdownedit.module.scss";
import { Text } from "../../ui/text/Text";
import { DELETE_TASK } from "../../graphql/queries.graphql";
import { useMutation } from "@apollo/client";
import type { Reference } from "@apollo/client";

type DropdownEditProps = {
  task: {
    id: string;
  };
};

export const DropdownEdit = ({ task }: DropdownEditProps) => {
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
      variables: { input: { id: task.id } },
      optimisticResponse: {
        deleteTask: {
          __typename: "Task",
          id: task.id, // 👈 usar el real, no hardcodeado
        },
      },
    });
  };

  return (
    <div className={styles.container}>
      <Menu>
        <MenuButton className={styles.buttonAction}>
          <RiMoreFill />
        </MenuButton>
        <MenuItems anchor="bottom end" className={styles.mainButton}>
          <MenuItem as="button" className={styles.buttonDropdown}>
            <RiPencilLine />
            <Text variant="subtitle">Edit</Text>
          </MenuItem>
          <MenuItem
            as="button"
            className={styles.buttonDropdown}
            onClick={handleDelete}
            disabled={isLoading}
          >
            <RiDeleteBinLine />

            <Text variant="subtitle">
              {isLoading ? "Deleting..." : "Delete"}
            </Text>
          </MenuItem>
        </MenuItems>
      </Menu>
    </div>
  );
};
