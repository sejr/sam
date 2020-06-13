import fs from 'fs';
import path from 'path';
import { NextPage } from 'next';
import matter from 'gray-matter';
import Layout from '@/components/Layout';
import PostListItem from '@/components/PostListItem';
import { Post } from '@/models/Post';

export function getStaticProps() {
    const postsDirectory = path.join(process.cwd(), 'posts');
    const filenames = fs.readdirSync(postsDirectory);
    const posts = filenames
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
        },
    };
}

interface IndexProps {
    posts: Post[];
}

const IndexPage: NextPage<IndexProps> = ({ posts }) => (
    <Layout title="Samuel Roth | sam.dev">
        <p>
            I am a software engineer in New York City, primarily interested in
            programming languages, web security, and start-ups. This website
            hosts my writings about those and other topics.
        </p>

        <div className="post-list">
            {posts.map((post) => (
                <PostListItem key={post.slug} post={post} />
            ))}
        </div>
    </Layout>
);

export default IndexPage;
