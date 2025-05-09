import React from 'react'

export default function Home() {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-black">
      {/* Blurred Gradient Shapes */}
      <div className="absolute top-0 left-0 w-[60vw] h-[20vw] bg-gradient-to-tr from-purple-800/40 to-blue-400/10 rounded-full blur-3xl -rotate-12 -translate-y-1/3 -translate-x-1/4 z-0" />
      <div className="absolute top-10 right-0 w-[40vw] h-[10vw] bg-gradient-to-tr from-yellow-700/30 to-purple-900/10 rounded-full blur-2xl rotate-12 translate-x-1/4 z-0" />
      <div className="absolute bottom-0 left-0 w-[50vw] h-[12vw] bg-gradient-to-tr from-purple-900/30 to-pink-400/10 rounded-full blur-2xl rotate-6 translate-y-1/3 -translate-x-1/4 z-0" />
      <div className="absolute bottom-10 right-0 w-[40vw] h-[10vw] bg-gradient-to-tr from-pink-700/30 to-purple-900/10 rounded-full blur-2xl -rotate-12 translate-x-1/4 z-0" />

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-4">
        <span className="mb-6 inline-block px-4 py-1 rounded-full bg-white/5 border border-white/10 text-sm font-medium text-gray-200 tracking-wide shadow-lg backdrop-blur-md">StockScope</span>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white leading-tight mb-4">
          Elevate Your <span className="bg-gradient-to-r from-purple-400 via-blue-300 to-pink-300 bg-clip-text text-transparent">Stock Market</span> Vision
        </h1>
        <p className="max-w-xl text-lg md:text-xl text-gray-400 mb-8">
          Powerful analytics and insights for smarter trading decisions.
        </p>
        <a
          href="/dashboard"
          className="inline-block px-8 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-pink-500 text-white font-semibold text-lg shadow-lg hover:from-purple-700 hover:to-pink-600 transition-all duration-200"
        >
          Get Started
        </a>
      </div>
    </div>
  )
}
