import rss from "@astrojs/rss";
import { getSortedNotes, getNotePath, getNoteExcerpt } from "@/utils/notes";
import { SITE } from "@/config";

export async function GET() {
  const notes = await getSortedNotes();
  return rss({
    title: `Notes | ${SITE.title}`,
    description: "koukyo 的短想法，主要写一些细碎的思考。",
    site: SITE.website,
    items: notes.map(note => ({
      link: getNotePath(note.id),
      title: getNoteExcerpt(note, 30),
      pubDate: note.data.pubDatetime,
      content: note.rendered?.html,
    })),
  });
}
