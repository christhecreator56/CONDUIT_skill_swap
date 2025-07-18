import { useRef, useEffect, useCallback, ReactNode, useState } from "react";

interface ClickSparkProps {
  sparkColor?: string;
  sparkSize?: number;
  sparkRadius?: number;
  sparkCount?: number;
  duration?: number;
  easing?: "linear" | "ease-in" | "ease-out" | "ease-in-out";
  extraScale?: number;
  children: ReactNode;
}

const isMobile = () => typeof window !== 'undefined' && window.innerWidth <= 600;

const ClickSpark = ({
  sparkColor = "#00D4FF",
  sparkSize = 10,
  sparkRadius = 15,
  sparkCount = 8,
  duration = 400,
  easing = "ease-out",
  extraScale = 1.0,
  children
}: ClickSparkProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sparksRef = useRef<any[]>([]);     
  const startTimeRef = useRef<number | null>(null); 
  const [mobile, setMobile] = useState(isMobile());

  // Responsive spark params
  const getSparkParams = () => {
    if (mobile) {
      return {
        sparkSize: sparkSize * 1.5,
        sparkRadius: sparkRadius * 1.5,
        sparkCount: Math.max(10, sparkCount),
        duration: duration * 1.2
      };
    }
    return { sparkSize, sparkRadius, sparkCount, duration };
  };

  useEffect(() => {
    const handleResize = () => setMobile(isMobile());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const parent = canvas.parentElement;
    if (!parent) return;

    let resizeTimeout: ReturnType<typeof setTimeout>;

    const resizeCanvas = () => {
      const { width, height } = parent.getBoundingClientRect();
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }
    };

    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(resizeCanvas, 100);
    };

    const ro = new ResizeObserver(handleResize);
    ro.observe(parent);

    resizeCanvas();

    return () => {
      ro.disconnect();
      clearTimeout(resizeTimeout);
    };
  }, []);

  const easeFunc = useCallback(
    (t: number) => {
      switch (easing) {
        case "linear":
          return t;
        case "ease-in":
          return t * t;
        case "ease-in-out":
          return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
        default:
          return t * (2 - t);
      }
    },
    [easing]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;

    const draw = (timestamp: number) => {
      if (!startTimeRef.current) {
        startTimeRef.current = timestamp; 
      }
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const { sparkSize, sparkRadius, duration } = getSparkParams();

      sparksRef.current = sparksRef.current.filter((spark) => {
        const elapsed = timestamp - spark.startTime;
        if (elapsed >= duration) {
          return false;
        }

        const progress = elapsed / duration;
        const eased = easeFunc(progress);

        const distance = eased * sparkRadius * extraScale;
        const lineLength = sparkSize * (1 - eased);

        const x1 = spark.x + distance * Math.cos(spark.angle);
        const y1 = spark.y + distance * Math.sin(spark.angle);
        const x2 = spark.x + (distance + lineLength) * Math.cos(spark.angle);
        const y2 = spark.y + (distance + lineLength) * Math.sin(spark.angle);

        ctx.strokeStyle = sparkColor;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();

        return true;
      });

      animationId = requestAnimationFrame(draw);
    };

    animationId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [
    sparkColor,
    sparkSize,
    sparkRadius,
    sparkCount,
    duration,
    easeFunc,
    extraScale,
    mobile
  ]);

  // Unified click/touch handler
  const triggerSparks = (x: number, y: number) => {
    const { sparkCount } = getSparkParams();
    const now = performance.now();
    const newSparks = Array.from({ length: sparkCount }, (_, i) => ({
      x,
      y,
      angle: (2 * Math.PI * i) / sparkCount,
      startTime: now,
    }));
    sparksRef.current.push(...newSparks);
  };

  const handleClick = (e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    triggerSparks(x, y);
  };

  const handleTouch = (e: React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0];
    if (!touch) return;
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    triggerSparks(x, y);
  };

  return (
    <div 
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        touchAction: 'manipulation',
        WebkitTapHighlightColor: 'transparent',
      }}
      onClick={handleClick}
      onTouchStart={handleTouch}
    >
      <canvas
        ref={canvasRef}
        style={{
          width: "100%",
          height: "100%",
          display: "block",
          userSelect: "none",
          position: "absolute",
          top: 0,
          left: 0,
          pointerEvents: "none",
          zIndex: 500 // ensure sparks are above other content
        }}
      />
      {children}
    </div>
  );
};

export default ClickSpark; 