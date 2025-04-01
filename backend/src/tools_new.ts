import { tool } from "ai";
import { z } from "zod";
import { client } from "./client";
import { cartQuery, orderQuery } from "./queries";

export const tools = {
  // Product Tools
  list_products: tool({
    description: "List all available products from Terminal.shop",
    parameters: z.object({}),
    execute: async () => {
      try {
        const products = await client.product.list();
        return products.data;
      } catch (error: any) {
        return error.message;
      }
    },
  }),

  get_product: tool({
    description: "Get details of a specific product by ID or variant ID",
    parameters: z.object({
      productId: z
        .string()
        .describe(
          "The product ID (e.g., prd_XXXXXXXXXXXXXXXXXXXXXXXXX) or variant ID (e.g., var_XXXXXXXXXXXXXXXXXXXXXXXXX)",
        ),
    }),
    execute: async ({ productId }) => {
      try {
        // Check if the ID is a variant ID
        if (productId.startsWith("var_")) {
          // If it's a variant ID, list all products and find the one with the matching variant
          const productsResponse = await client.product.list();
          const products = productsResponse.data;

          // Find the product that contains the variant with the matching ID
          const product = products.find((product) =>
            product.variants.some((variant) => variant.id === productId),
          );

          if (product) {
            return product;
          } else {
            return `No product found with variant ID: ${productId}`;
          }
        } else {
          // If it's a product ID, use the existing logic
          const product = await client.product.get(productId);
          return product.data;
        }
      } catch (error: any) {
        return error.message;
      }
    },
  }),

  // Profile Tools
  get_profile: tool({
    description: "Get the current user's profile information",
    parameters: z.object({}),
    execute: async () => {
      try {
        const profile = await client.profile.me();
        return profile.data;
      } catch (error: any) {
        return error.message;
      }
    },
  }),

  update_profile: tool({
    description: "Update the current user's profile information",
    parameters: z.object({
      email: z.string().email(),
      name: z.string(),
    }),
    execute: async ({ email, name }) => {
      try {
        const profile = await client.profile.update({ email, name });
        return profile.data;
      } catch (error: any) {
        return error.message;
      }
    },
  }),

  // Address Tools
  list_addresses: tool({
    description: "List all saved addresses for the current user",
    parameters: z.object({}),
    execute: async () => {
      try {
        const addresses = await client.address.list();
        return addresses.data;
      } catch (error: any) {
        return error.message;
      }
    },
  }),

  get_address: tool({
    description: "Get details of a specific address by ID",
    parameters: z.object({
      addressId: z
        .string()
        .describe("The address ID (e.g., shp_XXXXXXXXXXXXXXXXXXXXXXXXX)"),
    }),
    execute: async ({ addressId }) => {
      try {
        const address = await client.address.get(addressId);
        return address.data;
      } catch (error: any) {
        return error.message;
      }
    },
  }),

  create_address: tool({
    description: "Create a new shipping address",
    parameters: z.object({
      city: z.string(),
      country: z.string(),
      name: z.string(),
      street1: z.string(),
      zip: z.string(),
      street2: z.string().optional(),
    }),
    execute: async ({ city, country, name, street1, zip, street2 }) => {
      try {
        const address = await client.address.create({
          city,
          country,
          name,
          street1,
          zip,
          street2,
        });
        return address.data;
      } catch (error: any) {
        return error.message;
      }
    },
  }),

  delete_address: tool({
    description: "Delete a shipping address by ID",
    parameters: z.object({
      addressId: z
        .string()
        .describe("The address ID (e.g., shp_XXXXXXXXXXXXXXXXXXXXXXXXX)"),
    }),
    execute: async ({ addressId }) => {
      try {
        const result = await client.address.delete(addressId);
        return result.data;
      } catch (error: any) {
        return error.message;
      }
    },
  }),

  // Card Tools
  list_cards: tool({
    description: "List all saved credit cards for the current user",
    parameters: z.object({}),
    execute: async () => {
      try {
        const cards = await client.card.list();
        return cards.data;
      } catch (error: any) {
        return error.message;
      }
    },
  }),

  get_card: tool({
    description: "Get details of a specific credit card by ID",
    parameters: z.object({
      cardId: z
        .string()
        .describe("The card ID (e.g., crd_XXXXXXXXXXXXXXXXXXXXXXXXX)"),
    }),
    execute: async ({ cardId }) => {
      try {
        const card = await client.card.get(cardId);
        return card.data;
      } catch (error: any) {
        return error.message;
      }
    },
  }),

  create_card: tool({
    description:
      "Attach a new credit card (via Stripe token) to the current user",
    parameters: z.object({
      token: z
        .string()
        .describe(
          "Stripe token representing the card (e.g., tok_1N3T00LkdIwHu7ixt44h1F8k)",
        ),
    }),
    execute: async ({ token }) => {
      try {
        const card = await client.card.create({ token });
        return card.data;
      } catch (error: any) {
        return error.message;
      }
    },
  }),

  collect_card: tool({
    description:
      "Create a temporary URL for collecting credit card information",
    parameters: z.object({}),
    execute: async () => {
      try {
        const response = await client.card.collect();
        return response.data;
      } catch (error: any) {
        return error.message;
      }
    },
  }),

  // Cart Tools
  get_cart: tool({
    description: "Get the current user's cart contents",
    parameters: z.object({}),
    execute: cartQuery,
  }),

  add_cart_item: tool({
    description:
      "Add an item to the current user's cart, or updates the quantity if the item is already in the cart. This is the default when a user would like to place an order. Adding items to cart does not automatically place the order.",
    parameters: z.object({
      productVariantID: z.string().describe("The product variant ID to add"),
      quantity: z
        .number()
        .min(0)
        .describe("Quantity to add. Set to 0 to remove. This is the total quantity, not the amount you would like to add."),
    }),
    execute: async ({ productVariantID, quantity }) => {
      try {
        const response = await client.cart.setItem({
          productVariantID,
          quantity,
        });
        return response.data;
      } catch (error: any) {
        return error.message;
      }
    },
  }),

  set_cart_address: tool({
    description: "Set the shipping address for the current user's cart",
    parameters: z.object({
      addressID: z.string().describe("The address ID to use for shipping"),
    }),
    execute: async ({ addressID }) => {
      try {
        const response = await client.cart.setAddress({ addressID });
        return response.data;
      } catch (error: any) {
        return error.message;
      }
    },
  }),

  set_cart_card: tool({
    description: "Set the payment card for the current user's cart",
    parameters: z.object({
      cardID: z.string().describe("The card ID to use for payment"),
    }),
    execute: async ({ cardID }) => {
      try {
        const response = await client.cart.setCard({ cardID });
        return response.data;
      } catch (error: any) {
        return error.message;
      }
    },
  }),

  convert_cart_to_order: tool({
    description:
      "Convert the current user's cart to an order. Always double check before calling this.",
    parameters: z.object({}),
    execute: async () => {
      try {
        const response = await client.cart.convert();
        return response.data;
      } catch (error: any) {
        return error.message;
      }
    },
  }),

  clear_cart: tool({
    description: "Clear all items from the current user's cart",
    parameters: z.object({}),
    execute: async () => {
      try {
        const response = await client.cart.clear();
        return response.data;
      } catch (error: any) {
        return error.message;
      }
    },
  }),

  // Order Tools
  list_orders: tool({
    description: "List all orders for the current user",
    parameters: z.object({}),
    execute: orderQuery,
  }),

  get_order: tool({
    description: "Get details of a specific order by ID",
    parameters: z.object({
      orderId: z
        .string()
        .describe("The order ID (e.g., ord_XXXXXXXXXXXXXXXXXXXXXXXXX)"),
    }),
    execute: async ({ orderId }) => {
      try {
        const order = await client.order.get(orderId);
        return order.data;
      } catch (error: any) {
        return error.message;
      }
    },
  }),

  create_order: tool({
    description:
      "Create an order directly, bypassing the cart. Use with caution. Do not use this unless specifically requested by the user to order directly. The default should always be to add items to the cart.",
    parameters: z.object({
      addressID: z.string().describe("The shipping address ID"),
      cardID: z.string().describe("The payment card ID"),
      variants: z
        .record(
          z.string().describe("Product Variant ID"),
          z.number().min(1).describe("Quantity"),
        )
        .describe(
          "An object mapping product variant IDs to quantities (e.g., { var_XXXXXXXXXXXXXXXXXXXXXXXXX: 1 })",
        ),
    }),
    execute: async ({ addressID, cardID, variants }) => {
      try {
        const order = await client.order.create({
          addressID,
          cardID,
          variants,
        });
        return order.data;
      } catch (error: any) {
        return error.message;
      }
    },
  }),

  // Subscription Tools
  list_subscriptions: tool({
    description: "List all subscriptions for the current user",
    parameters: z.object({}),
    execute: async () => {
      try {
        const subscriptions = await client.subscription.list();
        return subscriptions.data;
      } catch (error: any) {
        return error.message;
      }
    },
  }),

  get_subscription: tool({
    description: "Get details of a specific subscription by ID",
    parameters: z.object({
      subscriptionId: z
        .string()
        .describe("The subscription ID (e.g., sub_XXXXXXXXXXXXXXXXXXXXXXXXX)"),
    }),
    execute: async ({ subscriptionId }) => {
      try {
        const subscription = await client.subscription.get(subscriptionId);
        return subscription.data;
      } catch (error: any) {
        return error.message;
      }
    },
  }),

  create_subscription: tool({
    description: "Create a new subscription for the current user",
    parameters: z.object({
      addressID: z.string().describe("The shipping address ID"),
      cardID: z.string().describe("The payment card ID"),
      productVariantID: z
        .string()
        .describe("The product variant ID to subscribe to"),
      quantity: z.number().min(1).describe("The quantity for the subscription"),
      schedule: z
        .discriminatedUnion("type", [
          z.object({
            type: z.literal("fixed").describe("Monthly subscription type"),
          }),
          z.object({
            type: z.literal("weekly").describe("Weekly subscription type"),
            interval: z
              .number()
              .min(1)
              .describe("Number of weeks between shipments"),
          }),
        ])
        .describe("Subscription schedule configuration"),
    }),
    execute: async ({
      addressID,
      cardID,
      productVariantID,
      quantity,
      schedule,
    }) => {
      // @ts-ignore
      const subscription = await client.subscription.create({
        addressID,
        cardID,
        productVariantID,
        quantity,
        schedule,
      });
      return subscription.data;
    },
  }),

  cancel_subscription: tool({
    description: "Cancel a subscription by ID",
    parameters: z.object({
      subscriptionId: z
        .string()
        .describe(
          "The subscription ID to cancel (e.g., sub_XXXXXXXXXXXXXXXXXXXXXXXXX)",
        ),
    }),
    execute: async ({ subscriptionId }) => {
      const result = await client.subscription.delete(subscriptionId);
      return result.data;
    },
  }),

  // Token Tools
  list_tokens: tool({
    description: "List all personal access tokens for the current user",
    parameters: z.object({}),
    execute: async () => {
      const tokens = await client.token.list();
      return tokens.data;
    },
  }),

  get_token: tool({
    description: "Get details of a specific personal access token by ID",
    parameters: z.object({
      tokenId: z
        .string()
        .describe("The token ID (e.g., pat_XXXXXXXXXXXXXXXXXXXXXXXXX)"),
    }),
    execute: async ({ tokenId }) => {
      const token = await client.token.get(tokenId);
      return token.data;
    },
  }),

  create_token: tool({
    description: "Create a new personal access token",
    parameters: z.object({}),
    execute: async () => {
      const token = await client.token.create();
      return token.data;
    },
  }),

  delete_token: tool({
    description: "Delete a personal access token by ID",
    parameters: z.object({
      tokenId: z
        .string()
        .describe(
          "The token ID to delete (e.g., pat_XXXXXXXXXXXXXXXXXXXXXXXXX)",
        ),
    }),
    execute: async ({ tokenId }) => {
      const result = await client.token.delete(tokenId);
      return result.data;
    },
  }),

  // Email Tools
  subscribe_email: tool({
    description: "Subscribe an email address to Terminal updates",
    parameters: z.object({
      email: z.string().email().describe("The email address to subscribe"),
    }),
    execute: async ({ email }) => {
      const email_result = await client.email.create({ email });
      return email_result.data;
    },
  }),

  // Think Tool
  think: tool({
    description:
      "Use the tool to think about something. It will not obtain new information or change the database, but just append the thought to the log. Use it when complex reasoning or some cache memory is needed.",
    parameters: z.object({
      thought: z.string(),
    }),
    execute: async ({ thought }) => {
      return { thought };
    },
  }),
};
