import Link from 'next/link';

export default function Header() {
  return (
    <div className="w-full flex justify-end items-center  p-5">
      ¿No tienes cuenta?{' '}
      <Link
        href="/register"
        className="p-2 rounded-md shadow-sm ml-3 mr-10 border "
      >
        Registrate
      </Link>
    </div>
  );
}
