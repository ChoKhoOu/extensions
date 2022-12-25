import { ActionPanel, List, Action } from "@raycast/api";
import React, { useEffect, useState } from "react";
import { CodaApi, ListPagesResponse, Page } from "./coda-api";

export default (props: { docId: string; }) => {
  const [docs, setPages] = useState<Page[]>(new Array<Page>());
  const [isLoading, setIsLoading] = useState<boolean>(true);

  async function getAllPages(docId: string) {
    const coda = new CodaApi();
    const data = [];
    let firstRequest = true;
    let pageToken = null;
    while (firstRequest || pageToken) {
      try {
        const res: ListPagesResponse = await coda.getPages({ docId: docId, pageToken: pageToken });
        data.push(...res.items);
        pageToken = res.nextPageToken || "";
      } catch (err) {
        console.error(err);
        pageToken = null;
      }
      firstRequest = false;
    }
    return data;
  }

  useEffect(() => {
    async function loadPages(docId: string) {
      const allPages = await getAllPages(docId);
      setPages(allPages);
    }

    loadPages(props.docId).then(
      () => {
        setIsLoading(false);
      }
    );

  }, []);
  return (
    <List
      isLoading={isLoading}
      searchBarPlaceholder="Search pages..."
    >
      <List.Section title="Docs">{docs?.map((page) => (
        <List.Item
          key={page.id}
          title={page.name}
          subtitle={page.subtitle}
          icon={{ source: page.icon == undefined ? "document-folder.png" : page.icon.browserLink }}
          actions={
            <ActionPanel>
              <Action.OpenInBrowser title="Open In Browser" url={page.browserLink} />
              <Action.CopyToClipboard
                title="Copy URL"
                content={page.browserLink}
                shortcut={{ modifiers: ["cmd"], key: "enter" }}
              />
            </ActionPanel>
          }
        />
      ))}
      </List.Section>
    </List>);
}