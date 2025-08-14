import React from 'react';

const Sidebar = ({ notes, activeNoteId, onNoteSelect, onNewNote }) => {
  return (
    <div className="sidebar">
      <div className="top-bar">
        <button className="button" onClick={onNewNote}>New Note</button>
      </div>
      <div className="notes-list">
        {notes.map(note => (
          <div
            key={note.id}
            className={`note-item ${note.id === activeNoteId ? 'active' : ''}`}
            onClick={() => onNoteSelect(note.id)}
          >
            <div className="note-title">{note.title || 'Untitled'}</div>
            <div className="note-preview">{note.content || 'No content'}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
