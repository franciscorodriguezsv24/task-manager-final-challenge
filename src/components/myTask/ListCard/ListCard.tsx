import type { GetTasksQuery } from "../../../generated/graphql";
import { tagToValue } from "../../../hooks/TagValue";
import { Badge } from "../../ui/badge/Badge";
import { Text } from "../../ui/text/Text";
import styles from "./listCard.module.scss";
import { formatDate } from "../../../hooks/FormatedDate";
import { Avatar } from "../../ui/avatar/Avatar";
import { pointEstimate } from "../../../hooks/PointEstimate";

type Tasks = GetTasksQuery["tasks"];
type Task = Tasks[0];

function labelTag(label: string): string | null {
  return tagToValue[label] ?? null;
}

function numberName(point: string): string | null {
  return pointEstimate[point] ?? null;
}

export const ListCard = ({ task }: { task: Task }) => {
  return (
    <div className={styles.containerCard}>
      <div className={styles.label}>
        <Text variant="subtitle">{task.name}</Text>
      </div>
      <div className={styles.label}>
        {task.tags.length > 0 && (
          <>
            <Badge variant={task.tags[0].toLowerCase()} key={task.tags[0]}>
              {labelTag(task.tags[0])}
            </Badge>

            {task.tags.length > 1 && (
              <Badge variant="default" key="extra-tags">
                +{task.tags.length - 1}
              </Badge>
            )}
          </>
        )}
      </div>
      <div className={styles.label}>
        <Text variant="subtitle">{numberName(task.pointEstimate)}</Text>
      </div>
      <div className={styles.label}>
        <Avatar
          imgUrl="https://picsum.photos/200/300"
          alt={task.assignee?.fullName}
          className={styles.avatar}
        />
        <Text variant="subtitle" className={styles.fullName}>
          {task.assignee?.fullName}
        </Text>
      </div>

      <div className={styles.label}>
        <Text variant="subtitle">{formatDate(task.dueDate)}</Text>
      </div>
    </div>
  );
};
