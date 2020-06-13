import fs from 'fs';
import path from 'path';
import { NextPage } from 'next';
import matter from 'gray-matter';
import Layout from '@/components/Layout';
import PostListItem from '@/components/PostListItem';
import { Post } from '@/models/Post';

export function getStaticProps({ params }: any) {
    const { year } = params;
    const postsDirectory = path.join(process.cwd(), 'posts');
    const filenames = fs.readdirSync(postsDirectory);
    const posts = filenames
        .filter((filename: string) => filename.split('-')[0] === year)
        .map((filename: string) => filename.split('.')[0])
        .map((filename: string) => {
            const parts = filename.split('-');
            const filePath = path.join(postsDirectory, filename + '.md');
            const fileContents = fs.readFileSync(filePath, 'utf8');
            const { data, content, excerpt } = matter(fileContents);
            return {
                ...data,
                filename,
                content,
                excerpt,
                slug: parts.join('-'),
                published: new Date(
                    parseInt(parts[0]),
                    parseInt(parts[1]),
                    parseInt(parts[2])
                ).toISOString(),
            };
        });

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
    <Layout title="Samuel Roth | sam.dev">
        <h1>{year}</h1>

        <div className="post-list">
            {posts.map((post) => (
                <PostListItem key={post.slug} post={post} />
            ))}
        </div>
    </Layout>
);

export default IndexPage;
