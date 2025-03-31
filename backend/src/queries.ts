import { client } from "./client";

export async function cartQuery() {
    const [{ data: products }, { data: cart }] = await Promise.all([
        client.product.list(),
        client.cart.get(),
    ])

    const enrichedItems = cart.items.map((item) => {
        const product = products.find((product) =>
            product.variants.some((variant) => variant.id === item.productVariantID),
        )

        return {
            ...item,
            product,
        }
    })

    return {
        ...cart,
        items: enrichedItems,
    }

}