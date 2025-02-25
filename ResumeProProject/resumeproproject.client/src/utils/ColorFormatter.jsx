export const rgbaToString = (color) => {
    return `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`;
};

export const darkenColor = (color, amount) => {
    return `rgb(${Math.max(0, color.r - amount)}, ${Math.max(0, color.g - amount)}, ${Math.max(0, color.b - amount)})`;
};

export const shiftColorTowards = (color, target, amount) => {
    return `rgb(
        ${Math.max(0, color.r - (color.r - target.r) * amount)}, 
        ${Math.max(0, color.g - (color.g - target.g) * amount)}, 
        ${Math.max(0, color.b - (color.b - target.b) * amount)}
    )`;
};
