import { AppPropsType } from 'next/dist/next-server/lib/utils';
import '@/assets/main.css';

export default function ({ Component, pageProps }: AppPropsType) {
    return <Component {...pageProps} />;
}
