/**
 * Notes service: CRUD operations using Supabase.
 * Expects a "notes" table with columns:
 * - id: uuid (primary key, default gen_random_uuid() or uuid_generate_v4())
 * - title: text
 * - content: text
 * - created_at: timestamptz default now()
 * - updated_at: timestamptz default now()
 */

import { supabase } from '../lib/supabase';

/**
 * Normalize Supabase errors into JS Error with readable message.
 */
function handleError(error, fallbackMessage) {
  if (error) {
    const msg = error.message || fallbackMessage || 'Unknown error';
    throw new Error(msg);
  }
}

/**
 * Map row into app-friendly note object.
 */
function mapNote(row) {
  return {
    id: row.id,
    title: row.title ?? '',
    content: row.content ?? '',
    created_at: row.created_at,
    updated_at: row.updated_at
  };
}

/**
 * Update the updated_at timestamp on server side through RPC or update.
 * Here we just set updated_at to now() using an update call.
 */

// PUBLIC_INTERFACE
export async function listNotes(searchTerm = '') {
  /** Fetch a list of notes ordered by updated_at desc. Optionally filter by title/content. */
  let query = supabase
    .from('notes')
    .select('*')
    .order('updated_at', { ascending: false });

  if (searchTerm) {
    // Use ilike for case-insensitive search across title and content
    query = query.or(`title.ilike.%${searchTerm}%,content.ilike.%${searchTerm}%`);
  }

  const { data, error } = await query;
  handleError(error, 'Failed to fetch notes');
  return (data || []).map(mapNote);
}

// PUBLIC_INTERFACE
export async function getNoteById(id) {
  /** Fetch a single note by id. */
  const { data, error } = await supabase
    .from('notes')
    .select('*')
    .eq('id', id)
    .single();

  handleError(error, 'Failed to fetch note');
  return mapNote(data);
}

// PUBLIC_INTERFACE
export async function createNote({ title, content }) {
  /** Create a new note. Returns created note. */
  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from('notes')
    .insert([{ title: title ?? '', content: content ?? '', updated_at: now }])
    .select()
    .single();

  handleError(error, 'Failed to create note');
  return mapNote(data);
}

// PUBLIC_INTERFACE
export async function updateNote(id, { title, content }) {
  /** Update an existing note. Returns updated note. */
  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from('notes')
    .update({ title: title ?? '', content: content ?? '', updated_at: now })
    .eq('id', id)
    .select()
    .single();

  handleError(error, 'Failed to update note');
  return mapNote(data);
}

// PUBLIC_INTERFACE
export async function deleteNote(id) {
  /** Delete a note by id. Returns true if successful. */
  const { error } = await supabase.from('notes').delete().eq('id', id);
  handleError(error, 'Failed to delete note');
  return true;
}
