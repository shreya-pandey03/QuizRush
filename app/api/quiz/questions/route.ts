import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json([
    {
      question: "What is the capital of India?",

      optionA: "Mumbai",
      optionB: "Delhi",
      optionC: "Chennai",
      optionD: "Kolkata",

      answer: "optionB",
    },
  ]);
}
