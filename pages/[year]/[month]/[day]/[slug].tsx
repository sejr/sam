import fs from 'fs';
import path from 'path';
import React from 'react';
import matter from 'gray-matter';
import ReactMarkdown from 'react-markdown';
import { Post } from '@/models/Post';
import Layout from '@/components/Layout';
import CodeBlock from '@/components/CodeBlock';
import Head from 'next/head';

export async function getStaticProps({ params }: any) {
    const { year, month, day, slug } = params;
    const filename = [year, month, day, slug].join('-') + '.md';
    const postsDirectory = path.join(process.cwd(), 'posts');
    const filePath = path.join(postsDirectory, filename);
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const {
        data: { title, tags },
        content,
        excerpt,
    } = matter(fileContents);
    return {
        props: {
            post: {
                title,
                tags: tags.split(', '),
                filename,
                content,
                excerpt,
                slug,
                published: new Date(
                    parseInt(year as string),
                    parseInt(month as string),
                    parseInt(day as string)
                ).toISOString(),
            },
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
                    slug: parts.slice(3).join('-'),
                },
            };
        });

    return {
        paths,
        fallback: false,
    };
}

export interface PostDetailProps {
    post: Post;
}

const PostDetail: React.FC<PostDetailProps> = ({ post }) => {
    const title = `${post.title} | Samuel Roth`;

    return (
        <Layout title={title}>
            <Head>
                <link
                    href="https://fonts.googleapis.com/css2?family=Overpass+Mono:wght@400;700&display=swap"
                    rel="stylesheet"
                />
            </Head>

            <h1 className="post-detail-title">{post.title}</h1>
            <ReactMarkdown
                source={post.content}
                renderers={{ code: CodeBlock }}
            />
        </Layout>
    );
};

export default PostDetail;
