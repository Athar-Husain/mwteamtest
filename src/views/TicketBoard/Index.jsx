import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DragDropContext } from '@hello-pangea/dnd';
import { Box, Skeleton, useTheme, Fade, Stack, Typography, Chip, alpha, Paper, IconButton, Tooltip } from '@mui/material';
import dayjs from 'dayjs';

// Icons for Stats Bar and Refresh
import TimerIcon from '@mui/icons-material/Timer';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import AssignmentIcon from '@mui/icons-material/Assignment';
import RefreshIcon from '@mui/icons-material/Refresh';

import AddTicket from './AddTicket';
import { updateTicket, optimisticUpdateTicket, getAllTicketsForTeam } from '../../redux/features/Tickets/TicketSlice';
import StatusBoard from './StatusBoard';
import TicketHeader from './TicketHeader';
import Loader from '../../component/Loader/Loader';

// --- Enhancement: Quick Stats Bar Component ---
const TeamStatsBar = ({ tickets }) => {
  const theme = useTheme();

  const highPriorityCount = tickets.filter((t) => t.priority?.toLowerCase() === 'high').length;

  // Metric 1: Resolved Today
  const resolvedTodayCount = tickets.filter(
    (t) => (t.status?.toLowerCase() === 'resolved' || t.status?.toLowerCase() === 'closed') && dayjs(t.resolvedAt).isSame(dayjs(), 'day')
  ).length;

  // Metric 2: Today Assigned (Created Today)
  const todayAssignedCount = tickets.filter((t) => dayjs(t.createdAt).isSame(dayjs(), 'day')).length;

  const stats = [
    {
      label: 'ASSIGNED TODAY',
      value: todayAssignedCount,
      icon: <AssignmentIcon />,
      color: theme.palette.info.main,
      bg: alpha(theme.palette.info.main, 0.1)
    },
    {
      label: 'HIGH PRIORITY',
      value: highPriorityCount,
      icon: <HourglassEmptyIcon />,
      color: theme.palette.error.main,
      bg: alpha(theme.palette.error.main, 0.1)
    },
    {
      label: 'RESOLVED TODAY',
      value: resolvedTodayCount,
      icon: <CheckCircleOutlineIcon />,
      color: theme.palette.success.main,
      bg: alpha(theme.palette.success.main, 0.1)
    }
  ];

  return (
    <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
      {stats.map((stat, index) => (
        <Paper
          key={index}
          elevation={0}
          sx={{
            p: 2,
            flex: 1,
            borderRadius: 4,
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            border: `1px solid ${theme.palette.divider}`,
            bgcolor: 'background.paper'
          }}
        >
          <Box sx={{ p: 1, bgcolor: stat.bg, borderRadius: 2, color: stat.color, display: 'flex' }}>{stat.icon}</Box>
          <Box>
            <Typography variant="caption" color="text.secondary" fontWeight={700} sx={{ letterSpacing: 0.5 }}>
              {stat.label}
            </Typography>
            <Typography variant="h6" fontWeight={800} color="text.primary" sx={{ lineHeight: 1.2 }}>
              {stat.value}
            </Typography>
          </Box>
        </Paper>
      ))}
    </Stack>
  );
};

