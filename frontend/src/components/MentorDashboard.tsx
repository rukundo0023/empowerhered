// MentorDashboard.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  List,
  ListItem,
  ListItemText,
  Divider,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
} from '@mui/material';

interface Mentee {
  id: string;
  name: string;
  email: string;
  progress: number;
  lastMeeting: string;
}

interface Meeting {
  id: string;
  menteeName: string;
  date: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
}

const MentorDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mentees, setMentees] = useState<Mentee[]>([]);
  const [upcomingMeetings, setUpcomingMeetings] = useState<Meeting[]>([]);
  const [stats, setStats] = useState({
    totalMentees: 0,
    activeMentees: 0,
    completedMeetings: 0,
    pendingMeetings: 0,
  });

  const [selectedTab, setSelectedTab] = useState(0);

  // Load tab selection from localStorage on mount
  useEffect(() => {
    const storedTab = localStorage.getItem('selectedTab');
    if (storedTab) {
      setSelectedTab(parseInt(storedTab));
    }
  }, []);

  // Save selected tab to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('selectedTab', selectedTab.toString());
  }, [selectedTab]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [menteesRes, meetingsRes, statsRes] = await Promise.all([
          axios.get('/api/mentors/mentees'),
          axios.get('/api/mentors/meetings'),
          axios.get('/api/mentors/stats'),
        ]);
        setMentees(Array.isArray(menteesRes.data) ? menteesRes.data : []);
        setUpcomingMeetings(Array.isArray(meetingsRes.data) ? meetingsRes.data : []);
        setStats(statsRes.data || {});
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Mentor Dashboard
      </Typography>

      {/* Stats */}
      <Box display="grid" gridTemplateColumns={{ xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr 1fr' }} gap={3} mb={4}>
        {[
          { label: 'Total Mentees', value: stats.totalMentees, color: '#e3f2fd', textColor: 'primary' },
          { label: 'Active Mentees', value: stats.activeMentees, color: '#f3e5f5', textColor: 'secondary' },
          { label: 'Completed Meetings', value: stats.completedMeetings, color: '#e8f5e9', textColor: 'success.main' },
          { label: 'Pending Meetings', value: stats.pendingMeetings, color: '#fff3e0', textColor: 'warning.main' },
        ].map((stat, index) => (
          <Box key={index} sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 140, bgcolor: stat.color, borderRadius: 2, boxShadow: 1 }}>
            <Typography component="h2" variant="h6" color={stat.textColor} gutterBottom>
              {stat.label}
            </Typography>
            <Typography component="p" variant="h4">
              {stat.value}
            </Typography>
          </Box>
        ))}
      </Box>

      {/* Tabs */}
      <Tabs
        value={selectedTab}
        onChange={(_, newValue) => setSelectedTab(newValue)}
        indicatorColor="primary"
        textColor="primary"
        sx={{ mb: 3 }}
      >
        <Tab label="My Mentees" />
        <Tab label="Upcoming Meetings" />
      </Tabs>

      {/* Tab Panels */}
      {selectedTab === 0 && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              My Mentees
            </Typography>
            <List>
              {mentees.length > 0 ? (
                mentees.map((mentee) => (
                  <React.Fragment key={mentee.id}>
                    <ListItem
                      secondaryAction={
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => navigate(`/mentor/mentee/${mentee.id}`)}
                        >
                          View Details
                        </Button>
                      }
                    >
                      <ListItemText
                        primary={mentee.name}
                        secondary={`Progress: ${mentee.progress}% | Last Meeting: ${mentee.lastMeeting}`}
                      />
                    </ListItem>
                    <Divider />
                  </React.Fragment>
                ))
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No mentees available.
                </Typography>
              )}
            </List>
          </CardContent>
        </Card>
      )}

      {selectedTab === 1 && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Upcoming Meetings
            </Typography>
            <List>
              {upcomingMeetings.length > 0 ? (
                upcomingMeetings.map((meeting) => (
                  <React.Fragment key={meeting.id}>
                    <ListItem
                      secondaryAction={
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => navigate(`/mentor/meeting/${meeting.id}`)}
                        >
                          View Details
                        </Button>
                      }
                    >
                      <ListItemText
                        primary={meeting.menteeName}
                        secondary={`Date: ${meeting.date} | Status: ${meeting.status}`}
                      />
                    </ListItem>
                    <Divider />
                  </React.Fragment>
                ))
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No upcoming meetings.
                </Typography>
              )}
            </List>
          </CardContent>
        </Card>
      )}
    </Container>
  );
};

export default MentorDashboard;
