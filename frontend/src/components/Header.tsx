import { Link } from "@tanstack/react-router";

export default function Header() {
  return (
    <header className="p-2 flex gap-2 bg-white text-black justify-between fixed top-0">
      <nav className="flex flex-row">
        <div className="px-2 font-bold flex flex-row gap-2">
          <Link to="/">Home</Link>
          <Link preload={false} to="/chat">
            Chat
          </Link>
          <Link preload={false} to="/new">
            New
          </Link>
        </div>
      </nav>
    </header>
  );
}
