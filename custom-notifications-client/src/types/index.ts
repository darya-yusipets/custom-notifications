export interface NotificationProps {
  type: "info" | "error" | "warning" | "success";
  message: string;
  duration?: number;
  show?: boolean;
}
