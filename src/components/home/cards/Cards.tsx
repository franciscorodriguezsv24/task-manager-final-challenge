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
  return (
    <Card.Container className={styles.cardContainer}>
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
          <Badge variant="default">
            <RiAlarmLine /> Today
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
        <Avatar imgUrl="https://picsum.photos/200/300" alt="testing2" />
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
