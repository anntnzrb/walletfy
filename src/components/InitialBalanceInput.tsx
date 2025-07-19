import { NumberInput, Group, Text } from "@mantine/core";
import { IconWallet } from "@tabler/icons-react";
import React, { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setInitialBalance } from "@/redux/slices/balanceSlice";
import { storageUtils } from "@/utils/storage";

const InitialBalanceInputComponent: React.FC = () => {
  const dispatch = useAppDispatch();
  const initialBalance = useAppSelector(
    (state) => state.balance.initialBalance,
  );

  const handleBalanceChange = useCallback(
    (value: number | string) => {
      const numericValue =
        typeof value === "string" ? parseFloat(value) || 0 : value;
      dispatch(setInitialBalance(numericValue));
      storageUtils.saveInitialBalance(numericValue);
    },
    [dispatch],
  );

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        marginBottom: "var(--walletfy-space-xl)",
      }}
    >
      <div
        className="walletfy-card"
        style={{
          textAlign: "center",
          padding: "var(--walletfy-space-xl)",
          maxWidth: "400px",
          width: "100%",
        }}
      >
        <Group justify="center" gap="sm" mb="md">
          <IconWallet size={24} style={{ color: "var(--walletfy-primary)" }} />
          <Text
            className="walletfy-section-title"
            style={{ fontSize: "1.25rem", fontWeight: "600" }}
          >
            💰 Balance Inicial
          </Text>
        </Group>
        <Text
          className="walletfy-helper-text"
          style={{ marginBottom: "var(--walletfy-space-md)" }}
        >
          Ingresa el monto inicial de tu billetera para comenzar a calcular tu
          balance global
        </Text>
        <NumberInput
          value={initialBalance}
          onChange={handleBalanceChange}
          placeholder="0.00"
          min={0}
          step={0.01}
          decimalScale={2}
          leftSection="$"
          size="lg"
          styles={{
            input: {
              textAlign: "center",
              fontSize: "1.25rem",
              fontWeight: "600",
              color: "var(--walletfy-primary)",
            },
          }}
        />
      </div>
    </div>
  );
};

export const InitialBalanceInput = React.memo(InitialBalanceInputComponent);
