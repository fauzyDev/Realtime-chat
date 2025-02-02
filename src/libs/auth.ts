import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export const userSession = async () => {
    const session = await getServerSession(authOptions)
    if (session?.user) {
        return {
            id: session.user.id, // Pastikan ID ada
      name: session.user.name,
      email: session.user.email,
      image: session.user.image,
        }
    }
    return null
}