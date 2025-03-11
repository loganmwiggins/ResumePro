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

export const formatDateTime = (dateTimeString) => {
    const date = new Date(dateTimeString);

    // Define date options
    const dateOptions = { year: "numeric", month: "short", day: "numeric" };

    // Format date part
    const datePart = date.toLocaleDateString("en-US", dateOptions);

    // Get hours and minutes, and format it in 12-hour AM/PM format
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12; // Convert 0 hours to 12
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

    // Format time part
    const timePart = `${formattedHours}:${formattedMinutes} ${ampm}`;

    return `${datePart} at ${timePart}`;
}