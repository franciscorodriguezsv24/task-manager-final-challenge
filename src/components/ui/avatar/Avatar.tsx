import styles from "./avatar.module.scss";

interface AvatarProps {
  imgUrl: string;
  alt: string;
}

export const Avatar = ({ imgUrl, alt, ...props }: AvatarProps) => {
  return <img src={imgUrl} alt={alt} className={styles.avatarImg} {...props} />;
};
