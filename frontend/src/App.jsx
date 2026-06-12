import { useState, useEffect } from "react";
import { checkServerStatus } from "./api";

function App() {
  const [serverStatus, setServerStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const data = await checkServerStatus();
        setServerStatus(data);
        setError(null);
      } catch (err) {
        setError(err.message);
        setServerStatus(null);
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-8">
      <h1 className="text-5xl font-bold">Online Judge</h1>

      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-4">Backend Connection</h2>

        {loading && <p className="text-lg text-gray-600">Checking server...</p>}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <p>❌ Connection Failed</p>
            <p className="text-sm">{error}</p>
          </div>
        )}

        {serverStatus && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
            <p>✅ {serverStatus.message}</p>
            <p className="text-sm">Status: {serverStatus.status}</p>
            <p className="text-xs text-gray-600 mt-2">{serverStatus.timestamp}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;