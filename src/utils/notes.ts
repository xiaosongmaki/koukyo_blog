import { getCollection, type CollectionEntry } from "astro:content";
import { SITE } from "@/config";

export type Note = CollectionEntry<"notes">;

const isPublished = ({ data }: Note) =>
  !data.draft &&
  (import.meta.env.DEV ||
    Date.now() > data.pubDatetime.getTime() - SITE.scheduledPostMargin);

/** Published notes, newest first */
export async function getSortedNotes() {
  const notes = await getCollection("notes");
  return notes
    .filter(isPublished)
    .sort(
      (a, b) => b.data.pubDatetime.getTime() - a.data.pubDatetime.getTime()
    );
}

export const getNotePath = (id: string) => `/notes/${id}/`;

/** Plain-text start of a note, for titles, meta and the homepage */
export function getNoteExcerpt(note: Note, maxLength = 80) {
  const text = (note.body ?? "")
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/^\s{0,3}(#{1,6}|>|[-*+]|\d+\.)\s+/gm, "")
    .replace(/[*_~`]/g, "")
    .replace(/\s+/g, " ")
    .trim();
  return text.length > maxLength ? `${text.slice(0, maxLength)}…` : text;
}
