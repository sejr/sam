import Link from 'next/link';
import logoStyles from '@/assets/Logo.module.css';
import Layout from './Layout';

interface LayoutProps {
    title: string;
    description: string;
    children: React.ReactNode;
}

export default ({ title, description, children }: LayoutProps) => {
    return (
        <Layout title={title} description={description}>
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

            <div>{children}</div>
        </Layout>
    );
};
