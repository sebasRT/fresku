const units = ['bulevar', 'sendero', 'villa'] as const

type Unit = typeof units[number]

const deliveryFees: Record<Unit, number> = {
    bulevar: 2000,
    sendero: 1500,
    villa: 300
}

export { deliveryFees, units, type Unit }

