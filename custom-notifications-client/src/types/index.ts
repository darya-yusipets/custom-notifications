export interface NotificationProps {
  type: "info" | "error" | "warning" | "success";
  message: string;
  duration?: number;
  period?: number;
  onHide?: () => void;
  isEmpty?: boolean;
}
