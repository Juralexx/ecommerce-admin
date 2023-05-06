import React from 'react'
import Image from 'next/image';
import styled from 'styled-components';
import axios from '@/axios.config';
import { CartProduct, IProductVariant, Promotion, User } from '@/types';
import { Delete } from '@mui/icons-material';
import { Button, QuantityInput, IconButton, Input } from '@/components/global';
import { getTotal } from '@/functions/utils';
import { getCart, updateCart } from '@/api/carts';

interface Props {
    cart: CartProduct[];
    setCart: React.Dispatch<React.SetStateAction<CartProduct[]>>;
    promotions: Promotion.Options[];
    user?: User.Options;
}

const Cart = ({ cart, setCart, promotions, user }: Props) => {
    const [total, setTotal] = React.useState<number>(0)
    const [codePromo, setCodePromo] = React.useState<Promotion.Options | null>(null)
    const [applicableCodes, setApplicableCodes] = React.useState<any[]>([])
    const [codeInput, setCodeInput] = React.useState<string>('')

    React.useEffect(() => {
        const fetchExistingCart = async () => {
            const cartStorage = localStorage.getItem('cart_id')
            if (cartStorage) {
                const { cart: existingCart } = await getCart(cartStorage)
                if (existingCart) {
                    const products = existingCart.products.map((cartItem: any, i: number) => {
                        const { product, quantity } = cartItem
                        const variant = product.variants.find((el: any) => el._id === cartItem.variant)
                        if (variant) {
                            return {
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
                            }
                        }
                    })
                    setCart(products)
                }
            }
        }
        fetchExistingCart()
    }, [])

    function storeApplicablesCodes() {
        for (let i = 0; i < cart.length; i++) {
            const product = cart[i]
            if (!product.promotion || product.promotion === 0) {
                if (product.promotions.length > 0) {
                    product.promotions.forEach(promo => {
                        const isAlreadyInApplicableCodes = applicableCodes.some(el => el._id === promo._id)
                        if (!isAlreadyInApplicableCodes) {
                            setApplicableCodes(prev => [...prev, promo])
                        }
                    })
                }
            }
        }
    }

    function checkIfCodeIsApplicable() {
        if (codePromo) {
            for (let i = 0; i < cart.length; i++) {
                const product = cart[i]
                let newTotal = 0
                if (!product.promotion || product.promotion === 0) {
                    if (product.promotions.length > 0) {
                        product.promotions.forEach(promo => {
                            const isCodeApplicable = promotions.some(el => el._id === promo._id)
                            if (isCodeApplicable) {
                                let newPrice = 0
                                if (codePromo.type === 'percentage') {
                                    newPrice = Number((product.price - ((codePromo.value / 100) * product.price)).toFixed(2))
                                }
                                if (codePromo.type === 'fixed') {
                                    newPrice = product.price - codePromo.value
                                }
                                newTotal = newTotal + (Number((product.price - newPrice).toFixed(2)) * product.quantity)
                            }
                        })
                    }
                }
                if (i === cart.length - 1) {
                    setTotal(Number((getCartTotal() - newTotal).toFixed(2)))
                }
            }
        }
    }

    React.useEffect(() => {
        if (!codePromo) {
            setTotal(getCartTotal())
        }
        if (cart.length > 0) {
            checkIfCodeIsApplicable()
            storeApplicablesCodes()
        } else {
            setApplicableCodes([])
        }
    }, [cart, codePromo])

    function handleCartQuantity(variant: IProductVariant, value: number) {
        let array = [...cart]
        const index = array.findIndex(el => el.variant._id === variant._id)

        if (index !== -1) {
            if (value > 0) {
                array[index].quantity = value
                setCart(array)
            }
            if (value <= 0) {
                array.splice(index, 1)
                return setCart(array)
            }
        }
    }

    function handleCodePromo(code: string) {
        if (!codePromo) {
            if (applicableCodes.some(el => el.code === code)) {
                const index = applicableCodes.findIndex(el => el.code === code)
                setCodePromo(applicableCodes[index])
            }
        }
    }


    async function removeProductFromCart(key: number) {
        let array = [...cart]
        array.splice(key, 1)
        setCart(array)

        const cartStorage = localStorage.getItem('cart_id')
        const { errors } = await updateCart({ _id: cartStorage },
            { products: array.map(item => { return { product: item._id, variant: item.variant, quantity: item.quantity } }) }
        )
        if (errors.message) {
            console.log(errors.message)
        }
    }

    function getCartTotal() {
        let total = 0
        for (let i = 0; i < cart.length; i++) {
            total = total + cart[i].price * cart[i].quantity;
        }
        return Number(total.toFixed(2))
    }

    async function handleCheckout() {
        await axios({
            method: 'post',
            url: '/api/payment/create-checkout-session',
            data: {
                cart: cart,
                user: user
            }
        })
            .then(res => {
                if (res.data.url) {
                    window.location.href = res.data.url
                }
            })
            .catch(err => console.log(err))
    }

    return (
        <CartContainer>
            <h2>Mon panier</h2>
            <div className='cart-container'>
                <div className='cart-items'>
                    {cart.length > 0 ? (
                        cart.map((product, i) => {
                            return (
                                <CartItem key={i}>
                                    <Image
                                        src={`${process.env.SERVER_URL}${product.image}`}
                                        height={125}
                                        width={125}
                                        style={{ height: 125, width: 125, objectFit: 'cover' }}
                                        alt={product.name || ''}
                                        title={product.name}
                                    />
                                    <div className='cart-item-right'>
                                        <div className='cart-item-right-right'>
                                            <div>
                                                <p className='title'>{product.name}</p>
                                                <p className='txt-sec'>{`${product.variant.width}/${product.variant.height}cm`}</p>
                                            </div>
                                            <div className='flex items-baseline'>
                                                <div className='price'>
                                                    {product.price}€
                                                </div>
                                                {product.promotion > 0 &&
                                                    <>
                                                        <div className='has-discount ml-3'>
                                                            {product.original_price}€
                                                        </div>
                                                        <div className='promo'>
                                                            -{product.promotion}%
                                                        </div>
                                                    </>
                                                }
                                            </div>
                                        </div>
                                        <div className='cart-item-right-left'>
                                            <div className='flex'>
                                                <QuantityInput
                                                    min="1"
                                                    max={product.variant.stock}
                                                    value={product.quantity}
                                                    onChange={(value: number) => handleCartQuantity(product.variant, value)}
                                                />
                                                <IconButton noBg className="ml-3" onClick={() => removeProductFromCart(i)}>
                                                    <Delete />
                                                </IconButton>
                                            </div>
                                            <div className='total-price'>
                                                {(product.price * product.quantity).toFixed(2)}€
                                            </div>
                                        </div>
                                    </div>
                                </CartItem>
                            )
                        })
                    ) : (
                        <p>Il n'y a pas d'articles dans votre panier</p>
                    )}
                </div>
                <div className='cart-summary'>
                    <div className='cart-summary-header'>
                        <p>Récapitulatif</p>
                    </div>
                    <div className='cart-summary-body'>
                        <div className='flex justify-between'>
                            <p>{getTotal(cart, 'number', 0)} articles</p>
                            <p className='bold'>{getCartTotal()}€</p>
                        </div>
                        {codePromo &&
                            <div className='flex justify-between mt-3'>
                                <p>Réduction(s)</p>
                                <p className='bold'>-{(getCartTotal() - total).toFixed(2)}€</p>
                            </div>
                        }
                        <div className='flex justify-between mt-3'>
                            <p>Livraison</p>
                            <p className='bold'>-</p>
                        </div>
                        <div className='mt-6'>
                            <p className='mb-2'>Ajouter un code promo</p>
                            <div className='flex'>
                                <div className='mr-2'>
                                    <Input
                                        value={codeInput}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCodeInput(e.target.value.toUpperCase())}
                                        placeholder="Code promo"
                                    />
                                </div>
                                <Button onClick={() => handleCodePromo(codeInput)}>
                                    Ajouter
                                </Button>
                            </div>
                        </div>
                        {applicableCodes.length > 0 &&
                            applicableCodes.map((promo, i) => {
                                return (
                                    <div className='promotion' key={i}>
                                        <div className='code'>{promo.code}</div> - Code promo -{promo.value}%
                                        <br />
                                        {promo.description}
                                    </div>
                                )
                            })
                        }
                        <div className='cart-total'>
                            <div className='flex justify-between'>
                                <p>Total TTC</p>
                                <p className='bold'>{total}€</p>
                            </div>
                            <Button fullWidth onClick={() => handleCheckout()}>
                                Valider la commande
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </CartContainer>
    )
}

