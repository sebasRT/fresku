const units = ['tower_a', 'tower_b'] as const

type Unit = typeof units[number]

const deliveryFees: Record<Unit, number> = {
    tower_a: 2000,
    tower_b: 1500,
}

export { deliveryFees, units, type Unit }
