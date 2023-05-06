import { NextRouter } from "next/router";

type NonFunctionPropertyNames<T> = {
    [K in keyof T]: T[K] extends Function ? never : K
}[keyof T];

type NonFunctionProperties<T> = Pick<T, NonFunctionPropertyNames<T>>;

export interface PageProps {
    uid?: string;
    user?: User.Options;
    router?: NextRouter;
    children?: React.ReactNode;
    title?: string;
}

export namespace Img {

    export interface Options {
        _id?: string;
        name?: string | null;
        path?: string | null;
        size?: number | null;
        extension?: string | null;
    }

    export const defaultProps: Options = {
        name: null,
        path: null,
        size: null,
        extension: null
    }
}

/**
 * Default properties used for all users (team and customers)
 */

export interface defaultUserProps {
    _id?: string;
    name?: string;
    lastname?: string;
    email?: string;
    password?: string;
    phone?: string;
}

/**
 * Team member properties
 */

export type UserRole = 'developer' | 'admin' | 'editor' | 'user';

export namespace User {

    export interface Options extends defaultUserProps {
        role: UserRole;
        image?: Img.Options;
        isAdmin?(): boolean,
        isEditor?(): boolean,
        isUser?(): boolean,
        isDeveloper?(): boolean,
    }

    export interface Entity extends Options { }

    export class Entity implements Options {
        constructor(args: Options) {
            Object.assign(this, args);
        }

        isAdmin(): boolean {
            return this.role === 'admin';
        }
        isEditor(): boolean {
            return this.role === 'editor';
        }
        isUser(): boolean {
            return this.role === 'user';
        }
        isDeveloper(): boolean {
            return this.role === 'developer';
        }
    }

    export const defaultProps: Options = {
        name: '',
        lastname: '',
        email: '',
        password: '',
        role: 'user',
        image: Img.defaultProps,
    }
}

/**
 * Navigation properties
 */

export interface Link {
    id: string | number;
    type?: 'link';
    name: string;
    link: string;
}

export interface Links {
    id: string | number;
    type: 'submenu' | 'link';
    name: string;
    link?: string;
    links?: Link[];
}

export namespace Navigation {

    export interface Options {
        _id?: string;
        navigation?: Array<Links>;
    }
}

/**
 * Categorie properties
 */

export namespace Category {

    export interface Options {
        _id?: string;
        name: string;
        link: string;
        parent: string;
        content: string;
        image: { [key: string]: any } | null;
    }

    export interface Entity extends Options {
        hasImage(): boolean;
    }

    export class Entity implements Options {
        constructor(args: Options) {
            Object.assign(this, args);
        }

        hasImage(): boolean {
            return !this.image || !this.image?.path;
        }
    }

    export const defaultProps: Options = {
        name: '',
        link: '',
        parent: '',
        content: '',
        image: null
    }
}

/**
 * Pages properties
 */

export namespace Page {

    export interface Options {
        _id?: string;
        published: boolean;
        title: string;
        link: string;
        content: string;
        isPublished?(): boolean
    }

    export interface Entity extends Options { }

    export class Entity {
        constructor(args: Options) {
            Object.assign(this, args);
        }

        isPublished(): boolean {
            return !this.published || this.published === null;
        }
    }

    export const defaultProps: Options = {
        published: false,
        title: '',
        content: '',
        link: ''
    }
}

/**
 * Customer properties
 */

export namespace Customer {

    export interface Options extends defaultUserProps {
        title: 'M' | 'Mme';
        birth?: Date;
        addresses: Address.Options[];
        phone?: string;
        cart: Product.Options[];
        orders: Order.Options[];
        registration_date: Date;
    }

    export interface Entity extends Options { }

    export class Entity {
        constructor(args: Options) {
            Object.assign(this, args);
        }
    }

    export const defaultProps: Options = {
        title: 'M',
        name: '',
        lastname: '',
        email: '',
        password: '',
        phone: '',
        addresses: [],
        cart: [],
        orders: [],
        registration_date: new Date(),
    }
}

/**
 * Products properties
 */

export namespace Product {

