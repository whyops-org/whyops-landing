import type { PlaybookType, PseoPage } from "@/lib/pseo/types";

type LinkablePage = PseoPage & {
  topic_key: string;
  entity_keys: string[];
};

type PageRecord<T extends LinkablePage> = {
  index: number;
  page: T;
  pathname: string;
  related: Set<number>;
};

const CATEGORY_PLAYBOOKS = new Set<PlaybookType>(["directory", "curation", "glossary"]);

function pathnameFromUrl(url: string): string {
  return new URL(url).pathname.replace(/\/+$/, "") || "/";
}

function dedupeByUrl<T extends { url: string }>(items: T[]): T[] {
  const seen = new Set<string>();
  return items.filter((item) => {
    if (seen.has(item.url)) {
      return false;
    }
    seen.add(item.url);
    return true;
  });
}

function buildRelatedSet<T extends LinkablePage>(
  index: number,
  page: T,
  topicMap: Map<string, number[]>,
  entityMap: Map<string, number[]>,
): Set<number> {
  const related = new Set<number>();
  const sameTopic = topicMap.get(page.topic_key) || [];

  sameTopic.forEach((candidate) => {
    if (candidate !== index) {
      related.add(candidate);
    }
  });

  page.entity_keys.forEach((entityKey) => {
    (entityMap.get(entityKey) || []).forEach((candidate) => {
      if (candidate !== index) {
        related.add(candidate);
      }
    });
  });

  return related;
}

function findStructuralParentIndex(
  pathname: string,
  pathnameMap: Map<string, number>,
): number | null {
  let cursor = pathname;

  while (cursor.lastIndexOf("/") > 0) {
    cursor = cursor.slice(0, cursor.lastIndexOf("/"));
    const candidate = pathnameMap.get(cursor);
    if (candidate !== undefined && cursor !== "/") {
      return candidate;
    }
  }

  return null;
}

function sortByUrl<T extends LinkablePage>(records: PageRecord<T>[], indexes: number[]): number[] {
  return [...indexes].sort((left, right) =>
    records[left].page.url.localeCompare(records[right].page.url),
  );
}

function pickSemanticParentIndex<T extends LinkablePage>(
  records: PageRecord<T>[],
  record: PageRecord<T>,
): number | null {
  return [...record.related]
    .filter((index) => records[index].page.playbook_type !== record.page.playbook_type)
    .sort((left, right) => {
      const leftBoost = CATEGORY_PLAYBOOKS.has(records[left].page.playbook_type) ? -1 : 0;
      const rightBoost = CATEGORY_PLAYBOOKS.has(records[right].page.playbook_type) ? -1 : 0;
      return leftBoost - rightBoost || records[left].page.url.length - records[right].page.url.length;
    })[0] ?? null;
}

function pickSiblingIndexes<T extends LinkablePage>(
  records: PageRecord<T>[],
  playbookIndexes: number[],
  record: PageRecord<T>,
): number[] {
  const shared: number[] = [];
  const unshared: number[] = [];

  playbookIndexes.forEach((index) => {
    if (index === record.index) {
      return;
    }

    if (record.related.has(index)) {
      shared.push(index);
      return;
    }

    unshared.push(index);
  });

  return [...sortByUrl(records, shared), ...sortByUrl(records, unshared)].slice(0, 2);
}

function pickRelatedIndexes<T extends LinkablePage>(
  records: PageRecord<T>[],
  record: PageRecord<T>,
  excluded: Set<number>,
  limit: number,
): number[] {
  return sortByUrl(
    records,
    [...record.related].filter((index) => {
      if (excluded.has(index)) {
        return false;
      }

      return records[index].page.playbook_type !== record.page.playbook_type;
    }),
  ).slice(0, limit);
}

export function attachDraftLinks<T extends LinkablePage>(pages: T[]): T[] {
  const pathnameMap = new Map<string, number>();
  const topicMap = new Map<string, number[]>();
  const entityMap = new Map<string, number[]>();
  const playbookMap = new Map<PlaybookType, number[]>();

  pages.forEach((page, index) => {
    pathnameMap.set(pathnameFromUrl(page.url), index);
    topicMap.set(page.topic_key, [...(topicMap.get(page.topic_key) || []), index]);
    playbookMap.set(page.playbook_type, [...(playbookMap.get(page.playbook_type) || []), index]);

    page.entity_keys.forEach((entityKey) => {
      entityMap.set(entityKey, [...(entityMap.get(entityKey) || []), index]);
    });
  });

  const records: Array<PageRecord<T>> = pages.map((page, index) => ({
    index,
    page,
    pathname: pathnameFromUrl(page.url),
    related: buildRelatedSet(index, page, topicMap, entityMap),
  }));

  return records
    .map((record) => {
      const parentIndex =
        findStructuralParentIndex(record.pathname, pathnameMap) ??
        pickSemanticParentIndex(records, record);
      const siblingIndexes = pickSiblingIndexes(
        records,
        playbookMap.get(record.page.playbook_type) || [],
        record,
      );
      const excluded = new Set<number>([
        record.index,
        ...(parentIndex === null ? [] : [parentIndex]),
        ...siblingIndexes,
      ]);
      const supplementalIndexes = pickRelatedIndexes(
        records,
        record,
        excluded,
        Math.max(0, 2 - siblingIndexes.length),
      );
      const crossPlaybookIndexes = pickRelatedIndexes(
        records,
        record,
        new Set<number>([...excluded, ...supplementalIndexes]),
        2,
      );

      if (parentIndex === null || siblingIndexes.length < 2 || crossPlaybookIndexes.length < 2) {
        return null;
      }

      const siblings = [...siblingIndexes, ...supplementalIndexes];
      const internalLinks = dedupeByUrl([
        {
          url: records[parentIndex].page.url,
          anchor: records[parentIndex].page.content.h1,
          relation: "parent" as const,
        },
        ...siblings.map((index) => ({
          url: records[index].page.url,
          anchor: records[index].page.content.h1,
          relation: "sibling" as const,
        })),
        ...crossPlaybookIndexes.map((index) => ({
          url: records[index].page.url,
          anchor: records[index].page.content.h1,
          relation: "cross-playbook" as const,
        })),
      ]);

      const relatedPages = dedupeByUrl(
        [...crossPlaybookIndexes, ...siblings].slice(0, 3).map((index) => ({
          url: records[index].page.url,
          title: records[index].page.content.h1,
          reason:
            records[index].page.playbook_type === record.page.playbook_type
              ? `Sibling ${records[index].page.playbook_type} page that helps the reader compare adjacent options.`
              : `${records[index].page.playbook_type} page that expands the same topic from a different search intent.`,
        })),
      );

      return {
        ...record.page,
        internal_links: internalLinks,
        related_pages: relatedPages,
      };
    })
    .filter((page): page is T => Boolean(page));
}
