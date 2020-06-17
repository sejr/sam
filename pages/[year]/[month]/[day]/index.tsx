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
    postsFromDay,
} from '@/util/post';
import Index from '@/components/Index';

export function getStaticProps({ params }: any) {
    const { year, month, day } = params;
    const postsDirectory = path.join(process.cwd(), 'posts');
    const filenames = fs.readdirSync(postsDirectory);
    const posts = postsFromFilenames(filenames)
        .filter((post) => postsFromYear(post, year))
        .filter((post) => postsFromMonth(post, month))
        .filter((post) => postsFromDay(post, day))
        .map(postPublishedToISOString);

    return {
        props: {
            posts,
            year,
            month,
            day,
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
                    day: parts[2],
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
    day: string;
}

const IndexPage: NextPage<IndexProps> = ({ year, month, day, posts }) => (
    <Index title="Samuel Roth | sam.dev" description={description}>
        <h1>
            {format(
                new Date(parseInt(year), parseInt(month) - 1, parseInt(day)),
                'PPP'
            )}
        </h1>

        <div className="post-list">
            {posts.map((post) => (
                <PostListItem key={post.slug} post={post} />
            ))}
        </div>
    </Index>
);

export default IndexPage;
