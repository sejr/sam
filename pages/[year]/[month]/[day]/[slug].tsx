import fs from 'fs';
import path from 'path';
import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Post } from '@/models/Post';
import Layout from '@/components/Layout';
import CodeBlock from '@/components/CodeBlock';
import Head from 'next/head';
import { format } from 'date-fns';
import { description } from '@/pages';
import postDetailStyles from '@/assets/PostDetail.module.css';
import logoStyles from '@/assets/Logo.module.css';
import { processPost, postPublishedToISOString } from '@/util/post';
import Link from 'next/link';

export async function getStaticProps({ params }: any) {
    const { year, month, day, slug } = params;
    const filename = [year, month, day, slug].join('-');
    return {
        props: {
            post: postPublishedToISOString(processPost(filename)),
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
        <Layout title={title} description={description}>
            <Head>
                <link
                    href="https://fonts.googleapis.com/css2?family=Overpass+Mono:wght@400;700&display=swap"
                    rel="stylesheet"
                />
            </Head>

            <div className={postDetailStyles.logoContainer}>
                <Link href="/">
                    <a className={logoStyles.logoLink}>
                        <img
                            className={logoStyles.logo}
                            src="/images/s.svg"
                            title="Samuel Roth | sam.dev"
                            alt="sam.dev"
                        />
                    </a>
                </Link>
            </div>

            <h1 className={postDetailStyles.title}>{post.title}</h1>
            <p className={postDetailStyles.published}>
                {format(new Date(post.published), 'PPP')}
                {post.minutes && <span> • {post.minutes} minute read</span>}
            </p>
            <ReactMarkdown
                source={post.content}
                renderers={{ code: CodeBlock }}
                linkTarget="_blank"
            />
        </Layout>
    );
};

export default PostDetail;
