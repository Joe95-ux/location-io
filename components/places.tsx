import React from "react";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";

import { Check } from "lucide-react";

import { cn } from "@/lib/utils";

import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

type PlacesProps = {
  setOffice: (position: google.maps.LatLngLiteral) => void;
};

export default function Places({ setOffice }: PlacesProps) {
  const {
    ready,
    value,
    setValue,
    suggestions: { status, data },
    clearSuggestions,
  } = usePlacesAutocomplete();

  const handleSelect = async (val: string) => {
    setValue(val, false);
    clearSuggestions();

    const results = await getGeocode({ address: val });
    const { lat, lng } = await getLatLng(results[0]);
    setOffice({ lat, lng });
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      <Command className="rounded-lg border border-slate-800 bg-slate-900/90 shadow-lg w-full text-slate-100">
        <CommandInput
          placeholder="Search office address..."
          className="h-9 border-b border-slate-700 bg-slate-900/70 text-slate-100 placeholder:text-slate-400 focus:ring-0"
          value={value}
          onValueChange={(value: string) => setValue(value)}
          disabled={!ready}
        />
        {value && (
          <CommandList className="bg-slate-900/90">
            <CommandGroup>
              {status === "OK" &&
                data.map(({ description, place_id }) => (
                  <CommandItem
                    key={place_id}
                    value={description}
                    onSelect={handleSelect}
                    className="hover:bg-slate-800 cursor-pointer text-slate-400"
                  >
                    {description}
                    <Check
                      className={cn(
                        "ml-auto text-slate-400",
                        value === description
                          ? "text-slate-200 opacity-100"
                          : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
            </CommandGroup>
          </CommandList>
        )}
      </Command>
    </div>
  );
}
