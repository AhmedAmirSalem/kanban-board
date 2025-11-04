type Props = {
  value: string;
  onChange: (v: string) => void;
};

export default function SearchBar({ value, onChange }: Props) {
  return (
    <input
      className="input search"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="search title or description"
    />
  );
}