export default Cart

const CartContainer = styled.div`
    padding : 50px 0;

    .cart-container {
        display : flex;

        @media(max-width: 992px) {
            flex-direction : column;
        }
    }

    .cart-items {
        flex-grow : 1;
    }

    .cart-summary {
        width         : 340px;
        border-radius : var(--rounded-sm);
        overflow      : hidden;
        margin-left   : 20px;
        border        : 1px solid var(--light-border);

        @media(max-width: 992px) {
            margin : 20px auto 0;
        }
    }

    .cart-summary-header {
        padding          : 15px 9px;
        background-color : var(--primary);
        text-align       : center;

        p {
            font-size   : 20px;
            font-weight : 500;
        }
    }

    .cart-summary-body {
        padding          : 20px;
        background-color : var(--bg-zero);
        height           : 100%;

        * {
            font-size : 16px;
        }
    }

    .cart-total {
        margin-top  : 10px;
        padding-top : 20px;
        border-top  : 1px solid var(--light-border);

        p {
            font-size: 20px;
        }

        button {
            font-size  : 18px;
            margin-top : 30px;
        }
    }

    .promotion {
        padding   : 10px 0;
        font-size : 1rem;

        .code {
            display : inline-block;
            color   : var(--orange-500);
        }
    }
`

const CartItem = styled.div`
    display          : flex;
    align-items      : stretch;
    padding          : 20px;
    background-color : var(--bg-zero);
    border-radius    : var(--rounded-sm);
    margin-bottom    : 10px;
    border           : 1px solid var(--light-border);

    &:last-child {
        margin-bottom : 0;
    }

    .cart-item-right {
        display         : flex;
        justify-content : space-between;
        flex-grow       : 1;
        padding-left    : 20px;
    }

    .cart-item-right-right {
        display         : flex;
        flex-direction  : column;
        justify-content : space-between;
    }

    .promo {
        border-radius : var(--rounded-sm);
        color         : var(--orange-500);
        font-weight   : bold;
        margin-left   : 10px;
    }

    .cart-item-right-left {
        display         : flex;
        flex-direction  : column;
        justify-content : space-between;
        align-items     : flex-end;

        .total-price {
            font-weight : 500;
            font-size   : 20px;
        }
    }

    .title {
        font-size : 18px;
    }
`