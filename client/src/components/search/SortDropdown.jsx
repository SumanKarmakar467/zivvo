import * as Select from "@radix-ui/react-select";

const options = [
  { value: "relevance", label: "Relevance" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "newest", label: "Newest" },
  { value: "rating", label: "Avg Rating" },
  { value: "popular", label: "Popularity" }
];

export function SortDropdown({ value = "relevance", onChange }) {
  return (
    <Select.Root value={value} onValueChange={onChange}>
      <Select.Trigger className="flex min-h-11 w-full items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--bg2)] px-4 text-sm font-semibold text-[var(--cream)] outline-none md:w-56">
        <Select.Value />
        <Select.Icon className="text-[var(--muted)]">⌄</Select.Icon>
      </Select.Trigger>
      <Select.Portal>
        <Select.Content className="z-[70] overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--bg2)] shadow-2xl">
          <Select.Viewport className="p-1">
            {options.map((option) => (
              <Select.Item
                key={option.value}
                value={option.value}
                className="cursor-pointer rounded-lg px-3 py-2 text-sm text-[var(--cream)] outline-none data-[highlighted]:bg-[rgba(124,92,252,0.16)]"
              >
                <Select.ItemText>{option.label}</Select.ItemText>
              </Select.Item>
            ))}
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
}

export default SortDropdown;
