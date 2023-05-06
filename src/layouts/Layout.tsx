import React from 'react';
import Link from 'next/link';
import styled from 'styled-components';
import { PageProps } from '@/types';
import HeadProvider from './Head';
import { AppBar, Input, Divider, IconButton, Sidebar, SidebarInner, SidebarList, SidebarItem } from '@/components/global';
import UserAvatar from './Avatar';
import { Home, Category, Inventory, ContentPaste, AccountCircle, AssignmentInd, Collections, Search, Menu, Web, AltRoute, FindInPage, LocalShipping, Percent } from '@mui/icons-material';
import { addActive } from '@/functions/utils';
import { isNotUser } from '@/functions/functions';

export default function Layout({ children, user, router, title }: PageProps) {
    const [mobileOpen, setMobileOpen] = React.useState(false);

    const navlinks = [
        {
            name: 'Menu',
            links: [
                {
                    name: 'Accueil',
                    link: '/',
                    icon: <Home />,
                    restriction: false
                }, {
                    name: 'Catégories',
                    link: '/categories',
                    icon: <Category />,
                    restriction: false
                }, {
                    name: 'Produits',
                    link: '/products',
                    icon: <Inventory />,
                    restriction: false
                }, {
                    name: 'Commandes',
                    link: '/orders',
                    icon: <ContentPaste />,
                    restriction: false
                }, {
                    name: 'Clients',
                    link: '/customers',
                    icon: <AssignmentInd />,
                    restriction: false
                }, {
                    name: 'Promotions',
                    link: '/promotions',
                    icon: <Percent />,
                    restriction: false
                }, {
                    name: 'Transporteurs',
                    link: '/carriers',
                    icon: <LocalShipping />,
                    restriction: false
                }, {
                    name: 'Medias',
                    link: '/medias',
                    icon: <Collections />,
                    restriction: false
                }
            ]
        }, {
            name: 'Site',
            links: [
                {
                    name: 'Site',
                    link: '/site',
                    icon: <Web />,
                    restriction: !isNotUser(user!?.role)
                }, {
                    name: 'Navigation',
                    link: '/navigation',
                    icon: <AltRoute />,
                    restriction: !isNotUser(user!?.role)
                }, {
                    name: 'Pages',
                    link: '/pages',
                    icon: <FindInPage />,
                    restriction: false
                }
            ]
        }, {
            name: 'Équipe',
            links: [
                {
                    name: 'Utilisateurs',
                    link: '/users',
                    icon: <AccountCircle />,
                    restriction: false
                }
            ]
        }
    ]

    return (
        <div style={{ display: 'flex', height: '100%' }}>
            <HeadProvider
                title={title}
            />
            <AppBar>
                <Toggle>
                    <IconButton noBg onClick={() => setMobileOpen(!mobileOpen)}>
                        <Menu />
                    </IconButton>
                </Toggle>
                <Input
                    placeholder='Rechercher...'
                    icon={<Search />}
                    style={{ width: '100%', maxWidth: '600px' }}
                />
                {user &&
                    <UserAvatar user={user} router={router!} />
                }
            </AppBar>
            <Sidebar>
                <SidebarInner className={addActive(mobileOpen)}>
                    {navlinks.map(({ name, links }, i) => {
                        return (
                            <React.Fragment key={i}>
                                <Divider />
                                <h4>
                                    {name}
                                </h4>
                                <SidebarList>
                                    {links.map((link, index) => (
                                        !link.restriction && (
                                            <Link href={link.link} passHref key={index}>
                                                <SidebarItem className={addActive(router!.asPath === link.link)}>
                                                    <div className='svg-container'>
                                                        {link.icon}
                                                    </div>
                                                    <div className='text'>
                                                        {link.name}
                                                    </div>
                                                </SidebarItem>
                                            </Link>
                                        )
                                    ))}
                                </SidebarList>
                            </React.Fragment>
                        )
                    })}
                </SidebarInner>
            </Sidebar>
            <Page>
                <PageContainer>
                    {children}
                </PageContainer>
            </Page>
        </div>
    );
}

const Page = styled.div`
    flex-grow   : 1;
    padding     : 24px;
    padding-top : 88px;
    height      : 100%;
    overflow    : auto;
    overflow-x  : hidden;

    @media (min-width: 1201px) {
        width: calc(100% - 240px);
    }
    @media(max-width: 576px) {
        padding     : 15px;
        padding-top : 83px;
    }
`

const PageContainer = styled.div`
    width     : 100%;
    max-width : 1280px;
    margin    : 0 auto;
`

const Toggle = styled.div`
    display       : none;
    padding-right : 20px;

    @media(max-width: 1200px) {
        display : block;
    }
`