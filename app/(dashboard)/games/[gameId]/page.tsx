"use client";

import { CheckCircle } from "lucide-react";

export default function GameDetailsPage() {

const questions=[

{
question:"Capital of India?",
answer:"Delhi",
correct:true
},

{
question:"2+2?",
answer:"4",
correct:true
},

{
question:"Planet nearest Sun?",
answer:"Mars",
correct:false
}

]

return (

<main className="min-h-screen bg-[oklch(0.06_0.007_38)] p-8">

<h1 className="text-4xl text-white font-bold">
Game Results
</h1>

<p className="text-neutral-400 mt-2">
Review your answers and scores
</p>

<div className="mt-8 bg-white/[0.03] p-6 rounded-2xl border border-white/10">

<div className="flex justify-between">

<div>

<h2 className="text-white text-xl font-semibold">
Final Score
</h2>

<p className="text-orange-500 text-3xl font-bold mt-2">
80 Points
</p>

</div>

<CheckCircle
size={40}
className="text-orange-500"
/>

</div>

</div>

<div className="space-y-4 mt-8">

{questions.map((q,index)=>(

<div
key={index}
className="p-5 bg-white/[0.03] border border-white/10 rounded-xl"
>

<h2 className="text-white">
{q.question}
</h2>

<p className="mt-2 text-neutral-400">
Your answer:
{" "}
<span className={q.correct ? "text-green-500":"text-red-500"}>
{q.answer}
</span>
</p>

</div>

))}

</div>

</main>

)

}