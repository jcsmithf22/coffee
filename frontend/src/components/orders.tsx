import { orderQueryOptions } from "@/lib/queries";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import Coffee from "@/assets/coffee.png";

export default function Orders() {
  const { data } = useSuspenseQuery(orderQueryOptions);

  return (
    <div className="text-sm flex flex-col gap-2">
      {data.map((order) => (
        <Card key={order.id} className="rounded-2xl shadow-lg">
          <CardContent className="space-y-2">
            <div className="font-medium mb-4 flex justify-between">
              Order <span className="text-foreground/60">#{order.id}</span>
            </div>

            <div className=" divide-y-1 divide-border">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-stretch py-4 gap-4">
                  <div className="p-1 bg-secondary rounded-md overflow-hidden w-fit shadow">
                    <img
                      src={Coffee}
                      alt="Coffee"
                      className="aspect-square object-cover h-10"
                    />
                  </div>
                  <div className="flex-1 flex flex-col justify-between py-0.5">
                    <div className="capitalize font-semibold text-base leading-none">
                      {item.product?.name}
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="text-xs bg-secondary/50 w-fit border rounded-full px-2.5  text-foreground/60 font-mono">
                        {item.quantity}
                      </div>
                      <div className="font-semibold leading-none">
                        ${(item.amount / 100).toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">
                  ${(order.amount.subtotal / 100).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span className="font-medium">
                  ${((order.amount.shipping ?? 0) / 100).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between border-t pt-3">
                <span className="text-base font-semibold">Total</span>
                <span className="text-base font-semibold">
                  $
                  {(
                    (order.amount.subtotal + (order.amount.shipping ?? 0)) /
                    100
                  ).toFixed(2)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
