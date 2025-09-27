import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/react";
import { RiDeleteBinLine, RiMoreFill, RiPencilLine } from "@remixicon/react";
import styles from "./dropdownedit.module.scss";
import { Text } from "../../ui/text/Text";
import { EditTask } from "../editTask/EditTask";
import { useState } from "react";
import useCardStore from "../../../store/useEditManager";
import { DeleteTask } from "../deleteTask/DeleteTask";

type TaskElements = {
  id: string;
  assigneeId: {
    id: string;
  };
  dueDate: Date;
  name: string;
  pointEstimate: string;
  status: string;
  tags: string[];
};

type DropdownEditProps = {
  task: {
    id: string;
  };
  taskElement: TaskElements;
};

export const DropdownEdit = ({ task, taskElement }: DropdownEditProps) => {
  const [isShowEditModal, setIsShowEditModal] = useState<boolean>(false);

  const [isShowDeleteModal, setIsShowDeleteModal] = useState<boolean>(false);

  const { selectCard } = useCardStore();

  return (
    <div className={styles.container}>
      <Menu>
        <MenuButton className={styles.buttonAction}>
          <RiMoreFill />
        </MenuButton>
        <MenuItems anchor="bottom end" className={styles.mainButton}>
          <MenuItem
            as="button"
            className={styles.buttonDropdown}
            onClick={() => {
              setIsShowEditModal(true);
              selectCard(taskElement);
            }}
          >
            <RiPencilLine />
            <Text variant="subtitle">Edit</Text>
          </MenuItem>
          <MenuItem
            as="button"
            className={styles.buttonDropdown}
            onClick={() => {
              setIsShowDeleteModal(true);
            }}
          >
            <RiDeleteBinLine />
            <Text variant="subtitle">Delete</Text>
          </MenuItem>
        </MenuItems>
      </Menu>

      {isShowEditModal && (
        <EditTask onClose={() => setIsShowEditModal(false)} />
      )}

      {isShowDeleteModal && (
        <DeleteTask onClose={() => setIsShowDeleteModal(false)} id={task.id} />
      )}
    </div>
  );
};
