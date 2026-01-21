import GameCanvas from "./GameCanvas";

export default function Content({ children }) {
  return (
    <div className="relative w-[95%] flex-1 border-4 border-black">
      {children}
    </div>
  );
}