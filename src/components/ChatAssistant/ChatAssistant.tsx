import React, { useState, useRef, useEffect } from "react";
import {
  ActionIcon,
  Box,
  Button,
  Card,
  Group,
  Stack,
  Text,
  Textarea,
  Tooltip,
} from "@mantine/core";
import {
  IconMessage,
  IconX,
  IconSend,
  IconLoader2,
  IconAlertCircle,
  IconTrash,
  IconLogout,
} from "@tabler/icons-react";
import { ChatMessage } from "@/components/ChatAssistant/ChatMessage";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { addEvent, deleteEvent } from "@/redux/slices/eventsSlice";
import { eventCreateSchema } from "@/schemas/eventSchema";
import {
  parseCreateEventCommand,
  parseSearchEventsCommand,
  parseConfirmDeleteCommand,
  parseDeleteEventCommand,
  searchEvents,
  formatEventForDisplay,
} from "@/utils/aiEventHelpers";
import { formatters } from "@/utils/formatters";
import { balanceHelpers } from "@/utils/balanceHelpers";
import { dateHelpers } from "@/utils/dateHelpers";
import { storageUtils } from "@/utils/storage";
import { logout } from "@/utils/auth";
import type { Message } from "@/components/ChatAssistant/types";
import type { Event as WalletfyEvent } from "@/types/Event";

const CHUTES_API_URL = "https://llm.chutes.ai/v1/chat/completions";
const CHUTES_MODEL =
  import.meta.env.VITE_CHUTES_MODEL || "deepseek-ai/DeepSeek-V3.1";
const CHAT_STORAGE_KEY = "walletfy_chat_messages";

const getApiToken = (): string => {
  return import.meta.env.VITE_CHUTES_API_TOKEN || "";
};

// Helper functions for localStorage serialization/deserialization
const serializeMessages = (messages: Message[]): string => {
  return JSON.stringify(messages, (key, value) => {
    // Convert Date objects to ISO strings for proper serialization
    if (key === "timestamp" && value instanceof Date) {
      return value.toISOString();
    }
    return value;
  });
};

const deserializeMessages = (data: string): Message[] => {
  try {
    const parsed = JSON.parse(data);
    // Convert ISO strings back to Date objects
    return parsed.map((msg: any) => ({
      ...msg,
      timestamp: new Date(msg.timestamp),
    }));
  } catch (error) {
    console.error("Error deserializing chat messages:", error);
    return [];
  }
};

