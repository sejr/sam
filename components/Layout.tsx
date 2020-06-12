import Head from 'next/head';
import Link from 'next/link';

export default ({ title, children }: any) => {
    return (
        <div className="layout">
            <Head>
                <title>{title}</title>
                <link rel="icon" href="/images/icon.png" />
            </Head>

            <Link href="/">
                <a className="logo-link">
                    <img
                        className="logo"
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
