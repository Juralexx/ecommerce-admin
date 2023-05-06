import React from 'react'
import Link from "next/link";
import { GetServerSideProps } from 'next';
import { isAuthenticated } from '@/api/session';
import { Carrier, PageProps } from "@/types";
import { Layout, RootPagesLayout } from "@/layouts";
import { Button, ConfirmDialog, ToolMenu, Divider, Grid, Zone, Tag } from '@/components/global';
import { EditNote, Start, Add, Delete, Check, Publish } from '@mui/icons-material';
import { isAdmin } from '@/functions/functions';
import { deleteCarrier, getCarriers, publish } from '@/api/carriers';
import useAlert from '@/contexts/useAlert';

interface Props extends PageProps {
    carriers: Carrier.Options[]
}

export default function Carriers({ user, router, carriers }: Props) {
    const [remove, setRemove] = React.useState<Record<string, any>>({ state: false, item: null })
    const { setAlert } = useAlert()

    return (
        <Layout user={user} router={router} title='Transporteurs'>
            <RootPagesLayout
                title='Transporteurs'
                addButton={
                    isAdmin(user!.role) && (
                        <Button href='/carriers/add' mobileFull>
                            <Add /> Ajouter
                        </Button>
                    )
                }
            >
                <Grid xs={1} sm={2} spacing={1}>
                    {carriers.map((carrier: Carrier.Options, i: number) => {
                        return (
                            <Zone key={i} style={{ margin: 0, paddingBottom: 50 }}>
                                <Grid xs={1} sm={2} spacing={0}>
                                    <div>
                                        <p className="label txt-sec">
                                            Nom
                                        </p>
                                        <p className="label">
                                            {carrier.name}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="label txt-sec">
                                            Prix
                                        </p>
                                        <p className="label">
                                            {carrier.price.toString().padEnd(4, '0')}€
                                        </p>
                                    </div>
                                </Grid>
                                <div>
                                    <p className="label txt-sec">
                                        Description
                                    </p>
                                    <p className="label">
                                        {carrier.description}
                                    </p>
                                </div>
                                <Tag
                                    name={'Status : ' + (carrier.published ? 'Activé' : 'Désactivé')}
                                    color={`${carrier.published ? 'success' : 'danger'}-color`}
                                    beforeColor={`${carrier.published ? 'success' : 'danger'}-color`}
                                    rounded="md"
                                    noBorder
                                    style={{ position: 'absolute', left: 10, bottom: 10 }}
                                />
                                <ToolMenu horizontale={false} style={{ position: 'absolute', right: 10, top: 10 }}>
                                    <Link href={`/carriers/${carrier._id}`}>
                                        <Start fontSize="small" /> Voir
                                    </Link>
                                    {isAdmin(user!.role) && (
                                        <React.Fragment>
                                            <div onClick={() => publish(carrier, setAlert, () => router!.replace(router!.asPath))}>
                                                {carrier.published ? <Check /> : <Publish />}{carrier.published ? 'Désactivé' : 'Activé'}
                                            </div>
                                            <Link href={`/carriers/${carrier._id}/update`}>
                                                <EditNote /> Modifier
                                            </Link>
                                            <Divider />
                                            <div onClick={() => setRemove({ state: true, item: carrier })}>
                                                <Delete fontSize="small" /> Supprimer
                                            </div>
                                        </React.Fragment>
                                    )}
                                </ToolMenu>
                            </Zone>
                        )
                    })}
                </Grid>
            </RootPagesLayout>
            <ConfirmDialog
                title="Voulez-vous vraiment supprimer ce transporteur ?"
                text='Cette action est irréversible.'
                confirmButton='Supprimer'
                open={remove.state}
                onClose={() => setRemove({ state: false, item: null })}
                onConfirm={() => {
                    deleteCarrier(remove.item)
                    router!.replace(router!.asPath)
                }}
            />
        </Layout>
    )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const { req, res } = context;
    const user = await isAuthenticated(req, res)
    const { carriers } = await getCarriers()

    return {
        props: {
            user,
            carriers
        }
    }
}