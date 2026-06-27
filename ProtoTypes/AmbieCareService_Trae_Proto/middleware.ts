import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isAuth = !!token;
    const { pathname } = req.nextUrl;

    // 이미 로그인된 사용자가 로그인 페이지에 접근할 경우 대시보드로 리다이렉트
    if (pathname === "/login" && isAuth) {
      if (token.role === "GUARDIAN") {
        return NextResponse.redirect(new URL("/guardian/dashboard", req.url));
      }
      if (token.role === "FACILITY_ADMIN") {
        return NextResponse.redirect(new URL("/admin/dashboard", req.url));
      }
    }

    // 역할별 경로 접근 권한 체크 (인증된 사용자에 대해서만 수행)
    if (isAuth) {
      if (pathname.startsWith("/guardian") && token.role !== "GUARDIAN") {
        return NextResponse.redirect(new URL("/admin/dashboard", req.url));
      }

      if (pathname.startsWith("/admin") && token.role !== "FACILITY_ADMIN") {
        return NextResponse.redirect(new URL("/guardian/dashboard", req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;
        
        // 퍼블릭 경로는 인증 없이 허용
        if (pathname === "/" || pathname === "/login" || pathname.startsWith("/api/auth")) {
          return true;
        }
        
        // 그 외 모든 경로는 토큰이 있어야 함
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: ["/guardian/:path*", "/admin/:path*", "/login"],
};
