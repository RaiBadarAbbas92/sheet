"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

// There are no customer accounts. Orders are saved in Supabase by the checkout API; this keeps a
// copy on the device so the track-order page can list them.

export type Order = {
  id: string;
  date: string;
  items: { slug: string; size: string; qty: number }[];
  total: number;
  payment: string;
  address: { name: string; phone: string; line: string; city: string };
  status: "Confirmed" | "Packed" | "Shipped" | "Delivered";
};

type AccountCtx = {
  orders: Order[];
  /** Records an order the API has accepted, under the order number it returned. */
  placeOrder: (o: Omit<Order, "date" | "status">) => Order;
};

const Ctx = createContext<AccountCtx | null>(null);

export const useAccount = () => {
  const c = useContext(Ctx);
  if (!c) throw new Error("useAccount must be used inside AccountProvider");
  return c;
};

const ORDERS_KEY = "neend-orders";

const read = <T,>(key: string, fallback: T): T => {
  try {
    const v = localStorage.getItem(key);
    return v ? (JSON.parse(v) as T) : fallback;
  } catch {
    return fallback;
  }
};

const write = (key: string, value: unknown) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
};

export function AccountProvider({ children }: { children: React.ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- syncing from browser storage
    setOrders(read<Order[]>(ORDERS_KEY, []));
  }, []);

  const value = useMemo<AccountCtx>(
    () => ({
      orders,
      placeOrder: (o) => {
        const order: Order = {
          ...o,
          date: new Date().toISOString(),
          status: "Confirmed",
        };
        setOrders((prev) => {
          const next = [order, ...prev];
          write(ORDERS_KEY, next);
          return next;
        });
        return order;
      },
    }),
    [orders],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
