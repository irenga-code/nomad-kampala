// Edge-runtime safe (used by middleware and the admin page): no node:* imports.
function safeEq(a: string, b: string) {
  const A = new TextEncoder().encode(a), B = new TextEncoder().encode(b);
  let diff = A.length ^ B.length;
  const n = Math.max(A.length, B.length);
  for (let i = 0; i < n; i++) diff |= (A[i] ?? 0) ^ (B[i] ?? 0); // constant-time over the longer input
  return diff === 0;
}

export function isAdmin(authorization: string | null): boolean {
  const user = process.env.ADMIN_USER;
  const pass = process.env.ADMIN_PASSWORD;
  if (!user || !pass || pass.length < 12) return false; // refuse weak/missing config
  if (!authorization?.startsWith("Basic ")) return false;
  let decoded = "";
  try {
    const bin = atob(authorization.slice(6));
    decoded = new TextDecoder().decode(Uint8Array.from(bin, (c) => c.charCodeAt(0)));
  } catch { return false; }
  const i = decoded.indexOf(":");
  if (i < 0) return false;
  const okUser = safeEq(decoded.slice(0, i), user);
  const okPass = safeEq(decoded.slice(i + 1), pass);
  return okUser && okPass;
}
