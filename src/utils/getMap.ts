import type { CollectionEntry } from "astro:content";
import {
  MAP_LINES,
  START_HERE,
  type MapLine,
  type MapStation,
} from "@/data/map";
import { getPath } from "./getPath";
import postFilter from "./postFilter";

type Post = CollectionEntry<"blog">;

export type ResolvedStation = MapStation & {
  post: Post;
  href: string;
  transfers: MapLine[];
};

export type ResolvedLine = Omit<MapLine, "stations"> & {
  stations: ResolvedStation[];
  updated: Date;
};

export const getSlug = (post: Post) =>
  getPath(post.id, post.filePath, false).replace(/^\//, "");

const byPubDesc = (a: Post, b: Post) =>
  b.data.pubDatetime.getTime() - a.data.pubDatetime.getTime();

/** Expects every post, drafts included, so typos in map.ts fail the build */
export function getMap(allPosts: Post[]) {
  const bySlug = new Map(allPosts.map(post => [getSlug(post), post]));
  const visible = new Set(allPosts.filter(postFilter).map(getSlug));

  for (const line of MAP_LINES) {
    for (const { slug } of line.stations) {
      if (!bySlug.has(slug)) {
        throw new Error(
          `map.ts: line "${line.id}" references unknown post "${slug}"`
        );
      }
    }
  }
  for (const slug of START_HERE) {
    if (!bySlug.has(slug)) {
      throw new Error(`map.ts: START_HERE references unknown post "${slug}"`);
    }
  }

  const linesOf = (slug: string) =>
    MAP_LINES.filter(line => line.stations.some(s => s.slug === slug));

  const lines: ResolvedLine[] = MAP_LINES.map(line => {
    const stations = line.stations
      .filter(({ slug }) => visible.has(slug))
      .map(station => {
        const post = bySlug.get(station.slug)!;
        return {
          ...station,
          post,
          href: getPath(post.id, post.filePath),
          transfers: linesOf(station.slug).filter(l => l.id !== line.id),
        };
      });
    const updated = new Date(
      Math.max(0, ...stations.map(s => s.post.data.pubDatetime.getTime()))
    );
    return { ...line, stations, updated };
  }).filter(line => line.stations.length > 0);

  const mapped = new Set(lines.flatMap(l => l.stations.map(s => s.slug)));
  const unmapped = allPosts
    .filter(postFilter)
    .filter(post => !mapped.has(getSlug(post)))
    .sort(byPubDesc);

  const startHere = START_HERE.filter(slug => visible.has(slug)).map(
    slug => bySlug.get(slug)!
  );

  return { lines, unmapped, startHere };
}

export function getLinesForPost(post: Post, allPosts: Post[]) {
  const slug = getSlug(post);
  return getMap(allPosts).lines.flatMap(line => {
    const index = line.stations.findIndex(s => s.slug === slug);
    if (index === -1) return [];
    return [
      {
        line,
        index,
        prev: line.stations[index - 1],
        next: line.stations[index + 1],
      },
    ];
  });
}
