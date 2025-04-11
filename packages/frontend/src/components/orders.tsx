import { orderQueryOptions } from "@/lib/queries";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import Coffee from "@/assets/coffee.png";
import { Button } from "@/components/ui/button";
import { Copy, ChevronDown } from "lucide-react";
import { handleCopy } from "@/lib/utils";
import { useState } from "react";

export default function Orders() {
  const { data } = useSuspenseQuery(orderQueryOptions);
  const [showAll, setShowAll] = useState(false);

  const displayedOrders = showAll ? data : data.slice(0, 3);

  return (
    <div className="text-sm flex flex-col gap-2">
      {!data.length && (
        <Card>
          <CardContent>
            <div className="flex items-center justify-center h-32">
              <span className="text-muted-foreground">No orders yet</span>
            </div>
          </CardContent>
        </Card>
      )}
      {displayedOrders.map((order) => (
        <Card key={order.id} className="rounded-2xl shadow-lg">
          <CardContent className="space-y-2">
            <div className="font-medium mb-4 flex justify-between items-center">
              <span className="text-foreground/60">#{order.id}</span>
              <Button
                data-component="copy-button"
                size="icon"
                variant="outline"
                className="-m-2"
                onClick={() => handleCopy(order.id)}
              >
                <Copy className="h-4 w-4" />
              </Button>
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
      {data.length > 3 && (
        <div className="flex justify-center">
          <Button
            variant="outline"
            className="rounded-2xl hover:bg-background/50"
            onClick={() => setShowAll(!showAll)}
          >
            {showAll ? "Show less" : "Show all orders"}
            <ChevronDown
              className={`size-4 transition-transform ${showAll ? "rotate-180" : ""}`}
            />
          </Button>
        </div>
      )}
    </div>
  );
}
