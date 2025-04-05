import { type Message } from "ai";
type Body = {
    messages: Message[];
};
declare const app: import("hono/hono-base").HonoBase<{}, {
    "/generate": {
        $post: {
            input: {
                json: Body;
            };
            output: {};
            outputFormat: string;
            status: import("hono/utils/http-status").StatusCode;
        } | {
            input: {
                json: Body;
            };
            output: {};
            outputFormat: string;
            status: import("hono/utils/http-status").StatusCode;
        };
    };
} & {
    "/cart": {
        $get: {
            input: {};
            output: {
                items: {
                    product: {
                        id: string;
                        description: string;
                        name: string;
                        variants: {
                            id: string;
                            name: string;
                            price: number;
                        }[];
                        order?: number | undefined;
                        subscription?: "allowed" | "required" | undefined;
                        tags?: {
                            app?: string | undefined;
                            color?: string | undefined;
                            featured?: boolean | undefined;
                            market_eu?: boolean | undefined;
                            market_na?: boolean | undefined;
                        } | undefined;
                    } | undefined;
                    id: string;
                    productVariantID: string;
                    quantity: number;
                    subtotal: number;
                }[];
                amount: {
                    subtotal: number;
                    shipping?: number | undefined;
                    total?: number | undefined;
                };
                subtotal: number;
                addressID?: string | undefined;
                cardID?: string | undefined;
                shipping?: {
                    service?: string | undefined;
                    timeframe?: string | undefined;
                } | undefined;
            };
            outputFormat: "json";
            status: import("hono/utils/http-status").ContentfulStatusCode;
        };
    };
} & {
    "/order": {
        $get: {
            input: {};
            output: {
                items: {
                    product: {
                        id: string;
                        description: string;
                        name: string;
                        variants: {
                            id: string;
                            name: string;
                            price: number;
                        }[];
                        order?: number | undefined;
                        subscription?: "allowed" | "required" | undefined;
                        tags?: {
                            app?: string | undefined;
                            color?: string | undefined;
                            featured?: boolean | undefined;
                            market_eu?: boolean | undefined;
                            market_na?: boolean | undefined;
                        } | undefined;
                    } | undefined;
                    id: string;
                    amount: number;
                    quantity: number;
                    description?: string | undefined;
                    productVariantID?: string | undefined;
                }[];
                id: string;
                amount: {
                    shipping: number;
                    subtotal: number;
                };
                shipping: {
                    city: string;
                    country: string;
                    name: string;
                    street1: string;
                    zip: string;
                    phone?: string | undefined;
                    province?: string | undefined;
                    street2?: string | undefined;
                };
                tracking: {
                    number?: string | undefined;
                    service?: string | undefined;
                    url?: string | undefined;
                };
                index?: number | undefined;
            }[];
            outputFormat: "json";
            status: import("hono/utils/http-status").ContentfulStatusCode;
        };
    };
} & {
    "/subscription": {
        $get: {
            input: {};
            output: {
                product: {
                    id: string;
                    description: string;
                    name: string;
                    variants: {
                        id: string;
                        name: string;
                        price: number;
                    }[];
                    order?: number | undefined;
                    subscription?: "allowed" | "required" | undefined;
                    tags?: {
                        app?: string | undefined;
                        color?: string | undefined;
                        featured?: boolean | undefined;
                        market_eu?: boolean | undefined;
                        market_na?: boolean | undefined;
                    } | undefined;
                } | undefined;
                id: string;
                addressID: string;
                cardID: string;
                productVariantID: string;
                quantity: number;
                next?: string | undefined;
                schedule?: {
                    type: "fixed";
                } | {
                    interval: number;
                    type: "weekly";
                } | undefined;
            }[];
            outputFormat: "json";
            status: import("hono/utils/http-status").ContentfulStatusCode;
        };
    };
}, "/">;
declare const _default: {
    port: number;
    fetch: (request: Request, Env?: unknown, executionCtx?: import("hono").ExecutionContext) => Response | Promise<Response>;
};
export default _default;
export type App = typeof app;
