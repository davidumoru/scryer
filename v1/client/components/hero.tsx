export function Hero() {
  return (
    <div className="container px-6">
      <div className="flex flex-col items-center space-y-4 text-center">
        <div className="space-y-6">
          <div>
            <h1 className="font-bold tracking-tighter text-4xl md:text-6xl lg:text-7xl">
              Web Data into
            </h1>
            <h1 className="font-bold tracking-tighter text-4xl md:text-6xl lg:text-7xl">
              Actionable Knowledge
            </h1>
          </div>
          <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
            Stop drowning in data. Transform the vast ocean of web information
            into clear, actionable knowledge that drives real-world results.
          </p>
        </div>
      </div>
    </div>
  );
}
