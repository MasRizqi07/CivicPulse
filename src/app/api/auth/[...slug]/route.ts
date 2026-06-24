import { auth } from "@/server/auth";

const handler = async (req: Request) => {
  return auth.handler(req);
};

export { handler as GET, handler as POST, handler as PUT, handler as DELETE, handler as PATCH };
