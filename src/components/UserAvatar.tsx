import { UserOutlined } from '@ant-design/icons';
import { Avatar } from 'antd';
import type { CSSProperties, ReactNode } from 'react';

type AvatarSize = number | 'small' | 'default' | 'large';

interface UserAvatarProps {
    src?: string | null;
    alt?: string;
    size?: AvatarSize;
    shape?: 'circle' | 'square';
    style?: CSSProperties;
    className?: string;
    fallbackIcon?: ReactNode;
    onClick?: () => void;
}

const avatarImageStyle: CSSProperties = {
    width: '100%',
    height: '100%',
    display: 'block',
    objectFit: 'cover',
    imageRendering: 'auto',
    transform: 'translateZ(0)'
};

export const UserAvatar = ({
    src,
    alt = 'Avatar',
    size = 'default',
    shape = 'circle',
    style,
    className,
    fallbackIcon = <UserOutlined />,
    onClick
}: UserAvatarProps) => {
    const normalizedSrc = typeof src === 'string' && src.trim() ? src.trim() : undefined;

    return (
        <Avatar
            size={size}
            shape={shape}
            className={className}
            style={{ overflow: 'hidden', ...style }}
            icon={normalizedSrc ? undefined : fallbackIcon}
            src={
                normalizedSrc ? (
                    <img
                        src={normalizedSrc}
                        alt={alt}
                        draggable={false}
                        decoding='async'
                        referrerPolicy='no-referrer'
                        style={avatarImageStyle}
                    />
                ) : undefined
            }
            onClick={onClick}
        />
    );
};

export default UserAvatar;
