import React from "react";
import Image from "next/image";
import { GetServerSideProps } from 'next';
import { isAuthenticated } from '@/api/session'
import { PageProps, Product, Category, Promotion } from "@/types";
import { Layout } from "@/layouts";
import Breadcrumb from "@/components/global/Breadcrumb";
import { Button, Stack, Zone, Grid, Alert, SelectCard, NumberInputCard, InputDatePicker, InputCard, Dialog, DialogTitle, DialogContent, Divider, DialogActions, IconButton, Table, TableRow, TableCell, Checkbox, TableHead, TableBody, Tag } from "@/components/global";
import useError from "@/functions/useError";
import { getCategories } from "@/api/categories";
import { isNotUser } from "@/functions/functions";
import { getProducts } from "@/api/products";
import { getTotal, numericDateParser, removeSpecialChars } from "@/functions/utils";
import { Add, KeyboardArrowRight, West } from "@mui/icons-material";
import { createPromotion } from "@/api/promotions";

interface Props extends PageProps {
    categories: Category.Options[];
    products: Product.Options[];
}

function bulkSelection(originalArray: any[], array: any[]) {
    let elements: any[] = []
    if (array.length === originalArray.length) {
        return elements = []
    } else return elements = [...originalArray]
}

function singleSelection(array: any[], item: any) {
    if (array.some(el => el._id === item._id)) {
        let arr = [...array]
        let index = arr.findIndex(el => el._id === item._id)
        arr.splice(index, 1)
        return arr
    } else {
        return [...array, item]
    }
}

