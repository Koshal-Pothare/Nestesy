const Visit_KEY = "upcomingVisits";

export const getVisit = () => {
  return JSON.parse(localStorage.getItem(Visit_KEY)) || [];
};

export const bookVisit = (property) => {
  const visits = getVisit();

  const exists = visits.some((item) => item.id === property.id);

  if (!exists) {
    visits.push(property);
    localStorage.setItem(Visit_KEY, JSON.stringify(visits));
  }
};

export const removeBooking = (id) => {
  const visits = getVisit().filter((item) => item.id !== id);
  localStorage.setItem(Visit_KEY, JSON.stringify(visits));
};

export const isBooked = (id) => {
  return getVisit().some((item) => item.id === id);
};

// export const toggleFavorite = (property) => {
//   const favorites = getFavorites();

//   const exists = favorites.some((item) => item.id === property.id);

//   if (exists) {
//     const updated = favorites.filter((item) => item.id !== property.id);
//     localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
//     return false;
//   }

//   favorites.push(property);
//   localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
//   return true;
// };