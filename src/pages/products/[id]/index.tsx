import React from 'react'
import Link from 'next/link';
import { GetServerSideProps } from 'next';
import { isAuthenticated } from '@/api/session'
import Image from 'next/image';
import { Layout } from "@/layouts";
import { PageProps, Product } from "@/types";
import Breadcrumb from "@/components/global/Breadcrumb";
import { Button, ImageBG, Zone, ConfirmDialog, Divider, Grid, Stack, Table, TableRow, TableCell, ToolMenu, Tag } from '@/components/global';
import { deleteProduct, getProduct, publish } from '@/api/products';
import { Check, Publish, Start } from '@mui/icons-material';
import useAlert from '@/contexts/useAlert';
import { getDateStatus, isNotUser } from '@/functions/functions';
import { dateParser } from '@/functions/utils';

interface Props extends PageProps {
    product: Product.Options
}

export default function ProductPage({ user, router, product }: Props) {
    const [remove, setRemove] = React.useState<Record<string, any>>({ state: false, item: null })
    const { setAlert } = useAlert()

    return (
        <Layout user={user} router={router} title={product.name + ' - Produits'}>
            <h2>
                {`Produit : ${product.name}`}
            </h2>
            <Breadcrumb />
            {isNotUser(user!?.role) && (
                <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    spacing={1}
                    justifyContent="space-between"
                    style={{ marginTop: 20 }}
                >
                    <Button mobileFull variant="classic" color="primary" noPadding onClick={() => publish(product, setAlert, () => router!.replace(router!.asPath))}>
                        {product.published ? <Check /> : <Publish />} {product.published ? 'Dépublier' : 'Publier'}
                    </Button>
                    <Stack
                        divider={<Divider orientation="vertical" />}
                        spacing={1}
                        justifyContent="space-between"
                        width={{ xs: '100%', sm: 'auto' }}
                    >
                        <Button mobileFull noPadding href={`/products/${product._id}/update`}>
                            Modifier
                        </Button>
                        <Button mobileFull noPadding variant="delete" onClick={() => setRemove({ state: true, item: product })}>
                            Supprimer
                        </Button>
                    </Stack>
                </Stack>
            )}
            <Zone>
                <h4>Informations</h4>
                <Divider className="mb-4" />
                <Grid xs={1} sm={2} lg={3} spacing={2}>
                    <div>
                        <p className="label txt-sec">
                            Nom
                        </p>
                        <p className="label">
                            {product.name || <em>Non renseigné</em>}
                        </p>
                    </div>
                    <div>
                        <p className="label txt-sec">
                            Catégorie
                        </p>
                        <p className="label">
                            {product.category.name || <em>Non renseigné</em>}
                        </p>
                    </div>
                </Grid>
            </Zone>
            <Zone>
                <h4>Variants</h4>
                <Table thead={['', 'Largeur', 'Hauteur', 'Poids', 'Couleur', 'Prix', 'Stock', 'Référence', 'Promotion', 'Taxe', 'Pays d\'origine']}>
                    {product?.variants.length > 0 &&
                        product?.variants.map((variant, i) => {
                            return (
                                <TableRow key={i}>
                                    {[
                                        i + 1,
                                        variant.width + 'cm' || '-',
                                        variant.height + 'cm' || '-',
                                        variant.weight + 'kg' || '-',
                                        variant.color || '-',
                                        variant.price || '-',
                                        variant.stock || '-',
                                        variant.ref || '-',
                                        variant.promotion || '-',
                                        variant.taxe || '-',
                                        variant.country.name || '-',
                                    ]
                                        .map((el: any, j) => {
                                            return (
                                                <TableCell key={j}>
                                                    {el}
                                                </TableCell>
                                            )
                                        })}
                                </TableRow>
                            )
                        })}
                </Table>
                {product?.variants &&
                    product?.variants.length === 0 &&
                    <Zone style={{ textAlign: 'center' }}>
                        Aucun variant
                    </Zone>
                }
            </Zone>
            <Zone>
                <h4>Codes réduction</h4>
                <Table thead={['', 'Code', 'Valeur', 'Description', 'Début', 'Fin', '', 'Status']}>
                    {product?.promotions.length > 0 &&
                        product?.promotions.map((promotion, i) => {
                            return (
                                <TableRow key={i}>
                                    {[
                                        i + 1,
                                        promotion.code,
                                        promotion.type === 'percentage' ? `${promotion.value}%` : `${promotion.value}€`,
                                        promotion.description,
                                        promotion.start_date ? dateParser(promotion.start_date) : '-',
                                        promotion.end_date ? dateParser(promotion.end_date) : '-',
                                        getDateStatus(promotion.start_date, promotion.end_date)
                                    ]
                                        .map((el: any, j) => {
                                            return (
                                                <TableCell key={j}>
                                                    {el}
                                                </TableCell>
                                            )
                                        })}
                                    <TableCell>
                                        <Tag
                                            name={promotion.is_active ? 'Actif' : 'Inactif'}
                                            color={promotion.is_active ? `success-color` : 'danger-color'}
                                            beforeColor={promotion.is_active ? `success-color` : 'danger-color'}
                                            rounded="md"
                                        />
                                    </TableCell>
                                    <TableCell className="call-to-action">
                                        <ToolMenu horizontale={true} style={{ marginLeft: 'auto' }}>
                                            <Link href={`/promotions/${promotion._id}`}>
                                                <Start fontSize="small" /> Voir
                                            </Link>
                                        </ToolMenu>
                                    </TableCell>
                                </TableRow>
                            )
                        })}
                </Table>
                {product?.promotions &&
                    product?.promotions.length === 0 &&
                    <Zone style={{ textAlign: 'center' }}>
                        Aucun code de réduction n'est appliqué à ce produit
                    </Zone>
                }
            </Zone>
            <Zone>
                <h4>Images</h4>
                {product.images!.length > 0 ? (
                    <Grid xs={1} sm={2} lg={3} xl={4} xxl={5} spacing={2}>
                        {product.images!.map((image, i) => {
                            return (
                                <ImageBG key={i}>
                                    <Image
                                        src={`${process.env.SERVER_URL}${image!.path}`}
                                        height={140}
                                        width={300}
                                        style={{ display: 'block', height: '100%', maxHeight: 300, width: "auto", maxWidth: '100%', margin: '0 auto' }}
                                        alt={image.name}
                                        title={image.name}
                                    />
                                </ImageBG>
                            )
                        })}
                    </Grid>
                ) : <em>Aucune image</em>}
            </Zone>
            <Zone>
                <h4>Description</h4>
                <Divider className="mb-4" />
                <div dangerouslySetInnerHTML={{ __html: product.description || '<em>Aucune description</em>' }} />
            </Zone>
            <Zone>
                <h4>Contenu</h4>
                <Divider className="mb-4" />
                <div dangerouslySetInnerHTML={{ __html: product.content || '<em>Aucun contenu</em>' }} />
            </Zone>
            <Zone>
                <h4>Details</h4>
                <Divider className="mb-4" />
                {product.details.length > 0 ? (
                    <Table>
                        {product.details.map((detail, i) => {
                            return (
                                <TableRow key={i}>
                                    <TableCell>
                                        {detail.title}
                                    </TableCell>
                                    <TableCell>
                                        {detail.content}
                                    </TableCell>
                                </TableRow>
                            )
                        })}
                    </Table>
                ) : <em>Non renseigné</em>}
            </Zone>
            <ConfirmDialog
                title="Voulez-vous vraiment supprimer ce produit ?"
                text='Cette action est irréversible.'
                confirmButton='Supprimer'
                open={remove.state}
                onClose={() => setRemove({ state: false, item: null })}
                onConfirm={() => {
                    deleteProduct(remove.item)
                    router!.replace(router!.asPath)
                }}
            />
        </Layout>
    )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const { req, res, params } = context;
    const user = await isAuthenticated(req, res)

    const { product } = await getProduct(params!.id as string)

    return {
        props: {
            user,
            product
        }
    }
}