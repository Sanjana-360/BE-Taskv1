

export const IST_conversion = (date) => {
    const date1 = new Date(date).toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
        hour12: true,
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    })
    return date1;
}

