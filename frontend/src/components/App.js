// src/App.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Grid, Button, TextField, Paper, Typography } from '@mui/material';
import Section from './components/Section';

const App = () => {
    const [sections, setSections] = useState([]);
    const [newSectionTitle, setNewSectionTitle] = useState('');

    useEffect(() => {
        axios.get('/api/sections')
            .then(response => {
                setSections(response.data);
            })
            .catch(error => {
                console.error('Error fetching sections:', error);
            });
    }, []);

    const addSection = () => {
        axios.post('/api/sections', { title: newSectionTitle })
            .then(response => {
                setSections([...sections, response.data]);
                setNewSectionTitle('');
            })
            .catch(error => {
                console.error('Error adding section:', error);
            });
    };

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                Trello Clone
            </Typography>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Paper style={{ padding: '16px', marginBottom: '16px' }}>
                        <TextField
                            label="New Section"
                            value={newSectionTitle}
                            onChange={(e) => setNewSectionTitle(e.target.value)}
                            fullWidth
                        />
                        <Button variant="contained" color="primary" onClick={addSection} style={{ marginTop: '8px' }}>
                            Add Section
                        </Button>
                    </Paper>
                </Grid>
                {sections.map((section) => (
                    <Grid item xs={12} sm={6} md={4} key={section._id}>
                        <Section section={section} />
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};

export default App;
