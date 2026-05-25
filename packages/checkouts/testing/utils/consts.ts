const units = ['bulevar', 'sendero', 'villa'] as const
type Unit = typeof units[number]
const deliveryFees: Record<Unit, number> = {
    bulevar: 1500,
    sendero: 1500,
    villa: 1500
}

export { deliveryFees, units }

