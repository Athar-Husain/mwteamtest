import { configureStore } from '@reduxjs/toolkit';

import customizationReducer from './features/customization/customizationSlice'; // Import the slice

// import regionReducer from './features/Region/regionSlice';
// import customerReducer from './features/Customers/customerSlice';
import adminReducer from './features/Admin/adminSlice';
import areaReducer from './features/Area/AreaSlice';
import teamReducer from './features/Team/TeamSlice';
import customerReducer from './features/Customers/CustomerSlice';
import connectionReducer from './features/Connection/ConnectionSlice';
import planReducer from './features/Plan/PlanSlice';
import ticketReducer from './features/Tickets/TicketSlice';

import notificationReducer from './features/Notifications/NotificationSlice';
import leadReducer from './features/Leads/LeadSlice';

export const store = configureStore({
  reducer: {
    // region: regionReducer,
    customization: customizationReducer, // Add the slice to the reducer object
    // customer: customerReducer,
    admin: adminReducer,
    area: areaReducer,
    team: teamReducer,
    customer: customerReducer,
    connection: connectionReducer,
    plan: planReducer,
    ticket: ticketReducer,
    notifications: notificationReducer,
    lead: leadReducer
  }
});
