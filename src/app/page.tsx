import { UserProvider } from "@/context/UserContext";
import { MatchLearnApp } from "@/components/MatchLearnApp";

export default function Page(){
  return (
    <UserProvider>
      <MatchLearnApp />
    </UserProvider>
  );
}
