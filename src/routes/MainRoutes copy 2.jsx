import React from 'react';
import Loadable from '../component/Loadable';
import { lazy } from 'react';
import Profile from '../views/Profile/Index';
import AllCustomers from '../views/Customers/All';
import AddCustomer from '../views/Customers/Add';
import SuspendedCustomer from '../views/Customers/Suspended';

// Teams
import AllTeam from '../views/TeamManagement/All';
import AddTeam from '../views/TeamManagement/AddTeam';
import SuspendedTeam from '../views/TeamManagement/Suspended';

import TeamRoles from '../views/TeamManagement/TeamRoles';

// Admin
import SusPendedAdmin from '../views/AdminManagement/Suspended';
import AllAdmin from '../views/AdminManagement/All';
import CreateAdmin from '../views/AdminManagement/CreateAdmin';
import RegionList from '../views/Regions/RegioList';

import AdminRoles from '../views/AdminManagement/AdminRoles';

// SetupBox
import SetupBoxList from '../views/SetupBox/All';
import AddSetupBox from '../views/SetupBox/AddSetupBox';
import SuspendedSetupBox from '../views/SetupBox/Suspended';

// ..packages
// import AllPackages from '../views/Packages/AllPackages';
import AddPackage from '../views/Packages/AddPackage';
import ActivePackages from '../views/Packages/ActivePackages';
import FeaturedPackages from '../views/Packages/FeaturedPackages';

// Payment
import PaymentsOverview from '../views/Payment/PaymentOverview';
import AllPayments from '../views/Payment/All';
import Invoices from '../views/Payment/Invoice';
import Transactions from '../views/Payment/Transactions';
import PendingPayments from '../views/Payment/PendingPayments';
import PaymentsHistory from '../views/Payment/PaymentHistory';
import Refunds from '../views/Payment/Refunds';

// Refferrals
import RewardManagement from '../views/Referral/Rewards';
import TaskBoard from '../views/Tasks/TaskBorads';
import Projects from '../views/Projects';
import ProjectBoard from '../views/Projects/Board/Index';
import Gem from '../views/Projects/Gem';
import NetworkStatusManager from '../views/NetworkStatus/Network';
import RegionForm from '../views/Regions/RegionForm';
// import Tickets from '../views/Tickets/Tickets';
import KanbanBoard from '../views/Kanban/Kanban';
import KanbanBoard2 from '../views/ProjectBoard/Index';
// import SupportTicketDetail from '../views/Support/SupportTicketDetail/SupportTicketDetail';
import ConnectionForm from '../views/Customers/ConnectionForm';
import PrivateRoute from './PrivateRoute';
import Network from '../views/Regions/Network';
import TeamDetails from '../views/TeamManagement/TeamDetails';
import AddCustomer4 from '../views/AdCustomer/Index';
import PlanCategory from '../views/Packages/PlanCategory';
import AllPlans from '../views/Packages/AllPlans';
import CreatePlan from '../views/Packages/CreatePlan';
import EditPlan from '../views/Packages/EditPlan';

import TicketBoard from '../views/TicketBoard/Index';
import TicketsList from '../views/TicketBoard/TicketsList';
// import TicketDetails from '../views/Support/TicketDetails/TicketDetails';
import TicketDetails from '../views/TicketDetail/Index';

// Import existing screens
const DashboardDefault = Loadable(lazy(() => import('../views/Dashboard/Default')));
const UtilsTypography = Loadable(lazy(() => import('../views/Utils/Typography')));
const SamplePage = Loadable(lazy(() => import('../views/SamplePage')));
const RegisterComplaintScreen = Loadable(lazy(() => import('../views/Complaints/RegisterComplaintScreen')));
const TrackComplaintScreen = Loadable(lazy(() => import('../views/Complaints/TrackComplaintScreen')));
const ReferScreen = Loadable(lazy(() => import('../views/Referral/ReferScreen')));
const ReferralTrackingScreen = Loadable(lazy(() => import('../views/Referral/ReferralTrackingScreen')));
const MakePaymentScreen = Loadable(lazy(() => import('../views/Payment/MakePaymentScreen')));
const PaymentHistoryScreen = Loadable(lazy(() => import('../views/Payment/PaymentHistoryScreen')));

// Reusable Placeholder
const ProfileScreen = Loadable(lazy(() => import('../views/Profile/Profile')));

// Layout
const MainLayout = Loadable(lazy(() => import('../layout/MainLayout')));

// ==============================|| MAIN ROUTES ||============================== //

