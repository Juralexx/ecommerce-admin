/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import styled from 'styled-components';

function titleize(str: string) {
    let dashesToSpace = str.replace(/-/g, ' ')
    return dashesToSpace.charAt(0).toUpperCase() + dashesToSpace.slice(1)
}

function Crumb({ text, href, last = false }: any) {
    if (last) {
        return <li>{text}</li>
    } else {
        return (
            <li>
                <Link href={href} passHref>
                    {text}
                </Link>
            </li>
        )
    }
}

export default function Breadcrumb(props: any) {
    const router = useRouter()
    const isBrowser = typeof window !== "undefined";
    const [current, setCurrent] = React.useState('')

    React.useEffect(() => {
        if (isBrowser) {
            let title = document.title?.split(' - ')[0]
            if (title)
                setCurrent(title)
            else setCurrent(document.title)
        }
    }, [isBrowser])

    function generateBreadcrumbs() {
        const asPathWithoutQuery = router.asPath.split("?")[0]

        const asPathNestedRoutes = asPathWithoutQuery.split("/").filter((v: string) => v.length > 0)

        const nestedRoutes = asPathNestedRoutes.filter((route: string) => !route.match(/^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/))

        const crumblist = nestedRoutes.slice(0, -1).map((subpath: string, key: number) => {
            const href = "/" + nestedRoutes.slice(0, key + 1).join("/")

            return { href, text: titleize(subpath) }
        })

        return [{ href: "/", text: 'Home' }, ...crumblist, { href: "/" + nestedRoutes, text: current }]
    }

    const breadcrumbs = generateBreadcrumbs()

    return (
        <Breadcrumbs aria-label="breadcrumb" role="breadcrumb" {...props}>
            <Crumbs>
                {breadcrumbs.map((crumb, key) => (
                    <Crumb {...crumb} key={key} last={key === breadcrumbs.length - 1} />
                ))}
            </Crumbs>
        </Breadcrumbs>
    );
}

const Breadcrumbs = styled.div`
    margin         : 0;
    font-weight    : 400;
    font-size      : 0.9rem;
    line-height    : 1.5;
    letter-spacing : 0.00938em;
`

const Crumbs = styled.ol`
    display     : flex;
    align-items : center;
    flex-wrap   : wrap;
    padding     : 0;
    margin      : 0;
    list-style  : none;
    color       : var(--text-secondary);

    a {
        &:hover {
            color : var(--primary-light);
        }
    }

    li {
        display : inline;
        color   : var(--text-secondary);

        + li {
            &:before {
                padding : 0 6px;
                content : "/";
            }
        }
    }
`