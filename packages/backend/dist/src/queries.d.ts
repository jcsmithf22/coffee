export declare function cartQuery(): Promise<{
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
export declare function orderQuery(): Promise<{
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
export declare function subscriptionQuery(): Promise<{
    product: import("@terminaldotshop/sdk/resources/product.mjs").Product | undefined;
    id: string;
    addressID: string;
    cardID: string;
    productVariantID: string;
    quantity: number;
    next?: string;
    schedule?: import("@terminaldotshop/sdk/resources/subscription.mjs").Subscription.Fixed | import("@terminaldotshop/sdk/resources/subscription.mjs").Subscription.Weekly;
}[]>;
