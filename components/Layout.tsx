import Head from 'next/head';
import Link from 'next/link';
import layoutStyles from '@/assets/Layout.module.css';
import logoStyles from '@/assets/Logo.module.css';

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
                <link rel="icon" href="/images/icon.png" />
            </Head>

            <Link href="/">
                <a className={logoStyles.logoLink}>
                    <img
                        className={logoStyles.logo}
                        src="/images/icon.svg"
                        title="Samuel Roth | sam.dev"
                        alt="sam.dev"
                    />
                </a>
            </Link>

            <div>{children}</div>
        </div>
    );
};
