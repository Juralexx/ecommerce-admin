import React from 'react'
import Link from "next/link";
import { GetServerSideProps } from 'next';
import { isAuthenticated } from '@/api/session';
import { PageProps, User } from "@/types";
import { Layout, RootPagesLayout } from "@/layouts";
import { Button, Card, CardHeader, IconButton, ConfirmDialog, ToolMenu, Divider, Table, TableRow, TableCell, Grid, Avatar } from '@/components/global';
import { EditNote, Start, Add, Apps, ViewHeadline, Delete } from '@mui/icons-material';
import { deleteUser, getUsers } from '@/api/users';
import { decodeRole, isAdmin } from '@/functions/functions';

interface Props extends PageProps {
    users: User.Options[]
}

export default function Users({ user, router, users }: Props) {
    const [display, setDisplay] = React.useState('grid')
    const [remove, setRemove] = React.useState<Record<string, any>>({ state: false, item: null })

    const ActionMenu = ({ user, horizontale = false, ...props }: any) => {
        return (
            <ToolMenu horizontale={horizontale} style={props.style}>
                <Link href={`/users/${user._id}`}>
                    <Start fontSize="small" /> Voir
                </Link>
                {isAdmin(user!.role) && (
                    <React.Fragment>
                        <Link href={`/users/${user._id}/update`}>
                            <EditNote /> Modifier
                        </Link>
                        <Divider />
                        <div onClick={() => setRemove({ state: true, item: user })}>
                            <Delete fontSize="small" /> Supprimer
                        </div>
                    </React.Fragment>
                )}
            </ToolMenu>
        )
    }

    return (
        <Layout user={user} router={router} title='Utilisateurs'>
            <RootPagesLayout
                title='Utilisateurs'
                addButton={
                    isAdmin(user!.role) && (
                        <Button href='/users/add' mobileFull>
                            <Add /> Ajouter
                        </Button>
                    )
                }
                toolsRight={
                    <IconButton noBg onClick={() => { display === 'grid' ? setDisplay('table') : setDisplay('grid') }}>
                        {display === 'grid' ? <Apps /> : <ViewHeadline />}
                    </IconButton>
                }
            >
                {display === 'grid' ? (
                    <Grid xs={1} sm={2} lg={3} xl={4} spacing={{ xs: 1, sm: 2 }}>
                        {users.map((user: User.Options, i: number) => {
                            return (
                                <Card key={i}>
                                    <CardHeader
                                        action={<ActionMenu user={user} />}
                                        title={user.name}
                                        subtitle={decodeRole(user.role)}
                                        avatar={
                                            <Avatar>
                                                {user!.name!.charAt(0)}
                                            </Avatar>
                                        }
                                    />
                                </Card>
                            )
                        })}
                    </Grid>
                ) : (
                    <Table thead={['', 'Prénom', 'Nom', 'Rôle', 'Email', '']}>
                        {users.map((user, i) => (
                            <TableRow key={i}>
                                <TableCell>
                                    <Avatar>
                                        {user!.name!.charAt(0)}
                                    </Avatar>
                                </TableCell>
                                {[user.name, user.lastname, user.role, user.email]
                                    .map((el: any, j) => {
                                        return (
                                            <TableCell key={j}>
                                                {el}
                                            </TableCell>
                                        )
                                    })}
                                <TableCell>
                                    <ActionMenu user={user} horizontale={true} style={{ marginLeft: 'auto' }} />
                                </TableCell>
                            </TableRow>
                        ))}
                    </Table>
                )}
            </RootPagesLayout>
            <ConfirmDialog
                title="Voulez-vous vraiment supprimer cet utilisateur ?"
                text='Cette action est irréversible.'
                confirmButton='Supprimer'
                open={remove.state}
                onClose={() => setRemove({ state: false, item: null })}
                onConfirm={() => {
                    deleteUser(remove.item)
                    router!.replace(router!.asPath)
                }}
            />
        </Layout>
    )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const { req, res } = context;
    const user = await isAuthenticated(req, res)
    const { users } = await getUsers()

    return {
        props: {
            user,
            users
        }
    }
}