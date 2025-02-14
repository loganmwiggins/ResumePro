export const formatDate = (dateString, options = { month: true, day: true, year: true }) => {
    const [year, month, day] = dateString.split("-").map(Number);
    const date = new Date(year, month - 1, day); // Month is zero-based

    // Determine the format based on the options provided
    const formatOptions = {
        ...(options.month && { month: "short" }),
        ...(options.day && { day: "numeric" }),
        ...(options.year && { year: "numeric" }),
    };

    return date.toLocaleDateString("en-US", formatOptions);
};