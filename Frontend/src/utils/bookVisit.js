const getVisitKey = () => {
  const user = JSON.parse(localStorage.getItem("nestesyLoggedInUser"));

  if (!user) return null;

  return `upcomingVisits_${user.email}`;
};

export const getVisit = () => {
  const key = getVisitKey();

  if (!key) return [];

  return JSON.parse(localStorage.getItem(key)) || [];
};

export const bookVisit = (property) => {
  const key = getVisitKey();

  if (!key) return false;

  const visits = getVisit();

  const exists = visits.some(
    (item) => item.id === property.id
  );

  if (exists) return false;

  visits.push(property);

  localStorage.setItem(
    key,
    JSON.stringify(visits)
  );

  return true;
};

export const removeVisitBooking = (id) => {
  const key = getVisitKey();

  if (!key) return;

  const visits = getVisit().filter(
    (item) => item.id !== id
  );

  localStorage.setItem(
    key,
    JSON.stringify(visits)
  );
};

export const isVisitBooked = (id) => {
  const key = getVisitKey();

  if (!key) return false;

  return getVisit().some(
    (item) => item.id === id
  );
};