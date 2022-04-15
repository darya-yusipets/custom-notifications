export interface NotificationProps {
  type: "info" | "error" | "warning" | "success";
  message: string;
  duration?: number;
  update?: () => void;
  period?: number;
}
