const getFavoriteKey = () => {
  const user = JSON.parse(localStorage.getItem("nestesyLoggedInUser"));

  if (!user) return null;

  return `favorites_${user.email}`;
};

export const getFavorites = () => {
  const key = getFavoriteKey();

  if (!key) return [];

  return JSON.parse(localStorage.getItem(key)) || [];
};

export const addToFavorites = (property) => {
  const key = getFavoriteKey();

  if (!key) return false;

  const favorites = getFavorites();

  const exists = favorites.some(
    (item) => item.id === property.id
  );

  if (!exists) {
    favorites.push(property);

    localStorage.setItem(
      key,
      JSON.stringify(favorites)
    );
  }

  return true;
};

export const removeFromFavorites = (id) => {
  const key = getFavoriteKey();

  if (!key) return;

  const favorites = getFavorites().filter(
    (item) => item.id !== id
  );

  localStorage.setItem(
    key,
    JSON.stringify(favorites)
  );
};

export const isFavorite = (id) => {
  const key = getFavoriteKey();

  if (!key) return false;

  return getFavorites().some(
    (item) => item.id === id
  );
};

export const toggleFavorite = (property) => {
  const key = getFavoriteKey();

  if (!key) return null;

  const favorites = getFavorites();

  const exists = favorites.some(
    (item) => item.id === property.id
  );

  if (exists) {
    const updated = favorites.filter(
      (item) => item.id !== property.id
    );

    localStorage.setItem(
      key,
      JSON.stringify(updated)
    );

    return false;
  }

  favorites.push(property);

  localStorage.setItem(
    key,
    JSON.stringify(favorites)
  );

  return true;
};