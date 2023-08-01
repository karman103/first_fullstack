import { UserButton } from "@clerk/nextjs/app-beta"

export default function DashboardPage() {
  return (
    <div>
      <p> Dashborad Page (Protected)</p>
      <UserButton afterSignOutUrl="/" /> 
    </div>
  )
}

