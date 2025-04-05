import { z } from "zod";
export declare const tools: {
    list_products: import("ai").Tool<z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>, any> & {
        execute: (args: {}, options: import("ai").ToolExecutionOptions) => PromiseLike<any>;
    };
    get_product: import("ai").Tool<z.ZodObject<{
        productId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        productId: string;
    }, {
        productId: string;
    }>, any> & {
        execute: (args: {
            productId: string;
        }, options: import("ai").ToolExecutionOptions) => PromiseLike<any>;
    };
    get_profile: import("ai").Tool<z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>, any> & {
        execute: (args: {}, options: import("ai").ToolExecutionOptions) => PromiseLike<any>;
    };
    update_profile: import("ai").Tool<z.ZodObject<{
        email: z.ZodString;
        name: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        name: string;
        email: string;
    }, {
        name: string;
        email: string;
    }>, any> & {
        execute: (args: {
            name: string;
            email: string;
        }, options: import("ai").ToolExecutionOptions) => PromiseLike<any>;
    };
    list_addresses: import("ai").Tool<z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>, any> & {
        execute: (args: {}, options: import("ai").ToolExecutionOptions) => PromiseLike<any>;
    };
    get_address: import("ai").Tool<z.ZodObject<{
        addressId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        addressId: string;
    }, {
        addressId: string;
    }>, any> & {
        execute: (args: {
            addressId: string;
        }, options: import("ai").ToolExecutionOptions) => PromiseLike<any>;
    };
    create_address: import("ai").Tool<z.ZodObject<{
        city: z.ZodString;
        country: z.ZodString;
        name: z.ZodString;
        street1: z.ZodString;
        zip: z.ZodString;
        street2: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        name: string;
        country: string;
        zip: string;
        city: string;
        street1: string;
        street2?: string | undefined;
    }, {
        name: string;
        country: string;
        zip: string;
        city: string;
        street1: string;
        street2?: string | undefined;
    }>, any> & {
        execute: (args: {
            name: string;
            country: string;
            zip: string;
            city: string;
            street1: string;
            street2?: string | undefined;
        }, options: import("ai").ToolExecutionOptions) => PromiseLike<any>;
    };
    delete_address: import("ai").Tool<z.ZodObject<{
        addressId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        addressId: string;
    }, {
        addressId: string;
    }>, any> & {
        execute: (args: {
            addressId: string;
        }, options: import("ai").ToolExecutionOptions) => PromiseLike<any>;
    };
    list_cards: import("ai").Tool<z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>, any> & {
        execute: (args: {}, options: import("ai").ToolExecutionOptions) => PromiseLike<any>;
    };
    get_card: import("ai").Tool<z.ZodObject<{
        cardId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        cardId: string;
    }, {
        cardId: string;
    }>, any> & {
        execute: (args: {
            cardId: string;
        }, options: import("ai").ToolExecutionOptions) => PromiseLike<any>;
    };
    create_card: import("ai").Tool<z.ZodObject<{
        token: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        token: string;
    }, {
        token: string;
    }>, any> & {
        execute: (args: {
            token: string;
        }, options: import("ai").ToolExecutionOptions) => PromiseLike<any>;
    };
    collect_card: import("ai").Tool<z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>, any> & {
        execute: (args: {}, options: import("ai").ToolExecutionOptions) => PromiseLike<any>;
    };
    get_cart: import("ai").Tool<z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>, {
        items: {
            product: import("@terminaldotshop/sdk/resources/product.mjs").Product | undefined;
            id: string;
            productVariantID: string;
            quantity: number;
            subtotal: number;
        }[];
        amount: import("@terminaldotshop/sdk/resources/cart.mjs").Cart.Amount;
        subtotal: number;
        addressID?: string;
        cardID?: string;
        shipping?: import("@terminaldotshop/sdk/resources/cart.mjs").Cart.Shipping;
    }> & {
        execute: (args: {}, options: import("ai").ToolExecutionOptions) => PromiseLike<{
            items: {
                product: import("@terminaldotshop/sdk/resources/product.mjs").Product | undefined;
                id: string;
                productVariantID: string;
                quantity: number;
                subtotal: number;
            }[];
            amount: import("@terminaldotshop/sdk/resources/cart.mjs").Cart.Amount;
            subtotal: number;
            addressID?: string;
            cardID?: string;
            shipping?: import("@terminaldotshop/sdk/resources/cart.mjs").Cart.Shipping;
        }>;
    };
    add_cart_item: import("ai").Tool<z.ZodObject<{
        productVariantID: z.ZodString;
        quantity: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        productVariantID: string;
        quantity: number;
    }, {
        productVariantID: string;
        quantity: number;
    }>, any> & {
        execute: (args: {
            productVariantID: string;
            quantity: number;
        }, options: import("ai").ToolExecutionOptions) => PromiseLike<any>;
    };
    set_cart_address: import("ai").Tool<z.ZodObject<{
        addressID: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        addressID: string;
    }, {
        addressID: string;
    }>, any> & {
        execute: (args: {
            addressID: string;
        }, options: import("ai").ToolExecutionOptions) => PromiseLike<any>;
    };
    set_cart_card: import("ai").Tool<z.ZodObject<{
        cardID: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        cardID: string;
    }, {
        cardID: string;
    }>, any> & {
        execute: (args: {
            cardID: string;
        }, options: import("ai").ToolExecutionOptions) => PromiseLike<any>;
    };
    convert_cart_to_order: import("ai").Tool<z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>, any> & {
        execute: (args: {}, options: import("ai").ToolExecutionOptions) => PromiseLike<any>;
    };
    clear_cart: import("ai").Tool<z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>, any> & {
        execute: (args: {}, options: import("ai").ToolExecutionOptions) => PromiseLike<any>;
    };
    list_orders: import("ai").Tool<z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>, {
        items: {
            product: import("@terminaldotshop/sdk/resources/product.mjs").Product | undefined;
            id: string;
            amount: number;
            quantity: number;
            description?: string;
            productVariantID?: string;
        }[];
        id: string;
        amount: import("@terminaldotshop/sdk/resources/order.mjs").Order.Amount;
        shipping: import("@terminaldotshop/sdk/resources/order.mjs").Order.Shipping;
        tracking: import("@terminaldotshop/sdk/resources/order.mjs").Order.Tracking;
        index?: number;
    }[]> & {
        execute: (args: {}, options: import("ai").ToolExecutionOptions) => PromiseLike<{
            items: {
                product: import("@terminaldotshop/sdk/resources/product.mjs").Product | undefined;
                id: string;
                amount: number;
                quantity: number;
                description?: string;
                productVariantID?: string;
            }[];
            id: string;
            amount: import("@terminaldotshop/sdk/resources/order.mjs").Order.Amount;
            shipping: import("@terminaldotshop/sdk/resources/order.mjs").Order.Shipping;
            tracking: import("@terminaldotshop/sdk/resources/order.mjs").Order.Tracking;
            index?: number;
        }[]>;
    };
    get_order: import("ai").Tool<z.ZodObject<{
        orderId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        orderId: string;
    }, {
        orderId: string;
    }>, any> & {
        execute: (args: {
            orderId: string;
        }, options: import("ai").ToolExecutionOptions) => PromiseLike<any>;
    };
    create_order: import("ai").Tool<z.ZodObject<{
        addressID: z.ZodString;
        cardID: z.ZodString;
        variants: z.ZodRecord<z.ZodString, z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        addressID: string;
        cardID: string;
        variants: Record<string, number>;
    }, {
        addressID: string;
        cardID: string;
        variants: Record<string, number>;
    }>, any> & {
        execute: (args: {
            addressID: string;
            cardID: string;
            variants: Record<string, number>;
        }, options: import("ai").ToolExecutionOptions) => PromiseLike<any>;
    };
    list_subscriptions: import("ai").Tool<z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>, any> & {
        execute: (args: {}, options: import("ai").ToolExecutionOptions) => PromiseLike<any>;
    };
    get_subscription: import("ai").Tool<z.ZodObject<{
        subscriptionId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        subscriptionId: string;
    }, {
        subscriptionId: string;
    }>, any> & {
        execute: (args: {
            subscriptionId: string;
        }, options: import("ai").ToolExecutionOptions) => PromiseLike<any>;
    };
    create_subscription: import("ai").Tool<z.ZodObject<{
        addressID: z.ZodString;
        cardID: z.ZodString;
        productVariantID: z.ZodString;
        quantity: z.ZodNumber;
        schedule: z.ZodDiscriminatedUnion<"type", [z.ZodObject<{
            type: z.ZodLiteral<"fixed">;
        }, "strip", z.ZodTypeAny, {
            type: "fixed";
        }, {
            type: "fixed";
        }>, z.ZodObject<{
            type: z.ZodLiteral<"weekly">;
            interval: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            type: "weekly";
            interval: number;
        }, {
            type: "weekly";
            interval: number;
        }>]>;
    }, "strip", z.ZodTypeAny, {
        productVariantID: string;
        quantity: number;
        addressID: string;
        cardID: string;
        schedule: {
            type: "fixed";
        } | {
            type: "weekly";
            interval: number;
        };
    }, {
        productVariantID: string;
        quantity: number;
        addressID: string;
        cardID: string;
        schedule: {
            type: "fixed";
        } | {
            type: "weekly";
            interval: number;
        };
    }>, "ok"> & {
        execute: (args: {
            productVariantID: string;
            quantity: number;
            addressID: string;
            cardID: string;
            schedule: {
                type: "fixed";
            } | {
                type: "weekly";
                interval: number;
            };
        }, options: import("ai").ToolExecutionOptions) => PromiseLike<"ok">;
    };
    cancel_subscription: import("ai").Tool<z.ZodObject<{
        subscriptionId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        subscriptionId: string;
    }, {
        subscriptionId: string;
    }>, "ok"> & {
        execute: (args: {
            subscriptionId: string;
        }, options: import("ai").ToolExecutionOptions) => PromiseLike<"ok">;
    };
    list_tokens: import("ai").Tool<z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>, import("@terminaldotshop/sdk/resources/token.mjs").Token[]> & {
        execute: (args: {}, options: import("ai").ToolExecutionOptions) => PromiseLike<import("@terminaldotshop/sdk/resources/token.mjs").Token[]>;
    };
    get_token: import("ai").Tool<z.ZodObject<{
        tokenId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        tokenId: string;
    }, {
        tokenId: string;
    }>, import("@terminaldotshop/sdk/resources/token.mjs").Token> & {
        execute: (args: {
            tokenId: string;
        }, options: import("ai").ToolExecutionOptions) => PromiseLike<import("@terminaldotshop/sdk/resources/token.mjs").Token>;
    };
    create_token: import("ai").Tool<z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>, import("@terminaldotshop/sdk/resources/token.mjs").TokenCreateResponse.Data> & {
        execute: (args: {}, options: import("ai").ToolExecutionOptions) => PromiseLike<import("@terminaldotshop/sdk/resources/token.mjs").TokenCreateResponse.Data>;
    };
    delete_token: import("ai").Tool<z.ZodObject<{
        tokenId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        tokenId: string;
    }, {
        tokenId: string;
    }>, "ok"> & {
        execute: (args: {
            tokenId: string;
        }, options: import("ai").ToolExecutionOptions) => PromiseLike<"ok">;
    };
    subscribe_email: import("ai").Tool<z.ZodObject<{
        email: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        email: string;
    }, {
        email: string;
    }>, "ok"> & {
        execute: (args: {
            email: string;
        }, options: import("ai").ToolExecutionOptions) => PromiseLike<"ok">;
    };
    think: import("ai").Tool<z.ZodObject<{
        thought: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        thought: string;
    }, {
        thought: string;
    }>, {
        thought: string;
    }> & {
        execute: (args: {
            thought: string;
        }, options: import("ai").ToolExecutionOptions) => PromiseLike<{
            thought: string;
        }>;
    };
};
