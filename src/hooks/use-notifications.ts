import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { api } from "@/lib/api/client";
import type {
  NotificationMarkAsReadResponse,
  NotificationsMarkAllAsReadResponse,
  NotificationsReadFilter,
  NotificationsResponse,
} from "@/types";

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
      return api.get<NotificationsResponse>(
        `/api/notifications/?${queryString}`
      );
    },
    placeholderData: keepPreviousData,
    staleTime: 30 * 1000,
  });
}

export function useMarkNotificationAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (notificationId: string) => {
      return api.patch<NotificationMarkAsReadResponse>(
        `/api/notifications/${notificationId}/read`
      );
    },
    onMutate: async (notificationId) => {
      // Cancel ongoing queries
      await queryClient.cancelQueries({ queryKey: ["notifications"] });
      await queryClient.cancelQueries({ queryKey: ["dashboard"] });

      // Snapshot current state
      const previousNotifications = queryClient.getQueryData(["notifications"]);
      const previousDashboard = queryClient.getQueryData(["dashboard"]);

      // Optimistically update notifications query
      queryClient.setQueryData<NotificationsResponse>(
        ["notifications", "all", 1, 20],
        (old) => {
          if (!old) return old;
          return {
            ...old,
            notifications: old.notifications.map((n) =>
              n.id === notificationId ? { ...n, read: true } : n
            ),
            unreadCount: Math.max(0, old.unreadCount - 1),
          };
        }
      );

      // Update filtered queries
      queryClient.setQueriesData<NotificationsResponse>(
        { queryKey: ["notifications"] },
        (old) => {
          if (!old) return old;
          return {
            ...old,
            notifications: old.notifications.map((n) =>
              n.id === notificationId ? { ...n, read: true } : n
            ),
            unreadCount: Math.max(0, old.unreadCount - 1),
          };
        }
      );

      // Optimistically update dashboard
      queryClient.setQueryData(["dashboard"], (old: unknown) => {
        if (!old || typeof old !== "object") return old;
        const data = old as {
          recentActivity: Array<{ id: string; read: boolean }>;
        };
        return {
          ...data,
          recentActivity: data.recentActivity?.map((a) =>
            a.id === notificationId ? { ...a, read: true } : a
          ),
        };
      });

      return { previousNotifications, previousDashboard };
    },
    onError: (_err, _notificationId, context) => {
      // Rollback on error
      if (context?.previousNotifications) {
        queryClient.setQueryData(
          ["notifications"],
          context.previousNotifications
        );
      }
      if (context?.previousDashboard) {
        queryClient.setQueryData(["dashboard"], context.previousDashboard);
      }
    },
    onSettled: () => {
      // Refetch to ensure consistency
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}

export function useMarkAllNotificationsAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      return api.patch<NotificationsMarkAllAsReadResponse>(
        "/api/notifications/read-all"
      );
    },
    onMutate: async () => {
      // Cancel ongoing queries
      await queryClient.cancelQueries({ queryKey: ["notifications"] });
      await queryClient.cancelQueries({ queryKey: ["dashboard"] });

      // Snapshot current state
      const previousNotifications = queryClient.getQueryData(["notifications"]);
      const previousDashboard = queryClient.getQueryData(["dashboard"]);

      // Optimistically update all notifications as read
      queryClient.setQueriesData<NotificationsResponse>(
        { queryKey: ["notifications"] },
        (old) => {
          if (!old) return old;
          return {
            ...old,
            notifications: old.notifications.map((n) => ({ ...n, read: true })),
            unreadCount: 0,
          };
        }
      );

      // Optimistically update dashboard
      queryClient.setQueryData(["dashboard"], (old: unknown) => {
        if (!old || typeof old !== "object") return old;
        const data = old as {
          recentActivity: Array<{ id: string; read: boolean }>;
        };
        return {
          ...data,
          recentActivity: data.recentActivity?.map((a) => ({
            ...a,
            read: true,
          })),
        };
      });

      return { previousNotifications, previousDashboard };
    },
    onError: (_err, _variables, context) => {
      // Rollback on error
      if (context?.previousNotifications) {
        queryClient.setQueryData(
          ["notifications"],
          context.previousNotifications
        );
      }
      if (context?.previousDashboard) {
        queryClient.setQueryData(["dashboard"], context.previousDashboard);
      }
    },
    onSettled: () => {
      // Refetch to ensure consistency
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}
