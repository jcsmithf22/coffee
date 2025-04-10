import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import Cart from "@/components/cart";
import Orders from "@/components/orders";
import Subscriptions from "@/components/subscriptions";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type TabType = "cart" | "orders" | "subscriptions";

interface SidebarProps {
  tab: TabType;
  setTab: (tab: TabType) => void;
}

export function Sidebar({ tab, setTab }: SidebarProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll({ container: scrollRef });
  const shadowHeight = useTransform(scrollY, [0, 40], [0, 1]);

  return (
    <div className="h-screen p-2 pb-0 pr-0 w-[400px] shrink-0">
      <div className="px-2">
        <Tabs
          className="gap-0"
          value={tab}
          onValueChange={(value) => setTab(value as TabType)}
        >
          <TabsList className="grid w-full grid-cols-3 bg-white rounded-2xl border shadow-lg h-12 p-1">
            <TabsTrigger current={tab} className="rounded-lg" value="cart">
              Cart
            </TabsTrigger>
            <TabsTrigger current={tab} className="rounded-lg" value="orders">
              Orders
            </TabsTrigger>
            <TabsTrigger
              current={tab}
              className="rounded-lg"
              value="subscriptions"
            >
              Subscriptions
            </TabsTrigger>
          </TabsList>
          <div className="relative -mx-2">
            <motion.div
              className="pointer-events-none absolute inset-x-0 h-20 overflow-hidden shadow-[inset_0px_30px_25px_-20px_rgba(0,0,0,0.35)] top-2 bg-transparent"
              style={{
                opacity: shadowHeight,
              }}
            ></motion.div>
            <svg
              className="h-4 absolute top-2 left-0 fill-secondary"
              viewBox="0 0 16 16"
              preserveAspectRatio="none"
            >
              <path d="M0 0 V16 A16 16 0 0 1 16 0 H0" />
            </svg>
            <svg
              className="h-4 absolute top-2 right-0 rotate-90 fill-secondary"
              viewBox="0 0 16 16"
              preserveAspectRatio="none"
            >
              <path d="M0 0 V16 A16 16 0 0 1 16 0 H0" />
            </svg>
            <motion.div
              className="hidden absolute h-8 inset-x-0 top-2 border-t"
              style={{
                mask: "linear-gradient(rgb(0, 0, 0) 20%, rgba(0, 0, 0, 0) 100%)",
                opacity: shadowHeight,
              }}
            >
              <div className="bg-black/15 size-full"></div>
            </motion.div>
          </div>
          <div className="card-content overflow-y-scroll overflow-x-visible pb-8 -mx-8 px-8 no-scrollbar mt-2">
            <TabsContent value="cart" className="pb-4">
              <Card className="rounded-2xl shadow-lg">
                <CardHeader>
                  <CardTitle>Cart</CardTitle>
                  <CardDescription>
                    An overview of your shopping cart.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Cart />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="orders" className="">
              <Orders />
            </TabsContent>
            <TabsContent value="subscriptions" className="">
              <Subscriptions />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}
