import React from "react";
import { styleHelpers } from "@/utils/styleHelpers";

/**
 * Reusable empty state component using styleHelpers
 */
interface EmptyStateProps {
  icon: string;
  title: string;
  description: string;
  className?: string;
}

const EmptyStateComponent: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  className,
}) => {
  const emptyStateStyles = styleHelpers.emptyState();

  return (
    <div {...emptyStateStyles} className={className}>
      <div className="walletfy-empty-state-icon">{icon}</div>
      <div className="walletfy-empty-state-title">{title}</div>
      <div className="walletfy-empty-state-description">{description}</div>
    </div>
  );
};

export const EmptyState = React.memo(EmptyStateComponent);

/**
 * Factory function for creating empty state components
 */
export const createEmptyState = (
  icon: string,
  title: string,
  description: string,
) => <EmptyState icon={icon} title={title} description={description} />;

/**
 * Pre-built empty states for common scenarios
 */
export const EmptyStates = {
  noEvents: createEmptyState(
    "📊",
    "¡Comienza tu viaje financiero!",
    "No hay eventos registrados aún. Crea tu primer evento de ingreso o egreso para comenzar a visualizar tu balance financiero.",
  ),

  noSearchResults: createEmptyState(
    "🔍",
    "No se encontraron resultados",
    "No hay eventos que coincidan con tu búsqueda. Intenta con otros términos o revisa la ortografía.",
  ),

  balanceFlow: createEmptyState(
    "📊",
    "Flujo de Balance",
    "Una vez que agregues eventos, podrás ver aquí el flujo de tu balance mensual y global.",
  ),

  loading: createEmptyState(
    "⏳",
    "Cargando...",
    "Estamos cargando tu información financiera.",
  ),

  error: createEmptyState(
    "⚠️",
    "Error",
    "Hubo un problema al cargar la información. Intenta nuevamente.",
  ),
};
