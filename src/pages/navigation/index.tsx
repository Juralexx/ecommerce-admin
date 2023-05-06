import React from 'react'
import dynamic from 'next/dynamic';
import { GetServerSideProps } from 'next';
import { isAuthenticated } from '@/api/session'
import { Links, PageProps } from '@/types';
import { Layout } from '@/layouts';
import { Add, AddCard, AddLink, Delete, DragIndicator } from '@mui/icons-material';
import Breadcrumb from "@/components/global/Breadcrumb";
import { Alert, Button, Card, CardContent, CardHeader, Grid, IconButton, Input, Stack } from '@/components/global';
import { getNavigation, updateNavigation } from '@/api/navigation';
import { deleteItemFromArray, isValidPathname } from '@/functions/utils';
import useError from '@/functions/useError';
import useAlert from '@/contexts/useAlert';

import { DndContext, closestCenter, MouseSensor, TouchSensor, useSensor, useSensors, DragOverlay, KeyboardSensor } from '@dnd-kit/core';
import { SortableContext, arrayMove, rectSwappingStrategy, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { isNotUser } from '@/functions/functions';

const Sortable = dynamic(() => import('@/components/navigation/Sortable'), {
    ssr: false,
});

interface Props extends PageProps {
    navigation: Array<Links>
}

export default function NavigationPage({ user, router, navigation }: Props) {
    const [nav, setNav] = React.useState([...navigation])

    /**
     * CRUD functions
     */

    const addLink = () => {
        return setNav(prev => ([...prev, { id: prev.length + 1, type: 'link', name: '', link: '' }]))
    }
    const addSubmenu = () => {
        return setNav(prev => ([...prev, { id: prev.length + 1, type: 'submenu', name: '', links: [{ id: 1, name: '', link: '' }] }]))
    }
    const handleLink = (e: any, key: number, property: string) => {
        let arr = [...nav] as any
        arr[key][property] = e.target.value
        return arr
    }
    const handleSublink = (e: any, key: number, subkey: number, property: string) => {
        let arr = [...nav] as any
        arr[key]['links'][subkey][property] = e.target.value
        return arr
    }
    const addSublink = (key: number) => {
        let arr = [...nav] as any
        let links = [...arr[key]['links'], { id: arr[key]['links'].length + 1, name: '', link: '' }]
        arr[key]['links'] = links
        return arr
    }
    const deleteSublink = (key: number, subkey: number) => {
        let arr = [...nav] as any
        let links = arr[key]['links']
        links.splice(subkey, 1)
        arr[key]['links'] = links
        return arr
    }

    /**
     * 
     */

    const { error, setError } = useError()
    const { setAlert } = useAlert()

    const updateNav = async (e: any) => {
        e.preventDefault()
        setError({ error: '', message: '' })

        for (let i = 0; i < nav.length; i++) {
            if (nav[i].type === 'link') {
                if (nav[i].name === '') {
                    return setError({ error: `name-${i}`, message: 'Veuillez saisir un nom valide' })
                } else if (nav[i].link === '' || !isValidPathname(nav[i].link)) {
                    return setError({ error: `link-${i}`, message: 'Veuillez saisir un lien valide' })
                }
            }
            if (nav[i].type === 'submenu') {
                if (nav[i].name === '') {
                    return setError({ error: `name-${i}`, message: 'Veuillez saisir un nom valide' })
                } else {
                    for (let j = 0; j < nav[i].links!.length; j++) {
                        const item = nav[i].links![j]
                        if (item.name === '') {
                            return setError({ error: `name-${i}-${j}`, message: 'Veuillez saisir un nom valide' })
                        } else if (item.link === '' || !isValidPathname(item.link)) {
                            return setError({ error: `link-${i}-${j}`, message: 'Veuillez saisir un lien valide' })
                        }
                    }
                }
            }
        }

        const { errors: navErrors } = await updateNavigation(nav)
        if (navErrors.message)
            setAlert('Une erreur s\'est produite...', 'error')
        else {
            setAlert('Enregistrement réussi !', 'success')
        }
    }

    /**
     * Main elements drag instance
     */

    const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));

    const [dragged, setDragged] = React.useState<boolean>(false)

    const [activeId, setActiveId] = React.useState<number | null>(null);

    function handleDragEnd(event: any) {
        setDragged(false)
        const { active, over } = event;

        if (active.id !== over.id) {
            const newArr = arrayMove([...nav], active.id - 1, over.id - 1)
            setNav(newArr)
        }
        setActiveId(null);
    }

    /**
     * Sub elements drag instance
     */

    function handleSubDrag(event: any, key: number) {
        setDragged(false)

        const { active, over } = event;

        if (active.id !== over.id) {
            const navCopy: any[] = [...nav]
            let arr = [...navCopy[key].links]
            if (arr && arr.length > 0) {
                navCopy[key].links = arrayMove(arr, active.id - 1, over.id - 1)
                setNav(navCopy)
            }
        }
    }

    return (
        <Layout user={user} router={router} title='Navigation'>
            <form
                onSubmit={updateNav}
                method="post"
            >
                <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    spacing={1}
                    justifyContent="space-between"
                >
                    <div>
                        <h2>Navigation</h2>
                        <Breadcrumb />
                    </div>
                    {navigation.length > 0 || nav.length > 0 &&
                        <Button type='submit' mobileFull>
                            Enregistrer
                        </Button>
                    }
                </Stack>
                <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    justifyContent="space-between"
                    alignItems={{ xs: 'flex-start', sm: "center" }}
                    spacing={2}
                    style={{ padding: '10px 16px', margin: '16px 0', backgroundColor: 'var(--bg-zero)', borderRadius: 'var(--rounded-sm)' }}
                >
                    <Stack
                        direction="row"
                        alignItems="center"
                        justifyContent="flex-end"
                        spacing={2}
                        style={{ width: '100%' }}
                    >
                        <Button type="button" onClick={addLink}>
                            <AddLink /> Lien
                        </Button>
                        <Button type="button" onClick={addSubmenu}>
                            <AddCard /> Menu
                        </Button>
                    </Stack>
                </Stack>
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragStart={(event: any) => setActiveId(event.active.id - 1)}
                    onDragEnd={handleDragEnd}
                    onDragCancel={() => setActiveId(null)}
                    autoScroll={false}
                >
                    <SortableContext items={nav.map(item => item.id)} strategy={rectSwappingStrategy}>
                        {nav.length > 0 &&
                            nav.map((item, i) => {
                                return (
                                    <div key={i}>
                                        <Sortable id={i + 1} index={i + 1} draggable={dragged} className="mb-3">
                                            {item.type === 'link' &&
                                                <Card>
                                                    <CardHeader
                                                        title={item.name ? 'Lien - ' + item.name : 'Lien'}
                                                        action={
                                                            <Stack alignItems="center" spacing={1}>
                                                                <IconButton small noBg onClick={() => setNav(deleteItemFromArray(nav, i))}>
                                                                    <Delete />
                                                                </IconButton>
                                                                <IconButton small noBg onPointerDown={() => setDragged(true)}>
                                                                    <DragIndicator />
                                                                </IconButton>
                                                            </Stack>
                                                        }
                                                    />
                                                    {activeId === null &&
                                                        <CardContent style={{ paddingTop: 0 }}>
                                                            <Stack
                                                                direction={{ xs: 'column', sm: 'row' }}
                                                                alignItems="flex-end"
                                                                spacing={1}
                                                            >
                                                                <Grid xs={1} sm={2} spacing={2}>
                                                                    <div>
                                                                        <Input
                                                                            name="Nom"
                                                                            placeholder='Nom'
                                                                            value={item.name}
                                                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNav(handleLink(e, i, 'name'))}
                                                                            isError={error.error === `name-${i}`}
                                                                        />
                                                                        {error.error === `name-${i}` &&
                                                                            <Alert type="error">{error.message}</Alert>
                                                                        }
                                                                    </div>
                                                                    <div>
                                                                        <Input
                                                                            name="Lien"
                                                                            placeholder='Lien'
                                                                            value={item.link}
                                                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNav(handleLink(e, i, 'link'))}
                                                                            isError={error.error === `link-${i}`}
                                                                        />
                                                                        {error.error === `link-${i}` &&
                                                                            <Alert type="error">{error.message}</Alert>
                                                                        }
                                                                    </div>
                                                                </Grid>
                                                            </Stack>
                                                        </CardContent>
                                                    }
                                                </Card>
                                            }
                                            {item.type === 'submenu' &&
                                                <Card>
                                                    <CardHeader>
                                                        <Stack alignItems="center" spacing={1}>
                                                            <p style={{ fontSize: 18 }}>
                                                                {item.name ? 'Sous-Menu - ' + item.name : 'Sous-Menu'}
                                                            </p>
                                                            <IconButton small onClick={() => setNav(addSublink(i))} style={{ marginLeft: 15 }}>
                                                                <Add />
                                                            </IconButton>
                                                        </Stack>
                                                        <Stack alignItems="center" spacing={1} style={{ position: 'absolute', top: 10, right: 10 }}>
                                                            <IconButton small noBg onClick={() => setNav(deleteItemFromArray(nav, i))}>
                                                                <Delete />
                                                            </IconButton>
                                                            <IconButton small noBg onPointerDown={() => setDragged(true)}>
                                                                <DragIndicator />
                                                            </IconButton>
                                                        </Stack>
                                                    </CardHeader>
                                                    {activeId === null &&
                                                        <CardContent style={{ paddingTop: 0 }}>
                                                            <Input
                                                                name="Nom"
                                                                placeholder='Nom'
                                                                value={item.name}
                                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNav(handleLink(e, i, 'name'))}
                                                                isError={error.error === `name-${i}`}
                                                                style={{ maxWidth: 575 }}
                                                            />
                                                            {error.error === `name-${i}` &&
                                                                <Alert type="error">{error.message}</Alert>
                                                            }
                                                            <DndContext
                                                                sensors={sensors}
                                                                collisionDetection={closestCenter}
                                                                onDragEnd={e => handleSubDrag(e, i)}
                                                                autoScroll={false}
                                                            >
                                                                <SortableContext items={item.links!.map(item => item.id)}>
                                                                    {item.links!.map((subitem, j) => {
                                                                        return (
                                                                            <Sortable id={j + 1} index={j + 1} draggable={dragged} key={j} className="mt-3">
                                                                                <Card>
                                                                                    <CardContent>
                                                                                        <Grid xs={1} sm={2} spacing={2}>
                                                                                            <div>
                                                                                                <Input
                                                                                                    name="Nom"
                                                                                                    placeholder='Nom'
                                                                                                    value={subitem.name}
                                                                                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNav(handleSublink(e, i, j, 'name'))}
                                                                                                    isError={error.error === `name-${i}-${j}`}
                                                                                                />
                                                                                                {error.error === `name-${i}-${j}` &&
                                                                                                    <Alert type="error">{error.message}</Alert>
                                                                                                }
                                                                                            </div>
                                                                                            <div>
                                                                                                <Input
                                                                                                    name="Lien"
                                                                                                    placeholder='Lien'
                                                                                                    value={subitem.link}
                                                                                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNav(handleSublink(e, i, j, 'link'))}
                                                                                                    isError={error.error === `link-${i}-${j}`}
                                                                                                />
                                                                                                {error.error === `link-${i}-${j}` &&
                                                                                                    <Alert type="error">{error.message}</Alert>
                                                                                                }
                                                                                            </div>
                                                                                        </Grid>
                                                                                        <Stack alignItems="center" spacing={1} style={{ position: 'absolute', top: 5, right: 5 }}>
                                                                                            <IconButton small noBg onClick={() => setNav(deleteSublink(i, j))}>
                                                                                                <Delete />
                                                                                            </IconButton>
                                                                                            <IconButton small noBg onPointerDown={() => setDragged(true)}>
                                                                                                <DragIndicator />
                                                                                            </IconButton>
                                                                                        </Stack>
                                                                                    </CardContent>
                                                                                </Card>
                                                                            </Sortable>
                                                                        )
                                                                    })}
                                                                </SortableContext>
                                                            </DndContext>
                                                        </CardContent>
                                                    }
                                                </Card>
                                            }
                                        </Sortable>
                                        {activeId === i &&
                                            <DragOverlay>
                                                <Card style={{ width: 220, margin: '10px 20px 0 auto' }}>
                                                    <CardHeader
                                                        action={
                                                            <Stack alignItems="center" spacing={1}>
                                                                <IconButton small noBg>
                                                                    <Delete />
                                                                </IconButton>
                                                                <IconButton small noBg>
                                                                    <DragIndicator />
                                                                </IconButton>
                                                            </Stack>}
                                                        title={nav[i].type === 'link' ? 'Lien' : 'Sous-menu'}
                                                    />
                                                </Card>
                                            </DragOverlay>
                                        }
                                    </div>
                                )
                            })
                        }
                    </SortableContext>
                </DndContext>
            </form>
        </Layout >
    )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const { req, res } = context;
    const user = await isAuthenticated(req, res)

    if (!isNotUser(user!?.role)) {
        res.writeHead(301, { location: '/' });
        res.end();
    }

    const { navigation } = await getNavigation()

    let nav = []

    if (navigation.length > 0) {
        nav = navigation[0].navigation
    }

    return {
        props: {
            user,
            navigation: nav
        }
    }
}