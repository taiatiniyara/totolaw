import { authClient } from "@/lib/auth-client";
import Image from "next/image";

export default function Home() {
  return (
    <div>
      <form
        action={async (formData) => {
          "use server";
          const email = formData.get("email") as string;
          console.log("Email submitted:", email);
          const u = await authClient.signIn.magicLink({
            email,
            name: "User",
            callbackURL: "/",
            newUserCallbackURL: "/",
            errorCallbackURL: "/",
          });
          console.log(u);
        }}
        className="max-w-md mx-auto mt-10 p-6 border border-gray-300 rounded"
      >
        <input
          name="email"
          type="email"
          placeholder="Email"
          required
          className="border border-gray-300 p-2 rounded w-full"
        />
        <button
          type="submit"
          className="mt-4 w-full bg-blue-500 text-white p-2 rounded"
        >
          Send Magic Link
        </button>
      </form>
    </div>
  );
}
