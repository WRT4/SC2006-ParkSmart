import "../styles/LoadingPage.css";

export default function LoadingPage() {
  return (
    <main className="loading grid min-h-screen min-w-screen place-items-center">
      <div className="flex flex-col items-center gap-5">
        <div className="loader"></div>
        <p>Checking sign-in status...</p>
      </div>
    </main>
  );
}
