import styles from "./avatar.module.scss";

interface AvatarProps {
  imgUrl: string;
  alt?: string;
  className?: string;
}

export const Avatar = ({ imgUrl, alt, className, ...props }: AvatarProps) => {
  return (
    <img
      src={imgUrl}
      alt={alt}
      className={`${styles.avatarImg} ${className}`}
      {...props}
    />
  );
};
