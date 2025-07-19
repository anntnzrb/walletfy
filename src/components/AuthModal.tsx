import React, { useState } from "react";
import {
  Modal,
  TextInput,
  Button,
  Stack,
  Text,
  Alert,
  Group,
  Title,
  Paper,
} from "@mantine/core";
import {
  IconLock,
  IconKey,
  IconAlertCircle,
  IconShieldCheck,
} from "@tabler/icons-react";
import { authenticate } from "@/utils/auth";

interface AuthModalProps {
  opened: boolean;
  onAuthenticated: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  opened,
  onAuthenticated,
}) => {
  const [accessCode, setAccessCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 300));

    if (authenticate(accessCode)) {
      onAuthenticated();
      setAccessCode("");
      setError(null);
    } else {
      setError("Código de acceso incorrecto. Por favor, intenta de nuevo.");
      setAccessCode("");
    }

    setIsLoading(false);
  };

  return (
    <Modal
      opened={opened}
      onClose={() => {}}
      withCloseButton={false}
      centered
      size="sm"
      radius="lg"
      overlayProps={{ blur: 4 }}
      closeOnClickOutside={false}
      closeOnEscape={false}
    >
      <Paper p="md">
        <Stack gap="md">
          <Group justify="center" mb="xs">
            <IconShieldCheck size={48} color="var(--walletfy-solarized-blue)" />
          </Group>

          <Title order={3} ta="center">
            🔐 Acceso Protegido
          </Title>

          <Text size="sm" c="dimmed" ta="center">
            Esta función requiere autenticación para proteger el uso de la API.
            Por favor, ingresa el código de acceso proporcionado.
          </Text>

          <form onSubmit={handleSubmit}>
            <Stack gap="md">
              <TextInput
                label="Código de Acceso"
                placeholder="Ingresa el código de acceso"
                value={accessCode}
                onChange={(e) => setAccessCode(e.currentTarget.value)}
                type="password"
                required
                autoFocus
                leftSection={<IconKey size={18} />}
                error={error}
                disabled={isLoading}
                styles={{
                  input: {
                    fontSize: "16px",
                  },
                }}
              />

              {error && (
                <Alert
                  icon={<IconAlertCircle size={16} />}
                  color="red"
                  variant="light"
                  radius="md"
                >
                  {error}
                </Alert>
              )}

              <Button
                type="submit"
                fullWidth
                loading={isLoading}
                leftSection={!isLoading && <IconLock size={18} />}
                variant="filled"
                size="md"
                radius="md"
                style={{
                  backgroundColor: "var(--walletfy-solarized-blue)",
                }}
              >
                {isLoading ? "Verificando..." : "Acceder"}
              </Button>

              <Text size="xs" c="dimmed" ta="center" mt="xs">
                💡 Consejo: El código de acceso debe ser proporcionado por el
                administrador del sistema.
              </Text>
            </Stack>
          </form>
        </Stack>
      </Paper>
    </Modal>
  );
};
