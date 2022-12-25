import { ActionPanel, List, Action } from "@raycast/api";
import { useEffect, useState } from "react";
import { CodaApi, Doc, ListDocsResponse } from "./coda-api";
import Pages from "./pages";


export default function Docs() {
  const [docs, setDocs] = useState<Doc[]>(new Array<Doc>());
  const [isLoading, setIsLoading] = useState<boolean>(true);
  useEffect(() => {
    async function loadDocs() {
      const allDocs = await getAllDocs();
      setDocs(allDocs);
    }

    loadDocs().then(
      () => {
        setIsLoading(false);
      }
    );
  }, []);

  async function getAllDocs() {
    const coda = new CodaApi();
    const data = [];

    let firstRequest = true;
    let pageToken = null;

    while (firstRequest || pageToken) {
      try {
        const res: ListDocsResponse = await coda.getDocs({ pageToken: pageToken });
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

  return (
    <List
      isLoading={isLoading}
      searchBarPlaceholder="Search docs..."
    >
      <List.Section title="Docs">{docs?.map((doc) => (
        <List.Item
          key={doc.id}
          title={doc.name}
          icon={{ source: doc.icon == undefined ? "document-folder.png" : doc.icon.browserLink }}
          actions={
            <ActionPanel>
              <Action.Push title="Show Pages" target={<Pages docId={doc.id} />} />
            </ActionPanel>
          }
        />
      ))}
      </List.Section>
    </List>
  );
}