const TicketBoard = () => {
  const theme = useTheme();
  const dispatch = useDispatch();

  const { Team } = useSelector((state) => state.team || {});
  const { allTickets, isTicketLoading } = useSelector((state) => state.ticket);

  const [openAddTicket, setOpenAddTicket] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false); // Local state for refresh animation

  const [filters, setFilters] = useState({
    status: '',
    startDate: null,
    endDate: null
  });

  useEffect(() => {
    dispatch(getAllTicketsForTeam());
  }, [dispatch]);

  // --- Enhancement: Manual Refresh Handler ---
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await dispatch(getAllTicketsForTeam());
    // Artificial delay for better UX feel
    setTimeout(() => setIsRefreshing(false), 600);
  };

  const filteredTickets = useMemo(() => {
    return allTickets.filter((ticket) => {
      const isAssignedToMe = ticket.assignedTo === Team?._id;
      const matchesStatus = !filters.status || ticket.status === filters.status;
      const createdDate = dayjs(ticket.createdAt);
      const matchesStartDate = !filters.startDate || createdDate.isAfter(dayjs(filters.startDate).startOf('day'));
      const matchesEndDate = !filters.endDate || createdDate.isBefore(dayjs(filters.endDate).endOf('day'));

      return isAssignedToMe && matchesStatus && matchesStartDate && matchesEndDate;
    });
  }, [allTickets, filters, Team?._id]);

  // console.log('filteredTickets', filteredTickets);

  const handleOnDragEnd = async (result) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    const movedTicket = allTickets.find((t) => t._id === draggableId);
    if (!movedTicket) return;

    const newStatus = destination.droppableId;
    if (movedTicket.status === newStatus) return;

    dispatch(optimisticUpdateTicket({ ticketId: draggableId, newStatus }));
    dispatch(updateTicket({ id: draggableId, data: { status: newStatus } }));
    await dispatch(getAllTicketsForTeam());
  };

  return (
    <>
      {isTicketLoading ? (
        <Loader />
      ) : (
        <Box sx={{ bgcolor: '#F4F7FE', height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {/* Header */}
          <Box sx={{ p: 1, bgcolor: 'background.paper', borderBottom: `1px solid ${theme.palette.divider}` }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Box>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Typography variant="h5" fontWeight={500} color="#1B2559">
                    My Work Order Board
                  </Typography>
                  <Tooltip title="Refresh Tickets">
                    <IconButton
                      onClick={handleRefresh}
                      disabled={isRefreshing || isTicketLoading}
                      sx={{
                        animation: isRefreshing ? 'spin 1s linear infinite' : 'none',
                        '@keyframes spin': {
                          '0%': { transform: 'rotate(0deg)' },
                          '100%': { transform: 'rotate(360deg)' }
                        }
                      }}
                    >
                      <RefreshIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Stack>

                <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.5 }}>
                  <Typography variant="body2" color="text.secondary">
                    Technician: <b>{Team?.firstName || 'Field Agent'}</b>
                  </Typography>
                  <Chip
                    label={`${filteredTickets.length} Total Tasks`}
                    size="small"
                    sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1), color: 'primary.main', fontWeight: 700 }}
                  />
                </Stack>
              </Box>

              <TicketHeader
                title=""
                currentView="status"
                hideViewSwitcher={true}
                onFilterChange={setFilters}
                onAddTicketClick={() => setOpenAddTicket(true)}
              />
            </Stack>
          </Box>

          {/* Board Content */}
          <Box sx={{ flex: 1, overflowX: 'auto', p: 3 }}>
            <TeamStatsBar tickets={filteredTickets} />

            <DragDropContext onDragEnd={handleOnDragEnd}>
              {isTicketLoading && !isRefreshing ? (
                <Stack direction="row" spacing={3} sx={{ height: '100%' }}>
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} variant="rectangular" width={320} height="100%" sx={{ borderRadius: 4, flexShrink: 0 }} />
                  ))}
                </Stack>
              ) : (
                <Fade in timeout={500}>
                  <Box sx={{ height: '100%' }}>
                    {filteredTickets.length === 0 ? (
                      <Box
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          height: '50vh',
                          opacity: 0.6
                        }}
                      >
                        <Typography variant="h6" fontWeight={700}>
                          No Tickets Found
                        </Typography>
                        <Typography variant="body2">You're all caught up for these filters.</Typography>
                      </Box>
                    ) : (
                      <StatusBoard tickets={filteredTickets} statuses={['Open', 'In Progress', 'escalated', 'resolved']} />
                    )}
                  </Box>
                </Fade>
              )}
            </DragDropContext>
          </Box>

          <AddTicket open={openAddTicket} handleClose={() => setOpenAddTicket(false)} />
        </Box>
      )}
    </>
  );
};

export default TicketBoard;
