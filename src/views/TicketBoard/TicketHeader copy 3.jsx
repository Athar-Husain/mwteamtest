import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Select,
  MenuItem,
  FormControl,
  Button,
  Stack,
  Tooltip,
  IconButton,
  ToggleButton,
  ToggleButtonGroup,
  Divider,
  alpha,
  useTheme,
  Badge,
  InputBase,
  Paper,
  Collapse,
  useMediaQuery
} from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import PeopleIcon from '@mui/icons-material/People';
import AddIcon from '@mui/icons-material/Add';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import CloseIcon from '@mui/icons-material/Close';

const STATUSES = [
  { label: 'All Statuses', value: '' },
  { label: 'Open', value: 'Open' },
  { label: 'In Progress', value: 'In Progress' },
  { label: 'Escalated', value: 'escalated' },
  { label: 'Resolved', value: 'resolved' },
  { label: 'Closed', value: 'closed' }
];

const TicketHeader = ({
  currentView,
  onViewChange,
  title = 'Tickets',
  onFilterChange,
  onAddTicketClick,
  hideViewSwitcher = false,
  enableSearch = true // Allow disabling search if needed
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const [filters, setFilters] = useState({
    status: '',
    startDate: null,
    endDate: null,
    search: ''
  });

  const [showFilters, setShowFilters] = useState(!isMobile); // Open by default on desktop
  const [activeFilterCount, setActiveFilterCount] = useState(0);

  useEffect(() => {
    let count = 0;
    if (filters.status) count++;
    if (filters.startDate) count++;
    if (filters.endDate) count++;
    if (filters.search.trim()) count++;
    setActiveFilterCount(count);
  }, [filters]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    if (onFilterChange) onFilterChange(newFilters);
  };

  const handleResetFilters = () => {
    const reset = { status: '', startDate: null, endDate: null, search: '' };
    setFilters(reset);
    if (onFilterChange) onFilterChange(reset);
  };

  const toggleFilters = () => setShowFilters((prev) => !prev);

  return (
    <Box sx={{ width: '100%', overflowX: 'auto', pb: isMobile ? 1 : 0 }}>
      {/* Top Bar: Title, View Switcher, Primary Actions */}
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        alignItems={{ xs: 'stretch', md: 'center' }}
        justifyContent="space-between"
        spacing={{ xs: 2, md: 3 }}
        sx={{ mb: 1 }}
      >
        {/* Left: Title + View Switcher */}
        <Stack direction="row" alignItems="center" spacing={2} sx={{ minWidth: 0 }}>
          {!hideViewSwitcher && !isSmallScreen && (
            <>
              {title && (
                <Typography
                  variant={isMobile ? 'h6' : 'h5'}
                  sx={{
                    fontWeight: 800,
                    color: 'text.primary',
                    letterSpacing: -0.5,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                >
                  {title}
                </Typography>
              )}

              {!isSmallScreen && (
                <>
                  <Divider orientation="vertical" flexItem sx={{ height: 28 }} />
                  <ToggleButtonGroup
                    value={currentView}
                    exclusive
                    onChange={(e, val) => val && onViewChange(val)}
                    size="small"
                    sx={{
                      bgcolor: alpha(theme.palette.primary.main, 0.08),
                      '& .MuiToggleButton-root': {
                        px: 2,
                        py: 0.8,
                        border: 'none',
                        borderRadius: '8px !important',
                        textTransform: 'none',
                        fontWeight: 600,
                        '&.Mui-selected': {
                          bgcolor: 'background.paper',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
                          color: 'primary.main'
                        }
                      }
                    }}
                  >
                    <ToggleButton value="status">
                      <DashboardIcon sx={{ fontSize: 18, mr: 1 }} />
                      Status
                    </ToggleButton>
                    <ToggleButton value="user">
                      <PeopleIcon sx={{ fontSize: 18, mr: 1 }} />
                      Team
                    </ToggleButton>
                  </ToggleButtonGroup>
                </>
              )}
            </>
          )}

          {/* Mobile: Title only on left */}
          {isSmallScreen && title && (
            <Typography variant="h6" sx={{ fontWeight: 800 }}>
              {title}
            </Typography>
          )}
        </Stack>

        {/* Right: New Ticket + Filter Toggle (Mobile) */}
        <Stack direction="row" spacing={1} alignItems="center">
          {isMobile && (
            <Tooltip title={showFilters ? 'Hide filters' : 'Show filters'}>
              <IconButton
                onClick={toggleFilters}
                color="primary"
                sx={{
                  bgcolor: alpha(theme.palette.primary.main, activeFilterCount > 0 ? 0.15 : 0.08),
                  border: `1px solid ${activeFilterCount > 0 ? theme.palette.primary.main : theme.palette.divider}`
                }}
              >
                <Badge badgeContent={activeFilterCount} color="primary">
                  {showFilters ? <CloseIcon /> : <FilterListIcon />}
                </Badge>
              </IconButton>
            </Tooltip>
          )}

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={onAddTicketClick}
            size={isMobile ? 'medium' : 'large'}
            sx={{
              borderRadius: '12px',
              textTransform: 'none',
              fontWeight: 700,
              px: { xs: 2.5, md: 3 },
              minWidth: { xs: 'auto', md: 140 },
              boxShadow: `0 4px 14px ${alpha(theme.palette.primary.main, 0.3)}`,
              whiteSpace: 'nowrap'
            }}
          >
            {isSmallScreen ? 'New' : 'New Ticket'}
          </Button>
        </Stack>
      </Stack>

      {/* Filters Section - Collapsible on Mobile */}
      <Collapse in={showFilters || !isMobile} timeout="auto" unmountOnExit>
        <Paper
          elevation={0}
          sx={{
            p: 2,
            borderRadius: '16px',
            bgcolor: alpha(theme.palette.background.paper, 0.8),
            border: `1px solid ${theme.palette.divider}`,
            backdropFilter: 'blur(10px)'
          }}
        >
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ xs: 'stretch', sm: 'center' }}>
            {/* Search Field */}
            {enableSearch && (
              <Paper
                sx={{
                  p: '4px 12px',
                  display: 'flex',
                  alignItems: 'center',
                  width: { xs: '100%', sm: 280 },
                  bgcolor: alpha(theme.palette.grey[100], 0.6),
                  border: `1px solid ${theme.palette.divider}`
                }}
              >
                <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />
                <InputBase
                  placeholder="Search tickets..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange({ ...filters, search: e.target.value })}
                  sx={{ flex: 1 }}
                  inputProps={{ 'aria-label': 'search tickets' }}
                />
              </Paper>
            )}

            {/* Date Range */}
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Stack direction="row" spacing={1} sx={{ width: { xs: '100%', sm: 'auto' } }}>
                <DatePicker
                  label="From"
                  value={filters.startDate}
                  onChange={(v) => handleFilterChange({ ...filters, startDate: v })}
                  slotProps={{
                    textField: {
                      size: 'small',
                      sx: { minWidth: { xs: '100%', sm: 130 } }
                    }
                  }}
                />
                <DatePicker
                  label="To"
                  value={filters.endDate}
                  onChange={(v) => handleFilterChange({ ...filters, endDate: v })}
                  slotProps={{
                    textField: {
                      size: 'small',
                      sx: { minWidth: { xs: '100%', sm: 130 } }
                    }
                  }}
                />
              </Stack>
            </LocalizationProvider>

            {/* Status Dropdown */}
            <FormControl size="small" sx={{ minWidth: { xs: '100%', sm: 160 } }}>
              <Select
                value={filters.status}
                displayEmpty
                onChange={(e) => handleFilterChange({ ...filters, status: e.target.value })}
                sx={{
                  borderRadius: '8px',
                  bgcolor: 'background.paper'
                }}
              >
                {STATUSES.map(({ label, value }) => (
                  <MenuItem key={value || 'all'} value={value}>
                    {label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Reset Button */}
            {activeFilterCount > 0 && (
              <Button
                onClick={handleResetFilters}
                startIcon={<RestartAltIcon />}
                variant="outlined"
                color="inherit"
                sx={{
                  borderRadius: '12px',
                  textTransform: 'none',
                  minWidth: 100
                }}
              >
                Clear
              </Button>
            )}
          </Stack>
        </Paper>
      </Collapse>

      {/* Mobile View Switcher (shown below when filters collapsed) */}
      {isSmallScreen && !hideViewSwitcher && (
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
          <ToggleButtonGroup value={currentView} exclusive onChange={(e, val) => val && onViewChange(val)} size="small">
            <ToggleButton value="status">
              <DashboardIcon sx={{ mr: 1 }} /> Status
            </ToggleButton>
            <ToggleButton value="user">
              <PeopleIcon sx={{ mr: 1 }} /> Team
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>
      )}
    </Box>
  );
};

export default TicketHeader;
