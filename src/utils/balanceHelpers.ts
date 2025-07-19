import type { Event } from "@/types/Event";
import { dateHelpers } from "@/utils/dateHelpers";

export interface MonthlyBalance {
  monthKey: string;
  monthName: string;
  totalIngresos: number;
  totalEgresos: number;
  monthlyBalance: number;
  globalBalance: number;
  events: Event[];
}

export const balanceHelpers = {
  /**
   * Calculates the balance for a specific month
   */
  calculateMonthlyBalance: (
    events: Event[],
  ): { ingresos: number; egresos: number } => {
    const ingresos = events
      .filter((event) => event.tipo === "ingreso")
      .reduce((sum, event) => sum + event.cantidad, 0);

    const egresos = events
      .filter((event) => event.tipo === "egreso")
      .reduce((sum, event) => sum + event.cantidad, 0);

    return { ingresos, egresos };
  },

  /**
   * Calculates the global balance flow for all months
   */
  calculateGlobalBalanceFlow: (
    events: Event[],
    initialBalance: number,
  ): MonthlyBalance[] => {
    const groupedEvents = dateHelpers.groupEventsByMonth(events);

    const monthKeys = Object.keys(groupedEvents).sort((a, b) =>
      a.localeCompare(b),
    );

    let runningGlobalBalance = initialBalance;

    return monthKeys.map((monthKey) => {
      const monthEvents = groupedEvents[monthKey];
      const { ingresos, egresos } =
        balanceHelpers.calculateMonthlyBalance(monthEvents);

      const monthlyBalance = ingresos - egresos;
      runningGlobalBalance += monthlyBalance;

      return {
        monthKey,
        monthName: dateHelpers.getMonthName(monthKey),
        totalIngresos: ingresos,
        totalEgresos: egresos,
        monthlyBalance,
        globalBalance: runningGlobalBalance,
        events: monthEvents,
      };
    });
  },

  /**
   * Gets the current global balance (most recent month's global balance)
   */
  getCurrentGlobalBalance: (
    events: Event[],
    initialBalance: number,
  ): number => {
    const balanceFlow = balanceHelpers.calculateGlobalBalanceFlow(
      events,
      initialBalance,
    );
    return balanceFlow.length > 0
      ? balanceFlow[balanceFlow.length - 1].globalBalance
      : initialBalance;
  },

  /**
   * Formats currency values for display
   */
  formatCurrency: (amount: number): string => {
    return new Intl.NumberFormat("es-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  },

  /**
   * Gets balance change indicators
   */
  getBalanceChangeIndicator: (
    balance: number,
  ): { color: string; icon: string } => {
    if (balance > 0) {
      return { color: "var(--walletfy-income)", icon: "📈" };
    } else if (balance < 0) {
      return { color: "var(--walletfy-expense)", icon: "📉" };
    } else {
      return { color: "var(--walletfy-neutral)", icon: "➖" };
    }
  },
};
