import React from 'react'
import Head from 'next/head'

const HeadProvider = ({ title }: any) => {
    const root = typeof window !== 'undefined' ? window.location : ''
    const pathname = typeof window !== 'undefined' ? window.location.pathname : ''

    const metadatas = {
        site_name: root,
        title: title,
        description: 'The Limequat e-commerce site backend',
        url: `${root}/${pathname}`
    }

    return (
        <Head>
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <link rel="icon" href="/favicon.ico" />

            <meta name="description" content={metadatas.description} />

            <title>{metadatas.title}</title>
        </Head>
    )
}

export default HeadProvider