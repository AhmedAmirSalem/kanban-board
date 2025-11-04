import type { ChangeEvent } from "react";

type Props = {
  value: string;
  onChange: (v: string) => void;
};

export default function SearchBar({ value, onChange }: Props) {
  function handle(e: ChangeEvent<HTMLInputElement>) {
    onChange(e.target.value);
  }
  return (
    <div style={{ marginBottom: 12 }}>
      <input
        value={value}
        onChange={handle}
        placeholder="search title or description"
        style={{ width: 320, padding: 8 }}
      />
    </div>
  );
}
