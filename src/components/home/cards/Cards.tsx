import {
  RiAlarmLine,
  RiAttachment2,
  RiChat3Line,
  RiMoreFill,
  RiNodeTree,
} from "@remixicon/react";
import { Avatar } from "../../ui/avatar/Avatar";
import { Badge } from "../../ui/badge/Badge";
import { Button } from "../../ui/button/Button";
import { Card } from "../../ui/card/Card";
import { Text } from "../../ui/text/Text";
import styles from "./card.module.scss";

export const Cards = () => {
  return (
    <Card.Container className={styles.cardContainer}>
      <Card.Header className={styles.cardHeader}>
        <Text variant="title">Slack</Text>
        <Button className={styles.button}>
          <RiMoreFill />
        </Button>
      </Card.Header>
      <Card.Body className={styles.cardBody}>
        <div className={styles.pointsContainer}>
          <Text variant="title">4 poiint</Text>
          <Badge variant="default">
            <RiAlarmLine /> Today
          </Badge>
        </div>
        <div className={styles.badgeContainer}>
          <Badge variant="primary">IOS APP</Badge>
          <Badge variant="secondary">Android</Badge>
        </div>
      </Card.Body>
      <Card.Footer className={styles.footerCard}>
        <Avatar imgUrl="https://picsum.photos/200/300" alt="testing2" />
        <div className={styles.detailsContainer}>
          <RiAttachment2 size={16} />
          <div className={styles.iconText}>
            <Text variant="text">5</Text>
            <RiNodeTree size={16} />
          </div>
          <div className={styles.iconText}>
            <Text variant="text">3</Text>
            <RiChat3Line size={16} />
          </div>
        </div>
      </Card.Footer>
    </Card.Container>
  );
};