export default function AddProduct({ user, router, categories, products }: Props) {
    const [datas, setDatas] = React.useState<Promotion.Options>(Promotion.defaultProps)
    const { error, setError } = useError()

    const [conditions, setConditions] = React.useState<Record<string, any>>({
        open: false,
        navigation: null,
        applyTo: 'in'
    })

    function handleBulk(type: string) {
        let elements: any[] = []
        if (type === 'products') {
            if (datas.condition.type === 'products') {
                if (datas.condition.products.length === products.length) {
                    elements = []
                } else elements = [...products]
                return setDatas(prev => ({ ...prev, condition: { ...prev.condition, products: elements } }))
            }
        } else if (type === 'categories') {
            if (datas.condition.type === 'categories') {
                if (datas.condition.categories.length === categories.length) {
                    elements = []
                } else elements = [...categories]
                return setDatas(prev => ({ ...prev, condition: { ...prev.condition, categories: elements } }))
            }
        }
    }

    function handleItem(type: 'products' | 'categories', item: any) {
        if (datas.condition[type].some(el => el._id === item._id)) {
            let arr = [...datas.condition[type]]
            let index = arr.findIndex(el => el._id === item._id)
            arr.splice(index, 1)
            return setDatas(prev => ({ ...prev, condition: { ...prev.condition, [type]: arr } }))
        } else {
            return setDatas(prev => ({ ...prev, condition: { ...prev.condition, [type]: [...prev.condition[type], item] } }))
        }
    }

    const addPromotion = async (e: any) => {
        e.preventDefault()
        let config: Promotion.Options = JSON.parse(JSON.stringify(datas))

        if (datas.condition.products.length === 0 && datas.condition.products.length === 0) {
            config.condition.type = 'all'
        }

        const { condition } = config

        if (condition.type !== 'all') {
            if (conditions.applyTo === 'out') {
                if (condition.type === 'products') {
                    condition['products'] = products.filter(product => condition.products.some(el => el._id !== product._id))
                }
                else if (condition.type === 'categories') {
                    condition['categories'] = categories.filter(category => condition.categories.some(el => el._id !== category._id))
                }
            }
        }
        const { errors } = await createPromotion(config)
        if (errors.message)
            setError(errors)
        // else router!.replace('/promotions')
    }

    return (
        <Layout user={user} router={router} title='Ajouter une promotion - Promotions'>
            <form
                onSubmit={addPromotion}
                method="post"
                encType="multipart/form-data"
            >
                <Stack
                    spacing={2}
                    direction={{ xs: 'column', sm: 'row' }}
                    alignItems={{ xs: 'flex-start', sm: "center" }}
                    justifyContent={{ xs: 'flex-start', sm: "space-between" }}
                >
                    <div>
                        <h2>Ajouter une promotion</h2>
                        <Breadcrumb />
                    </div>
                    <Button type='submit' mobileFull>
                        Enregistrer
                    </Button>
                </Stack>
                <Zone>
                    <h4>Type de promotion</h4>
                    <Grid xs={1} sm={2} spacing={2} style={{ margin: '16px 0 40px' }}>
                        <SelectCard
                            title="Pourcentage"
                            onClick={() => setDatas(prev => ({ ...prev, type: 'percentage' }))}
                            checked={datas.type === 'percentage'}
                        >
                            <p>Promotion appliquée en pourcentage</p>
                        </SelectCard>
                        <SelectCard
                            title="Montant fixe"
                            onClick={() => setDatas(prev => ({ ...prev, type: 'fixed' }))}
                            checked={datas.type === 'fixed'}
                        >
                            <p>Une promotion fixe est appliqué</p>
                        </SelectCard>
                    </Grid>
                    <h4>Général</h4>
                    <Grid xs={1} sm={2} spacing={2} style={{ margin: '16px 0 40px' }}>
                        <div>
                            <InputCard
                                name="Code"
                                placeholder='Code'
                                value={datas.code}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDatas(datas => ({ ...datas, code: removeSpecialChars(e.target.value.toUpperCase()) }))}
                                isError={error.error === 'code'}
                            />
                            {error.error === 'code' &&
                                <Alert type="error">{error.message}</Alert>
                            }
                            <p className="txt-sec mt-2">Le code que les clients devront entrer lors de la validation de la commande.
                                Majuscules et nombres uniquement.
                            </p>
                        </div>
                        <div>
                            <NumberInputCard
                                name={datas.type === 'percentage' ? 'Pourcentage' : 'Montant'}
                                placeholder={datas.type === 'percentage' ? 'Pourcentage' : 'Montant'}
                                icon={datas.type === 'percentage' ? '%' : '€'}
                                step='0.01'
                                value={datas.value}
                                onChange={(value: number) => setDatas(datas => ({ ...datas, value: Number(value) }))}
                                isError={error.error === 'value'}
                            />
                            {error.error === 'value' &&
                                <Alert type="error">{error.message}</Alert>
                            }
                        </div>
                    </Grid>
                    <div className="mb-10">
                        <InputCard
                            name="Description"
                            placeholder='Description'
                            value={datas.description}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDatas(datas => ({ ...datas, description: e.target.value }))}
                            isError={error.error === 'description'}
                        />
                        {error.error === 'description' &&
                            <Alert type="error">{error.message}</Alert>
                        }
                    </div>
                    <h4>Type de promotion</h4>
                    <p className="txt-sec">
                        Vous pouvez ajouter une date d'activation et une date d'expiration. Si aucune date n'est préciser le code sera actif imédiatement.
                    </p>
                    <Grid xs={1} sm={2} spacing={2} style={{ margin: '16px 0 40px' }}>
                        <div>
                            <InputDatePicker
                                card
                                name="Date de début"
                                placeholder={numericDateParser(new Date())}
                                value={datas.start_date && numericDateParser(datas.start_date)}
                                selected={datas.start_date}
                                onSelect={(date: Date) => setDatas(datas => ({ ...datas, start_date: date }))}
                                isError={error.error === 'start_date'}
                            />
                            {error.error === 'start_date' &&
                                <Alert type="error">{error.message}</Alert>
                            }
                            <p className="txt-sec mt-2">
                                Plannifier la date d'activivation du code de réduction.
                            </p>
                        </div>
                        <div>
                            <InputDatePicker
                                card
                                name="Date de d'expiration"
                                placeholder={numericDateParser(new Date())}
                                value={datas.end_date && numericDateParser(datas.end_date)}
                                selected={datas.end_date}
                                onSelect={(date: Date) => setDatas(datas => ({ ...datas, end_date: date }))}
                                isError={error.error === 'end_date'}
                            />
                            {error.error === 'end_date' &&
                                <Alert type="error">{error.message}</Alert>
                            }
                            <p className="txt-sec mt-2">
                                Plannifier la date d'activivation d'expiration du code de réduction.
                            </p>
                        </div>
                    </Grid>
                    <h4>Conditions</h4>
                    <p className="txt-sec">
                        Le code de réduction s'appliquera à l'ensemble des produits si aucun condition n'est ajoutée.
                    </p>
                    <div className="mt-7">
                        <Button type="button" fullWidth onClick={() => setConditions(prev => ({ ...prev, open: true }))}>
                            <Add /> Ajouter une condition
                        </Button>
                        <Dialog
                            tabletFull
                            open={conditions.open}
                            onClose={() => setConditions(prev => ({ ...prev, open: false }))}
                        >
                            <DialogTitle color='text.secondary'>
                                {conditions.navigation === null && (
                                    'Ajouter une condition'
                                )}
                                {conditions.navigation === 'products' && (
                                    <div className="flex items-center">
                                        <IconButton className="mr-2" noBg icon={<West />} onClick={() => setConditions(prev => ({ ...prev, navigation: null }))} />
                                        Choisissez les produits
                                    </div>
                                )}
                                {conditions.navigation === 'categories' && (
                                    <>
                                        <IconButton className="mr-2" noBg icon={<West />} onClick={() => setConditions(prev => ({ ...prev, navigation: null }))} />
                                        Choisissez les catégories
                                    </>
                                )}
                            </DialogTitle>
                            <DialogContent>
                                {conditions.navigation === null ? (
                                    <React.Fragment>
                                        <Zone hover onClick={() => {
                                            setConditions(prev => ({ ...prev, navigation: 'products' }))
                                            setDatas(prev => ({ ...prev, condition: { ...prev.condition, type: 'products' } }))
                                        }}>
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-xl mb-1">Produits</p>
                                                    <p className="txt-sec">Des produits spécifique uniquement</p>
                                                </div>
                                                <KeyboardArrowRight />
                                            </div>
                                        </Zone>
                                        <Zone hover onClick={() => {
                                            setConditions(prev => ({ ...prev, navigation: 'categories' }))
                                            setDatas(prev => ({ ...prev, condition: { ...prev.condition, type: 'categories' } }))
                                        }}>
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-xl mb-1">Catégories</p>
                                                    <p className="txt-sec">Des catégories spécifiques uniquement</p>
                                                </div>
                                                <KeyboardArrowRight />
                                            </div>
                                        </Zone>
                                    </React.Fragment>
                                ) : (
                                    <React.Fragment>
                                        {conditions.navigation === 'products' && (
                                            <>
                                                <Grid xs={1} sm={2} spacing={2} style={{ margin: '16px 0 40px' }}>
                                                    <SelectCard
                                                        title="Sélectionnés"
                                                        onClick={() => setConditions(prev => ({ ...prev, applyTo: 'in' }))}
                                                        checked={conditions.applyTo === 'in'}
                                                    >
                                                        <p>Appliqué aux produits sélectionnés</p>
                                                    </SelectCard>
                                                    <SelectCard
                                                        title="Non sélectionnés"
                                                        onClick={() => setConditions(prev => ({ ...prev, applyTo: 'out' }))}
                                                        checked={conditions.applyTo === 'out'}
                                                    >
                                                        <p>Appliqué aux produits non sélectionnés</p>
                                                    </SelectCard>
                                                </Grid>
                                                <Table style={{ tableLayout: 'fixed' }}>
                                                    <TableHead>
                                                        <TableCell style={{ width: 45 }}>
                                                            <Checkbox onClick={() => handleBulk('products')} checked={datas.condition.products.length === products.length} />
                                                        </TableCell>
                                                        <TableCell style={{ width: 82 }}></TableCell>
                                                        <TableCell style={{ width: 350 }}>Nom</TableCell>
                                                        <TableCell style={{ width: 140 }}>Status</TableCell>
                                                        <TableCell style={{ width: 70 }}>Stock</TableCell>
                                                    </TableHead>
                                                    <TableBody>
                                                        {products.map((product, i) => (
                                                            <TableRow key={i}>
                                                                <TableCell>
                                                                    <Checkbox
                                                                        checked={datas.condition.products.some(el => el._id === product._id)}
                                                                        onClick={() => handleItem('products', product)}
                                                                    />
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
                                            </>
                                        )}
                                        {conditions.navigation === 'categories' && (
                                            <>
                                                <Grid xs={1} sm={2} spacing={2} style={{ margin: '16px 0 40px' }}>
                                                    <SelectCard
                                                        title="Sélectionnés"
                                                        onClick={() => setConditions(prev => ({ ...prev, applyTo: 'in' }))}
                                                        checked={conditions.applyTo === 'in'}
                                                    >
                                                        <p>Appliqué aux catégories sélectionnés</p>
                                                    </SelectCard>
                                                    <SelectCard
                                                        title="Non sélectionnés"
                                                        onClick={() => setConditions(prev => ({ ...prev, applyTo: 'out' }))}
                                                        checked={conditions.applyTo === 'out'}
                                                    >
                                                        <p>Appliqué aux catégories non sélectionnés</p>
                                                    </SelectCard>
                                                </Grid>
                                                <Table style={{ tableLayout: 'fixed' }}>
                                                    <TableHead>
                                                        <TableCell style={{ width: 45 }}>
                                                            <Checkbox onClick={() => handleBulk('categories')} checked={datas.condition.categories.length === categories.length} />
                                                        </TableCell>
                                                        <TableCell style={{ width: 82 }}></TableCell>
                                                        <TableCell>Nom</TableCell>
                                                        <TableCell>Lien</TableCell>
                                                    </TableHead>
                                                    <TableBody>
                                                        {categories.map((category, i) => (
                                                            <TableRow key={i}>
                                                                <TableCell>
                                                                    <Checkbox
                                                                        checked={datas.condition.categories.some(el => el._id === category._id)}
                                                                        onClick={() => handleItem('categories', category)}
                                                                    />
                                                                </TableCell>
                                                                <TableCell>
                                                                    {category.image!?.path &&
                                                                        <Image
                                                                            src={`${process.env.SERVER_URL}${category.image.path}`}
                                                                            height={50}
                                                                            width={50}
                                                                            style={{ display: 'block', height: 50, width: 50, objectFit: 'cover' }}
                                                                            alt={category.name}
                                                                            title={category.name}
                                                                        />
                                                                    }
                                                                </TableCell>
                                                                <TableCell>
                                                                    {category.name}
                                                                </TableCell>
                                                                <TableCell>
                                                                    {category.link}
                                                                </TableCell>
                                                            </TableRow>
                                                        ))}
                                                    </TableBody>
                                                </Table>
                                            </>
                                        )}
                                    </React.Fragment>
                                )}
                            </DialogContent>
                            <Divider />
                            <DialogActions>
                                <Button type="button" onClick={() => setConditions(prev => ({ ...prev, open: false }))}>
                                    Terminer
                                </Button>
                            </DialogActions>
                        </Dialog>
                    </div>
                </Zone>
            </form>
        </Layout>
    )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const { req, res } = context;
    const user = await isAuthenticated(req, res)

    if (!isNotUser(user!?.role)) {
        res.writeHead(301, { location: '/' });
        res.end();
    }

    const { categories } = await getCategories()
    const { products } = await getProducts({ limit: 150, select: '-description -content' })

    return {
        props: {
            user,
            categories,
            products
        }
    }
}