    export interface Options {
        _id?: string,
        published?: boolean;
        name: string;
        category: { [key: string]: any };
        variants: IProductVariant[];
        promotions: Promotion.Options[];
        images?: any[];
        content: string;
        description: string;
        tags: string[];
        details: Array<{ title: string, content: string }>;
        isPublished?(): boolean
    }

    export interface Entity extends Options { }

    export class Entity {
        constructor(args: Options) {
            Object.assign(this, args);
        }

        isPublished(): boolean {
            return !this.published || this.published === null;
        }
    }

    export const variantDefaultProps = {
        width: '',
        height: '',
        weight: '',
        color: '',
        price: 0,
        stock: 0,
        ref: '',
        promotion: 0,
        taxe: 0,
        country: { name: "France", code: "FR" },
        barcode: '',
    }

    export const defaultProps: Options = {
        published: false,
        name: '',
        category: Category.defaultProps,
        variants: [{ ...variantDefaultProps }],
        promotions: [],
        images: [],
        content: '',
        description: '',
        tags: [],
        details: [
            { title: '', content: '' }
        ]
    }
}

export interface IProductVariant {
    _id?: string;
    width: string;
    height: string;
    weight: string;
    color: string;
    price: number;
    stock: number;
    promotion: number;
    ref: string;
    taxe: number;
    country: Record<string, string>;
    url?: string;
    barcode: string;
}

export type OrderStatus = 'accepted' | 'preparation' | 'completed' | 'shipped' | 'delivered' | 'canceled';

export type PaymentStatus = 'awaiting' | 'paid' | 'canceled';

interface IProduct {
    product: Product.Options;
    variant: IProductVariant;
    original_price: number;
    promotion: number;
    price: number;
    number: number;
}

export namespace Order {

    export interface Options {
        _id?: string;
        key: number,
        date: Date;
        customer: Customer.Options,
        payment_method: string;
        delivery_address: Address.Options;
        billing_address: Address.Options;
        products: IProduct[];
        shipping_fees: number;
        price: number;
        carrier: Carrier.Options;
        status: OrderStatus;
        payment_status: PaymentStatus;
        timeline: any;
    }
}

export interface CartProduct {
    _id?: string;
    name: string;
    category: { [key: string]: any };
    promotions: Promotion.Options[];
    image?: string;
    variant: IProductVariant;
    original_price: number;
    promotion: number;
    price: number;
    taxe: number;
    quantity: number;
}

export namespace Carrier {

    export interface Options {
        _id?: string;
        name: string;
        description: string;
        price: number | string;
        published: boolean;
    }

    export const defaultProps: Options = {
        name: '',
        description: '',
        price: '',
        published: false
    }
}

export namespace Promotion {

    export interface Options {
        _id?: string;
        type: 'percentage' | 'fixed';
        code: string;
        value: number;
        description: string;
        start_date: Date | string;
        end_date: Date | string;
        condition: {
            type: string;
            products: Product.Options[];
            categories: Category.Options[];
        },
        is_active: boolean;
    }

    export const defaultProps: Options = {
        type: 'percentage',
        code: '',
        value: 0,
        description: '',
        start_date: new Date(),
        end_date: '',
        condition: {
            type: 'all',
            products: [],
            categories: []
        },
        is_active: false
    }
}

/**
 * 
 */

export enum Roles {
    developer = 'developer',
    admin = 'admin',
    editor = 'editor',
    user = 'user'
}

export const roles: Array<{ name: string, value: UserRole }> = [
    { name: 'Développeur', value: 'developer' },
    { name: 'Administrateur', value: 'admin' },
    { name: 'Éditeur', value: 'editor' },
    { name: 'Utilisateur', value: 'user' }
]

export enum PaymentsStatus {
    accepted = 'accepted',
    preparation = 'in preparation',
    shipped = 'shipped',
    delivered = 'delivered'
}

export const paymentStatus = [
    'accepted',
    'preparation',
    'shipped',
    'delivered'
]

export namespace Address {

    export interface Options {
        street: string;
        postcode: string;
        city: string;
        department: string;
        region: string;
    }

    export const defaultProps = {
        street: '',
        postcode: '',
        city: '',
        department: '',
        region: ''
    }
}