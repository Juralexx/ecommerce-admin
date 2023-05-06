import React from 'react'
import { isAuthenticated } from '@/api/session';
import { GetServerSideProps } from 'next';
import { Layout } from "@/layouts";
import { PageProps, User } from "@/types";
import Breadcrumb from "@/components/global/Breadcrumb";
import { getUser, deleteUser } from '@/api/users';
import { Button, Zone, ConfirmDialog, Divider, Grid, Stack, Avatar } from '@/components/global';
import { decodeRole, isAdmin } from '@/functions/functions';

interface Props extends PageProps {
    userProps: User.Options
}

export default function UserPage({ user, router, userProps }: Props) {
    const [remove, setRemove] = React.useState<Record<string, any>>({ state: false, item: null })

    return (
        <Layout user={user} router={router} title={userProps.name + ' - Compte'}>
            <Stack
                direction='row'
                alignItems="center"
                spacing={2}
                style={{ marginBottom: 10 }}
            >
                <Avatar width={50} height={50} fontSize={29}>
                    {user!.name!.charAt(0)}
                </Avatar>
                <h2>
                    {userProps.name}
                </h2>
            </Stack>
            <Breadcrumb />
            {isAdmin(user!.role) && (
                <Stack
                    direction="row"
                    divider={<Divider orientation="vertical" />}
                    spacing={2}
                    style={{ marginTop: 20, marginLeft: 'auto', justifyContent: 'flex-end' }}
                >
                    <Button mobileFull noPadding href={`/users/${userProps._id}/update`}>
                        Modifier
                    </Button>
                    <Button mobileFull noPadding variant="delete" onClick={() => setRemove({ state: true, item: userProps })}>
                        Supprimer
                    </Button>
                </Stack>
            )}
            <Zone>
                <Grid xs={1} sm={2} spacing={2} style={{ marginBottom: '16px' }}>
                    <div>
                        <p className="label txt-sec">
                            Prénom
                        </p>
                        <p className="label">
                            {userProps.name}
                        </p>
                    </div>
                    <div>
                        <p className="label txt-sec">
                            Nom
                        </p>
                        <p className="label">
                            {userProps.lastname}
                        </p>
                    </div>
                </Grid>
                <Grid xs={1} sm={2} spacing={2} style={{ marginBottom: '16px' }}>
                    <div>
                        <p className="label txt-sec">
                            Rôle
                        </p>
                        <p className="label">
                            {decodeRole(userProps.role)}
                        </p>
                    </div>
                    <div>
                        <p className="label txt-sec">
                            Téléphone
                        </p>
                        <p className="label">
                            {userProps.phone || <em>Non renseigné</em>}
                        </p>
                    </div>
                </Grid>
                <Grid xs={1} sm={2} spacing={2} style={{ marginBottom: '16px' }}>
                    <div>
                        <p className="label txt-sec">
                            Email
                        </p>
                        <p className="label">
                            {userProps.email}
                        </p>
                    </div>
                    <div>
                        <p className="label txt-sec">
                            Mot de passe
                        </p>
                        <p className="label">
                            *****************
                        </p>
                    </div>
                </Grid>
            </Zone>
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
    const { req, res, params } = context;
    const user = await isAuthenticated(req, res)

    const { user: userProps } = await getUser(params!.id as string)

    return {
        props: {
            user,
            userProps
        }
    }
}