"use client"

interface Question{

id:string
question:string

}

export default function QuestionsTable({

questions

}:{
questions:Question[]
}){

return(

<table
className="
w-full
border
"
>

<thead>

<tr>

<th>ID</th>

<th>Question</th>

</tr>

</thead>

<tbody>

{

questions.map(
(q)=>(
<tr key={q.id}>

<td>
{q.id}
</td>

<td>
{q.question}
</td>

</tr>
)
)

}

</tbody>

</table>

)

}