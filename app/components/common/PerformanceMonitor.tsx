"use client";
import React, { memo, useEffect, useState, useMemo } from "react";

interface PerformanceMonitorProps {
  componentName: string;
  renderCount?: number;
  className?: string;
}

const PerformanceMonitor = memo(
  ({
    componentName,
    renderCount = 0,
    className = "",
  }: PerformanceMonitorProps) => {
    const [renderTimes, setRenderTimes] = useState<number[]>([]);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
      const startTime = performance.now();

      return () => {
        const endTime = performance.now();
        const renderTime = endTime - startTime;

        setRenderTimes((prev) => [...prev.slice(-9), renderTime]);
      };
    });

    const avgRenderTime = useMemo(() => {
      if (renderTimes.length === 0) return 0;
      return (
        renderTimes.reduce((sum, time) => sum + time, 0) / renderTimes.length
      );
    }, [renderTimes]);

    // Only show in development
    useEffect(() => {
      setIsVisible(process.env.NODE_ENV === "development");
    }, []);

    if (!isVisible) return null;

    return (
      <div
        className={`fixed bottom-4 right-4 bg-black bg-opacity-75 text-white p-2 rounded text-xs z-50 ${className}`}
      >
        <div>Component: {componentName}</div>
        <div>Renders: {renderCount}</div>
        <div>Avg Time: {avgRenderTime.toFixed(2)}ms</div>
        <div>Last 10: {renderTimes.length}</div>
      </div>
    );
  }
);

PerformanceMonitor.displayName = "PerformanceMonitor";

export default PerformanceMonitor;
