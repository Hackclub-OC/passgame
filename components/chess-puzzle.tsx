"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Chessboard } from "react-chessboard"
import { Chess } from "chess.js"

export const ChessPuzzle: React.FC = () => {
  const [game, setGame] = useState<Chess>(new Chess())
  const [bestMove, setBestMove] = useState("")

  useEffect(() => {
    const fetchChessPuzzle = async () => {
      try {
        const response = await fetch("https://api.chess.com/pub/puzzle/random")
        const data = await response.json()
        const newGame = new Chess()
        newGame.load(data.fen)
        setGame(newGame)
        setBestMove(data.solution[0])
      } catch (error) {
        console.error("Error fetching chess puzzle:", error)
        // Fallback to a default puzzle if API call fails
        const newGame = new Chess()
        newGame.load("r1bqkb1r/pppp1ppp/2n2n2/4p2Q/2B1P3/8/PPPP1PPP/RNB1K1NR w KQkq - 0 1")
        setGame(newGame)
        setBestMove("Qh6")
      }
    }

    fetchChessPuzzle()
  }, [])

  return (
    <div className="text-center">
      <p className="mb-4">Find the best move (White to play):</p>
      <div className="w-64 h-64 mx-auto">
        <Chessboard position={game.fen()} />
      </div>
      <p className="mt-4">Best move: {bestMove}</p>
    </div>
  )
}

