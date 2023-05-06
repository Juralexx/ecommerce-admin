import React from 'react'
import { AppProps } from 'next/app'
import { useRouter } from 'next/router';
import styled from 'styled-components';
import "../components/editor/quill.snow.css"
import "../styles/cols.css"
import "../styles/container.css"
import "../styles/globals.css"
import "../styles/tail.css"
import GlobalStyles from '@/styles/GlobalStyles'
import AlertProvider from '@/contexts/AlertContext';
import AlertPopup from '@/contexts/AlertPopup';

export default function App({ Component, pageProps }: AppProps) {
    const router = useRouter();

    return (
        <AlertProvider>
            <GlobalStyles />
            <AlertPopup />
            <Container>
                <Component
                    {...pageProps}
                    router={router}
                />
            </Container>
        </AlertProvider>
    )
}

const Container = styled.div`
    position       : relative;
    height         : 100vh;
    width          : 100vw;
    display        : flex;
    flex-direction : column;
    z-index        : 9;
`