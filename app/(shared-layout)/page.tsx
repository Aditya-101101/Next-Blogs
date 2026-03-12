import Image from "next/image";
import Link from "next/link";
export default function Home() {
  return (
    <div>
      <h1>testing</h1>
      <button><Link href='/content'>navigate to content</Link></button>
    </div>
  );
}
