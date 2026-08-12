const HISTORY_KEY = "bookingHistory";

export const getBookingHistory = () => {
  return JSON.parse(localStorage.getItem(HISTORY_KEY)) || [];
};

export const addToBookingHistory = (booking, status = "Completed") => {
  const history = getBookingHistory();

  const exists = history.some((item) => item.id === booking.id);

  if (!exists) {
    history.push({
      ...booking,
      status,
      bookingCompletedAt: new Date().toISOString(),
    });

    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  }
};

export const removeFromBookingHistory = (id) => {
  const history = getBookingHistory().filter(
    (item) => item.id !== id
  );

  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
};