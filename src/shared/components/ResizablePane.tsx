import {
  type ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

interface Props {
  left: ReactNode;
  right: ReactNode;
  defaultSplit?: number;
  minLeft?: number;
  minRight?: number;
}

export default function ResizablePane({
  left,
  right,
  defaultSplit = 50,
  minLeft = 20,
  minRight = 20,
}: Props) {
  const [split, setSplit] = useState(defaultSplit);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const handleMouseDown = useCallback(() => {
    isDragging.current = true;
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const pct = ((e.clientX - rect.left) / rect.width) * 100;
      setSplit(Math.max(minLeft, Math.min(100 - minRight, pct)));
    };

    const handleMouseUp = () => {
      isDragging.current = false;
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [minLeft, minRight]);

  return (
    <div ref={containerRef} className="flex flex-1 min-h-0 h-full">
      <div style={{ flex: `0 0 ${split}%` }} className="relative min-w-0">
        <div className="absolute inset-0 overflow-hidden">{left}</div>
      </div>
      <div
        onMouseDown={handleMouseDown}
        className="w-1 bg-border hover:bg-accent cursor-col-resize shrink-0 transition-colors"
      />
      <div style={{ flex: `0 0 ${100 - split}%` }} className="relative min-w-0">
        <div className="absolute inset-0 overflow-hidden">{right}</div>
      </div>
    </div>
  );
}
