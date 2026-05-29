import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json([
    {
      question: "What is the capital of India?",
      options: ["Mumbai", "Delhi", "Chennai", "Kolkata"],
      answer: "Delhi",
    },
  ]);
}