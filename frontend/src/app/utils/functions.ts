export const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
      //hour: "2-digit", I removed this line because my field in the database is DATE, not DATETIME
      //minute: "2-digit",
      hour12: true, // Formato AM/PM
    });
  };