const MainRoutes = [
  {
    path: '/',
    element: <PrivateRoute />,
    children: [
      {
        path: '/',
        element: <MainLayout />,

        children: [
          { path: '/', element: <DashboardDefault /> },
          { path: '/dashboard/default', element: <DashboardDefault /> },
          { path: '/Home', element: <DashboardDefault /> },
          { path: '/profile', element: <Profile /> },

          { path: '/areas', element: <RegionList /> },
          { path: '/areas/:id/view', element: <RegionForm mode="view" /> },
          { path: '/areas/:id/edit', element: <RegionForm mode="edit" /> },
          { path: '/areas/:id/create', element: <RegionForm mode="create" /> },

          // teams

          { path: '/team/all', element: <AllTeam /> },
          { path: '/team/:id', element: <TeamDetails /> },
          { path: '/team/create', element: <AddTeam /> },
          { path: '/team/suspended', element: <SuspendedTeam /> },
          { path: '/team/roles', element: <TeamRoles /> },

          { path: '/customer/add', element: <AddCustomer4 /> },

          // Typography & Sample
          { path: '/utils/util-typography', element: <UtilsTypography /> },
          { path: '/sample-page', element: <SamplePage /> },

          //       <Route path="/regions/:id/view" element={<RegionForm mode="view" />} />
          // <Route path="/regions/:id/edit" element={<RegionForm mode="edit" />} />
          // <Route path="/regions/create" element={<RegionForm mode="create" />} />

          { path: '/network3', element: <Network /> },

          // Complaints (Customer)
          { path: '/complaints/registerComplaint', element: <RegisterComplaintScreen /> },
          { path: '/complaints/trackcomplaints', element: <TrackComplaintScreen /> },

          // Payments (Customer)
          { path: '/payment/makePayment', element: <MakePaymentScreen /> },
          { path: '/payment/paymenthistory', element: <PaymentHistoryScreen /> },

          // Packages
          // { path: '/packages', element: <PackagesScreen /> },

          // Referrals (Customer)
          { path: '/referral/referafriend', element: <ReferScreen /> },
          { path: '/referral/trackReferral', element: <ReferralTrackingScreen /> },
          //tickets
          { path: '/tickets-list', element: <TicketsList /> },
          { path: '/tickets-board', element: <TicketBoard /> },
          { path: '/ticket/:ticketId', element: <TicketDetails /> },
          // { path: '/ticketdetails', element: <SupportTicketDetail /> },

          // { path: '/ticket/:ticketId', element: <SupportTicketDetail /> },

          // Placeholder Routes (Admin - using ProfileScreen)
          // Placeholder Routes (Admin - using ProfileScreen)
          { path: '/projects/projects', element: <Projects /> },
          { path: '/kanban', element: <KanbanBoard2 /> },
          // { path: '/kanban3', element: <KanbanBoard /> },
          { path: '/projects/test', element: <Gem /> },
          { path: '/projects/Board', element: <ProjectBoard /> },
          { path: '/projects/allprojects', element: <ProfileScreen /> },
          { path: '/projects/create-project', element: <ProfileScreen /> },

          { path: '/tasks/allTasks', element: <TaskBoard /> },

          { path: '/complaints/all', element: <ProfileScreen /> },
          { path: '/complaints/open', element: <ProfileScreen /> },
          { path: '/complaints/resolved', element: <ProfileScreen /> },
          { path: '/complaints/issues', element: <ProfileScreen /> },

          { path: '/customers/all', element: <AllCustomers /> },
          { path: '/customers/add', element: <ConnectionForm /> },
          { path: '/customers/create', element: <AddCustomer /> },
          { path: '/customers/suspended', element: <SuspendedCustomer /> },

          { path: '/admin/all', element: <AllAdmin /> },
          { path: '/admin/create', element: <CreateAdmin /> },
          { path: '/admin/suspended', element: <SusPendedAdmin /> },
          { path: '/admin/roles', element: <AdminRoles /> },

          { path: '/network/all', element: <NetworkStatusManager /> },

          { path: '/setupbox/all', element: <SetupBoxList /> },
          { path: '/setupbox/create', element: <AddSetupBox /> },
          { path: '/setupbox/suspended', element: <SuspendedSetupBox /> },

          { path: '/plans', element: <AllPlans /> },
          { path: '/plan/create', element: <CreatePlan /> },
          { path: '/plan/edit/:id', element: <EditPlan /> },
          { path: 'plan/categories', element: <PlanCategory /> },

          { path: '/packages/create', element: <AddPackage /> },
          { path: '/packages/active', element: <ActivePackages /> },
          { path: '/packages/featured', element: <FeaturedPackages /> },

          { path: '/payments/all', element: <AllPayments /> },
          { path: '/payments/overview', element: <PaymentsOverview /> },
          { path: '/payments/invoices', element: <Invoices /> },
          { path: '/payments/transactions', element: <Transactions /> },
          { path: '/payments/pending', element: <PendingPayments /> },
          { path: '/payments/history', element: <PaymentsHistory /> },
          { path: '/payments/refunds', element: <Refunds /> },

          { path: '/referrals/overview', element: <ProfileScreen /> },
          { path: '/referrals/users', element: <ProfileScreen /> },
          { path: '/referrals/rewards', element: <RewardManagement /> }

          // Authentication
          // { path: '/application/login', element: <ProfileScreen /> },
          // { path: '/application/register', element: <ProfileScreen /> }
        ]
      }
    ]
  }
];

export default MainRoutes;
