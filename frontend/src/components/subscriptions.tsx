import { useSuspenseQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Coffee from "@/assets/coffee.png";
import { Copy } from "lucide-react";
import { handleCopy } from "@/lib/utils";
import { subscriptionQueryOptions } from "@/lib/queries";

export default function Subscriptions() {
  const { data } = useSuspenseQuery(subscriptionQueryOptions);

  console.log(data);

  return (
    <div className="text-sm flex flex-col gap-2">
      {!data.length && (
        <Card>
          <CardContent>
            <div className="flex items-center justify-center h-32">
              <span className="text-muted-foreground">No subscriptions</span>
            </div>
          </CardContent>
        </Card>
      )}
      {data.map((subscription) => (
        <Card key={subscription.id} className="rounded-2xl shadow-lg">
          <CardContent className="space-y-2">
            <div className="font-medium mb-4 flex justify-between items-center">
              <span className="text-foreground/60">#{subscription.id}</span>
              <Button
                data-component="copy-button"
                size="icon"
                variant="outline"
                className="-m-2"
                onClick={() => handleCopy(subscription.id)}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>

            <div data-slot="subscription-details">
              <div className="divide-y-1 divide-border">
                <div
                  key={subscription.id}
                  className="flex items-stretch pt-4 gap-4"
                >
                  <div className="p-1 bg-secondary rounded-md overflow-hidden w-fit shadow h-fit">
                    <img
                      src={Coffee}
                      alt="Coffee"
                      className="aspect-square object-cover h-10"
                    />
                  </div>
                  <div className="flex-1 flex flex-col justify-between py-0.5">
                    <div className="flex gap-1.5 items-center">
                      <div className="text-xs bg-secondary/50 w-fit border rounded-full px-2.5 text-foreground/60 font-mono">
                        {subscription.quantity}
                      </div>
                      <div className="capitalize font-semibold text-base leading-none">
                        {subscription.product?.name}
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Frequency</span>
                      <span className="font-medium">
                        {subscription.schedule?.type === "weekly"
                          ? `Every ${subscription.schedule.interval} week${subscription.schedule.interval > 1 ? "s" : ""}`
                          : "Monthly"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
