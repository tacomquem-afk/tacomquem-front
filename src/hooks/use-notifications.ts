import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api/client";
import type { NotificationsReadFilter, NotificationsResponse } from "@/types";

type UseNotificationsInput = {
  readFilter?: NotificationsReadFilter;
  page?: number;
  limit?: number;
};

function buildNotificationsQuery({
  readFilter = "all",
  page = 1,
  limit = 20,
}: UseNotificationsInput) {
  const params = new URLSearchParams();
  params.set("page", String(page));
  params.set("limit", String(limit));

  if (readFilter === "read") {
    params.set("read", "true");
  } else if (readFilter === "unread") {
    params.set("read", "false");
  }

  return params.toString();
}

export function useNotifications(input: UseNotificationsInput = {}) {
  const readFilter = input.readFilter ?? "all";
  const page = input.page ?? 1;
  const limit = input.limit ?? 20;

  return useQuery({
    queryKey: ["notifications", readFilter, page, limit],
    queryFn: async () => {
      const queryString = buildNotificationsQuery({ readFilter, page, limit });
      return api.get<NotificationsResponse>(`/api/notifications/?${queryString}`);
    },
    placeholderData: keepPreviousData,
    staleTime: 30 * 1000,
  });
}
