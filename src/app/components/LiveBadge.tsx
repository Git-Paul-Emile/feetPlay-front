export function LiveBadge() {
  return (
    <div className="flex items-center gap-1.5 bg-red-600/90 backdrop-blur-sm px-2.5 py-1 rounded">
      <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
      <span className="text-white text-xs font-medium uppercase tracking-wide">Direct</span>
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
      `}</style>
    </div>
  );
}
