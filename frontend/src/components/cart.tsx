import { cartQueryOptions } from "@/lib/queries";
import { useSuspenseQuery } from "@tanstack/react-query";

export default function Cart() {
  const { data } = useSuspenseQuery(cartQueryOptions)

  console.log(data)

  return (
      <div className="text-sm">

        {data.items.map(item => (
          <div key={item.id} className="flex justify-between items-center border-b py-4">
            <div className="font-medium">{item.product?.name}</div>
            <div className="flex gap-4 text-gray-600">
              <div>Qty: {item.quantity}</div>
              <div className="font-semibold">
                ${(item.subtotal / 100).toFixed(2)}
              </div>
            </div>
          </div>
        ))}
        <div className="mt-6 space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600">Subtotal:</span>
            <span className="font-medium">
              ${(data.amount.subtotal / 100).toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Shipping:</span>
            <span className="font-medium">
              ${((data.amount.shipping ?? 0) / 100).toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between border-t pt-3">
            <span className="text-base font-semibold">Total:</span>
            <span className="text-base font-semibold">
              ${((data.amount.total ?? 0) / 100).toFixed(2)}
            </span>
          </div>
        </div>

      </div>
  )
}
