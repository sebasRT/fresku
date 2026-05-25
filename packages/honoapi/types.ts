import type { JwtVariables } from 'hono/jwt'

export type AdminJwtPayload = {
    tenantId: string
    domain: string
    adminInfo: Record<string, unknown>
}

export type DomerAccessPayload = {
    domerId: string
    tenantId: string
    domain: string
}

export type DomisJwtPayload = {
    tenantId: string
    domer: { id: string } & Record<string, unknown>
}

export type AdminVariables = JwtVariables<AdminJwtPayload>
export type DomerAccessVariables = JwtVariables<DomerAccessPayload>
export type DomisVariables = JwtVariables<DomisJwtPayload>
