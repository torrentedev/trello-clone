// src/components/Section.js
import React, { useState } from 'react';
import axios from 'axios';
import { Card, CardContent, CardHeader, Button, TextField, Paper, Typography } from '@mui/material';
import { Draggable } from 'react-beautiful-dnd';
import './Section.css';

const Section = ({ section }) => {
    // Llama a los hooks siempre
    const [cards, setCards] = useState(section?.cards || []);
    const [newCardTitle, setNewCardTitle] = useState('');
    const [newCardDescription, setNewCardDescription] = useState('');

    // Verificación condicional después de llamar a los hooks
    if (!section || !section.cards) {
        return null; // o un mensaje de error o cargando
    }

    const addCard = () => {
        axios.post(`/api/sections/${section._id}/cards`, { title: newCardTitle, description: newCardDescription })
            .then(response => {
                setCards(response.data.cards);
                setNewCardTitle('');
                setNewCardDescription('');
            })
            .catch(error => {
                console.error('Error al agregar tarjeta:', error);
            });
    };

    return (
        <Paper className="paper">
            <Typography variant="h6" gutterBottom>
                {section.title}
            </Typography>
            {cards.map((card, index) => (
                <Draggable key={card._id} draggableId={card._id} index={index}>
                    {(provided) => (
                        <Card
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="card"
                        >
                            <CardHeader title={card.title} />
                            <CardContent>
                                <Typography variant="body2">
                                    {card.description}
                                </Typography>
                            </CardContent>
                        </Card>
                    )}
                </Draggable>
            ))}
            <TextField
                label="Título de la Tarjeta"
                value={newCardTitle}
                onChange={(e) => setNewCardTitle(e.target.value)}
                fullWidth
                className="textField"
            />
            <TextField
                label="Descripción de la Tarjeta"
                value={newCardDescription}
                onChange={(e) => setNewCardDescription(e.target.value)}
                fullWidth
                className="textField"
            />
            <Button variant="contained" color="primary" onClick={addCard}>
                Agregar Tarjeta
            </Button>
        </Paper>
    );
};

export default Section;
