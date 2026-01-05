// assets/icons.js
import NavigationOutlinedIcon from '@mui/icons-material/NavigationOutlined';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import WifiOutlinedIcon from '@mui/icons-material/WifiOutlined';
import ChromeReaderModeOutlinedIcon from '@mui/icons-material/ChromeReaderModeOutlined';
import AppRegistrationOutlinedIcon from '@mui/icons-material/AppRegistrationOutlined';
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import PersonAddAlt1OutlinedIcon from '@mui/icons-material/PersonAddAlt1Outlined';
import AppsOutlinedIcon from '@mui/icons-material/AppsOutlined';
import ReportProblemOutlinedIcon from '@mui/icons-material/ReportProblemOutlined';
import HourglassEmptyOutlinedIcon from '@mui/icons-material/HourglassEmptyOutlined';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import SecurityOutlinedIcon from '@mui/icons-material/SecurityOutlined';
import InsightsOutlinedIcon from '@mui/icons-material/InsightsOutlined';
import ListAltOutlinedIcon from '@mui/icons-material/ListAltOutlined'; // Added
import CreditCardOutlinedIcon from '@mui/icons-material/CreditCardOutlined'; // Added

export const icons = {
  NavigationOutlinedIcon,
  DashboardOutlinedIcon,
  WifiOutlinedIcon,
  ChromeReaderModeOutlinedIcon,
  AppRegistrationOutlinedIcon,
  CategoryOutlinedIcon,
  PeopleAltOutlinedIcon,
  PersonAddAlt1OutlinedIcon,
  AppsOutlinedIcon,
  ReportProblemOutlinedIcon,
  HourglassEmptyOutlinedIcon,
  HelpOutlineOutlinedIcon,
  SecurityOutlinedIcon,
  InsightsOutlinedIcon,
  ListAltOutlinedIcon,
  CreditCardOutlinedIcon
};

