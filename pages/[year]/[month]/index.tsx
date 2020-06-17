import fs from 'fs';
import path from 'path';
import { NextPage } from 'next';
import PostListItem from '@/components/PostListItem';
import { Post } from '@/models/Post';
import { format } from 'date-fns';
import { description } from '@/pages';
import {
    postsFromFilenames,
    postsFromYear,
    postsFromMonth,
    postPublishedToISOString,
} from '@/util/post';
import Index from '@/components/Index';

export function getStaticProps({ params }: any) {
    const { year, month } = params;
    const postsDirectory = path.join(process.cwd(), 'posts');
    const filenames = fs.readdirSync(postsDirectory);
    const posts = postsFromFilenames(filenames)
        .filter((post) => postsFromYear(post, year))
        .filter((post) => postsFromMonth(post, month))
        .map(postPublishedToISOString);

    return {
        props: {
            posts,
            year,
            month,
        },
    };
}

export async function getStaticPaths() {
    const postsDirectory = path.join(process.cwd(), 'posts');
    const filenames = fs.readdirSync(postsDirectory);
    const paths = filenames
        .map((filename: string) => filename.split('.')[0])
        .map((filename: string) => {
            const parts = filename.split('-');
            return {
                params: {
                    year: parts[0],
                    month: parts[1],
                },
            };
        });

    return {
        paths,
        fallback: false,
    };
}

interface IndexProps {
    posts: Post[];
    year: string;
    month: string;
}

const IndexPage: NextPage<IndexProps> = ({ year, month, posts }) => (
    <Index title="Samuel Roth | sam.dev" description={description}>
        <h1>
            {format(new Date(parseInt(year), parseInt(month) - 1), 'MMMM yyyy')}
        </h1>

        <div className="post-list">
            {posts.map((post) => (
                <PostListItem key={post.slug} post={post} />
            ))}
        </div>
    </Index>
);

export default IndexPage;
