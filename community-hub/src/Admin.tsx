import { useState } from "react";

type ReportItem = {
  id: string;
  reason: string;
  details?: string | null;
  status: string;
  createdAt: string;
  reporter?: { displayName?: string };
  post?: { id: string; body: string; status: string } | null;
};

export default function AdminPage() {
  const [token, setToken] = useState("");
  const [items, setItems] = useState<ReportItem[]>([]);
  const [message, setMessage] = useState("Enter the server-side admin token to load the moderation queue.");
  const [busy, setBusy] = useState(false);

  async function loadReports() {
    if (!token.trim()) { setMessage("Admin token is required."); return; }
    setBusy(true);
    try {
      const response = await fetch("/api/admin/reports", { headers: { "x-admin-token": token } });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to load reports.");
      setItems(data.items || []);
      setMessage(data.items?.length ? "Open moderation reports." : "No open reports.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Request failed.");
      setItems([]);
    } finally { setBusy(false); }
  }

  async function moderatePost(id: string, status: "HIDDEN" | "REMOVED" | "PUBLISHED") {
    setBusy(true);
    try {
      const response = await fetch(`/api/admin/posts/${encodeURIComponent(id)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", "x-admin-token": token },
        body: JSON.stringify({ status })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to moderate post.");
      setItems((current) => current.map((item) => item.post?.id === id ? { ...item, post: { ...item.post, status } } : item));
      setMessage(`Post status updated: ${status.toLowerCase()}.`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Request failed.");
    } finally { setBusy(false); }
  }

  async function updateReport(id: string, status: "REVIEWING" | "RESOLVED" | "DISMISSED") {
    setBusy(true);
    try {
      const response = await fetch(`/api/admin/reports/${encodeURIComponent(id)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", "x-admin-token": token },
        body: JSON.stringify({ status })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to update report.");
      setItems((current) => current.filter((item) => item.id !== id));
      setMessage(`Report updated: ${status.toLowerCase()}.`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Request failed.");
    } finally { setBusy(false); }
  }

  return <main className="admin-shell">
    <header className="admin-header">
      <a className="brand" href="/"><span className="brand-mark">IL</span><span><strong>InterLink</strong><small>MODERATION CONSOLE</small></span></a>
      <a className="text-button" href="/">Back to Hub</a>
    </header>
    <section className="admin-panel">
      <span className="section-kicker">ADMINISTRATION</span>
      <h1>Community moderation</h1>
      <p>Review member reports and update their status. Keep this page private and never share your admin token.</p>
      <label className="admin-label" htmlFor="admin-token">Admin API token</label>
      <input id="admin-token" className="admin-input" type="password" autoComplete="off" value={token} onChange={(event) => setToken(event.target.value)} placeholder="Enter server admin token" />
      <button className="button-primary" onClick={loadReports} disabled={busy}>{busy ? "Loading…" : "Load reports"}</button>
      <p className="admin-message" role="status">{message}</p>
      <div className="admin-report-list">
        {items.map((item) => <article className="content-card" key={item.id}>
          <div className="card-meta"><span className="tag">{item.reason}</span><span>{new Date(item.createdAt).toLocaleString()}</span></div>
          <h3>{item.reporter?.displayName || "Community member"}</h3>
          <p>{item.details || "No additional details."}</p>
          {item.post && <blockquote className="reported-content">{item.post.body}</blockquote>}
          {item.post && <div className="admin-actions"><button className="button-secondary" disabled={busy} onClick={() => moderatePost(item.post!.id, "HIDDEN")}>Hide post</button><button className="button-secondary" disabled={busy} onClick={() => moderatePost(item.post!.id, "REMOVED")}>Remove post</button></div>}
          <div className="admin-actions">
            <button className="button-secondary" disabled={busy} onClick={() => updateReport(item.id, "REVIEWING")}>Review</button>
            <button className="button-primary" disabled={busy} onClick={() => updateReport(item.id, "RESOLVED")}>Resolve</button>
            <button className="button-secondary" disabled={busy} onClick={() => updateReport(item.id, "DISMISSED")}>Dismiss</button>
          </div>
        </article>)}
      </div>
    </section>
  </main>;
}
