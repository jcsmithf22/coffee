import { queryOptions } from "@tanstack/react-query";

import { hc } from "hono/client";
import type { App } from "@backend/index";

const ENDPOINT = import.meta.env.DEV
  ? "http://localhost:4000"
  : import.meta.env.VITE_OPENCONTROL_ENDPOINT;

export const client = hc<App>(ENDPOINT || "");

export const fetchCart = async () => {
  const response = await client.cart.$get();
  return response.json();
};

export const fetchOrders = async () => {
  const response = await client.order.$get();
  return response.json();
};

export const fetchSubscriptions = async () => {
  const response = await client.subscription.$get();
  return response.json();
};

export const cartQueryOptions = queryOptions({
  queryKey: ["terminal", "cart"],
  queryFn: fetchCart,
  throwOnError: true,
});

export const orderQueryOptions = queryOptions({
  queryKey: ["terminal", "orders"],
  queryFn: fetchOrders,
  throwOnError: true,
});

export const subscriptionQueryOptions = queryOptions({
  queryKey: ["terminal", "subscriptions"],
  queryFn: fetchSubscriptions,
  throwOnError: true,
});
