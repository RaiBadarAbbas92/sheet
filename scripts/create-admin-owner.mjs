// Creates or updates the Neend Mattress owner account in admin_users from
// ADMIN_EMAIL / ADMIN_NAME / ADMIN_PASSWORD in .env.local. Other admin
// accounts in the shared table are left alone.
//
//   node scripts/create-admin-owner.mjs

import { randomBytes, scryptSync } from "node:crypto";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
for (const line of readFileSync(path.join(root, ".env.local"), "utf8").split(/\r?\n/)) {
  const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
  if (match && !process.env[match[1]]) process.env[match[1]] = match[2].replace(/^["']|["']$/g, "");
}

const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY;
const email = String(process.env.ADMIN_EMAIL || "").trim().toLowerCase();
const name = String(process.env.ADMIN_NAME || "Owner").trim();
const password = String(process.env.ADMIN_PASSWORD || "").trim();
if (!url || !key) throw new Error("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in .env.local");
if (!email || password.length < 10) throw new Error("Set ADMIN_EMAIL and an ADMIN_PASSWORD of at least 10 characters in .env.local");

// Same format as hashPassword in lib/adminUsers.js.
const salt = randomBytes(16).toString("base64url");
const passwordHash = `scrypt:${salt}:${scryptSync(password, salt, 64).toString("base64url")}`;

const headers = { apikey: key, Authorization: `Bearer ${key}`, "Content-Type": "application/json" };
const clash = await fetch(`${url}/rest/v1/admin_users?select=id&email=eq.${encodeURIComponent(email)}&id=neq.neend-owner`, { headers }).then((r) => r.json());
if (clash.length) throw new Error(`${email} already belongs to another admin account; choose a different ADMIN_EMAIL`);

const now = new Date().toISOString();
const res = await fetch(`${url}/rest/v1/admin_users?on_conflict=id`, {
  method: "POST",
  headers: { ...headers, Prefer: "resolution=merge-duplicates,return=minimal" },
  body: JSON.stringify({
    id: "neend-owner",
    name,
    email,
    role: "Owner",
    permissions: ["dashboard", "orders", "orders.export", "products", "inventory", "customers", "settings", "users"],
    password_hash: passwordHash,
    status: "Active",
    updated_at: now,
  }),
});
if (!res.ok) throw new Error(`Saving admin user failed: ${res.status} ${await res.text()}`);
console.log(`Owner account ready: ${email}`);
