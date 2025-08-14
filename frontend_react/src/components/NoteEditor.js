import React from 'react';

const NoteEditor = ({ note, onSave, onDelete }) => {
  const [title, setTitle] = React.useState(note?.title || '');
  const [content, setContent] = React.useState(note?.content || '');
  
  React.useEffect(() => {
    setTitle(note?.title || '');
    setContent(note?.content || '');
  }, [note]);

  const handleSave = () => {
    onSave({ ...note, title, content });
  };

  if (!note) {
    return (
      <div className="content">
        <p>Select a note or create a new one</p>
      </div>
    );
  }

  return (
    <div className="note-editor">
      <div className="top-bar">
        <div className="actions">
          <button className="button" onClick={handleSave}>Save</button>
          <button className="button secondary" onClick={() => onDelete(note.id)}>Delete</button>
        </div>
      </div>
      <div className="content">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Note title"
        />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Note content"
        />
      </div>
    </div>
  );
};

export default NoteEditor;
