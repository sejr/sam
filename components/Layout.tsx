import Head from 'next/head';
import layoutStyles from '@/assets/Layout.module.css';
import { Fragment } from 'react';

interface LayoutProps {
    title: string;
    description: string;
    children: React.ReactNode;
}

export default ({ title, description, children }: LayoutProps) => {
    return (
        <div className={layoutStyles.layout}>
            <Head>
                <title>{title}</title>
                <meta name="description" content={description}></meta>
                <link
                    href="https://fonts.googleapis.com/css2?family=Source+Code+Pro:wght@400;700&display=swap"
                    rel="stylesheet"
                />
                <link rel="icon" href="/images/icon.png" />
                {['og', 'twitter'].map((tag) => (
                    <Fragment>
                        <meta property={`${tag}:title`} content={title} />
                        <meta
                            property={`${tag}:description`}
                            content={description}
                        />
                        <meta
                            property={`${tag}:image`}
                            content="/images/banner.png"
                        />
                    </Fragment>
                ))}
            </Head>
            <div>{children}</div>
        </div>
    );
};
