// src/App.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Grid, Button, TextField, Paper, Typography } from '@mui/material';
import Section from './Section';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

const App = () => {
    const [sections, setSections] = useState([]);
    const [newSectionTitle, setNewSectionTitle] = useState('');

    useEffect(() => {
        axios.get('/api/sections')
            .then(response => {
                setSections(response.data);
            })
            .catch(error => {
                console.error('Error al obtener secciones:', error);
            });
    }, []);

    const addSection = () => {
        axios.post('/api/sections', { title: newSectionTitle })
            .then(response => {
                setSections([...sections, response.data]);
                setNewSectionTitle('');
            })
            .catch(error => {
                console.error('Error al agregar sección:', error);
            });
    };

    const onDragEnd = (result) => {
        const { source, destination } = result;

        if (!destination) {
            return;
        }

        const sourceSectionIndex = sections.findIndex(section => section._id === source.droppableId);
        const destinationSectionIndex = sections.findIndex(section => section._id === destination.droppableId);

        const sourceSection = sections[sourceSectionIndex];
        const destinationSection = sections[destinationSectionIndex];

        // Si la tarjeta se mueve dentro de la misma sección
        if (sourceSectionIndex === destinationSectionIndex) {
            const updatedCards = Array.from(sourceSection.cards);
            const [movedCard] = updatedCards.splice(source.index, 1);
            updatedCards.splice(destination.index, 0, movedCard);

            const updatedSections = [...sections];
            updatedSections[sourceSectionIndex] = {
                ...sourceSection,
                cards: updatedCards,
            };

            setSections(updatedSections);
        } else {
            const sourceCards = Array.from(sourceSection.cards);
            const destinationCards = Array.from(destinationSection.cards);
            const [movedCard] = sourceCards.splice(source.index, 1);
            destinationCards.splice(destination.index, 0, movedCard);

            const updatedSections = [...sections];
            updatedSections[sourceSectionIndex] = {
                ...sourceSection,
                cards: sourceCards,
            };
            updatedSections[destinationSectionIndex] = {
                ...destinationSection,
                cards: destinationCards,
            };

            setSections(updatedSections);

            axios.put(`/api/sections/${source.droppableId}/cards`, { cards: sourceCards })
                .then(() => axios.put(`/api/sections/${destination.droppableId}/cards`, { cards: destinationCards }))
                .then(() => {
                    toast.success("Actividad guardada");
                })
                .catch(error => {
                    console.error('Error al actualizar tarjetas:', error);
                });
        }
    };

    return (
        <Container className="container">
            <Typography variant="h4" gutterBottom>
                Clon de Trello
            </Typography>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Paper className="paper">
                        <TextField
                            label="Nueva Sección"
                            value={newSectionTitle}
                            onChange={(e) => setNewSectionTitle(e.target.value)}
                            fullWidth
                        />
                        <Button variant="contained" color="primary" onClick={addSection} className="button">
                            Agregar Sección
                        </Button>
                    </Paper>
                </Grid>
                <DragDropContext onDragEnd={onDragEnd}>
                    {sections.length > 0 && sections.map((section) => (
                        <Grid item xs={12} sm={6} md={4} key={section._id}>
                            <Droppable droppableId={section._id}>
                                {(provided) => (
                                    <div ref={provided.innerRef} {...provided.droppableProps}>
                                        <Section section={section} />
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        </Grid>
                    ))}
                </DragDropContext>
            </Grid>
            <ToastContainer />
        </Container>
    );
};

export default App;
