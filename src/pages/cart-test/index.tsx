import React from 'react'
import Image from 'next/image';
import { GetServerSideProps } from 'next'
import { isAuthenticated } from '@/api/session'
import { getProducts } from '@/api/products'
import { getPromotions } from '@/api/promotions';
import { getCategories } from '@/api/categories';
import { Layout, RootPagesLayout } from '@/layouts';
import { CartProduct, Category, IProductVariant, PageProps, Product, Promotion } from '@/types';
import { Panorama } from '@mui/icons-material';
import { Button, Card, CardContent, CardHeader, Grid, ImageBG, Select, QuantityInput, SidePagination } from '@/components/global';
import useSearchParams from '@/functions/useSearchParams';
import Cart from '@/components/cart/Cart';
import { createCart, updateCart } from '@/api/carts';

interface Props extends PageProps {
    products: Product.Options[];
    count: number;
    currentPage: number;
    limit: number;
    categories: Category.Options[];
    promotions: Promotion.Options[];
}

export default function TestCart({ user, router, products, count, currentPage, limit, categories, promotions }: Props) {
    const { removeQueryParams } = useSearchParams({ filters: [] })
    const [category, setCategory] = React.useState<Partial<Category.Options | undefined>>({ name: '' })
    const [productsView, setProductsView] = React.useState<any[]>([])

    const [cart, setCart] = React.useState<CartProduct[]>([])

    React.useEffect(() => {
        if (products) {
            let array: any[] = []
            products.forEach(product => {
                array = [...array, { ...product, quantity: 1, variant: product.variants[0] }]
            })
            setProductsView(array)
        }
    }, [products])

    function handleCardQuantity(key: number, value: number) {
        let array = [...productsView]
        array[key].quantity = value
        setProductsView(array)
    }
    function handleCardVariant(key: number, variant: IProductVariant) {
        let array = [...productsView]
        array[key].variant = variant
        setProductsView(array)
    }

    async function addProductToCart(product: Product.Options, variant: IProductVariant, quantity: number) {
        const index = cart.findIndex(el => el.variant._id === variant._id)
        let array = [...cart]

        if (index === -1) {
            array = [...array, {
                _id: product._id,
                name: product.name,
                category: product.category,
                promotions: product.promotions,
                image: product.images![0].path,
                variant: variant,
                original_price: variant.price,
                promotion: variant.promotion,
                taxe: variant.taxe,
                price: variant.price - ((variant.promotion / 100) * variant.price),
                quantity: quantity
            }]
            setCart(array)
        } else {
            array[index].quantity = array[index].quantity + quantity
            setCart(array)
        }

        const cartStorage = localStorage.getItem('cart_id')
        if (!cartStorage) {
            const { errors, data } = await createCart({ products: array.map(item => { return { product: item._id, variant: item.variant._id, quantity: item.quantity } }) })
            if (errors.message) {
                console.log(errors.message)
            } else {
                localStorage.setItem('cart_id', data._id)
            }
        } else {
            const { errors } = await updateCart({ _id: cartStorage },
                { products: array.map(item => { return { product: item._id, variant: item.variant._id, quantity: item.quantity } }) }
            )
            if (errors.message) {
                console.log(errors.message)
            }
        }
    }

    function getPromotion(price: number, promotion: number) {
        return (price - ((promotion / 100) * price)).toFixed(2)
    }

    return (
        <Layout user={user} router={router} title='Panier test'>
            <RootPagesLayout
                title='Panier test'
                filters={
                    <Select
                        placeholder="Catégorie"
                        readOnly
                        value={category!.name}
                        onChange={() => { }}
                        onClean={() => {
                            removeQueryParams('category')
                            setCategory({ name: '' })
                        }}
                    >
                        {categories?.length > 0 && (
                            categories.map((category, i) => (
                                <div key={i} onClick={() => {
                                    setCategory(category)
                                    router?.push({ query: { ...router.query, category: category._id } })
                                }}>
                                    {category.name}
                                </div>
                            ))
                        )}
                    </Select>
                }
            >
                <Grid xs={1} sm={2} lg={3} xl={4} spacing={2} alignSelf="flex-start">
                    {productsView.length > 0 &&
                        products.map((product: Product.Options, i: number) => {
                            return (
                                <Card key={i}>
                                    <CardHeader
                                        title={product.name}
                                        subtitle={product.category.name}
                                    />
                                    {product.images!.length > 0 ? (
                                        <Image
                                            src={`${process.env.SERVER_URL}${product.images![0].path}`}
                                            height={140}
                                            width={300}
                                            style={{ height: 200, width: "100%", objectFit: 'cover' }}
                                            alt={product.name}
                                            title={product.name}
                                        />
                                    ) : (
                                        <ImageBG>
                                            <Panorama />
                                            <p>Aucune image</p>
                                        </ImageBG>
                                    )}
                                    <CardContent>
                                        <p style={{ textAlign: 'right', marginBottom: 20 }}>
                                            À partir de {product.variants[0]?.promotion > 0 ? (
                                                <>
                                                    <span className='price ml-1'>{getPromotion(product.variants[0].price, product.variants[0].promotion)}</span>€
                                                    <span className='has-discount ml-2'>{product.variants[0].price}€</span>
                                                </>
                                            ) : (
                                                <span className='price ml-1'>{product.variants[0].price}€</span>
                                            )}
                                        </p>
                                        <div className='mb-2'>
                                            <Select
                                                placeholder={`${productsView[i].variant.width}/${productsView[i].variant.height}cm`}
                                                readOnly
                                                value={`${productsView[i].variant.width}/${productsView[i].variant.height}cm`}
                                                onChange={() => { }}
                                            >
                                                {product.variants.length > 0 && (
                                                    product.variants.map((variant, j) => (
                                                        <div key={j} onClick={() => handleCardVariant(i, variant)}>
                                                            {`${variant.width}/${variant.height}cm`}
                                                        </div>
                                                    ))
                                                )}
                                            </Select>
                                        </div>
                                        <Grid xs={2} spacing={1}>
                                            <QuantityInput
                                                min="1"
                                                max={productsView[i].variant.stock}
                                                value={productsView[i].quantity}
                                                onChange={(value: number) => handleCardQuantity(i, value)}
                                            />
                                            <Button fullWidth onClick={async () => await addProductToCart(product, productsView[i].variant, productsView[i].quantity)}>
                                                Ajouter
                                            </Button>
                                        </Grid>
                                    </CardContent>
                                </Card>
                            )
                        })}
                </Grid>
                <SidePagination
                    array={products}
                    router={router}
                    currentPage={currentPage}
                    count={count}
                    limit={limit}
                />
                <Cart
                    cart={cart}
                    setCart={setCart}
                    promotions={promotions}
                    user={user}
                />
            </RootPagesLayout>
        </Layout>
    )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const { req, res, query } = context
    const user = await isAuthenticated(req, res)

    const { products, count, currentPage, limit } = await getProducts({ ...query, select: '-description -content' })
    const { categories } = await getCategories({ select: 'name', populate: 'false' })
    const { promotions } = await getPromotions()

    return {
        props: {
            user,
            products,
            count,
            currentPage,
            limit,
            categories,
            promotions
        }
    }
}