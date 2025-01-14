import { List } from "@raycast/api";
import { useState } from "react";
import { findLocationsByPostcode, Location } from "inpost";
import isValidPostcode from "uk-postcode-validator";
import { LocationItem } from "./shared";
import { useCachedPromise } from "@raycast/utils";

export default function Command() {
  const [searchText, setSearchText] = useState<string>("");

  const {
    isLoading,
    data: locations,
    revalidate: refreshSearch,
  } = useCachedPromise<(text: string) => Promise<Location[]>>(
    async (text: string) => {
      if (!isValidPostcode(searchText)) {
        return [];
      } else {
        return findLocationsByPostcode(text);
      }
    },
    [searchText]
  );

  return (
    <List isLoading={isLoading} onSearchTextChange={setSearchText} searchBarPlaceholder="Enter your postcode" throttle>
      <List.Section title="Locations" subtitle={locations && locations.length + ""}>
        {locations &&
          locations.map((location) => (
            <LocationItem key={location.id} location={location} refreshLocations={refreshSearch} />
          ))}
      </List.Section>
    </List>
  );
}
