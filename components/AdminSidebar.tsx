"use client"

import Link from "next/link"

export default function AdminSidebar(){

return(

<div
className="
w-64
min-h-screen
border-r
p-6
"
>

<div className="space-y-4">

<Link href="/admin/questions">
Questions
</Link>

<Link href="/admin/users">
Users
</Link>

<Link href="/admin/rooms">
Rooms
</Link>

<Link href="/admin/analytics">
Analytics
</Link>

</div>

</div>

)

}