import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api/client";
import type { Item } from "@/types";

type ItemsResponse = {
  items: Item[];
};

export function useItems() {
  return useQuery({
    queryKey: ["items"],
    queryFn: async () => {
      const data = await api.get<ItemsResponse>("/api/items/");
      return data.items;
    },
    staleTime: 5 * 60 * 1000, // 5min
  });
}
