import React from 'react'
import { isAuthenticated } from '@/api/session';
import { GetServerSideProps } from 'next';
import { Layout } from "@/layouts";
import { PageProps, User, roles } from "@/types";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import Breadcrumb from "@/components/global/Breadcrumb";
import { getUser, updateUser } from '@/api/users';
import useError from '@/functions/useError';
import { encodeRole, isAdmin } from '@/functions/functions';
import { Button, Select, Zone, Input, Alert, Grid, Stack, InputCard } from '@/components/global';

interface Props extends PageProps {
    userProps: User.Options
}

interface UpdateUserProps extends User.Options {
    newPassword?: string,
    confirmPasswod?: string,
}

export default function UpdateUser({ user, router, userProps }: Props) {
    const [datas, setDatas] = React.useState<UpdateUserProps>({
        ...userProps,
        password: '',
        newPassword: '',
        confirmPasswod: '',
    })
    const { error, setError } = useError()
    const [passwordShown, setPasswordShown] = React.useState(false)

    const update = async (e: any) => {
        e.preventDefault()

        let config: UpdateUserProps = {
            name: datas.name,
            lastname: datas.lastname,
            email: datas.email,
            role: encodeRole(datas.role),
            phone: datas.phone
        }

        if (datas.newPassword) {
            if (datas.newPassword !== datas.confirmPasswod) {
                return setError({ error: 'confirmPassword', message: 'Les mots de passe ne correspondent pas.' })
            } else {
                config.password = datas.password
                config.newPassword = datas.newPassword
            }
        }
        const { errors: userErrors } = await updateUser(userProps, config)
        if (userErrors.message) {
            setError(userErrors)
        } else {
            router!.replace(`/users/${userProps._id}`)
        }
    }

    const Icon = passwordShown ? Visibility : VisibilityOff

    return (
        <Layout user={user} router={router} title={`Modifier le profil de ${userProps.name} - Utilisateurs`}>
            <form
                onSubmit={update}
                method="post"
                encType="multipart/form-data"
            >
                <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    spacing={2}
                    justifyContent="space-between"
                >
                    <div>
                        <h2>Modifier le profil de {userProps.name}</h2>
                        <Breadcrumb />
                    </div>
                    <Stack
                        direction='row'
                        spacing={1}
                        justifyContent={{ xs: 'center', md: "space-between" }}
                        width={{ xs: '100%', md: 'auto' }}
                    >
                        <Button type='submit' tabletFull>
                            Enregistrer
                        </Button>
                    </Stack>
                </Stack>
                <Zone>
                    <Grid xs={1} sm={2} spacing={{ xs: 0, sm: 2 }}>
                        <div>
                            <div style={{ marginBottom: '12px' }}>
                                <InputCard
                                    name="Prénom"
                                    placeholder='Prénom'
                                    value={datas.name}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDatas(datas => ({ ...datas, name: e.target.value }))}
                                    isError={error.error === 'name'}
                                />
                                {error.error === 'name' &&
                                    <Alert type="error">{error.message}</Alert>
                                }
                            </div>
                            <div style={{ marginBottom: '12px' }}>
                                <InputCard
                                    name="Nom"
                                    placeholder='Nom'
                                    value={datas.lastname}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDatas(datas => ({ ...datas, lastname: e.target.value }))}
                                    isError={error.error === 'lastname'}
                                />
                                {error.error === 'lastname' &&
                                    <Alert type="error">{error.message}</Alert>
                                }
                            </div>
                        </div>
                        <div>
                            <div style={{ marginBottom: '12px' }}>
                                <InputCard
                                    name="Téléphone"
                                    placeholder='Téléphone'
                                    value={datas.phone}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDatas(datas => ({ ...datas, phone: e.target.value }))}
                                    isError={error.error === 'phone'}
                                />
                                {error.error === 'phone' &&
                                    <Alert type="error">{error.message}</Alert>
                                }
                            </div>
                            <div style={{ marginBottom: '12px' }}>
                                <Select
                                    name="Rôle"
                                    readOnly
                                    value={datas.role}
                                    isError={error.error === 'role'}
                                >
                                    {roles.map(({ name, value }) => (
                                        <div key={name} onClick={() => setDatas(datas => ({ ...datas, role: value }))}>
                                            {name}
                                        </div>
                                    ))}
                                </Select>
                                {error.error === 'role' &&
                                    <Alert type="error">{error.message}</Alert>
                                }
                            </div>
                        </div>
                    </Grid>
                </Zone>
                <Zone>
                    <Grid xs={1} sm={2} spacing={{ xs: 0, sm: 2 }}>
                        <div>
                            <div style={{ marginBottom: '12px' }}>
                                <InputCard
                                    name="Email"
                                    placeholder='Email'
                                    value={datas.email}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDatas(datas => ({ ...datas, email: e.target.value }))}
                                    isError={error.error === 'email'}
                                />
                                {error.error === 'email' &&
                                    <Alert type="error">{error.message}</Alert>
                                }
                            </div>
                            <div style={{ marginBottom: '12px' }}>
                                <InputCard
                                    name="Ancien mot de passe"
                                    placeholder='Mot de passe'
                                    value={datas.password}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDatas(datas => ({ ...datas, password: e.target.value }))}
                                    type={passwordShown ? 'text' : 'password'}
                                    endIcon={<Icon onClick={() => setPasswordShown(!passwordShown)} />}
                                    isError={error.error === 'password'}
                                />
                                {error.error === 'password' &&
                                    <Alert type="error">{error.message}</Alert>
                                }
                            </div>
                        </div>
                        <div>
                            <div style={{ marginBottom: '12px' }}>
                                <InputCard
                                    name="Nouveau mot de passe"
                                    placeholder='Mot de passe'
                                    value={datas.newPassword}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDatas(datas => ({ ...datas, newPassword: e.target.value }))}
                                    type={passwordShown ? 'text' : 'password'}
                                    endIcon={<Icon onClick={() => setPasswordShown(!passwordShown)} />}
                                    isError={error.error === 'newPassword'}
                                />
                                {error.error === 'newPassword' &&
                                    <Alert type="error">{error.message}</Alert>
                                }
                            </div>
                            <div>
                                <InputCard
                                    name="Confirmer nouveau mot de passe"
                                    placeholder='Confirmer mot de passe'
                                    value={datas.confirmPasswod}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDatas(datas => ({ ...datas, confirmPasswod: e.target.value }))}
                                    type={passwordShown ? 'text' : 'password'}
                                    endIcon={<Icon onClick={() => setPasswordShown(!passwordShown)} />}
                                    isError={error.error === 'confirmPassword'}
                                />
                                {error.error === 'confirmPassword' &&
                                    <Alert type="error">{error.message}</Alert>
                                }
                            </div>
                        </div>
                    </Grid>
                </Zone>
            </form>
        </Layout >
    )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const { req, res, params } = context;
    const user = await isAuthenticated(req, res)

    if (!isAdmin(user!.role)) {
        res.writeHead(301, { location: '/' });
        res.end();
    }

    const { user: userProps } = await getUser(params!.id as string)

    return {
        props: {
            user,
            userProps
        }
    }
}