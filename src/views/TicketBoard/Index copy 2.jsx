import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DragDropContext } from '@hello-pangea/dnd';
import { Box, Skeleton, useTheme, Fade, Stack, Typography, Chip, alpha } from '@mui/material';
import dayjs from 'dayjs';

import AddTicket from './AddTicket';
import { getAllTickets, updateTicket, optimisticUpdateTicket, getAllTicketsForTeam } from '../../redux/features/Tickets/TicketSlice';
import StatusBoard from './StatusBoard';
import TicketHeader from './TicketHeader';

const TicketBoard = () => {
  const theme = useTheme();
  const dispatch = useDispatch();

  // Get current logged in team member from auth state
  const { user } = useSelector((state) => state.auth || {});
  const { allTickets, isTicketLoading } = useSelector((state) => state.ticket);

  const [openAddTicket, setOpenAddTicket] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    startDate: null,
    endDate: null
  });

  useEffect(() => {
    // dispatch(getAllTickets());

    dispatch(getAllTicketsForTeam());
  }, [dispatch]);

  // For Team Panel: We only show tickets assigned to THIS specific technician
  const filteredTickets = useMemo(() => {
    return allTickets.filter((ticket) => {
      // 1. Mandatory filter: Ticket must be assigned to the logged-in team member
      const isAssignedToMe = ticket.assignedTo?._id === user?._id;

      // 2. Additional UI filters
      const matchesStatus = !filters.status || ticket.status === filters.status;
      const createdDate = dayjs(ticket.createdAt);
      const matchesStartDate = !filters.startDate || createdDate.isAfter(dayjs(filters.startDate).startOf('day'));
      const matchesEndDate = !filters.endDate || createdDate.isBefore(dayjs(filters.endDate).endOf('day'));

      return isAssignedToMe && matchesStatus && matchesStartDate && matchesEndDate;
    });
  }, [allTickets, filters, user?._id]);

  const handleOnDragEnd = (result) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    const movedTicket = allTickets.find((t) => t._id === draggableId);
    if (!movedTicket) return;

    // Team members can only change the STATUS of their own tickets
    const newStatus = destination.droppableId;
    if (movedTicket.status === newStatus) return;

    // Optimistic Update for UI smoothness
    dispatch(optimisticUpdateTicket({ ticketId: draggableId, newStatus }));

    // API call to persist the status change
    dispatch(updateTicket({ id: draggableId, data: { status: newStatus } }));
  };

  return (
    <Box sx={{ bgcolor: '#F4F7FE', height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* 1. Specialized Team Header */}
      <Box
        sx={{
          p: 3,
          bgcolor: 'background.paper',
          borderBottom: `1px solid ${theme.palette.divider}`,
          boxShadow: '0px 4px 12px rgba(0,0,0,0.03)'
        }}
      >
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="h5" fontWeight={800} color="#1B2559">
              My Work Order Board
            </Typography>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.5 }}>
              <Typography variant="body2" color="text.secondary">
                Technician: <b>{user?.firstName || 'Field Agent'}</b>
              </Typography>
              <Chip
                label={`${filteredTickets.length} Active Tasks`}
                size="small"
                sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1), color: 'primary.main', fontWeight: 700 }}
              />
            </Stack>
          </Box>

          <TicketHeader
            title=""
            currentView="status" // Forced to status view for teams
            hideViewSwitcher={true} // You should add this prop to TicketHeader to hide user/status toggle
            onFilterChange={setFilters}
            onAddTicketClick={() => setOpenAddTicket(true)}
          />
        </Stack>
      </Box>

      {/* 2. Kanban Board Area */}
      <Box sx={{ flex: 1, overflowX: 'auto', p: 3 }}>
        <DragDropContext onDragEnd={handleOnDragEnd}>
          {isTicketLoading ? (
            <Stack direction="row" spacing={3} sx={{ height: '100%' }}>
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} variant="rectangular" width={320} height="100%" sx={{ borderRadius: '20px', flexShrink: 0 }} />
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
                      height: '60vh',
                      opacity: 0.6
                    }}
                  >
                    <Typography variant="h6" fontWeight={700}>
                      No Tickets Found
                    </Typography>
                    <Typography variant="body2">You are all caught up for the selected filters.</Typography>
                  </Box>
                ) : (
                  <StatusBoard tickets={filteredTickets} statuses={['open', 'In Progress', 'Escalated', 'closed', 'resolved']} />
                )}
              </Box>
            </Fade>
          )}
        </DragDropContext>
      </Box>

      {/* 3. Modals */}
      <AddTicket open={openAddTicket} handleClose={() => setOpenAddTicket(false)} />
    </Box>
  );
};

export default TicketBoard;
