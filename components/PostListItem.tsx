import React from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { Post } from '@/models/Post';
import postListItemStyles from '@/assets/PostListItem.module.css';

interface PostListItemProps {
    post: Post;
}

const PostListItem: React.FC<PostListItemProps> = ({ post }) => {
    const published = new Date(post.published);
    const prefix = post.slug.split('-').slice(0, 3).join('/');
    const suffix = post.slug.split('-').slice(3).join('-');
    const as = `/${[prefix, suffix].join('/')}`;

    return (
        <div className={postListItemStyles.postListItem}>
            <h2>
                <Link href="/[year]/[month]/[day]/[slug]" as={as}>
                    <a>{post.title}</a>
                </Link>
                {post.new && (
                    <span className={postListItemStyles.new}>New</span>
                )}
            </h2>
            <p className={postListItemStyles.meta}>
                {format(published, 'PPP')}
            </p>
        </div>
    );
};

export default PostListItem;
