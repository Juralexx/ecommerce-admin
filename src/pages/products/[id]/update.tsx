import React from "react";
import dynamic from "next/dynamic";
import { GetServerSideProps } from 'next';
import { isAuthenticated } from '@/api/session'
import { PageProps, Product, Category } from "@/types";
import { Layout } from "@/layouts";
import Breadcrumb from "@/components/global/Breadcrumb";
import { Alert, Button, Input, Select, Zone, IconButton, Grid, Stack, Card, CardContent, InputCard, NumberInput } from "@/components/global";
import { Add, Check, Delete, Publish } from "@mui/icons-material";
import useError from "@/functions/useError";
import { getCategories } from "@/api/categories";
import { deleteItemFromArray, handleObjectProp } from "@/functions/utils";
import { getProduct, publish, updateProduct } from "@/api/products";
import { convertDeltaToString } from "@/components/editor/functions";
import MediasModal from "@/components/MediasModal";
import ImagesPreview from "@/components/ImagesPreview";
import useAlert from "@/contexts/useAlert";
import { isNotUser } from "@/functions/functions";
import countries from '@/api/countries.json'

const Wysiwyg = dynamic(() => import('@/components/editor/Wysiwyg'),
    { ssr: false }
)

interface Props extends PageProps {
    product: Product.Options,
    categories: Category.Options[]
}

