import axios from "axios";
import { getApiToken } from "./preference";

//https://coda.io/developers/apis/v1#tag/Pages/operation/listPages
interface ListDocsParams {
  query?: string;
  limit?: number;
  pageToken?: string | null;
}

export interface ListDocsResponse {
  items: Doc[];
  nextPageToken?: string;
  nextPageUrl?: string;
}

// https://coda.io/developers/apis/v1#tag/Pages/operation/listPages
interface ListPagesParams {
  docId: string;
  query?: string;
  limit?: number;
  pageToken?: string | null;
}

export interface ListPagesResponse {
  items: Page[];
  nextPageToken?: string;
  nextPageUrl?: string;
}

export interface Page {
  id: string;
  type: string;
  href: string;
  name: string;
  browserLink: string;
  icon?: Icon;
  subtitle?: string;
}

export interface Doc {
  id: string;
  type: string;
  href: string;
  name: string;
  browserLink: string;
  icon?: Icon;
}

interface Icon {
  name: string;
  type: string;
  browserLink: string;
}


export class CodaApi {
  apiToken = "";

  constructor() {
    this.apiToken = getApiToken();
  }

  async getDocs(params?: ListDocsParams): Promise<ListDocsResponse> {
    const url = `https://coda.io/apis/v1/docs`;
    const headers = {
      Authorization: `Bearer ${this.apiToken}`
    };
    if (params?.limit) {
      params.limit = 99;
    }
    const result = await axios.get(url, { headers, params });

    return result.data as ListDocsResponse;
  }

  async getPages(params: ListPagesParams): Promise<ListPagesResponse> {
    const url = `https://coda.io/apis/v1/docs/` + params?.docId + `/pages`;
    const headers = {
      Authorization: `Bearer ${this.apiToken}`
    };
    if (params?.limit) {
      params.limit = 99;
    }
    const result = await axios.get(url, { headers, params });
    return result.data as ListDocsResponse;
  }
}