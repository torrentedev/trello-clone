// src/components/Section.js
import React, { useState } from 'react';
import axios from 'axios';
import { Card, CardContent, CardHeader, Button, TextField, Paper, Typography } from '@mui/material';

const Section = ({ section }) => {
    const [cards, setCards] = useState(section.cards);
    const [newCardTitle, setNewCardTitle] = useState('');
    const [newCardDescription, setNewCardDescription] = useState('');

    const addCard = () => {
        axios.post(`/api/sections/${section._id}/cards`, { title: newCardTitle, description: newCardDescription })
            .then(response => {
                setCards(response.data.cards);
                setNewCardTitle('');
                setNewCardDescription('');
            })
            .catch(error => {
                console.error('Error adding card:', error);
            });
    };

    return (
        <Paper style={{ padding: '16px' }}>
            <Typography variant="h6" gutterBottom>
                {section.title}
            </Typography>
            {cards.map((card, index) => (
                <Card key={index} style={{ marginBottom: '8px' }}>
                    <CardHeader title={card.title} />
                    <CardContent>
                        <Typography variant="body2">
                            {card.description}
                        </Typography>
                    </CardContent>
                </Card>
            ))}
            <TextField
                label="Card Title"
                value={newCardTitle}
                onChange={(e) => setNewCardTitle(e.target.value)}
                fullWidth
                style={{ marginBottom: '8px' }}
            />
            <TextField
                label="Card Description"
                value={newCardDescription}
                onChange={(e) => setNewCardDescription(e.target.value)}
                fullWidth
                style={{ marginBottom: '8px' }}
            />
            <Button variant="contained" color="primary" onClick={addCard}>
                Add Card
            </Button>
        </Paper>
    );
};

export default Section;
