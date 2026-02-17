import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { api } from "@/lib/api/client";
import type { CreateItemInput, Item, UpdateItemInput } from "@/types";

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

export function useUpdateItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      input,
    }: {
      id: string;
      input: UpdateItemInput;
    }) => {
      const data = await api.patch<{ item: Item }>(`/api/items/${id}`, input);
      return data.item;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["items"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}

export function useDeleteItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/api/items/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["items"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}
