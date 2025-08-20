export { default } from "next-auth/middleware"

export const config = {
  matcher: ["/dashboard/:path*"], // protege /dashboard e subrotas
}
