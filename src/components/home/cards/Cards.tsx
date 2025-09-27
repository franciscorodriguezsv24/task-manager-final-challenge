import {
  RiAlarmLine,
  RiAttachment2,
  RiChat3Line,
  RiNodeTree,
} from "@remixicon/react";
import { Avatar } from "../../ui/avatar/Avatar";
import { Badge } from "../../ui/badge/Badge";
import { Card } from "../../ui/card/Card";
import { Text } from "../../ui/text/Text";
import styles from "./card.module.scss";
import { DropdownEdit } from "../dropdownEdit/DropdownEdit";
import type { GetTasksQuery } from "../../../generated/graphql";
import { pointEstimate } from "../../../hooks/PointEstimate";
import { tagToValue } from "../../../hooks/TagValue";
import { formatDate } from "../../../hooks/FormatedDate";
import { UseMediaQuery } from "../../../hooks/UseMediaQuery";
import { useDraggable } from "@dnd-kit/core";
import { Button, TooltipTrigger } from "react-aria-components";
import { Tooltip } from "../../ui/tooltip/Tooltip";

function numberName(point: string): string | null {
  return pointEstimate[point] ?? null;
}

function labelTag(label: string): string | null {
  return tagToValue[label] ?? null;
}

type Tasks = GetTasksQuery["tasks"];
type Task = Tasks[0];

const random0T09 = Math.floor(Math.random() * 10);
const random0To100 = Math.floor(Math.random() * 100) + 1;

export const Cards = ({ task }: { task: Task }) => {
  const isMobile = UseMediaQuery("(max-width: 880px)");

  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: task.id,
    disabled: isMobile,
    data: {
      type: "task",
      task: task,
    },
  });

  const isFormElement = (target: HTMLElement): boolean => {
    return (
      target.tagName === "INPUT" ||
      target.tagName === "TEXTAREA" ||
      target.tagName === "SELECT" ||
      target.contentEditable === "true" ||
      target.closest("input") !== null ||
      target.closest("textarea") !== null ||
      target.closest("select") !== null ||
      target.closest('[contenteditable="true"]') !== null ||
      target.closest("#modal-root") !== null
    );
  };

  const smartListeners = {
    ...listeners,
    onKeyDown: (event: React.KeyboardEvent) => {
      const target = event.target as HTMLElement;

      if (isFormElement(target)) {
        return;
      }

      if (listeners?.onKeyDown) {
        listeners.onKeyDown(event);
      }
    },
    onMouseDown: (event: React.MouseEvent) => {
      const target = event.target as HTMLElement;

      if (isFormElement(target)) {
        return;
      }

      if (listeners?.onMouseDown) {
        listeners.onMouseDown(event);
      }
    },
    onPointerDown: (event: React.PointerEvent) => {
      const target = event.target as HTMLElement;

      if (isFormElement(target)) {
        return;
      }

      if (listeners?.onPointerDown) {
        listeners.onPointerDown(event);
      }
    },
  };

  const style = {
    opacity: isDragging ? 0.3 : 1,
    cursor: isDragging ? "grabbing" : "grab",
    zIndex: isDragging ? 1000 : "auto",
  };

  return (
    <Card.Container
      ref={setNodeRef}
      {...smartListeners}
      {...attributes}
      className={styles.cardContainer}
      style={style}
    >
      <Card.Header className={styles.cardHeader}>
        <Text variant="title">{task.name}</Text>
        <DropdownEdit
          task={{ id: task.id }}
          taskElement={{
            id: task.id,
            assigneeId: { id: task.assignee?.id || "" },
            dueDate: task.dueDate,
            name: task.name,
            pointEstimate: task.pointEstimate,
            status: task.status,
            tags: task.tags,
          }}
        />
      </Card.Header>
      <Card.Body className={styles.cardBody}>
        <div className={styles.pointsContainer}>
          <Text variant="title">{numberName(task.pointEstimate)}</Text>
          <Badge date={task.dueDate}>
            <RiAlarmLine /> {formatDate(task.dueDate)}
          </Badge>
        </div>
        <div className={styles.badgeContainer}>
          {task.tags.map((tag) => {
            return (
              <Badge variant={tag.toLowerCase()} key={tag}>
                {labelTag(tag)}
              </Badge>
            );
          })}
        </div>
      </Card.Body>
      <Card.Footer className={styles.footerCard}>
        <div className={styles.avatarContainer}>
          <TooltipTrigger>
            <Button className={styles.contianerButtonAvatar}>
              <Avatar imgUrl="https://picsum.photos/200/300" alt="testing2" />
            </Button>
            <Tooltip>{task.assignee?.fullName}</Tooltip>
          </TooltipTrigger>
        </div>
        <div className={styles.detailsContainer}>
          <RiAttachment2 size={16} />
          <div className={styles.iconText}>
            <Text variant="text">{random0To100}</Text>
            <RiNodeTree size={16} />
          </div>
          <div className={styles.iconText}>
            <Text variant="text">{random0T09}</Text>
            <RiChat3Line size={16} />
          </div>
        </div>
      </Card.Footer>
    </Card.Container>
  );
};
