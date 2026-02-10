import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api/client";
import type { Friend } from "@/types";

type FriendsResponse = {
  friends: Friend[];
};

export function useFriends() {
  return useQuery({
    queryKey: ["friends"],
    queryFn: async () => {
      const data = await api.get<FriendsResponse>("/api/dashboard/friends");
      return data.friends;
    },
    staleTime: 5 * 60 * 1000, // 5min
  });
}
