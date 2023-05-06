import React from 'react'
import { GetServerSideProps } from 'next';
import { isAuthenticated } from '@/api/session';
import { Layout } from "@/layouts";
import { PageProps, User, roles } from "@/types";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Alert, Button, Input, Select, Zone, Grid, Stack, InputCard } from '@/components/global';
import Breadcrumb from "@/components/global/Breadcrumb";
import { createUser } from '@/api/users';
import useError from '@/functions/useError';
import { decodeRole, isAdmin } from '@/functions/functions';

interface AddUserProps extends User.Options {
    confirmPassword?: string,
}

export default function AddUser({ user, router }: PageProps) {
    const [datas, setDatas] = React.useState<AddUserProps>({ ...User.defaultProps, confirmPassword: '' })
    const { error, setError } = useError()
    const [passwordShown, setPasswordShown] = React.useState(false)

    const addUser = async (e: any) => {
        e.preventDefault()

        if (datas.password !== datas.confirmPassword) {
            return setError({ error: 'confirmPassword', message: 'Les mots de passe ne correspondent pas.' })
        }

        let config: User.Options = {
            name: datas.name,
            lastname: datas.lastname,
            email: datas.email,
            password: datas.password,
            role: datas.role,
            phone: datas.phone
        }
        const { errors: userErrors } = await createUser(config)
        if (userErrors.message) {
            setError(userErrors)
        } else {
            router!.replace(`/users`)
        }
    }

    const Icon = passwordShown ? Visibility : VisibilityOff

    return (
        <Layout user={user} router={router} title='Ajouter un utilisateur - Utilisateurs'>
            <form
                onSubmit={addUser}
                encType="multipart/form-data"
                method="post"
            >
                <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    spacing={1}
                    alignItems={{ xs: 'flex-start', sm: "center" }}
                    justifyContent={{ xs: 'flex-start', sm: "space-between" }}
                >
                    <div>
                        <h2>Ajouter un utilisateur</h2>
                        <Breadcrumb />
                    </div>
                    <Button type='submit' mobileFull>
                        Enregistrer
                    </Button>
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
                                <Select
                                    name="Rôle"
                                    value={decodeRole(datas.role)}
                                    readOnly
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
                            <div>
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
                                    name="Mot de passe"
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
                            <div>
                                <InputCard
                                    name="Confirmer mot de passe"
                                    placeholder='Confirmer mot de passe'
                                    style={{ marginTop: 16 }}
                                    value={datas.confirmPassword}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDatas(datas => ({ ...datas, confirmPassword: e.target.value }))}
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
        </Layout>
    )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const { req, res } = context;
    const user = await isAuthenticated(req, res)

    if (!isAdmin(user!.role)) {
        res.writeHead(301, { location: '/' });
        res.end();
    }

    return {
        props: {
            user
        }
    }
}