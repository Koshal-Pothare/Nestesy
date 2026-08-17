const GLOBAL_VISITS_KEY = "upcomingVisits";

const getUserVisitKey = () => {
    const user = JSON.parse(
        localStorage.getItem("nestesyLoggedInUser")
    );

    if (!user) return null;

    return `upcomingVisits_${user.email}`;
};

// Get current user's visits
export const getVisit = () => {
    const key = getUserVisitKey();

    if (!key) return [];

    return JSON.parse(localStorage.getItem(key)) || [];
};

// Get ALL visits - Host/Admin
export const getAllVisits = () => {
    return JSON.parse(
        localStorage.getItem(GLOBAL_VISITS_KEY)
    ) || [];
};

export const bookVisit = (visitData) => {
    const userKey = getUserVisitKey();

    if (!userKey) return false;

   
    // USER-SPECIFIC VISITS
  

    const userVisits = getVisit();

    const userExists = userVisits.some(
        (item) => item.id === visitData.id
    );

    if (userExists) return false;

    userVisits.push(visitData);

    localStorage.setItem(
        userKey,
        JSON.stringify(userVisits)
    );


    // GLOBAL VISITS
  

    const allVisits = getAllVisits();

    allVisits.push(visitData);

    localStorage.setItem(
        GLOBAL_VISITS_KEY,
        JSON.stringify(allVisits)
    );

    return true;
};

// Remove user's visit
export const removeVisitBooking = (id) => {
    const userKey = getUserVisitKey();

    if (!userKey) return;

    const userVisits = getVisit().filter(
        (item) => item.id !== id
    );

    localStorage.setItem(
        userKey,
        JSON.stringify(userVisits)
    );

    // Also remove from global visits
    const allVisits = getAllVisits().filter(
        (item) => item.id !== id
    );

    localStorage.setItem(
        GLOBAL_VISITS_KEY,
        JSON.stringify(allVisits)
    );
};

// Check if current user already booked this property
export const isVisitBooked = (id) => {
    const userKey = getUserVisitKey();

    if (!userKey) return false;

    return getVisit().some(
        (item) => item.id === id
    );
};

// Update visit status
export const updateVisitStatus = (id, status) => {
    // Get all visits
    const allVisits = getAllVisits();

    // Find the visit
    const visit = allVisits.find(
        (item) => item.id === id
    );

    if (!visit) return [];

    // Update global visits
    const updatedVisits = allVisits.map((item) =>
        item.id === id
            ? { ...item, status }
            : item
    );

    localStorage.setItem(
        GLOBAL_VISITS_KEY,
        JSON.stringify(updatedVisits)
    );

    // Find the customer who booked this visit
    const visitorEmail = visit.visitorEmail;

    if (visitorEmail) {
        const userKey = `upcomingVisits_${visitorEmail}`;

        const userVisits =
            JSON.parse(
                localStorage.getItem(userKey)
            ) || [];

        const updatedUserVisits = userVisits.map(
            (item) =>
                item.id === id
                    ? { ...item, status }
                    : item
        );

        localStorage.setItem(
            userKey,
            JSON.stringify(updatedUserVisits)
        );
    }

    return updatedVisits;
};