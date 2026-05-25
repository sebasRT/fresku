import clsx, { ClassValue } from "clsx";
import { MouseEvent, RefObject } from "react";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

function byBounding(e: MouseEvent<HTMLElement>, fn: () => void, target: RefObject<HTMLElement> | null = null) {
    const targetElement = target?.current || e.currentTarget;

    const targetDimensions = targetElement.getBoundingClientRect();

    if (
        e.clientX < targetDimensions.left ||
        e.clientX > targetDimensions.right ||
        e.clientY < targetDimensions.top ||
        e.clientY > targetDimensions.bottom
    ) {
        fn()
    }
}

export { byBounding, cn };
