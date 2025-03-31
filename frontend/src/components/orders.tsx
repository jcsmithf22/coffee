import { orderQueryOptions } from "@/lib/queries";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";

export default function Orders() {
  const { data } = useSuspenseQuery(orderQueryOptions)

  return (
    <div className="text-sm flex flex-col gap-2">
      {data.map(order => (
        <Card key={order.id} className="rounded-2xl shadow-lg">
          <CardContent className="space-y-2">
            <div className="font-medium mb-4 flex justify-between">Order <span className="text-foreground/60">#{order.id}</span></div>

            <div className="space-y-4">
              {order.items.map(item => (
                <div key={item.id} className="flex justify-between items-center border-b py-4">
                  <div>{item.product?.name}</div>
                  <div className="flex gap-4 text-gray-600">
                    <div>Qty: {item.quantity}</div>
                    <div className="font-semibold">
                      ${(item.amount / 100).toFixed(2)}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-medium">
                  ${(order.amount.subtotal / 100).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping:</span>
                <span className="font-medium">
                  ${((order.amount.shipping ?? 0) / 100).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between border-t pt-3">
                <span className="text-base font-semibold">Total:</span>
                <span className="text-base font-semibold">
                  ${(
                    (order.amount.subtotal +
                      (order.amount.shipping ?? 0)) / 100
                  ).toFixed(2)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
