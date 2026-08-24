const getItemId = (item) => {
  if (!item) return "";
  if (typeof item === "string") return item;
  return String(item.propertyId || item._id || item.id || "");
};

const getFavoriteKey = () => {
  try {
    const user =
      JSON.parse(localStorage.getItem("nestesyLoggedInUser")) ||
      JSON.parse(localStorage.getItem("nestesyUser"));

    if (user && user.email) {
      return `favorites_${user.email}`;
    }
  } catch {
    // fallback
  }

  return "favorites_guest";
};

export const getFavorites = () => {
  const key = getFavoriteKey();
  try {
    const data = localStorage.getItem(key);
    let favs = data ? JSON.parse(data) : [];

    // If empty, check fallback keys
    if (!Array.isArray(favs) || favs.length === 0) {
      const fallbackKeys = ["favorites_guest", "favorites", "wishlist"];
      for (const fKey of fallbackKeys) {
        if (fKey !== key) {
          const raw = localStorage.getItem(fKey);
          if (raw) {
            try {
              const parsed = JSON.parse(raw);
              if (Array.isArray(parsed) && parsed.length > 0) {
                favs = parsed;
                // Auto-sync into user key
                localStorage.setItem(key, JSON.stringify(favs));
                break;
              }
            } catch {}
          }
        }
      }
    }
    return Array.isArray(favs) ? favs : [];
  } catch {
    return [];
  }
};

export const addToFavorites = (property) => {
  const key = getFavoriteKey();
  const propertyId = getItemId(property);
  if (!propertyId) return false;

  const favorites = getFavorites();
  const exists = favorites.some((item) => getItemId(item) === propertyId);

  if (!exists) {
    favorites.push({
      ...property,
      id: propertyId,
      _id: propertyId,
      propertyId: propertyId,
    });

    localStorage.setItem(key, JSON.stringify(favorites));
    localStorage.setItem("favorites", JSON.stringify(favorites));

    window.dispatchEvent(new CustomEvent("favoritesUpdated"));
  }

  return true;
};

export const removeFromFavorites = (id) => {
  const key = getFavoriteKey();
  const targetId = getItemId(id);
  if (!targetId) return;

  const favorites = getFavorites().filter((item) => getItemId(item) !== targetId);

  localStorage.setItem(key, JSON.stringify(favorites));
  localStorage.setItem("favorites", JSON.stringify(favorites));

  window.dispatchEvent(new CustomEvent("favoritesUpdated"));
};

export const isFavorite = (id) => {
  const targetId = getItemId(id);
  if (!targetId) return false;

  return getFavorites().some((item) => getItemId(item) === targetId);
};

export const toggleFavorite = (property) => {
  const key = getFavoriteKey();
  const propertyId = getItemId(property);
  if (!propertyId) return null;

  const favorites = getFavorites();
  const exists = favorites.some((item) => getItemId(item) === propertyId);

  if (exists) {
    const updated = favorites.filter((item) => getItemId(item) !== propertyId);
    localStorage.setItem(key, JSON.stringify(updated));
    localStorage.setItem("favorites", JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent("favoritesUpdated"));
    return false;
  }

  favorites.push({
    ...property,
    id: propertyId,
    _id: propertyId,
    propertyId: propertyId,
  });

  localStorage.setItem(key, JSON.stringify(favorites));
  localStorage.setItem("favorites", JSON.stringify(favorites));
  window.dispatchEvent(new CustomEvent("favoritesUpdated"));
  return true;
};