import React, { useState } from "react";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";


import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

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

  const [open, setOpen] = useState<boolean>(false);

  const handleSelect = async (val: string) => {
    setValue(val, false);
    clearSuggestions();

    const results = await getGeocode({ address: val });
    const { lat, lng } = await getLatLng(results[0]);
    setOffice({ lat, lng });
  };

  return (
    <div className="flex flex-col gap-4">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-[100%] justify-between bg-background hover:bg-accent hover:text-accent-foreground"
          >
            {value
              ? data.find((location) => location.description.includes(value))
                  ?.description
              : "Search office address..."}
            <ChevronsUpDown className="opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[100%] p-0  border border-border bg-popover text-popover-foreground">
          <Command>
            <CommandInput
              placeholder="Search office address..."
              className="h-9 border-b border-border"
              value={value}
              onValueChange={(value:string) => setValue(value)}
              disabled={!ready}
            />
            <CommandList>
              <CommandEmpty className="py-6 text-center text-sm text-muted-foreground">No office address found.</CommandEmpty>
              <CommandGroup>
                {status === "OK" &&
                  data.map(({ description, place_id }) => (
                    <CommandItem
                      key={place_id}
                      value={description}
                      onSelect={handleSelect}
                    >
                      {description}
                      <Check
                        className={cn(
                          "ml-auto",
                          value === description ? "opacity-100" : "opacity-0"
                        )}
                      />
                    </CommandItem>
                  ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
