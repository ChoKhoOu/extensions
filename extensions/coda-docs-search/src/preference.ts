import { getPreferenceValues } from "@raycast/api";

interface Preferences {
  apiToken: string;
}

export function getApiToken() {
  const { apiToken } = getPreferenceValues<Preferences>();
  return apiToken;
}

export function getPreferences() {
  const preferences = getPreferenceValues<Preferences>();

  return {
    apiToken: preferences.apiToken
  };
}

