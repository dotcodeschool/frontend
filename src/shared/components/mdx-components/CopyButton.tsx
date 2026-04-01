import { useState } from "react";
import { FaCheck, FaCopy } from "react-icons/fa";

interface Props {
  text: string;
  className?: string;
}

export function CopyButton({ text, className = "" }: Props) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <button
      onClick={copy}
      className={`p-1.5 rounded-md border transition-all ${
        copied
          ? "text-success border-success/30 bg-success/10 cursor-default"
          : "text-content-muted border-border bg-elevated/80 hover:text-content-primary hover:border-content-muted hover:bg-elevated"
      } ${className}`}
      aria-label={copied ? "Copied!" : "Copy code"}
      title={copied ? "Copied!" : "Copy"}
    >
      {copied ? (
        <FaCheck className="w-3 h-3" />
      ) : (
        <FaCopy className="w-3 h-3" />
      )}
    </button>
  );
}
