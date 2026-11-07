import type { User } from "../users/types";
import type { Role } from "./types";

export function hasPermission(
  user: User | null,
  permissionName: string,
): boolean {
  if (user === null) return false;
  return user.role.permissions.some((p) => p.name === permissionName);
}

export function hasAllPermissions(
  user: User | null,
  permissions: string[],
): boolean {
  return permissions.every((permission) => hasPermission(user, permission));
}
export const MAX_ROLE_LEVEL = 100;
export const PROTECTED_ROLE_NAMES = ["Admin", "User"];

export function isProtectedRole(role: Role): boolean {
  return PROTECTED_ROLE_NAMES.includes(role.name);
}

export function canManageUser(actor: User, target: User): boolean {
  if (actor.role.level === MAX_ROLE_LEVEL) return true;

  return actor.role.level > target.role.level;
}

export function canAssignRole(actor: User, role: Role): boolean {
  if (actor.role.level === MAX_ROLE_LEVEL) return true;

  return actor.role.level > role.level;
}

export function canManageRole(actor: User, role: Role): boolean {
  if (actor.role.level === MAX_ROLE_LEVEL) return true;

  return actor.role.level > role.level;
}
