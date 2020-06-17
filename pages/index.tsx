import fs from 'fs';
import path from 'path';
import { NextPage } from 'next';
import PostListItem from '@/components/PostListItem';
import { Post } from '@/models/Post';
import postListStyles from '@/assets/PostList.module.css';
import { postsFromFilenames, postPublishedToISOString } from '@/util/post';
import Index from '@/components/Index';

export function getStaticProps() {
    const postsDirectory = path.join(process.cwd(), 'posts');
    const filenames = fs.readdirSync(postsDirectory);
    const posts = postsFromFilenames(filenames).map(postPublishedToISOString);

    return {
        props: {
            posts,
        },
    };
}

export const description =
    'Samuel Roth is a software engineer in New York City, primarily interested in programming languages, web security, and start-ups.';

interface IndexProps {
    posts: Post[];
}

const IndexPage: NextPage<IndexProps> = ({ posts }) => (
    <Index title="Samuel Roth | sam.dev" description={description}>
        <p>{description}</p>
        <div className={postListStyles.postList}>
            {posts.map((post) => (
                <PostListItem key={post.slug} post={post} />
            ))}
        </div>
    </Index>
);

export default IndexPage;
