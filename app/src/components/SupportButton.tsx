type Props = {
  onClick: () => void;
};

export function SupportButton({ onClick }: Props) {
  return (
    <button
      type="button"
      className="fixed bottom-4 right-4 bg-primary hover:bg-primary/90 text-white font-bold py-2 px-4 rounded-full shadow-lg cursor-pointer"
      onClick={onClick}
    >
      <span className="material-symbols-outlined">volunteer_activism</span>
    </button>
  );
}