export default function updateProductPage({ user, router, product, categories }: Props) {
    const [datas, setDatas] = React.useState<Product.Options>(JSON.parse(JSON.stringify(product)))
    const { error, setError } = useError()
    const { setAlert } = useAlert()

    const update = async (e: any) => {
        e.preventDefault()
        let config = {
            name: datas.name,
            category: datas.category._id,
            description: convertDeltaToString(datas.description),
            content: convertDeltaToString(datas.content),
            variants: datas.variants,
            details: datas.details,
            images: datas.images!.map(img => img._id),
            tags: datas.tags
        }
        const { errors } = await updateProduct(product, config)
        if (errors.message) {
            setError(errors)
        } else {
            // router!.replace(`/products/${product._id}`)
        }
    }

    const [openMedias, setOpenMedias] = React.useState<boolean>(false)

    return (
        <Layout user={user} router={router} title={`Modifier : ${product.name}`}>
            <form
                onSubmit={(e) => update(e)}
                method="post"
                encType="multipart/form-data"
            >
                <Stack
                    direction={{ xs: 'column', md: 'row' }}
                    spacing={1}
                    justifyContent={{ xs: 'flex-start', md: "space-between" }}
                >
                    <div style={{ width: '100%' }}>
                        <h2>Modifier : {product.name}</h2>
                        <Breadcrumb />
                    </div>
                    <Stack
                        direction='row'
                        spacing={1}
                        justifyContent={{ xs: 'center', md: "space-between" }}
                        width={{ xs: '100%', md: 'auto' }}
                    >
                        <Button tabletFull type="button" variant="classic" color="primary" noPadding onClick={() => publish(product, setAlert, () => router!.replace(router!.asPath))}>
                            {product.published ? <Check /> : <Publish />}{product.published ? 'Dépublier' : 'Publier'}
                        </Button>
                        <Button type='submit' tabletFull>
                            Enregistrer
                        </Button>
                    </Stack>
                </Stack>
                <Zone>
                    <h4>Informations</h4>
                    <Grid xs={1} sm={2} spacing={2} style={{ marginBottom: '16px' }}>
                        <div>
                            <InputCard
                                name="Nom"
                                placeholder='Nom'
                                value={datas.name}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDatas(data => ({ ...data, name: e.target.value }))}
                                isError={error.error === 'name'}
                            />
                            {error.error === 'name' &&
                                <Alert type="error">{error.message}</Alert>
                            }
                        </div>
                        <div>
                            <Select
                                name="Catégorie"
                                placeholder="Catégorie"
                                readOnly
                                value={datas.category.name !== '' ? datas.category.name : categories[0].name}
                                onChange={() => { }}
                                isError={error.error === 'category'}
                            >
                                {categories.map((category, i) => (
                                    <div key={i} onClick={() => setDatas(data => ({ ...data, category: category }))}>
                                        {category.name}
                                    </div>
                                ))}
                            </Select>
                            {error.error === 'category' &&
                                <Alert type="error">{error.message}</Alert>
                            }
                        </div>
                    </Grid>
                </Zone>
                <Zone>
                    <Stack
                        direction='row'
                        alignItems="center"
                        spacing={2}
                        style={{ marginBottom: datas.variants.length > 0 ? '16px' : 0 }}
                    >
                        <h4 className="m-0">Variants</h4>
                        <IconButton small onClick={() => setDatas(data => ({ ...data, variants: [...data.variants, Product.variantDefaultProps] }))}>
                            <Add />
                        </IconButton>
                    </Stack>
                    {datas.variants.map((variant, i) => {
                        return (
                            <Card className="mt-3" key={i}>
                                <CardContent>
                                    <Grid xs={1} sm={2} lg={3} spacing={2}>
                                        <div>
                                            <Input
                                                name="Largeur"
                                                placeholder='Nom'
                                                value={variant.width}
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDatas(data => ({ ...data, variants: handleObjectProp(datas.variants, i, 'width', e.target.value) }))}
                                            />
                                            {error.error === `width-${i}` &&
                                                <Alert type="error">{error.message}</Alert>
                                            }
                                        </div>
                                        <div>
                                            <Input
                                                name="Hauteur"
                                                placeholder='Hauteur'
                                                value={variant.height}
                                                onChange={(value: number) => setDatas(data => ({ ...data, variants: handleObjectProp(datas.variants, i, 'height', value) }))}
                                            />
                                            {error.error === `height-${i}` &&
                                                <Alert type="error">{error.message}</Alert>
                                            }
                                        </div>
                                        <div>
                                            <Input
                                                name="Poids"
                                                placeholder='Poids'
                                                value={variant.weight}
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDatas(data => ({ ...data, variants: handleObjectProp(datas.variants, i, 'weight', e.target.value) }))}
                                            />
                                            {error.error === `weight-${i}` &&
                                                <Alert type="error">{error.message}</Alert>
                                            }
                                        </div>
                                        <div>
                                            <Input
                                                name="Couleur"
                                                placeholder='Couleur'
                                                value={variant.color}
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDatas(data => ({ ...data, variants: handleObjectProp(datas.variants, i, 'color', e.target.value) }))}
                                            />
                                        </div>
                                        <div>
                                            <NumberInput
                                                name="Prix"
                                                placeholder='Prix'
                                                step="0.01"
                                                min="0"
                                                value={variant.price}
                                                onChange={(value: number) => setDatas(data => ({ ...data, variants: handleObjectProp(datas.variants, i, 'price', value) }))}
                                            />
                                            {error.error === `price-${i}` &&
                                                <Alert type="error">{error.message}</Alert>
                                            }
                                        </div>
                                        <div>
                                            <NumberInput
                                                name="Taxe"
                                                placeholder='Taxe'
                                                step="0.01"
                                                min="0"
                                                value={variant.taxe}
                                                onChange={(value: number) => setDatas(data => ({ ...data, variants: handleObjectProp(datas.variants, i, 'taxe',value) }))}
                                            />
                                            {error.error === `taxe-${i}` &&
                                                <Alert type="error">{error.message}</Alert>
                                            }
                                        </div>
                                        <div>
                                            <NumberInput
                                                name="Stock"
                                                placeholder='Stock'
                                                value={variant.stock}
                                                onChange={(value: number) => setDatas(data => ({ ...data, variants: handleObjectProp(datas.variants, i, 'stock', value) }))}
                                            />
                                        </div>
                                        <div>
                                            <Input
                                                name="Référence"
                                                placeholder='Référence'
                                                value={variant.ref}
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDatas(data => ({ ...data, variants: handleObjectProp(datas.variants, i, 'ref', e.target.value) }))}
                                            />
                                            {error.error === `ref-${i}` &&
                                                <Alert type="error">{error.message}</Alert>
                                            }
                                        </div>
                                        <div>
                                            <NumberInput
                                                name="Promotion"
                                                placeholder='Promotion'
                                                value={variant.promotion}
                                                onChange={(value: number) => setDatas(data => ({ ...data, variants: handleObjectProp(datas.variants, i, 'promotion', value) }))}
                                            />
                                        </div>
                                        <div>
                                            <Select
                                                name="Pays d'origine"
                                                placeholder={variant.country.name}
                                                readOnly
                                                value={variant.country.name}
                                                onChange={() => { }}
                                            >
                                                {countries.map((country, j) => (
                                                    <div key={j} onClick={() => setDatas(data => ({ ...data, variants: handleObjectProp(datas.variants, i, 'country', country) }))}>
                                                        {country.name}
                                                    </div>
                                                ))}
                                            </Select>
                                        </div>
                                        <div>
                                            <Input
                                                name="Code barre"
                                                placeholder='Code barre'
                                                value={variant.barcode}
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDatas(data => ({ ...data, variants: handleObjectProp(datas.variants, i, 'barcode', e.target.value) }))}
                                            />
                                            {error.error === `barcode-${i}` &&
                                                <Alert type="error">{error.message}</Alert>
                                            }
                                        </div>
                                    </Grid>
                                    <Stack alignItems="center" spacing={1} style={{ position: 'absolute', top: 5, right: 5 }}>
                                        <IconButton small noBg onClick={() => setDatas(data => ({ ...data, variants: deleteItemFromArray(datas.variants, i) }))}>
                                            <Delete />
                                        </IconButton>
                                    </Stack>
                                </CardContent>
                            </Card>
                        )
                    })}
                </Zone>
                <Zone>
                    <h4>Introduction</h4>
                    <Wysiwyg
                        id="toolbar-1"
                        value={datas.description}
                        onChange={editor => setDatas(data => ({ ...data, description: editor }))}
                        max={20000}
                    />
                    {error.error === 'description' &&
                        <Alert type="error">{error.message}</Alert>
                    }
                </Zone>
                <Zone>
                    <h4>Description</h4>
                    <Wysiwyg
                        value={datas.content}
                        onChange={editor => setDatas(data => ({ ...data, content: editor }))}
                    />
                    {error.error === 'content' &&
                        <Alert type="error">{error.message}</Alert>
                    }
                </Zone>
                <Zone>
                    <Stack
                        direction='row'
                        alignItems="center"
                        spacing={2}
                        style={{ marginBottom: '16px' }}
                    >
                        <h4 className="m-0">Détails</h4>
                        <IconButton small onClick={() => setDatas(data => ({ ...data, details: [...data.details, { title: '', content: '' }] }))}>
                            <Add />
                        </IconButton>
                    </Stack>
                    {datas.details.map((detail, i) => {
                        return (
                            <Card className="mt-3" key={i}>
                                <CardContent>
                                    <Grid xs={1} sm={2} spacing={2}>
                                        <div>
                                            <Input
                                                name="Nom"
                                                placeholder='Nom'
                                                value={detail.title}
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDatas(data => ({ ...data, details: handleObjectProp(datas.details, i, 'title', e.target.value) }))}
                                            />
                                        </div>
                                        <div>
                                            <Input
                                                name="Valeur"
                                                placeholder='Valeur'
                                                value={detail.content}
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDatas(data => ({ ...data, details: handleObjectProp(datas.details, i, 'content', e.target.value) }))}
                                            />
                                        </div>
                                    </Grid>
                                    <Stack alignItems="center" spacing={1} style={{ position: 'absolute', top: 5, right: 5 }}>
                                        <IconButton small noBg onClick={() => setDatas(data => ({ ...data, details: deleteItemFromArray(datas.details, i) }))}>
                                            <Delete />
                                        </IconButton>
                                    </Stack>
                                </CardContent>
                            </Card>
                        )
                    })}
                </Zone>
                <Zone>
                    <Stack
                        direction="row"
                        alignItems="center"
                        justifyContent="space-between"
                        spacing={1.5}
                    >
                        <h4>Images</h4>
                        <Button type="button" onClick={() => setOpenMedias(!openMedias)}>
                            Ajouter des médias
                        </Button>
                    </Stack>
                    <ImagesPreview
                        images={datas.images || []}
                        maxFiles={6}
                        onDelete={(key) => setDatas(data => ({ ...data, images: deleteItemFromArray(data.images, key) }))}
                        onMove={(newArray) => setDatas(data => ({ ...data, images: newArray }))}
                    />
                </Zone>
            </form>
            <MediasModal
                open={openMedias}
                onClose={() => setOpenMedias(!openMedias)}
                previousMedias={product.images ? product.images : []}
                currentMedias={datas.images ? datas.images : []}
                onSelect={(media, key) => {
                    if (datas.images) {
                        setDatas(data => ({ ...data, images: data.images!.some(m => m._id === media._id) ? deleteItemFromArray(data.images, key) : [...data.images!, media] }))
                    }
                }}
            />
        </Layout>
    )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const { req, res, params } = context;
    const user = await isAuthenticated(req, res)

    if (!isNotUser(user!?.role)) {
        res.writeHead(301, { location: '/' });
        res.end();
    }

    const { product } = await getProduct(params!.id as any)
    const { categories } = await getCategories()

    return {
        props: {
            user,
            product,
            categories
        }
    }
}