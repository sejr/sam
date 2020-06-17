import fs from 'fs';
import path from 'path';
import { Post } from '@/models/Post';
import matter from 'gray-matter';
import { parse } from 'date-fns';
import readingTime from '@danieldietrich/reading-time';

/**
 * Retrieves information about a post, including its contents, title, and reading time.
 * @param filename The file we want to process.
 */
export function processPost(filename: string): Post {
    const postsDirectory = path.join(process.cwd(), 'posts');
    const parts = filename.split('-');
    const filePath = path.join(postsDirectory, filename + '.md');
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const {
        data: { title, tags },
        content,
        excerpt,
    } = matter(fileContents);
    const { minutes, words } = readingTime(content);
    const published = parse(
        parts.slice(0, 3).join('-'),
        'yyyy-MM-dd',
        new Date()
    );
    return {
        title,
        tags,
        filename,
        content,
        excerpt,
        minutes,
        words,
        slug: parts.join('-'),
        published,
    };
}

/**
 * Fetches information about posts given an array of Markdown file names.
 * @param filenames Files to fetch post information from.
 */
export function postsFromFilenames(filenames: string[]): Post[] {
    return filenames
        .reverse()
        .map((filename: string) => filename.split('.')[0])
        .map(processPost);
}

/**
 * If `post.published` is a `Date`, we convert it to an ISO string.
 * @param post The post to fix the date for.
 */
export function postPublishedToISOString(post: Post): Post {
    if (typeof post.published === 'object') {
        post.published = post.published.toISOString();
    }
    return post;
}

export function postsFromYear(post: Post, year: number): boolean {
    if (typeof post.published === 'object') {
        return post.published.getFullYear() == year;
    }

    throw new Error('`post.published` must be a valid `Date`');
}

export function postsFromMonth(post: Post, month: number): boolean {
    if (typeof post.published === 'object') {
        return post.published.getMonth() == month - 1;
    }

    throw new Error('`post.published` must be a valid `Date`');
}

export function postsFromDay(post: Post, day: number): boolean {
    if (typeof post.published === 'object') {
        return post.published.getDate() == day;
    }

    throw new Error('`post.published` must be a valid `Date`');
}
