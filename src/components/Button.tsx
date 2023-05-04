interface CustomButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
  type?: 'button' | 'submit' | 'reset';
}

export default function CustomButton({
  children,
  onClick,
  variant,
  type = 'button',
  ...props
}: CustomButtonProps) {
  const buttonClasses = () => {
    if (variant === 'primary') {
      return 'bg-cxBlue text-white p-2 py-3 rounded-md shadow-sm w-full flex items-center justify-center';
    } else
      return 'bg-gray-400 text-white p-2 py-3 rounded-md shadow-sm w-full flex items-center justify-center';
  };
  return (
    <button
      onClick={onClick}
      className={buttonClasses()}
      type={type}
      {...props}
    >
      {children}
    </button>
  );
}
