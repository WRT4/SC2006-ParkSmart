export default function SearchResult({ title, address }) {
  return (
    <div className="flex cursor-pointer flex-col gap-0.5 border-b-1 border-b-gray-200 p-2 hover:bg-[#f8f9fa] active:bg-[#e9ecef]">
      <p className="text-start font-medium">{title}</p>
      <p className="text-start text-xs text-gray-600">{address}</p>
    </div>
  );
}
