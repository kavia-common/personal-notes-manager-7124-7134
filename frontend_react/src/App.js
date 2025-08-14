import React, { useState, useEffect } from 'react';
import './App.css';
import Sidebar from './components/Sidebar';
import NoteEditor from './components/NoteEditor';
import { listNotes, createNote, updateNote, deleteNote } from './services/notesService';

function App() {
  const [notes, setNotes] = useState([]);
  const [activeNoteId, setActiveNoteId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const activeNote = notes.find(note => note.id === activeNoteId);

  const loadNotes = async () => {
    try {
      const notesList = await listNotes();
      setNotes(notesList);
      setError(null);
    } catch (err) {
      setError('Failed to load notes');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotes();
  }, []);

  const handleNewNote = async () => {
    try {
      const newNote = await createNote({ title: 'Untitled', content: '' });
      setNotes(prev => [newNote, ...prev]);
      setActiveNoteId(newNote.id);
    } catch (err) {
      setError('Failed to create note');
      console.error(err);
    }
  };

  const handleSaveNote = async (updatedNote) => {
    try {
      const saved = await updateNote(updatedNote.id, updatedNote);
      setNotes(prev => prev.map(note => 
        note.id === saved.id ? saved : note
      ));
      setError(null);
    } catch (err) {
      setError('Failed to save note');
      console.error(err);
    }
  };

  const handleDeleteNote = async (noteId) => {
    try {
      await deleteNote(noteId);
      setNotes(prev => prev.filter(note => note.id !== noteId));
      setActiveNoteId(null);
      setError(null);
    } catch (err) {
      setError('Failed to delete note');
      console.error(err);
    }
  };

  if (loading) {
    return <div className="app">Loading...</div>;
  }

  return (
    <div className="app">
      <Sidebar
        notes={notes}
        activeNoteId={activeNoteId}
        onNoteSelect={setActiveNoteId}
        onNewNote={handleNewNote}
      />
      <div className="main-panel">
        {error && (
          <div style={{ padding: '10px', color: 'red', backgroundColor: '#ffebee' }}>
            {error}
          </div>
        )}
        <NoteEditor
          note={activeNote}
          onSave={handleSaveNote}
          onDelete={handleDeleteNote}
        />
      </div>
    </div>
  );
}

export default App;
