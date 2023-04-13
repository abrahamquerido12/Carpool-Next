export default function CustomButton({
  children,
  onClick,
  variant,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
}) {
  const buttonClasses = () => {
    if (variant === 'primary') {
      return 'bg-cxBlue text-white p-2 py-3 rounded-md shadow-sm w-full';
    } else return 'bg-cxGray text-white p-2 py-3 rounded-md shadow-sm w-full';
  };
  return (
    <button onClick={onClick} className={buttonClasses()}>
      {children}
    </button>
  );
}
