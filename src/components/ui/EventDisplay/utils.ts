import { eventTypeHelpers } from "@/utils/eventTypeHelpers";
import { formatters } from "@/utils/formatters";

// Re-export centralized utilities for backward compatibility
export { eventTypeHelpers as eventTypeUtils, formatters };

// Legacy exports (deprecated - use centralized utilities instead)
export const getEventColor = eventTypeHelpers.getTextClass;
export const getEventSign = eventTypeHelpers.getSign;
export const formatCurrency = formatters.currency;
export const getTooltipContent = formatters.tooltipContent;
