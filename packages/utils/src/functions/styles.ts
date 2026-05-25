import clsx, { ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}


function byBounding(e: React.MouseEvent<HTMLElement>, fn: () => void) {
    const dialogDimensions = e.currentTarget.getBoundingClientRect();
    if (
        e.clientX < dialogDimensions.left ||
        e.clientX > dialogDimensions.right ||
        e.clientY < dialogDimensions.top ||
        e.clientY > dialogDimensions.bottom
    ) {
        fn()
    }
};

export { byBounding, cn };

