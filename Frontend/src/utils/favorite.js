const FAVORITES_KEY = "favorites";

export const getFavorites = () => {
  return JSON.parse(localStorage.getItem(FAVORITES_KEY)) || [];
};

export const addToFavorites = (property) => {
  const favorites = getFavorites();

  const exists = favorites.some((item) => item.id === property.id);

  if (!exists) {
    favorites.push(property);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  }
};

export const removeFromFavorites = (id) => {
  const favorites = getFavorites().filter((item) => item.id !== id);
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
};

export const isFavorite = (id) => {
  return getFavorites().some((item) => item.id === id);
};

export const toggleFavorite = (property) => {
  const favorites = getFavorites();

  const exists = favorites.some((item) => item.id === property.id);

  if (exists) {
    const updated = favorites.filter((item) => item.id !== property.id);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
    return false;
  }

  favorites.push(property);
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  return true;
};