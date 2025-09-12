import { useState } from "react";
import { Modal } from "../../ui/modal/Modal";
import { RiAddFill } from "@remixicon/react";
import { Button } from "../../ui/button/Button";
import styles from "./createTask.module.scss";
import { createPortal } from "react-dom";
import { ListBox } from "../../ui/listBox/ListBox";
import { ListAvatar } from "../../ui/listAvatar/ListAvatar";
import { ListCheckBox } from "../../ui/listChexkbox/ListCheckBox";
import { CalendarC } from "../../ui/calendar/Calendar";

export const CreateTask = () => {
  const [isShowModal, setIsShowModal] = useState<boolean>(false);

  const points = [
    { id: 1, value: "0 points" },
    { id: 2, value: "1 points" },
    { id: 3, value: "2 points" },
    { id: 4, value: "3 points" },
    { id: 5, value: "4 points" },
  ];

  const user = [
    {
      id: 1,
      name: "Francisco hernandez",
      img: "https://picsum.photos/200/300",
    },
    {
      id: 2,
      name: "Maria Rodriguezzzzzzzzzzzxxxxxxxxxx",
      img: "https://picsum.photos/200/300",
    },
    { id: 3, name: "Carlos Martinez", img: "https://picsum.photos/200/300" },
    { id: 4, name: "Ana Lopez", img: "https://picsum.photos/200/300" },
    { id: 5, name: "Diego Fernandez", img: "https://picsum.photos/200/300" },
  ];

  return (
    <div>
      <Button
        variant="secondary"
        className={styles.buttons}
        onClick={() => setIsShowModal(true)}
      >
        <RiAddFill />
      </Button>

      {isShowModal &&
        createPortal(
          <div className={styles.container}>
            <Modal.Container className={styles.modalContainer}>
              <Modal.Header className={styles.modalHeader}>
                task Title
              </Modal.Header>
              <Modal.Body className={styles.modalBody}>
                <ListBox
                  data={points}
                  displayKey="value"
                  key="id"
                  placeholder="Estimate..."
                />
                <ListAvatar
                  data={user}
                  displayKey="name"
                  key="id"
                  image="img"
                  placeholder="Assignee"
                />
                <ListCheckBox
                  data={points}
                  displayKey="value"
                  key="id"
                  placeholder="Label"
                />
                <CalendarC />
              </Modal.Body>
              <Modal.Footer className={styles.modalFooter}>
                testing
                <Button variant="primary" onClick={() => setIsShowModal(false)}>
                  Close
                </Button>
              </Modal.Footer>
            </Modal.Container>
          </div>,
          document.getElementById("modal-root")!,
        )}
    </div>
  );
};
