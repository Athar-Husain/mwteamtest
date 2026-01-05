import React from 'react';
import { Paper, Typography, Box, Chip, Tooltip, Avatar, Stack, alpha, Divider, IconButton } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import TimerIcon from '@mui/icons-material/Timer';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty'; // Waiting icon
import RouterIcon from '@mui/icons-material/Router';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);
dayjs.extend(duration);

const getPriorityStyles = (priority, theme) => {
  const p = priority?.toLowerCase();
  switch (p) {
    case 'low':
      return { color: theme.palette.success.main, bg: alpha(theme.palette.success.main, 0.1) };
    case 'medium':
      return { color: theme.palette.warning.main, bg: alpha(theme.palette.warning.main, 0.1) };
    case 'high':
      return { color: theme.palette.error.main, bg: alpha(theme.palette.error.main, 0.1) };
    default:
      return { color: theme.palette.grey[500], bg: alpha(theme.palette.grey[500], 0.1) };
  }
};

const TicketCard = ({ ticket }) => {
  const theme = useTheme();
  const styles = getPriorityStyles(ticket.priority, theme);
  const isFinished = ['resolved', 'closed'].includes(ticket.status?.toLowerCase());

  // --- Combined Time Logic (Waiting or Resolved) ---
  const getTimeStats = () => {
    const start = dayjs(ticket.createdAt);
    const end = isFinished ? dayjs(ticket.resolvedAt) : dayjs(); // Use 'now' if not resolved
    const diffInMinutes = end.diff(start, 'minute');

    let timeString = '';
    if (diffInMinutes < 60) timeString = `${diffInMinutes}m`;
    else if (diffInMinutes < 1440) timeString = `${Math.floor(diffInMinutes / 60)}h ${diffInMinutes % 60}m`;
    else timeString = `${Math.floor(diffInMinutes / 1440)}d ${Math.floor((diffInMinutes % 1440) / 60)}h`;

    return {
      timeString,
      isOverdue: diffInMinutes > 1440 && !isFinished, // Flag if waiting > 24h
      rawMinutes: diffInMinutes
    };
  };

  const stats = getTimeStats();

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        mb: 2,
        borderRadius: 4,
        position: 'relative',
        cursor: 'grab',
        bgcolor: '#fff',
        border: `1px solid ${theme.palette.divider}`,
        borderLeft: ticket.priority === 'high' ? `4px solid ${theme.palette.error.main}` : `1px solid ${theme.palette.divider}`,
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          borderColor: theme.palette.primary.light,
          boxShadow: '0 12px 24px rgba(112, 144, 176, 0.12)',
          transform: 'translateY(-4px)'
        }
      }}
    >
      {/* Header: Priority & Dynamic Timer */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.5 }}>
        <Chip
          label={ticket.priority?.toUpperCase()}
          size="small"
          sx={{ height: 20, fontSize: '0.65rem', fontWeight: 800, color: styles.color, bgcolor: styles.bg }}
        />

        <Tooltip title={isFinished ? 'Time to Resolve' : 'Current Waiting Time'}>
          <Chip
            icon={isFinished ? <TimerIcon sx={{ fontSize: 12 }} /> : <HourglassEmptyIcon sx={{ fontSize: 12 }} />}
            label={stats.timeString}
            size="small"
            sx={{
              height: 22,
              fontSize: '0.7rem',
              fontWeight: 700,
              bgcolor: isFinished
                ? alpha(theme.palette.success.main, 0.1)
                : stats.isOverdue
                  ? alpha(theme.palette.error.main, 0.1)
                  : alpha(theme.palette.info.main, 0.1),
              color: isFinished ? 'success.dark' : stats.isOverdue ? 'error.main' : 'info.main',
              border: '1px solid',
              borderColor: 'inherit'
            }}
          />
        </Tooltip>
      </Stack>

      {/* Customer Info Section */}
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 1 }}>
        <Box>
          <Typography variant="subtitle2" fontWeight={800} color="#1B2559">
            {ticket.connection?.userName || 'N/A'}
          </Typography>
          <Stack direction="row" spacing={0.5} alignItems="center">
            <RouterIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
            <Typography variant="caption" fontWeight={600} color="text.secondary">
              BOX: {ticket.connection?.boxId || 'N/A'}
            </Typography>
          </Stack>
        </Box>
        <IconButton size="small" onClick={() => navigator.clipboard.writeText(ticket.connection?.userName)}>
          <ContentCopyIcon sx={{ fontSize: 14 }} />
        </IconButton>
      </Stack>

      <Typography
        variant="body2"
        color="text.secondary"
        sx={{
          mb: 2,
          fontSize: '0.8rem',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden'
        }}
      >
        {ticket.description}
      </Typography>

      <Divider sx={{ mb: 1.5, borderStyle: 'dashed' }} />

      {/* Footer: Status & Created Date */}
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Chip
            label={ticket.status}
            size="small"
            sx={{ borderRadius: '4px', fontSize: '9px', fontWeight: 700, textTransform: 'uppercase', height: 18 }}
          />
        </Box>

        <Stack direction="row" spacing={0.5} alignItems="center" sx={{ color: 'text.disabled' }}>
          <AccessTimeIcon sx={{ fontSize: 14 }} />
          <Typography variant="caption" fontWeight={600}>
            {dayjs(ticket.createdAt).format('DD MMM')}
          </Typography>
        </Stack>
      </Stack>
    </Paper>
  );
};

export default TicketCard;
