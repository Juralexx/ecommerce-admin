import React from 'react'
import { GetServerSideProps } from 'next';
import { isAuthenticated } from '@/api/session'
import Image from 'next/image';
import { Layout } from "@/layouts";
import { PageProps, Promotion } from "@/types";
import Breadcrumb from "@/components/global/Breadcrumb";
import { Button, Zone, ConfirmDialog, Divider, Grid, Stack, Table, TableRow, TableCell, Tag, TableHead, TableBody } from '@/components/global';
import useAlert from '@/contexts/useAlert';
import { getDateStatus, isNotUser } from '@/functions/functions';
import { dateParser, getTotal } from '@/functions/utils';
import { activate, deletePromotion, getPromotion } from '@/api/promotions';
import { Check, Publish } from '@mui/icons-material';

interface Props extends PageProps {
    promotion: Promotion.Options
}

export default function PromotionPage({ user, router, promotion }: Props) {
    const [remove, setRemove] = React.useState<Record<string, any>>({ state: false, item: null })
    const { setAlert } = useAlert()

    return (
        <Layout user={user} router={router} title={`${promotion?.code} - Promotions`}>
            <h2>
                {`Réduction ${promotion?.code}`}
            </h2>
            <Breadcrumb />
            {isNotUser(user!?.role) && (
                <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    spacing={1}
                    justifyContent="space-between"
                    style={{ marginTop: 20 }}
                >
                    <Button mobileFull variant="classic" color="primary" noPadding onClick={() => activate(promotion, setAlert, () => router!.replace(router!.asPath))}>
                        {promotion.is_active ? <Check /> : <Publish />} {promotion.is_active ? 'Désactivé le code' : 'Activé le code'}
                    </Button>
                    <Stack
                        divider={<Divider orientation="vertical" />}
                        spacing={1}
                        justifyContent="space-between"
                        width={{ xs: '100%', sm: 'auto' }}
                    >
                        <Button mobileFull noPadding href={`/promotions/${promotion._id}/update`}>
                            Modifier
                        </Button>
                        <Button mobileFull noPadding variant="delete" onClick={() => setRemove({ state: true, item: promotion })}>
                            Supprimer
                        </Button>
                    </Stack>
                </Stack>
            )}
            <Zone>
                <h4>Informations</h4>
                <Grid xs={1} sm={2} lg={3} spacing={2} style={{ marginBottom: '16px' }}>
                    <div>
                        <p className="label txt-sec">
                            Code
                        </p>
                        <p className="label">
                            {promotion?.code || <em>Non renseigné</em>}
                        </p>
                    </div>
                    <div>
                        <p className="label txt-sec">
                            Valeur
                        </p>
                        <p className="label">
                            {promotion.type === 'percentage' ? `${promotion.value}%` : `${promotion.value}€` || <em>Non renseigné</em>}
                        </p>
                    </div>
                    <div>
                        <p className="label txt-sec">
                            Description
                        </p>
                        <p className="label">
                            {promotion.description || <em>Non renseigné</em>}
                        </p>
                    </div>
                    <div>
                        <p className="label txt-sec">
                            Début
                        </p>
                        <p className="label">
                            {promotion.start_date && dateParser(promotion.start_date) || '-'}
                        </p>
                    </div>
                    <div>
                        <p className="label txt-sec">
                            Fin
                        </p>
                        <p className="label">
                            {promotion.end_date && dateParser(promotion.start_date) || '-'}
                        </p>
                    </div>
                    <div>
                        <p className="label txt-sec">
                            Status
                        </p>
                        <Tag
                            name={promotion.is_active ? 'Actif' : 'Inactif'}
                            color={promotion.is_active ? `success-color` : 'danger-color'}
                            beforeColor={promotion.is_active ? `success-color` : 'danger-color'}
                            rounded="md"
                        />
                    </div>
                    <div>
                        <p className="label txt-sec">
                            Informations
                        </p>
                        <p className="label">
                            {getDateStatus(promotion.start_date, promotion.end_date)}
                        </p>
                    </div>
                </Grid>
            </Zone>
            <Zone>
                <h4>Produits</h4>
                <Table style={{ tableLayout: 'fixed' }}>
                    <TableHead>
                        <TableCell style={{ width: 45 }}></TableCell>
                        <TableCell style={{ width: 82 }}></TableCell>
                        <TableCell style={{ width: 350 }}>Nom</TableCell>
                        <TableCell style={{ width: 140 }}>Status</TableCell>
                        <TableCell style={{ width: 70 }}>Stock</TableCell>
                    </TableHead>
                    <TableBody>
                        {promotion?.condition?.products?.length > 0
                            && promotion?.condition?.products.map((product, i) => (
                                <TableRow key={i}>
                                    <TableCell>
                                        {i + 1}
                                    </TableCell>
                                    <TableCell>
                                        {product.images![0]?.path &&
                                            <Image
                                                src={`${process.env.SERVER_URL}${product.images![0].path}`}
                                                height={50}
                                                width={50}
                                                style={{ display: 'block', height: 50, width: 50, objectFit: 'cover' }}
                                                alt={product.name}
                                                title={product.name}
                                            />
                                        }
                                    </TableCell>
                                    <TableCell>
                                        {product.name}
                                    </TableCell>
                                    <TableCell>
                                        <Tag
                                            name={product.published ? 'Publié' : 'Non publié'}
                                            color={product.published ? 'success-color' : 'danger-color'}
                                            beforeColor={product.published ? 'success-color' : 'danger-color'}
                                            rounded="md"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        {getTotal(product.variants, 'stock', 0)} dans {product.variants.length} variants,
                                    </TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
                {promotion?.condition?.products &&
                    promotion?.condition?.products?.length === 0 &&
                    <Zone style={{ textAlign: 'center' }}>
                        Aucun produits
                    </Zone>
                }
            </Zone>
            <Zone>
                <h4>Catégories</h4>
                {promotion?.condition?.categories?.length > 0 &&
                    <Table thead={['Nom', 'Parent', 'URL', 'Image']}>
                        {promotion?.condition?.categories?.map((category, i) => (
                            <TableRow key={i}>
                                <TableCell>
                                    {category.image &&
                                        <Image
                                            src={`${process.env.SERVER_URL}${category.image!.path}`}
                                            height={40}
                                            width={40}
                                            style={{ borderRadius: 100 }}
                                            alt={category.name}
                                            title={category.name}
                                        />
                                    }
                                </TableCell>
                                {[category.name, category.parent, category.link, category.image!.name]
                                    .map((el: any, j) => {
                                        return (
                                            <TableCell key={j}>
                                                {el}
                                            </TableCell>
                                        )
                                    })}
                            </TableRow>
                        ))}
                    </Table>
                }
                {promotion?.condition?.categories &&
                    promotion?.condition?.categories?.length === 0 &&
                    <Zone style={{ textAlign: 'center' }}>
                        Aucune catégories
                    </Zone>
                }
            </Zone>

            <ConfirmDialog
                title="Voulez-vous vraiment supprimer cette promotion ?"
                text='Cette action est irréversible.'
                confirmButton='Supprimer'
                open={remove.state}
                onClose={() => setRemove({ state: false, item: null })}
                onConfirm={() => {
                    deletePromotion(remove.item)
                    router!.replace(router!.asPath)
                }}
            />
        </Layout>
    )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const { req, res, params } = context;
    const user = await isAuthenticated(req, res)

    const { promotion } = await getPromotion(params!.id as string)

    return {
        props: {
            user,
            promotion
        }
    }
}