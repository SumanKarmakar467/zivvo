export default function PageLoader() {
  return (
    <div className="min-h-screen bg-[#05060F] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-full border-4 border-violet-600 border-t-cyan-400 animate-spin" />
        <p className="text-violet-300 text-sm animate-pulse">Loading...</p>
      </div>
    </div>
  );
}
