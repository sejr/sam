export interface Post {
    title: string;
    tags: string[];
    slug: string;
    filename?: string;
    content?: string;
    excerpt?: string;
    published: string;
    new?: boolean;
}
