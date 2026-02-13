import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api/client";
import type { CreateLoanInput, Loan, LoanListFilter } from "@/types";

type LoansResponse = {
  loans: Loan[];
};

type CreateLoanResponse = {
  loan: Loan;
  confirmUrl: string;
};

export function useLoans(filter?: LoanListFilter) {
  return useQuery({
    queryKey: ["loans", filter],
    queryFn: async () => {
      const params = filter ? `?filter=${filter}` : "";
      const data = await api.get<LoansResponse>(`/api/loans/${params}`);
      return data.loans;
    },
    staleTime: 60 * 1000, // 1min
  });
}

export function useLoan(id: string) {
  return useQuery({
    queryKey: ["loan", id],
    queryFn: async () => {
      const data = await api.get<{ loan: Loan }>(`/api/loans/${id}`);
      return data.loan;
    },
    enabled: !!id,
  });
}

export function useCreateLoan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateLoanInput) => {
      return api.post<CreateLoanResponse>("/api/loans/", input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["loans"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["items"] });
    },
  });
}

export function useReturnLoan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (loanId: string) => {
      const data = await api.patch<{ loan: Loan }>(
        `/api/loans/${loanId}/return`
      );
      return data.loan;
    },
    onMutate: async (loanId) => {
      // Cancel ongoing queries
      await queryClient.cancelQueries({ queryKey: ["loans"] });

      // Snapshot current state
      const previousLoans = queryClient.getQueryData(["loans"]);

      // Optimistically update
      queryClient.setQueryData<Loan[]>(["loans"], (old) =>
        old?.map((loan) =>
          loan.id === loanId ? { ...loan, status: "returned" as const } : loan
        )
      );

      return { previousLoans };
    },
    onError: (_err, _loanId, context) => {
      // Rollback on error
      queryClient.setQueryData(["loans"], context?.previousLoans);
    },
    onSettled: () => {
      // Refetch to ensure consistency
      queryClient.invalidateQueries({ queryKey: ["loans"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["friends"] });
    },
  });
}

export function useRemindLoan() {
  return useMutation({
    mutationFn: async (loanId: string) => {
      await api.post(`/api/loans/${loanId}/remind`);
    },
  });
}

export function useCancelLoan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (loanId: string) => {
      await api.patch(`/api/loans/${loanId}/cancel`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["loans"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}
