import { withAuth } from "next-auth/middleware";
import type { NextRequest } from "next/server";

export default withAuth({
  pages: {
    signIn: "/login",
  },
});

export const config = {
  matcher: ["/dashboard", "/profile", "/settings"], // rotas protegidas
};
