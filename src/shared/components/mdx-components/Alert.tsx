import type { ReactNode } from "react";
import {
  FaCheckCircle,
  FaExclamationTriangle,
  FaInfoCircle,
  FaTimesCircle,
} from "react-icons/fa";

interface AlertProps {
  children: ReactNode;
  variant: "info" | "warning" | "success" | "error";
}

const config = {
  info: {
    icon: FaInfoCircle,
    border: "border-l-blue-500",
    bg: "bg-blue-500/10",
  },
  warning: {
    icon: FaExclamationTriangle,
    border: "border-l-yellow-500",
    bg: "bg-yellow-500/10",
  },
  success: {
    icon: FaCheckCircle,
    border: "border-l-green-500",
    bg: "bg-green-500/10",
  },
  error: {
    icon: FaTimesCircle,
    border: "border-l-red-500",
    bg: "bg-red-500/10",
  },
};

function Alert({ children, variant }: AlertProps) {
  const { icon: Icon, border, bg } = config[variant];
  return (
    <div
      className={`flex gap-3 p-4 my-4 border-l-4 ${border} ${bg} rounded-r-lg`}
    >
      <Icon className="w-5 h-5 mt-0.5 shrink-0 text-content-secondary" />
      <div className="text-sm text-content-secondary [&>p]:my-0">
        {children}
      </div>
    </div>
  );
}

export function InfoBox({ children }: { children: ReactNode }) {
  return <Alert variant="info">{children}</Alert>;
}
export function Warning({ children }: { children: ReactNode }) {
  return <Alert variant="warning">{children}</Alert>;
}
export function Success({ children }: { children: ReactNode }) {
  return <Alert variant="success">{children}</Alert>;
}
export function Error({ children }: { children: ReactNode }) {
  return <Alert variant="error">{children}</Alert>;
}
