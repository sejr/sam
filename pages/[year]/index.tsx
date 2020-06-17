import fs from 'fs';
import path from 'path';
import { NextPage } from 'next';
import PostListItem from '@/components/PostListItem';
import { Post } from '@/models/Post';
import { description } from '..';
import {
    postPublishedToISOString,
    postsFromYear,
    postsFromFilenames,
} from '@/util/post';
import Index from '@/components/Index';

export function getStaticProps({ params }: any) {
    const { year } = params;
    const postsDirectory = path.join(process.cwd(), 'posts');
    const filenames = fs.readdirSync(postsDirectory);
    const posts = postsFromFilenames(filenames)
        .filter((post) => postsFromYear(post, year))
        .map(postPublishedToISOString);

    return {
        props: {
            posts,
            year,
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
}

const IndexPage: NextPage<IndexProps> = ({ year, posts }) => (
    <Index title="Samuel Roth | sam.dev" description={description}>
        <h1>{year}</h1>

        <div className="post-list">
            {posts.map((post) => (
                <PostListItem key={post.slug} post={post} />
            ))}
        </div>
    </Index>
);

export default IndexPage;
