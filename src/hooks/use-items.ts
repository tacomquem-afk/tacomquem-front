import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { api } from "@/lib/api/client";
import type { CreateItemInput, Item } from "@/types";

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

export function useCreateItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateItemInput) => {
      const data = await api.post<{ item: Item }>("/api/items/", input);
      return data.item;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["items"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}
