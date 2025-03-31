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

export async function orderQuery() {
  const [{ data: products }, { data: orders }] = await Promise.all([
    client.product.list(),
    client.order.list(),
  ])

  const enrichedOrders = orders.map((order) => {
    const enrichedItems = order.items.map((item) => {
      const product = products.find((product) =>
        product.variants.some(
          (variant) => variant.id === item.productVariantID,
        ),
      )

      return {
        ...item,
        product,
      }
    })

    return {
      ...order,
      items: enrichedItems,
    }
  })

  return enrichedOrders
}

export async function subscriptionQuery() {
    const [{ data: products }, { data: subscriptions }] = await Promise.all([
      client.product.list(),
      client.subscription.list(),
    ])
  
    const enrichedSubscriptions = subscriptions.map((subscription) => {
      const product = products.find((product) =>
        product.variants.some(
          (variant) => variant.id === subscription.productVariantID,
        ),
      )
  
      return {
        ...subscription,
        product,
      }
    })
  
    return enrichedSubscriptions
  }
  