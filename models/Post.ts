export interface Post {
    title: string;
    tags: string[];
    slug: string;
    filename?: string;
    content?: string;
    excerpt?: string;
    published: Date | string;
    new?: boolean;
    minutes?: number;
    words?: number;
}
