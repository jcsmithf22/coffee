import { useSuspenseQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { subscriptionQueryOptions } from "@/lib/queries";

export default function Subscriptions() {
  const { data } = useSuspenseQuery(subscriptionQueryOptions);
  
  console.log("Subscriptions data", data);

  return (
    <div className="text-sm flex flex-col gap-2">
      {data.map((subscription) => (
        <Card key={subscription.id} className="rounded-2xl shadow-lg">
          <CardContent className="space-y-2">
            <div className="font-medium mb-4 flex justify-between">
              Subscription <span className="text-foreground/60">#{subscription.id}</span>
            </div>

            <div data-slot="subscription-details">
              <div data-slot="subscription-info" className="mb-4">
                <div data-slot="subscription-id" className="font-medium">
                  Subscription #{subscription.id}
                </div>
                {subscription.schedule && (
                  <div data-slot="subscription-schedule">
                    {subscription.schedule.type === "weekly" ? (
                      <>
                        Every {subscription.schedule.interval} week
                        {subscription.schedule.interval > 1 && "s"}
                      </>
                    ) : (
                      <>Monthly</>
                    )}
                  </div>
                )}
              </div>

              <div data-slot="subscription-item" className="flex justify-between items-center border-b py-4">
                <div data-slot="item-name">{subscription.product?.name}</div>
                <div data-slot="item-details" className="flex gap-4 text-gray-600">
                  <div data-slot="item-quantity">Qty: {subscription.quantity}</div>
                  {subscription.next && (
                    <div data-slot="item-next">
                      Next: {new Date(subscription.next).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))
      }
    </div>
  )
}