// ==============================|| MENU ITEMS ||============================== //
const menuConfig = {
  items: [
    {
      id: 'navigation',
      title: 'MW FiberNet',
      caption: 'Dashboard & Profile',
      type: 'group',
      icon: icons.NavigationOutlinedIcon,
      children: [
        {
          id: 'dashboard',
          title: 'Dashboard',
          type: 'item',
          icon: icons.DashboardOutlinedIcon,
          url: '/dashboard/default'
        }
      ]
    },
    {
      id: 'pages',
      title: 'Pages & Management',
      type: 'group',
      icon: icons.NavigationOutlinedIcon,
      children: [
        {
          id: 'area-management',
          title: 'Network Area',
          type: 'collapse',
          icon: icons.WifiOutlinedIcon,
          children: [
            {
              id: 'area-view',
              title: 'View Areas / Network',
              type: 'item',
              icon: icons.ChromeReaderModeOutlinedIcon,
              url: '/areas'
            }
          ]
        },
        // {
        //   id: 'team-management',
        //   title: 'Team Management',
        //   type: 'collapse',
        //   icon: icons.PeopleAltOutlinedIcon,
        //   children: [
        //     {
        //       id: 'all-teams',
        //       title: 'All Teams',
        //       type: 'item',
        //       icon: icons.PeopleAltOutlinedIcon,
        //       url: '/team/all'
        //     },
        //     {
        //       id: 'add-team',
        //       title: 'Add Team',
        //       type: 'item',
        //       icon: icons.PersonAddAlt1OutlinedIcon,
        //       url: '/team/create'
        //     }
        //   ]
        // },
        {
          id: 'tickets-management',
          title: 'Tickets & Complaints',
          type: 'collapse',
          icon: icons.ReportProblemOutlinedIcon,
          children: [
            {
              id: 'tickets-list',
              title: 'Tickets List',
              type: 'item',
              icon: icons.ReportProblemOutlinedIcon,
              url: '/tickets-list'
            },
            {
              id: 'tickets-board',
              title: 'Tickets Board',
              type: 'item',
              icon: icons.HourglassEmptyOutlinedIcon,
              url: '/tickets-board'
            }
          ]
        },
        {
          id: 'plans-management',
          title: 'Plans Management',
          type: 'collapse',
          icon: icons.ChromeReaderModeOutlinedIcon,
          children: [
            {
              id: 'all-plans',
              title: 'All Plans',
              type: 'item',
              icon: icons.ChromeReaderModeOutlinedIcon,
              url: '/plans'
            }
            // {
            //   id: 'create-plan',
            //   title: 'Create Plan',
            //   type: 'item',
            //   icon: icons.AppRegistrationOutlinedIcon,
            //   url: '/plan/create'
            // },
            // {
            //   id: 'plans-categories',
            //   title: 'Plans Categories',
            //   type: 'item',
            //   icon: icons.CategoryOutlinedIcon,
            //   url: '/plan/categories'
            // }
          ]
        },
        // {
        //   id: 'customer-management',
        //   title: 'Customer Management',
        //   type: 'collapse',
        //   icon: icons.PeopleAltOutlinedIcon,
        //   children: [
        //     {
        //       id: 'all-customers',
        //       title: 'All Customers',
        //       type: 'item',
        //       icon: icons.PeopleAltOutlinedIcon,
        //       url: '/customers/all'
        //     },
        //     {
        //       id: 'add-customer',
        //       title: 'Add Customer',
        //       type: 'item',
        //       icon: icons.PersonAddAlt1OutlinedIcon,
        //       url: '/customer/add'
        //     },
        //     {
        //       id: 'all-connections',
        //       title: 'All Connections',
        //       type: 'item',
        //       icon: icons.AppRegistrationOutlinedIcon,
        //       url: '/connections'
        //     }
        //   ]
        // },
        {
          id: 'referrals-management',
          title: 'Refferals Management',
          type: 'collapse',
          icon: icons.PeopleAltOutlinedIcon,
          children: [
            {
              id: 'referals-dashboard',
              title: 'Referrals Dashboard',
              type: 'item',
              icon: icons.DashboardOutlinedIcon,
              url: '/referrals'
            },
            // {
            //   id: 'all-leads',
            //   title: 'All Leads',
            //   type: 'item',
            //   icon: icons.ListAltOutlinedIcon,
            //   url: '/leads/all'
            // },
            // {
            //   id: 'add-lead',
            //   title: 'Add Lead',
            //   type: 'item',
            //   icon: icons.PersonAddAlt1OutlinedIcon,
            //   url: '/leads/add'
            // }
          ]
        }
        // {
        //   id: 'billing-management',
        //   title: 'Billing Management',
        //   type: 'collapse',
        //   icon: icons.CreditCardOutlinedIcon,
        //   children: [
        //     {
        //       id: 'all-billing',
        //       title: 'All Billings',
        //       type: 'item',
        //       icon: icons.PeopleAltOutlinedIcon,
        //       url: '/billing'
        //     }
        //     // {
        //     //   id: 'add-billing-customer',
        //     //   title: 'Add Customer',
        //     //   type: 'item',
        //     //   icon: icons.PersonAddAlt1OutlinedIcon,
        //     //   url: '/customer/add'
        //     // },
        //     // {
        //     //   id: 'all-billing-connections',
        //     //   title: 'All Connections',
        //     //   type: 'item',
        //     //   icon: icons.AppRegistrationOutlinedIcon,
        //     //   url: '/connections'
        //     // }
        //   ]
        // }
        // {
        //   id: 'projects-boards',
        //   title: 'Project Boards',
        //   type: 'collapse',
        //   icon: icons.AppsOutlinedIcon,
        //   children: [
        //     {
        //       id: 'project-board',
        //       title: 'Board',
        //       type: 'item',
        //       icon: icons.AppsOutlinedIcon,
        //       url: '/kanban'
        //     }
        //   ]
        // }
      ]
    },
    {
      id: 'utils',
      title: 'Utils',
      type: 'group',
      icon: icons.SecurityOutlinedIcon,
      children: [
        {
          id: 'util-icons',
          title: 'Icons',
          type: 'item',
          icon: icons.InsightsOutlinedIcon,
          external: true
        }
      ]
    },
    {
      id: 'support',
      title: 'Support',
      type: 'group',
      icon: icons.HelpOutlineOutlinedIcon,
      children: [
        {
          id: 'documentation',
          title: 'Documentation',
          type: 'item',
          icon: icons.HelpOutlineOutlinedIcon,
          external: true
        }
      ]
    }
  ]
};

export default menuConfig;