export const ChatAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [width, setWidth] = useState(350);
  const [height, setHeight] = useState(600);
  const [pendingDeletion, setPendingDeletion] = useState<{
    eventId: string;
    eventName: string;
    step: "search" | "confirm";
  } | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const chatRef = useRef<HTMLDivElement>(null);
  const isResizing = useRef(false);

  const events = useAppSelector((state) => state.events.events);
  const initialBalance = useAppSelector(
    (state) => state.balance.initialBalance,
  );
  const themeMode = useAppSelector((state) => state.theme.mode);

  const dispatch = useAppDispatch();

  const handleEventCreation = (eventData: WalletfyEvent) => {
    try {
      const { id, ...eventWithoutId } = eventData;
      const validatedData = eventCreateSchema.parse(eventWithoutId);

      dispatch(addEvent(validatedData));

      const updatedEvents = [...events, eventData];
      storageUtils.saveEvents(updatedEvents);

      return true;
    } catch (error) {
      return false;
    }
  };

  const handleEventDeletion = (eventId: string) => {
    try {
      dispatch(deleteEvent(eventId));

      const updatedEvents = events.filter((e) => e.id !== eventId);
      storageUtils.saveEvents(updatedEvents);

      return true;
    } catch (error) {
      return false;
    }
  };

  // Process AI response for commands
  const processAICommands = (content: string): boolean => {
    // Handle event creation
    const event = parseCreateEventCommand(content);
    if (event) {
      const success = handleEventCreation(event);
      if (success) {
        const successMessage: Message = {
          id: crypto.randomUUID(),
          role: "assistant",
          content: `✅ Evento creado exitosamente: ${event.nombre} - ${formatters.currency(event.cantidad)}`,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, successMessage]);
      } else {
        const errorMessage: Message = {
          id: crypto.randomUUID(),
          role: "assistant",
          content:
            "❌ Error al crear el evento. Por favor, verifica los datos.",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, errorMessage]);
      }
      return success;
    }

    // Handle event search for deletion
    const searchCriteria = parseSearchEventsCommand(content);
    if (searchCriteria) {
      const searchResults = searchEvents(events, searchCriteria);

      if (searchResults.length === 0) {
        const noResultsMessage: Message = {
          id: crypto.randomUUID(),
          role: "assistant",
          content:
            "❌ No se encontraron eventos que coincidan con tu búsqueda. Intenta con otros términos o fechas.",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, noResultsMessage]);
      } else if (searchResults.length === 1) {
        // Single match - show confirmation
        const event = searchResults[0].event;
        const confirmMessage: Message = {
          id: crypto.randomUUID(),
          role: "assistant",
          content: `🔍 Encontré este evento:\n\n📋 **${formatEventForDisplay(event)}**\n\n¿Estás seguro de que quieres eliminarlo? Escribe 'sí' para confirmar o 'no' para cancelar.`,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, confirmMessage]);
        setPendingDeletion({
          eventId: event.id,
          eventName: event.nombre,
          step: "confirm",
        });
      } else {
        // Multiple matches - show list for selection
        const listMessage = searchResults
          .slice(0, 5)
          .map(
            (result, index) =>
              `${index + 1}. ${formatEventForDisplay(result.event)}`,
          )
          .join("\n");

        const selectMessage: Message = {
          id: crypto.randomUUID(),
          role: "assistant",
          content: `🔍 Encontré ${searchResults.length} eventos que coinciden:\n\n${listMessage}\n\n¿Cuál quieres eliminar? Escribe el número o 'cancelar' para cancelar.`,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, selectMessage]);
        setPendingDeletion({ eventId: "", eventName: "", step: "search" });
      }
      return true;
    }

    // Handle deletion confirmation
    const confirmData = parseConfirmDeleteCommand(content);
    if (confirmData) {
      const confirmMessage: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: `⚠️ **Confirmar eliminación**\n\n📋 ${confirmData.name} - $${confirmData.amount} - ${confirmData.date}\n\n¿Estás seguro de que quieres eliminar este evento? Escribe 'sí' para confirmar o 'no' para cancelar.`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, confirmMessage]);
      setPendingDeletion({
        eventId: confirmData.id,
        eventName: confirmData.name,
        step: "confirm",
      });
      return true;
    }

    // Handle final deletion
    const deleteEventId = parseDeleteEventCommand(content);
    if (deleteEventId) {
      const success = handleEventDeletion(deleteEventId);
      if (success) {
        const successMessage: Message = {
          id: crypto.randomUUID(),
          role: "assistant",
          content: `✅ ¡Eliminado exitosamente! El evento ha sido borrado de tu registro financiero.`,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, successMessage]);
        setPendingDeletion(null);
      } else {
        const errorMessage: Message = {
          id: crypto.randomUUID(),
          role: "assistant",
          content:
            "❌ Error al eliminar el evento. Por favor, inténtalo de nuevo.",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, errorMessage]);
      }
      return success;
    }

    return false;
  };

  useEffect(() => {
    try {
      const storedMessages = localStorage.getItem(CHAT_STORAGE_KEY);
      if (storedMessages) {
        const parsedMessages = deserializeMessages(storedMessages);
        setMessages(parsedMessages);
      }
    } catch (error) {
      console.error("Error loading chat messages from localStorage:", error);
    }
  }, []);

  useEffect(() => {
    try {
      const messagesToSave = messages.filter(
        (msg) => msg.role === "user" || msg.role === "assistant",
      );
      localStorage.setItem(CHAT_STORAGE_KEY, serializeMessages(messagesToSave));
    } catch (error) {
      console.error("Error saving chat messages to localStorage:", error);
    }
  }, [messages]);

  const scrollToBottom = () => {
    if (viewportRef.current) {
      try {
        viewportRef.current.scrollTo({
          top: viewportRef.current.scrollHeight,
          behavior: "smooth",
        });
      } catch (err) {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const forceScrollToBottom = () => {
    setTimeout(() => scrollToBottom(), 0);
    setTimeout(() => scrollToBottom(), 50);
    setTimeout(() => scrollToBottom(), 100);
  };

  useEffect(() => {
    forceScrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isLoading && messages.length > 0) {
      forceScrollToBottom();
    }
  }, [messages, isLoading]);

  useEffect(() => {
    if (isOpen) {
      forceScrollToBottom();
    }
  }, [isOpen]);

  useEffect(() => {
    const viewportElement = viewportRef.current;
    if (!viewportElement) return;

    const handleWheel = (e: WheelEvent) => {
      e.stopPropagation();
      e.preventDefault();

      const delta = e.deltaY;
      viewportElement.scrollTop += delta;
    };

    const handleTouchMove = (e: TouchEvent) => {
      e.stopPropagation();
      e.preventDefault();
    };

    viewportElement.addEventListener("wheel", handleWheel, { passive: false });
    viewportElement.addEventListener("touchmove", handleTouchMove, {
      passive: false,
    });

    return () => {
      viewportElement.removeEventListener("wheel", handleWheel);
      viewportElement.removeEventListener("touchmove", handleTouchMove);
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleDocumentWheel = (e: WheelEvent) => {
      const chatContainer = document.querySelector(".walletfy-chat-container");
      if (chatContainer && chatContainer.contains(e.target as Node)) {
        e.preventDefault();
      }
    };

    document.addEventListener("wheel", handleDocumentWheel, { passive: false });

    return () => {
      document.removeEventListener("wheel", handleDocumentWheel);
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const chatContainer = document.querySelector(".walletfy-chat-container");
    const chatViewport = document.querySelector(".walletfy-chat-viewport");

    const handleWheel = (e: Event) => {
      e.stopPropagation();
      e.preventDefault();
    };

    const handleTouchMove = (e: Event) => {
      e.stopPropagation();
      e.preventDefault();
    };

    if (chatContainer) {
      chatContainer.addEventListener("wheel", handleWheel, { passive: false });
      chatContainer.addEventListener("touchmove", handleTouchMove, {
        passive: false,
      });
    }

    if (chatViewport) {
      chatViewport.addEventListener("wheel", handleWheel, { passive: false });
      chatViewport.addEventListener("touchmove", handleTouchMove, {
        passive: false,
      });
    }

    return () => {
      if (chatContainer) {
        chatContainer.removeEventListener("wheel", handleWheel);
        chatContainer.removeEventListener("touchmove", handleTouchMove);
      }

      if (chatViewport) {
        chatViewport.removeEventListener("wheel", handleWheel);
        chatViewport.removeEventListener("touchmove", handleTouchMove);
      }
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        scrollToBottom();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isOpen]);

  // Handle resize start
  const startResizing = (e: React.MouseEvent) => {
    e.preventDefault();
    isResizing.current = true;

    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = width;
    const startHeight = height;

    const doDrag = (moveEvent: MouseEvent) => {
      if (!isResizing.current) return;

      const newWidth = startWidth + (startX - moveEvent.clientX);
      const newHeight = startHeight + (startY - moveEvent.clientY);

      // Set minimum and maximum dimensions
      setWidth(Math.max(300, Math.min(newWidth, 800)));
      setHeight(Math.max(400, Math.min(newHeight, 800)));
    };

    const stopDrag = () => {
      isResizing.current = false;
      document.removeEventListener("mousemove", doDrag);
      document.removeEventListener("mouseup", stopDrag);
    };

    document.addEventListener("mousemove", doDrag);
    document.addEventListener("mouseup", stopDrag);
  };

  // Prepare financial context for the LLM
  const getFinancialContext = () => {
    const balanceFlow = balanceHelpers.calculateGlobalBalanceFlow(
      events,
      initialBalance,
    );
    const currentBalance =
      balanceFlow.length > 0
        ? balanceFlow[balanceFlow.length - 1].globalBalance
        : initialBalance;

    // Group events by type and get recent activity
    const ingresos = events.filter((e) => e.tipo === "ingreso");
    const egresos = events.filter((e) => e.tipo === "egreso");

    // Get last 5 events
    const recentEvents = [...events]
      .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
      .slice(0, 5);

    return {
      user_id: "walletfy_user",
      current_page: "dashboard",
      context_generated_at: new Date().toISOString(),
      context_generated_at_formatted: new Date().toLocaleString("es-ES"),
      user_data: {
        initial_balance: initialBalance,
        current_balance: currentBalance,
        total_ingresos: ingresos.length,
        total_egresos: egresos.length,
        total_ingresos_amount: ingresos.reduce((sum, e) => sum + e.cantidad, 0),
        total_egresos_amount: egresos.reduce((sum, e) => sum + e.cantidad, 0),
      },
      app_state: {
        balance_flow: balanceFlow.map((month) => ({
          month: month.monthName,
          ingresos: month.totalIngresos,
          egresos: month.totalEgresos,
          balance: month.monthlyBalance,
          global_balance: month.globalBalance,
        })),
        recent_events: recentEvents.map((event) => ({
          id: event.id,
          nombre: event.nombre,
          descripcion: event.descripcion,
          cantidad: event.cantidad,
          fecha: dateHelpers.formatDate(event.fecha),
          tipo: event.tipo,
          formatted_amount: formatters.eventAmount(event),
        })),
      },
      relevant_transactions: recentEvents,
      user_preferences: {
        theme: themeMode,
      },
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!inputValue.trim() || isLoading) return;

    // Handle pending deletion workflow
    if (pendingDeletion) {
      const userInput = inputValue.toLowerCase().trim();

      if (pendingDeletion.step === "confirm") {
        if (userInput === "sí" || userInput === "si" || userInput === "yes") {
          // User confirmed deletion
          const success = handleEventDeletion(pendingDeletion.eventId);
          const message: Message = {
            id: crypto.randomUUID(),
            role: "assistant",
            content: success
              ? `✅ ¡Eliminado exitosamente! El evento "${pendingDeletion.eventName}" ha sido borrado de tu registro financiero.`
              : "❌ Error al eliminar el evento. Por favor, inténtalo de nuevo.",
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, message]);
          setPendingDeletion(null);
          setInputValue("");
          return;
        } else if (
          userInput === "no" ||
          userInput === "cancelar" ||
          userInput === "cancel"
        ) {
          // User cancelled deletion
          const message: Message = {
            id: crypto.randomUUID(),
            role: "assistant",
            content:
              "✅ Eliminación cancelada. El evento no ha sido modificado.",
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, message]);
          setPendingDeletion(null);
          setInputValue("");
          return;
        }
      } else if (pendingDeletion.step === "search") {
        // Handle selection from search results
        const selection = parseInt(userInput);
        if (!isNaN(selection) && selection >= 1 && selection <= 5) {
          // User selected a valid number
          // We need to re-run the search to get the selected event
          // For now, let's just cancel and let the AI handle it
          setPendingDeletion(null);
        } else if (userInput === "cancelar" || userInput === "cancel") {
          const message: Message = {
            id: crypto.randomUUID(),
            role: "assistant",
            content: "✅ Búsqueda cancelada.",
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, message]);
          setPendingDeletion(null);
          setInputValue("");
          return;
        }
      }
    }

    // Add user message to chat
    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);
    setError(null);

    try {
      // Prepare context for the LLM
      const context = getFinancialContext();

      // Create system message with context
      const systemMessage = `You are a financial assistant for Walletfy, a personal finance management app. 
The user has provided the following financial data (this data is current as of ${new Date().toLocaleString("es-ES")}):
${JSON.stringify(context, null, 2)}

## Core Capabilities:
1. **Financial Analysis**: Provide helpful, concise financial advice and insights based on user data
2. **Event Creation**: Guide users conversationally through creating new income/expense events
3. **Event Deletion**: Help users find and delete existing events with smart search and safety confirmations

## Event Creation Instructions:
When users want to create events (keywords: "crear evento", "añadir gasto", "registrar ingreso", "nuevo evento", etc.):
1. Guide them step-by-step through required fields
2. Ask for: nombre (1-20 chars), cantidad (positive number), fecha (support "hoy", "ayer", or dates), tipo ("ingreso" or "egreso")
3. descripcion is optional (max 100 chars)
4. When you have all required data, create the event using this EXACT command format:
   [CREATE_EVENT: nombre="EventName", cantidad=123.45, fecha="2025-01-15", tipo="ingreso", descripcion="Optional description"]

## Event Deletion Instructions:
When users want to delete events (keywords: "eliminar", "borrar", "delete", "quitar evento", etc.):
1. **Smart Search**: Extract search criteria from natural language and search for matching events
2. **Multi-step Workflow**: Always use confirmation steps for safety
3. **Command Format for Search**:
   [SEARCH_EVENTS: keywords="salario", month="09", year="2023", tipo="ingreso"]
4. **Command Format for Confirmation**:
   [CONFIRM_DELETE: id="event123", name="Salario mensual", amount=3000, date="01/09/2023"]
5. **Command Format for Final Deletion**:
   [DELETE_EVENT: id="event123"]

## Deletion Workflow Example:
User: "eliminar el salario de septiembre 2023"
You: "[SEARCH_EVENTS: keywords=salario, month=09, year=2023] Buscando eventos de salario en septiembre 2023..."

## Search Criteria Support:
- **Keywords**: Extract meaningful terms (ignore stop words like "el", "la", "de")
- **Date Ranges**: Support "septiembre 2023", "mes pasado", "esta semana", etc.
- **Amount Matching**: Extract monetary values and match with tolerance
- **Event Type**: Detect "gasto/egreso" vs "ingreso/salario" keywords

## Safety Rules for Deletion:
- ALWAYS require explicit user confirmation before final deletion
- Show exactly what will be deleted with full event details
- For multiple matches, show numbered list for user selection
- For no matches, suggest alternative search terms
- Handle cancellation gracefully ("cancelar", "no")
- Never delete without user confirmation

## Date Parsing Support:
- "hoy" or "today" = today's date
- "ayer" or "yesterday" = yesterday's date  
- "mañana" or "tomorrow" = tomorrow's date
- Standard formats: DD/MM/YYYY, DD-MM-YYYY, YYYY-MM-DD

## Validation Rules:
- nombre: 1-20 characters required
- cantidad: positive number required
- fecha: valid date required
- tipo: "ingreso" or "egreso" required
- descripcion: optional, max 100 characters

## Example Deletion Flow:
User: "eliminar el salario de septiembre 2023"
You: "[SEARCH_EVENTS: keywords=salario, month=09, year=2023] Encontré estos eventos que coinciden:
     1. Salario mensual - $3000 - 01/09/2023
     2. Salario extra - $500 - 15/09/2023
     ¿Cuál quieres eliminar? (escribe el número o 'cancelar')"

User: "1"
You: "[CONFIRM_DELETE: id=abc123, name=Salario mensual, amount=3000, date=01/09/2023] 
     ¿Estás seguro de que quieres eliminar este evento?
     📋 Salario mensual - $3000 - 01/09/2023
     Escribe 'sí' para confirmar o 'no' para cancelar."

User: "sí"  
You: "[DELETE_EVENT: id=abc123] ¡Eliminado exitosamente! El evento 'Salario mensual' ha sido borrado de tu registro financiero."

## General Rules:
- Always respond in Spanish
- Keep responses under 200 words
- Use current financial data provided above
- If asked about transactions, refer by name and date
- For summaries, provide clear financial insights
- For predictions, be cautious and note they are estimates
- ALWAYS use the exact command formats shown when creating or deleting events
- Prioritize user safety with clear confirmations for deletions`;

      // Prepare messages for API call
      const apiMessages = [
        { role: "system", content: systemMessage },
        ...messages.map((m) => ({ role: m.role, content: m.content })),
        { role: "user", content: inputValue },
      ];

      const apiToken = getApiToken();
      if (!apiToken) {
        throw new Error(
          "API token not available. Please ensure you are authenticated.",
        );
      }

      const response = await fetch(CHUTES_API_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: CHUTES_MODEL,
          messages: apiMessages,
          stream: true,
          max_tokens: 1024,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }

      if (!response.body) {
        throw new Error("Response body is null");
      }

      // Process streaming response
      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      let assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: "",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);

      try {
        while (true) {
          const { done, value } = await reader.read();

          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split("\n");

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const data = line.slice(6);

              if (data === "[DONE]") {
                break;
              }

              try {
                const parsed = JSON.parse(data);
                const content = parsed.choices?.[0]?.delta?.content || "";

                if (content) {
                  assistantMessage = {
                    ...assistantMessage,
                    content: assistantMessage.content + content,
                  };

                  setMessages((prev) => {
                    const newMessages = [...prev];
                    const lastIndex = newMessages.length - 1;
                    if (
                      lastIndex >= 0 &&
                      newMessages[lastIndex].id === assistantMessage.id
                    ) {
                      newMessages[lastIndex] = assistantMessage;
                    }
                    return newMessages;
                  });
                }
              } catch (parseError) {
                console.warn("Error parsing SSE data:", parseError);
              }
            }
          }
        }
      } finally {
        reader.releaseLock();
      }

      if (assistantMessage.content) {
        processAICommands(assistantMessage.content);
      }
    } catch (err) {
      console.error("Chat error:", err);
      setError(
        err instanceof Error ? err.message : "An unknown error occurred",
      );

      // Add error message to chat
      const errorMessage: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content:
          "Lo siento, ocurrió un error al procesar tu solicitud. Por favor, inténtalo de nuevo.",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([]);
    setError(null);
    try {
      localStorage.removeItem(CHAT_STORAGE_KEY);
    } catch (error) {
      console.error("Error clearing chat messages from localStorage:", error);
    }
  };

  const handleLogout = () => {
    logout();
    window.location.reload();
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      if (messages.length === 0) {
        const welcomeMessage: Message = {
          id: crypto.randomUUID(),
          role: "assistant",
          content:
            '¡Hola! Soy tu asistente financiero. Puedo ayudarte a analizar tus gastos, ingresos, **crear nuevos eventos financieros** y **eliminar eventos existentes**. ¿En qué puedo ayudarte hoy?\n\n**Características principales:**\n- 📊 Análisis de gastos e ingresos\n- 💡 Recomendaciones personalizadas\n- ✨ **Creación guiada de eventos** (solo di "crear evento" o "añadir gasto")\n- 🗑️ **Eliminación inteligente de eventos** (di "eliminar" o "borrar" con detalles)\n- 📈 Seguimiento de metas financieras\n\n*¡Empieza a consultar, crear o eliminar eventos ya!*',
          timestamp: new Date(),
        };
        setMessages([welcomeMessage]);
      }
    }
  };

  return (
    <>
      {/* Floating chat toggle button */}
      <Tooltip label="Asistente financiero" position="left">
        <ActionIcon
          variant="filled"
          size="xl"
          radius="xl"
          onClick={toggleChat}
          style={{
            position: "fixed",
            bottom: "20px",
            right: "20px",
            zIndex: 1000,
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
            backgroundColor:
              themeMode === "dark"
                ? "var(--walletfy-dark-surface)"
                : "var(--walletfy-solarized-base3)",
            border: `1px solid ${
              themeMode === "dark"
                ? "var(--walletfy-dark-border)"
                : "var(--walletfy-gray-200)"
            }`,
          }}
        >
          <IconMessage
            size={20}
            color={
              themeMode === "dark"
                ? "var(--walletfy-solarized-blue)"
                : "var(--walletfy-solarized-violet)"
            }
          />
        </ActionIcon>
      </Tooltip>

      {/* Chat window */}
      {isOpen && (
        <Card
          ref={chatRef}
          onWheel={(e) => {
            e.stopPropagation();
            e.preventDefault();
          }}
          onTouchMove={(e) => {
            e.stopPropagation();
            e.preventDefault();
          }}
          onMouseDown={(e) => e.stopPropagation()}
          shadow="lg"
          radius="md"
          withBorder
          className="walletfy-chat-container"
          style={{
            position: "fixed",
            bottom: "80px",
            right: "20px",
            width: `${width}px`,
            height: `${height}px`,
            display: "flex",
            flexDirection: "column",
            zIndex: 1000,
            backgroundColor:
              themeMode === "dark"
                ? "var(--walletfy-dark-surface)"
                : "var(--walletfy-solarized-base3)",
            borderColor:
              themeMode === "dark"
                ? "var(--walletfy-dark-border)"
                : "var(--walletfy-gray-200)",
            overflow: "hidden",
          }}
        >
          {/* Chat header */}
          <Box mb="sm">
            <Group justify="space-between">
              <Group gap="xs">
                <IconMessage
                  size={20}
                  color={
                    themeMode === "dark"
                      ? "var(--walletfy-solarized-blue)"
                      : "var(--walletfy-solarized-violet)"
                  }
                />
                <Text fw={600}>Asistente Financiero</Text>
              </Group>
              <Tooltip
                label="Cerrar sesión"
                position="bottom"
                withinPortal
                zIndex={1001}
              >
                <ActionIcon
                  variant="subtle"
                  size="sm"
                  onClick={handleLogout}
                  aria-label="Cerrar sesión"
                >
                  <IconLogout
                    size={16}
                    color={
                      themeMode === "dark"
                        ? "var(--walletfy-dark-text)"
                        : "var(--walletfy-gray-700)"
                    }
                  />
                </ActionIcon>
              </Tooltip>
            </Group>
          </Box>

          {/* Messages container */}
          <Box
            ref={viewportRef}
            className="walletfy-chat-viewport"
            style={{
              flex: 1,
              minHeight: 0,
              maxHeight: "calc(100% - 100px)", // Adjust for header and input area
              marginBottom: "sm",
              overflowY: "auto",
              overflowX: "hidden",
              paddingRight: "8px",
              scrollbarWidth: "thin",
              scrollbarColor:
                themeMode === "dark"
                  ? "var(--walletfy-dark-border) var(--walletfy-dark-surface)"
                  : "var(--walletfy-gray-400) var(--walletfy-gray-100)",
            }}
            onWheel={(e) => {
              e.stopPropagation();
              e.preventDefault();
              // Manually handle scrolling
              if (viewportRef.current) {
                viewportRef.current.scrollTop += e.deltaY;
              }
            }}
            onTouchMove={(e) => {
              e.stopPropagation();
              e.preventDefault();
            }}
          >
            <Stack
              gap="sm"
              pr="xs"
              className="walletfy-chat-messages"
              style={{ padding: "0 8px 0 0" }}
            >
              {messages.map((message) => (
                <ChatMessage
                  key={message.id}
                  message={message}
                  themeMode={themeMode}
                />
              ))}
              {isLoading && (
                <Group justify="flex-start">
                  <Box
                    style={{
                      backgroundColor:
                        themeMode === "dark"
                          ? "var(--walletfy-dark-border)"
                          : "var(--walletfy-gray-100)",
                      borderRadius: "var(--walletfy-radius-lg)",
                      padding: "var(--walletfy-space-sm)",
                      maxWidth: "80%",
                    }}
                  >
                    <Group gap="xs">
                      <IconLoader2 size={16} className="animate-spin" />
                      <Text size="sm">Escribiendo...</Text>
                    </Group>
                  </Box>
                </Group>
              )}
              {error && (
                <Group justify="flex-start">
                  <Box
                    style={{
                      backgroundColor: "var(--walletfy-solarized-red)",
                      borderRadius: "var(--walletfy-radius-lg)",
                      padding: "var(--walletfy-space-sm)",
                      maxWidth: "80%",
                    }}
                  >
                    <Group gap="xs">
                      <IconAlertCircle size={16} color="white" />
                      <Text size="sm" c="white">
                        {error}
                      </Text>
                    </Group>
                  </Box>
                </Group>
              )}
              <div ref={messagesEndRef} />
            </Stack>
          </Box>

          {/* Input form */}
          <form onSubmit={handleSubmit}>
            <Stack gap="xs">
              <Textarea
                ref={textareaRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Escribe tu consulta financiera..."
                autosize
                minRows={1}
                maxRows={3}
                disabled={isLoading}
                style={{ width: "100%" }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
              />
              <Group justify="space-between" align="center">
                <Group gap="xs">
                  <Tooltip
                    label="Limpiar chat"
                    position="top"
                    withinPortal
                    zIndex={1001}
                  >
                    <ActionIcon
                      variant="subtle"
                      size="md"
                      onClick={handleClearChat}
                      aria-label="Limpiar chat"
                    >
                      <IconTrash
                        size={18}
                        color={
                          themeMode === "dark"
                            ? "var(--walletfy-dark-text)"
                            : "var(--walletfy-gray-700)"
                        }
                      />
                    </ActionIcon>
                  </Tooltip>
                  <Tooltip
                    label="Cerrar"
                    position="top"
                    withinPortal
                    zIndex={1001}
                  >
                    <ActionIcon
                      variant="subtle"
                      size="md"
                      onClick={toggleChat}
                      aria-label="Cerrar chat"
                    >
                      <IconX
                        size={18}
                        color={
                          themeMode === "dark"
                            ? "var(--walletfy-dark-text)"
                            : "var(--walletfy-gray-700)"
                        }
                      />
                    </ActionIcon>
                  </Tooltip>
                </Group>
                <Button
                  type="submit"
                  variant="filled"
                  size="md"
                  disabled={!inputValue.trim() || isLoading}
                  style={{
                    height: "auto",
                    backgroundColor:
                      themeMode === "dark"
                        ? "var(--walletfy-solarized-blue)"
                        : "var(--walletfy-solarized-violet)",
                    borderRadius: "var(--walletfy-radius-md)",
                  }}
                >
                  <IconSend size={18} color="white" />
                </Button>
              </Group>
            </Stack>
          </form>

          {/* Resize handle */}
          <Box
            onMouseDown={startResizing}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "20px",
              height: "20px",
              cursor: "nwse-resize",
              backgroundColor: "transparent",
            }}
          >
            <Box
              style={{
                position: "absolute",
                top: "4px",
                left: "4px",
                width: "8px",
                height: "8px",
                borderLeft: `2px solid ${
                  themeMode === "dark"
                    ? "var(--walletfy-dark-text)"
                    : "var(--walletfy-gray-600)"
                }`,
                borderTop: `2px solid ${
                  themeMode === "dark"
                    ? "var(--walletfy-dark-text)"
                    : "var(--walletfy-gray-600)"
                }`,
              }}
            />
          </Box>
        </Card>
      )}
    </>
  );
};
