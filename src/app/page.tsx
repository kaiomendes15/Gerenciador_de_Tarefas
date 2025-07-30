import { getServerSession } from "next-auth";
import { googleAuthOptions } from "./api/auth/[...nextauth]/route";
export default async function Home() {
  const session = await getServerSession(googleAuthOptions); // objeto que é usado quando inicializa o next auth
  return (
    <div>
      <h1> Welcome, { session && <span>{ session.user!.name }</span> }</h1>
    </div>
  );
}
