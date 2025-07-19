import { Stack, Group, Text, Card, Badge } from "@mantine/core";
import React, { useMemo } from "react";
import { useAppSelector } from "@/redux/hooks";
import { balanceHelpers } from "@/utils/balanceHelpers";
import type { MonthlyBalance } from "@/utils/balanceHelpers";
import { eventTypeHelpers } from "@/utils/eventTypeHelpers";
import { formatters } from "@/utils/formatters";
import { styleHelpers } from "@/utils/styleHelpers";

interface BalanceFlowProps {
  onEditEvent: (event: any) => void;
}

const BalanceFlowComponent: React.FC<BalanceFlowProps> = ({
  onEditEvent: _onEditEvent,
}) => {
  const events = useAppSelector((state) => state.events.events);
  const initialBalance = useAppSelector(
    (state) => state.balance.initialBalance,
  );

  const balanceFlow = useMemo(
    () => balanceHelpers.calculateGlobalBalanceFlow(events, initialBalance),
    [events, initialBalance],
  );

  const currentGlobalBalance = useMemo(
    () => balanceHelpers.getCurrentGlobalBalance(events, initialBalance),
    [events, initialBalance],
  );

  const emptyStateStyles = styleHelpers.emptyState();
  const cardStyles = styleHelpers.card();

  if (events.length === 0) {
    return (
      <div {...cardStyles}>
        <div {...emptyStateStyles}>
          <div className="walletfy-empty-state-icon">📊</div>
          <div className="walletfy-empty-state-title">Flujo de Balance</div>
          <div className="walletfy-empty-state-description">
            Una vez que agregues eventos, podrás ver aquí el flujo de tu balance
            mensual y global.
          </div>
        </div>
      </div>
    );
  }

  return (
    <Stack gap="lg">
      {/* Current Global Balance */}
      <div {...styleHelpers.centeredContainer()}>
        <Card
          {...styleHelpers.card()}
          style={{
            ...styleHelpers.card().style,
            ...styleHelpers.gradientBackground(
              "var(--walletfy-primary)",
              "var(--walletfy-secondary)",
            ).style,
            textAlign: "center",
            maxWidth: "500px",
            width: "100%",
          }}
        >
          <Text size="sm" mb="xs" fw={500} c="dark.6">
            💰 Balance Global Actual
          </Text>
          <Text
            size="xl"
            fw={700}
            {...styleHelpers.financialFigure(currentGlobalBalance, "lg")}
          >
            {formatters.currency(currentGlobalBalance)}
          </Text>
          <Group justify="center" gap="xs" mt="xs">
            {eventTypeHelpers.getTrendIcon(currentGlobalBalance)}
            <Text size="sm" fw={500} c="dark.6">
              {currentGlobalBalance >= 0
                ? "Balance Positivo"
                : "Balance Negativo"}
            </Text>
          </Group>
        </Card>
      </div>

      {/* Monthly Balance Flow */}
      <div {...styleHelpers.centeredContainer()}>
        <div
          {...styleHelpers.card()}
          style={{
            ...styleHelpers.card().style,
            maxWidth: "800px",
            width: "100%",
          }}
        >
          <Text {...styleHelpers.sectionTitle("lg")}>
            📈 Flujo de Balance Mensual
          </Text>

          <Stack gap="md">
            {balanceFlow.map((monthData: MonthlyBalance) => (
              <Card
                key={monthData.monthKey}
                {...styleHelpers.card()}
                style={{
                  ...styleHelpers.card().style,
                  border: "1px solid var(--walletfy-border)",
                  borderRadius: "var(--walletfy-radius-md)",
                }}
              >
                <Group justify="space-between" align="center" mb="md">
                  <Text fw={600} style={{ fontSize: "1.125rem" }}>
                    📅 {monthData.monthName}
                  </Text>
                  <Badge
                    variant="light"
                    size="lg"
                    style={{
                      backgroundColor: eventTypeHelpers.getBalanceIndicator(
                        monthData.globalBalance,
                      ).color,
                      color: "white",
                    }}
                  >
                    Global: {formatters.currency(monthData.globalBalance)}
                  </Badge>
                </Group>

                <Group justify="space-between" mb="sm">
                  <div style={{ flex: 1 }}>
                    <Text size="sm" c="dimmed">
                      Total Ingresos
                    </Text>
                    <Text fw={600} style={{ color: "var(--walletfy-income)" }}>
                      {eventTypeHelpers.getIcon("ingreso")}{" "}
                      {formatters.currency(monthData.totalIngresos)}
                    </Text>
                  </div>
                  <div style={{ flex: 1, textAlign: "center" }}>
                    <Text size="sm" c="dimmed">
                      Total Egresos
                    </Text>
                    <Text fw={600} style={{ color: "var(--walletfy-expense)" }}>
                      {eventTypeHelpers.getIcon("egreso")}{" "}
                      {formatters.currency(monthData.totalEgresos)}
                    </Text>
                  </div>
                  <div style={{ flex: 1, textAlign: "right" }}>
                    <Text size="sm" c="dimmed">
                      Balance del Mes
                    </Text>
                    <Text
                      fw={600}
                      style={{
                        color: eventTypeHelpers.getBalanceIndicator(
                          monthData.monthlyBalance,
                        ).color,
                      }}
                    >
                      {eventTypeHelpers.getTrendIcon(monthData.monthlyBalance)}{" "}
                      {formatters.currency(monthData.monthlyBalance)}
                    </Text>
                  </div>
                </Group>

                <Text size="xs" c="dimmed" ta="center">
                  {formatters.eventCount(monthData.events.length)}
                </Text>
              </Card>
            ))}
          </Stack>
        </div>
      </div>
    </Stack>
  );
};

export const BalanceFlow = React.memo(BalanceFlowComponent);
