import { useState, useEffect } from "react";

const QUOTES = [
  "The secret of getting ahead is getting started. — Mark Twain",
  "You don't have to be great to start, but you have to start to be great. — Zig Ziglar",
  "It always seems impossible until it's done. — Nelson Mandela",
  "Progress, not perfection. Keep moving forward.",
  "Small steps every day lead to giant leaps over time.",
  "Believe you can and you're halfway there. — Theodore Roosevelt",
  "Your future is created by what you do today, not tomorrow.",
  "Dream big. Start small. Act now.",
];

const CATEGORIES = ["Work", "Health", "Learning", "Personal", "Finance", "Other"];
const PRI_COLOR = { High: "#FF6B9D", Medium: "#FFD06B", Low: "#63E8AF" };
const CAT_COLOR = {
  Work: "rgba(99,150,255,0.25)", Health: "rgba(99,232,175,0.25)",
  Learning: "rgba(255,200,80,0.25)", Personal: "rgba(255,107,157,0.25)",
  Finance: "rgba(59,181,255,0.25)", Other: "rgba(160,160,160,0.2)",
};

function Logo({ size = 40, color = "#0a1a10" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 60 60" fill="none">
      <circle cx="38" cy="9" r="6" fill={color} />
      <line x1="38" y1="15" x2="30" y2="30" stroke={color} strokeWidth="3" strokeLinecap="round" />
      <line x1="34" y1="20" x2="44" y2="28" stroke={color} strokeWidth="3" strokeLinecap="round" />
      <line x1="34" y1="20" x2="24" y2="16" stroke={color} strokeWidth="3" strokeLinecap="round" />
      <line x1="30" y1="30" x2="22" y2="42" stroke={color} strokeWidth="3" strokeLinecap="round" />
      <line x1="22" y1="42" x2="14" y2="50" stroke={color} strokeWidth="3" strokeLinecap="round" />
      <line x1="30" y1="30" x2="38" y2="44" stroke={color} strokeWidth="3" strokeLinecap="round" />
      <line x1="38" y1="44" x2="46" y2="38" stroke={color} strokeWidth="3" strokeLinecap="round" />
      <line x1="6" y1="36" x2="15" y2="36" stroke={color} strokeWidth="2" strokeLinecap="round" opacity="0.5" />
      <line x1="3" y1="42" x2="12" y2="42" stroke={color} strokeWidth="2" strokeLinecap="round" opacity="0.3" />
    </svg>
  );
}

function PieChart({ done, total }) {
  const pct = total === 0 ? 0 : done / total;
  const r = 50, cx = 58, cy = 58, circ = 2 * Math.PI * r;
  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <svg width="116" height="116">
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#162616" strokeWidth="14" />
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#63E8AF" strokeWidth="14"
          strokeDasharray={circ} strokeDashoffset={circ * (1 - pct)}
          strokeLinecap="round" transform={`rotate(-90 ${cx} ${cy})`} />
        {pct > 0 && pct < 1 && (
          <circle cx={cx} cy={cy} r={r} fill="none" stroke="#FF6B9D" strokeWidth="14"
            strokeDasharray={circ} strokeDashoffset={circ * pct}
            strokeLinecap="round" transform={`rotate(-90 ${cx} ${cy})`} />
        )}
        {total === 0 && (
          <circle cx={cx} cy={cy} r={r} fill="none" stroke="#2a3a2a" strokeWidth="14"
            strokeDasharray={circ} />
        )}
      </svg>
      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", textAlign: "center" }}>
        <div style={{ fontSize: "1.25rem", fontWeight: 800, color: "#63E8AF" }}>
          {total === 0 ? "0%" : Math.round(pct * 100) + "%"}
        </div>
        <div style={{ fontSize: "0.52rem", color: "#6a9a7a", letterSpacing: "0.08em" }}>DONE</div>
      </div>
    </div>
  );
}

export default function GoalTrail() {
  const [screen, setScreen] = useState("splash");
  const [users, setUsers] = useState({});
  const [me, setMe] = useState(null);
  const [authErr, setAuthErr] = useState("");
  const [reg, setReg] = useState({ name: "", age: "", gender: "", mobile: "", email: "", purpose: "", password: "", confirm: "" });
  const [log, setLog] = useState({ email: "", password: "" });
  const [tasks, setTasks] = useState([]);
  const [notes, setNotes] = useState([]);
  const [rems, setRems] = useState([]);
  const [tab, setTab] = useState("tasks");
  const [nt, setNt] = useState({ title: "", category: "Work", priority: "Medium" });
  const [nn, setNn] = useState("");
  const [nr, setNr] = useState({ title: "", time: "" });
  const [addTask, setAddTask] = useState(false);
  const [chgPwd, setChgPwd] = useState(false);
  const [pwd, setPwd] = useState({ old: "", newP: "", confirm: "" });
  const [pwdErr, setPwdErr] = useState("");
  const [toast, setToast] = useState(null);
  const [filt, setFilt] = useState("All");

  // Splash timer
  useEffect(() => {
    const t = setTimeout(() => setScreen("login"), 2200);
    return () => clearTimeout(t);
  }, []);

  const pop = (msg, type = "ok") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const doRegister = () => {
    const { name, age, gender, mobile, email, purpose, password, confirm } = reg;
    if (!name || !age || !gender || !mobile || !email || !purpose || !password) {
      setAuthErr("Please fill in all fields."); return;
    }
    if (password !== confirm) { setAuthErr("Passwords do not match."); return; }
    if (users[email]) { setAuthErr("This email is already registered."); return; }
    setUsers(prev => ({ ...prev, [email]: { name, age, gender, mobile, email, purpose, password, tasks: [], notes: [], rems: [] } }));
    setAuthErr("");
    setReg({ name: "", age: "", gender: "", mobile: "", email: "", purpose: "", password: "", confirm: "" });
    pop("Account created! Please sign in.");
    setScreen("login");
  };

  const doLogin = () => {
    const { email, password } = log;
    if (!email || !password) { setAuthErr("Enter your email and password."); return; }
    const u = users[email];
    if (!u) { setAuthErr("No account found with this email."); return; }
    if (u.password !== password) { setAuthErr("Wrong password. Try again."); return; }
    setMe(email);
    setTasks(u.tasks || []);
    setNotes(u.notes || []);
    setRems(u.rems || []);
    setAuthErr("");
    setLog({ email: "", password: "" });
    setScreen("app");
  };

  const save = (newTasks, newNotes, newRems) => {
    const t = newTasks ?? tasks;
    const n = newNotes ?? notes;
    const r = newRems ?? rems;
    setUsers(prev => ({ ...prev, [me]: { ...prev[me], tasks: t, notes: n, rems: r } }));
  };

  const doLogout = () => { setMe(null); setTasks([]); setNotes([]); setRems([]); setScreen("login"); };

  const doChangePwd = () => {
    const u = users[me];
    if (u.password !== pwd.old) { setPwdErr("Current password is wrong."); return; }
    if (pwd.newP !== pwd.confirm) { setPwdErr("New passwords don't match."); return; }
    setUsers(prev => ({ ...prev, [me]: { ...prev[me], password: pwd.newP } }));
    setChgPwd(false); setPwdErr(""); setPwd({ old: "", newP: "", confirm: "" });
    pop("Password updated!");
  };

  const taskAdd = () => {
    if (!nt.title.trim()) return;
    const updated = [...tasks, { id: Date.now(), ...nt, done: false }];
    setTasks(updated); save(updated, null, null);
    setNt({ title: "", category: "Work", priority: "Medium" }); setAddTask(false); pop("Task added!");
  };
  const taskToggle = (id) => { const u = tasks.map(t => t.id === id ? { ...t, done: !t.done } : t); setTasks(u); save(u, null, null); };
  const taskDel = (id) => { const u = tasks.filter(t => t.id !== id); setTasks(u); save(u, null, null); };

  const noteAdd = () => {
    if (!nn.trim()) return;
    const u = [{ id: Date.now(), text: nn, at: new Date().toLocaleString() }, ...notes];
    setNotes(u); save(null, u, null); setNn(""); pop("Note saved!");
  };
  const noteDel = (id) => { const u = notes.filter(n => n.id !== id); setNotes(u); save(null, u, null); };

  const remAdd = () => {
    if (!nr.title.trim() || !nr.time) return;
    const u = [...rems, { id: Date.now(), ...nr }];
    setRems(u); save(null, null, u); setNr({ title: "", time: "" }); pop("Reminder set!");
  };
  const remDel = (id) => { const u = rems.filter(r => r.id !== id); setRems(u); save(null, null, u); };

  const done = tasks.filter(t => t.done).length;
  const pending = tasks.length - done;
  const ud = me ? users[me] : null;
  const shown = tasks.filter(t => filt === "All" || t.category === filt);
  const quote = QUOTES[new Date().getDate() % QUOTES.length];

  // ── shared styles ──
  const BG = "linear-gradient(135deg,#070d07 0%,#0b1810 50%,#070d14 100%)";
  const inp = {
    width: "100%", background: "rgba(255,255,255,0.06)", border: "1.5px solid rgba(99,232,175,0.2)",
    borderRadius: "11px", padding: "0.78rem 0.95rem", color: "#dff0e8", fontSize: "0.9rem",
    outline: "none", boxSizing: "border-box", fontFamily: "inherit",
  };
  const lbl = { display: "block", fontSize: "0.7rem", fontWeight: 700, color: "#4a8060", letterSpacing: "0.12em", marginBottom: "0.32rem" };
  const btnMain = {
    width: "100%", padding: "0.88rem", borderRadius: "11px", border: "none", cursor: "pointer",
    background: "linear-gradient(135deg,#63E8AF,#38b0ff)", color: "#071410", fontWeight: 800,
    fontSize: "0.97rem", fontFamily: "inherit", boxShadow: "0 4px 22px rgba(99,232,175,0.28)",
  };
  const btnOut = {
    background: "transparent", border: "1.5px solid rgba(99,232,175,0.28)", color: "#63E8AF",
    padding: "0.6rem 1rem", borderRadius: "10px", cursor: "pointer", fontFamily: "inherit",
    fontSize: "0.82rem", fontWeight: 700,
  };
  const authCard = {
    background: "rgba(12,22,15,0.97)", border: "1px solid rgba(99,232,175,0.13)",
    borderRadius: "22px", padding: "2.4rem 1.9rem", width: "100%", maxWidth: "410px",
    boxShadow: "0 28px 70px rgba(0,0,0,0.55)",
  };
  const errBox = {
    marginTop: "0.8rem", background: "rgba(255,107,157,0.09)", border: "1px solid rgba(255,107,157,0.25)",
    borderRadius: "8px", padding: "0.6rem 0.9rem", color: "#ff8ab8", fontSize: "0.82rem",
  };
  const modal = {
    background: "rgba(10,20,13,0.98)", border: "1px solid rgba(99,232,175,0.18)",
    borderRadius: "22px", padding: "1.9rem 1.7rem", width: "100%", maxWidth: "370px",
    boxShadow: "0 28px 70px rgba(0,0,0,0.6)",
  };

  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
    * { box-sizing:border-box; margin:0; padding:0; }
    body, input, textarea, select, button { font-family:'Plus Jakarta Sans',sans-serif; }
    input { color:#dff0e8 !important; }
    input::placeholder, textarea::placeholder { color:#2e5040 !important; }
    select option { background:#0b1810; color:#dff0e8; }
    ::-webkit-scrollbar { width:3px; height:3px; }
    ::-webkit-scrollbar-thumb { background:rgba(99,232,175,0.18); border-radius:2px; }
    @keyframes spin { to { transform:rotate(360deg); } }
    @keyframes up { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
    @keyframes glow { 0%,100%{opacity:0.5} 50%{opacity:1} }
    @keyframes toastin { from{opacity:0;transform:translateX(-50%) translateY(-10px)} to{opacity:1;transform:translateX(-50%) translateY(0)} }
  `;

  // ── SPLASH ──────────────────────────────────────────────────────────────────
  if (screen === "splash") return (
    <div style={{ minHeight: "100vh", background: BG, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "1.4rem" }}>
      <style>{css}</style>
      <div style={{ background: "linear-gradient(135deg,#63E8AF,#38b0ff)", borderRadius: "22px", padding: "1.1rem", boxShadow: "0 0 55px rgba(99,232,175,0.45)", animation: "glow 1.4s ease-in-out infinite" }}>
        <Logo size={60} color="#071410" />
      </div>
      <div style={{ textAlign: "center", animation: "up 0.7s ease 0.25s both" }}>
        <div style={{ fontSize: "3rem", fontWeight: 800, background: "linear-gradient(135deg,#63E8AF,#38b0ff)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>GoalTrail</div>
        <div style={{ color: "#3a6050", fontSize: "0.85rem", letterSpacing: "0.28em", marginTop: "0.25rem" }}>PERSONAL PROGRESS TRACKER</div>
      </div>
      <div style={{ display: "flex", gap: "0.45rem", animation: "up 0.7s ease 0.6s both" }}>
        {[0, 1, 2].map(i => <div key={i} style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#63E8AF", opacity: 0.4, animation: `glow 0.8s ease ${i * 0.2}s infinite` }} />)}
      </div>
    </div>
  );

  // ── REGISTER ────────────────────────────────────────────────────────────────
  if (screen === "register") return (
    <div style={{ minHeight: "100vh", background: BG, display: "flex", justifyContent: "center", alignItems: "flex-start", padding: "2rem 1rem 3rem" }}>
      <style>{css}</style>
      {toast && <div style={{ position: "fixed", top: "1.2rem", left: "50%", transform: "translateX(-50%)", background: "linear-gradient(135deg,#63E8AF,#38b0ff)", color: "#071410", padding: "0.65rem 1.4rem", borderRadius: "30px", fontWeight: 700, fontSize: "0.83rem", zIndex: 999, animation: "toastin .3s ease", whiteSpace: "nowrap" }}>{toast.msg}</div>}
      <div style={authCard}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.8rem" }}>
          <div style={{ background: "linear-gradient(135deg,#63E8AF,#38b0ff)", borderRadius: "10px", padding: "0.48rem" }}><Logo size={26} color="#071410" /></div>
          <div>
            <div style={{ fontSize: "1.65rem", fontWeight: 800, color: "#e0f0e8" }}>Create Account</div>
            <div style={{ color: "#3a6050", fontSize: "0.8rem" }}>Join GoalTrail today</div>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.82rem" }}>
          <div><label style={lbl}>FULL NAME</label><input style={inp} placeholder="Jane Doe" value={reg.name} onChange={e => setReg({ ...reg, name: e.target.value })} /></div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.85rem" }}>
            <div><label style={lbl}>AGE</label><input style={inp} type="number" placeholder="25" value={reg.age} onChange={e => setReg({ ...reg, age: e.target.value })} /></div>
            <div><label style={lbl}>GENDER</label>
              <select style={{ ...inp, background: "rgba(12,22,15,0.97)" }} value={reg.gender} onChange={e => setReg({ ...reg, gender: e.target.value })}>
                <option value="">Select</option><option>Male</option><option>Female</option><option>Other</option>
              </select>
            </div>
          </div>
          <div><label style={lbl}>MOBILE</label><input style={inp} placeholder="+91 98765 43210" value={reg.mobile} onChange={e => setReg({ ...reg, mobile: e.target.value })} /></div>
          <div><label style={lbl}>EMAIL</label><input style={inp} type="email" placeholder="you@email.com" value={reg.email} onChange={e => setReg({ ...reg, email: e.target.value })} /></div>
          <div><label style={lbl}>PURPOSE / GOAL</label><input style={inp} placeholder="I want to use GoalTrail to..." value={reg.purpose} onChange={e => setReg({ ...reg, purpose: e.target.value })} /></div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.85rem" }}>
            <div><label style={lbl}>PASSWORD</label><input style={inp} type="password" placeholder="••••••••" value={reg.password} onChange={e => setReg({ ...reg, password: e.target.value })} /></div>
            <div><label style={lbl}>CONFIRM</label><input style={inp} type="password" placeholder="••••••••" value={reg.confirm} onChange={e => setReg({ ...reg, confirm: e.target.value })} /></div>
          </div>
        </div>
        {authErr && <div style={errBox}>⚠ {authErr}</div>}
        <button style={{ ...btnMain, marginTop: "1.4rem" }} onClick={doRegister}>Create My Account →</button>
        <div style={{ textAlign: "center", marginTop: "1rem", fontSize: "0.83rem", color: "#3a6050" }}>
          Already have an account?{" "}
          <span style={{ color: "#63E8AF", cursor: "pointer", fontWeight: 700 }} onClick={() => { setAuthErr(""); setScreen("login"); }}>Sign In</span>
        </div>
      </div>
    </div>
  );

  // ── LOGIN ────────────────────────────────────────────────────────────────────
  if (screen === "login") return (
    <div style={{ minHeight: "100vh", background: BG, display: "flex", justifyContent: "center", alignItems: "center", padding: "1rem" }}>
      <style>{css}</style>
      {toast && <div style={{ position: "fixed", top: "1.2rem", left: "50%", transform: "translateX(-50%)", background: "linear-gradient(135deg,#63E8AF,#38b0ff)", color: "#071410", padding: "0.65rem 1.4rem", borderRadius: "30px", fontWeight: 700, fontSize: "0.83rem", zIndex: 999, animation: "toastin .3s ease", whiteSpace: "nowrap" }}>{toast.msg}</div>}
      <div style={authCard}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: "2rem" }}>
          <div style={{ background: "linear-gradient(135deg,#63E8AF,#38b0ff)", borderRadius: "16px", padding: "0.85rem", boxShadow: "0 0 38px rgba(99,232,175,0.35)", marginBottom: "0.9rem" }}>
            <Logo size={46} color="#071410" />
          </div>
          <div style={{ fontSize: "2.1rem", fontWeight: 800, background: "linear-gradient(135deg,#63E8AF,#38b0ff)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>GoalTrail</div>
          <div style={{ color: "#3a6050", fontSize: "0.75rem", letterSpacing: "0.24em", marginTop: "0.2rem" }}>YOUR PROGRESS COMPANION</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.95rem" }}>
          <div><label style={lbl}>EMAIL</label>
            <input style={inp} type="email" placeholder="you@email.com" value={log.email}
              onChange={e => setLog({ ...log, email: e.target.value })}
              onKeyDown={e => e.key === "Enter" && doLogin()} />
          </div>
          <div><label style={lbl}>PASSWORD</label>
            <input style={inp} type="password" placeholder="••••••••" value={log.password}
              onChange={e => setLog({ ...log, password: e.target.value })}
              onKeyDown={e => e.key === "Enter" && doLogin()} />
          </div>
        </div>
        {authErr && <div style={errBox}>⚠ {authErr}</div>}
        <button style={{ ...btnMain, marginTop: "1.4rem" }} onClick={doLogin}>Sign In →</button>
        <div style={{ textAlign: "center", marginTop: "1rem", fontSize: "0.83rem", color: "#3a6050" }}>
          New here?{" "}
          <span style={{ color: "#63E8AF", cursor: "pointer", fontWeight: 700 }} onClick={() => { setAuthErr(""); setScreen("register"); }}>Create account</span>
        </div>
      </div>
    </div>
  );

  // ── APP ──────────────────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: "100vh", background: BG, color: "#dff0e8", fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
      <style>{css}</style>

      {/* Toast */}
      {toast && <div style={{ position: "fixed", top: "70px", left: "50%", transform: "translateX(-50%)", background: toast.type === "ok" ? "linear-gradient(135deg,#63E8AF,#38b0ff)" : "#FF6B9D", color: "#071410", padding: "0.65rem 1.4rem", borderRadius: "30px", fontWeight: 700, fontSize: "0.83rem", zIndex: 999, animation: "toastin .3s ease", whiteSpace: "nowrap", boxShadow: "0 6px 24px rgba(99,232,175,0.3)" }}>{toast.msg}</div>}

      {/* Change-pwd modal */}
      {chgPwd && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.72)", backdropFilter: "blur(7px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200, padding: "1rem" }}
          onClick={e => e.target === e.currentTarget && (setChgPwd(false), setPwdErr(""))}>
          <div style={modal}>
            <div style={{ fontSize: "1.15rem", fontWeight: 800, marginBottom: "1.4rem", color: "#c8e8d8" }}>🔒 Change Password</div>
            {[["CURRENT PASSWORD", "old"], ["NEW PASSWORD", "newP"], ["CONFIRM NEW", "confirm"]].map(([l, k]) => (
              <div key={k} style={{ marginBottom: "0.82rem" }}>
                <label style={lbl}>{l}</label>
                <input style={inp} type="password" value={pwd[k]} onChange={e => setPwd({ ...pwd, [k]: e.target.value })} />
              </div>
            ))}
            {pwdErr && <div style={errBox}>⚠ {pwdErr}</div>}
            <div style={{ display: "flex", gap: "0.75rem", marginTop: "1.2rem" }}>
              <button style={{ ...btnOut, flex: 1 }} onClick={() => { setChgPwd(false); setPwdErr(""); }}>Cancel</button>
              <button style={{ ...btnMain, flex: 1 }} onClick={doChangePwd}>Update</button>
            </div>
          </div>
        </div>
      )}

      {/* Add-task modal */}
      {addTask && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.72)", backdropFilter: "blur(7px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200, padding: "1rem" }}
          onClick={e => e.target === e.currentTarget && setAddTask(false)}>
          <div style={modal}>
            <div style={{ fontSize: "1.15rem", fontWeight: 800, marginBottom: "1.4rem", color: "#c8e8d8" }}>✦ New Task</div>
            <div style={{ marginBottom: "0.82rem" }}>
              <label style={lbl}>TASK TITLE</label>
              <input style={inp} placeholder="What do you want to achieve?" value={nt.title}
                onChange={e => setNt({ ...nt, title: e.target.value })}
                onKeyDown={e => e.key === "Enter" && taskAdd()} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.85rem", marginBottom: "0.9rem" }}>
              <div><label style={lbl}>CATEGORY</label>
                <select style={{ ...inp, background: "rgba(10,20,13,0.98)" }} value={nt.category} onChange={e => setNt({ ...nt, category: e.target.value })}>
                  {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div><label style={lbl}>PRIORITY</label>
                <select style={{ ...inp, background: "rgba(10,20,13,0.98)" }} value={nt.priority} onChange={e => setNt({ ...nt, priority: e.target.value })}>
                  <option>Low</option><option>Medium</option><option>High</option>
                </select>
              </div>
            </div>
            <div style={{ display: "flex", gap: "0.75rem" }}>
              <button style={{ ...btnOut, flex: 1 }} onClick={() => setAddTask(false)}>Cancel</button>
              <button style={{ ...btnMain, flex: 1 }} onClick={taskAdd}>Add Task</button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header style={{ background: "rgba(7,14,9,0.92)", borderBottom: "1px solid rgba(99,232,175,0.1)", backdropFilter: "blur(18px)", padding: "0 1.4rem", height: "60px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.55rem" }}>
          <div style={{ background: "linear-gradient(135deg,#63E8AF,#38b0ff)", borderRadius: "8px", padding: "0.28rem" }}><Logo size={22} color="#071410" /></div>
          <span style={{ fontSize: "1.35rem", fontWeight: 800, background: "linear-gradient(135deg,#63E8AF,#38b0ff)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>GoalTrail</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
          <div style={{ width: "34px", height: "34px", borderRadius: "50%", background: "linear-gradient(135deg,#63E8AF,#38b0ff)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, color: "#071410", fontSize: "0.95rem" }}>
            {ud?.name?.[0]?.toUpperCase()}
          </div>
          <button style={{ ...btnOut, padding: "0.38rem 0.72rem", fontSize: "0.73rem" }} onClick={() => setChgPwd(true)}>🔑</button>
          <button style={{ ...btnOut, padding: "0.38rem 0.72rem", fontSize: "0.73rem" }} onClick={doLogout}>Exit</button>
        </div>
      </header>

      {/* Quote */}
      <div style={{ margin: "1.1rem 1.3rem 0", padding: "0.85rem 1.1rem", background: "rgba(99,232,175,0.05)", border: "1px solid rgba(99,232,175,0.1)", borderRadius: "13px", display: "flex", gap: "0.7rem", alignItems: "center" }}>
        <span style={{ fontSize: "1.2rem" }}>💡</span>
        <span style={{ fontSize: "0.82rem", color: "#7ab890", fontStyle: "italic", lineHeight: 1.5 }}>{quote}</span>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.9rem", padding: "1.1rem 1.3rem" }}>
        {[{ n: done, l: "Done", c: "#63E8AF" }, { n: pending, l: "Pending", c: "#FF6B9D" }, { n: tasks.length, l: "Total", c: "#38b0ff" }].map(s => (
          <div key={s.l} style={{ background: "rgba(14,26,18,0.8)", border: "1px solid rgba(99,232,175,0.09)", borderRadius: "14px", padding: "1rem 0.8rem", textAlign: "center" }}>
            <div style={{ fontSize: "1.85rem", fontWeight: 800, color: s.c, lineHeight: 1 }}>{s.n}</div>
            <div style={{ fontSize: "0.65rem", color: "#3a6050", letterSpacing: "0.1em", marginTop: "0.25rem", textTransform: "uppercase" }}>{s.l}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "0.45rem", padding: "0 1.3rem 0.9rem", overflowX: "auto", scrollbarWidth: "none" }}>
        {[["tasks", "📋 Tasks"], ["progress", "📊 Progress"], ["notes", "📝 Notes"], ["reminders", "⏰ Reminders"], ["about", "👤 About"]].map(([id, label]) => (
          <button key={id} onClick={() => setTab(id)} style={{ padding: "0.46rem 1.05rem", borderRadius: "20px", border: "none", cursor: "pointer", fontSize: "0.78rem", fontWeight: 700, whiteSpace: "nowrap", background: tab === id ? "linear-gradient(135deg,#63E8AF,#38b0ff)" : "rgba(255,255,255,0.05)", color: tab === id ? "#071410" : "#4a7a5a", transition: "all .2s" }}>{label}</button>
        ))}
      </div>

      {/* Content */}
      <div style={{ padding: "0 1.3rem 5rem" }}>

        {/* TASKS */}
        {tab === "tasks" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.9rem" }}>
              <div style={{ fontSize: "1rem", fontWeight: 800, color: "#b8dcc8" }}>My Tasks</div>
              <button style={{ ...btnOut, fontSize: "0.78rem", padding: "0.46rem 0.95rem" }} onClick={() => setAddTask(true)}>+ Add Task</button>
            </div>
            <div style={{ display: "flex", gap: "0.38rem", marginBottom: "0.9rem", overflowX: "auto", paddingBottom: "0.2rem" }}>
              {["All", ...CATEGORIES].map(c => (
                <button key={c} onClick={() => setFilt(c)} style={{ padding: "0.32rem 0.85rem", borderRadius: "20px", border: filt === c ? "1px solid rgba(99,232,175,0.4)" : "1px solid transparent", cursor: "pointer", fontSize: "0.73rem", fontWeight: 700, whiteSpace: "nowrap", background: filt === c ? "rgba(99,232,175,0.14)" : "rgba(255,255,255,0.04)", color: filt === c ? "#63E8AF" : "#3a6050" }}>{c}</button>
              ))}
            </div>
            {shown.length === 0
              ? <div style={{ textAlign: "center", padding: "2.5rem 1rem", color: "#2e4a3a" }}><div style={{ fontSize: "2.3rem" }}>🎯</div><div style={{ marginTop: "0.5rem" }}>No tasks here. Add your first goal!</div></div>
              : shown.map(t => (
                <div key={t.id} style={{ background: t.done ? "rgba(99,232,175,0.04)" : "rgba(14,26,18,0.8)", border: `1px solid ${t.done ? "rgba(99,232,175,0.18)" : "rgba(99,232,175,0.07)"}`, borderRadius: "13px", padding: "0.82rem 0.95rem", marginBottom: "0.6rem", display: "flex", alignItems: "center", gap: "0.7rem" }}>
                  <div style={{ width: "7px", height: "7px", borderRadius: "50%", background: PRI_COLOR[t.priority], flexShrink: 0 }} />
                  <div onClick={() => taskToggle(t.id)} style={{ width: "21px", height: "21px", borderRadius: "6px", flexShrink: 0, cursor: "pointer", border: t.done ? "none" : "2px solid rgba(99,232,175,0.35)", background: t.done ? "linear-gradient(135deg,#63E8AF,#38b0ff)" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.72rem", color: "#071410", fontWeight: 900 }}>
                    {t.done && "✓"}
                  </div>
                  <div style={{ flex: 1, fontSize: "0.87rem", fontWeight: 600, color: t.done ? "#3a6050" : "#cce8d8", textDecoration: t.done ? "line-through" : "none" }}>{t.title}</div>
                  <span style={{ fontSize: "0.62rem", padding: "0.18rem 0.55rem", borderRadius: "20px", background: CAT_COLOR[t.category], color: "#b0ccc0", fontWeight: 700, whiteSpace: "nowrap" }}>{t.category}</span>
                  <button style={{ background: "none", border: "none", cursor: "pointer", color: "#2e5040", fontSize: "0.82rem", padding: "0.18rem", flexShrink: 0 }} onClick={() => taskDel(t.id)}>✕</button>
                </div>
              ))
            }
          </div>
        )}

        {/* PROGRESS */}
        {tab === "progress" && (
          <div>
            <div style={{ fontSize: "1rem", fontWeight: 800, color: "#b8dcc8", marginBottom: "0.9rem" }}>Progress Overview</div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "2rem", background: "rgba(14,26,18,0.8)", border: "1px solid rgba(99,232,175,0.09)", borderRadius: "18px", padding: "1.4rem", marginBottom: "0.9rem" }}>
              <PieChart done={done} total={tasks.length} />
              <div style={{ display: "flex", flexDirection: "column", gap: "0.7rem" }}>
                {[{ c: "#63E8AF", l: "Completed", v: done }, { c: "#FF6B9D", l: "Pending", v: pending }, { c: "#38b0ff", l: "Total", v: tasks.length }].map(x => (
                  <div key={x.l} style={{ display: "flex", alignItems: "center", gap: "0.48rem", fontSize: "0.8rem", color: "#7a9a88" }}>
                    <div style={{ width: "9px", height: "9px", borderRadius: "50%", background: x.c, flexShrink: 0 }} />
                    {x.l}: <strong style={{ color: x.c }}>{x.v}</strong>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ fontSize: "1rem", fontWeight: 800, color: "#b8dcc8", marginBottom: "0.7rem" }}>By Category</div>
            {CATEGORIES.map(cat => {
              const ct = tasks.filter(t => t.category === cat);
              const cd = ct.filter(t => t.done).length;
              const p = ct.length === 0 ? 0 : Math.round((cd / ct.length) * 100);
              if (!ct.length) return null;
              return (
                <div key={cat} style={{ background: "rgba(14,26,18,0.8)", border: "1px solid rgba(99,232,175,0.07)", borderRadius: "13px", padding: "0.9rem", marginBottom: "0.55rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.45rem" }}>
                    <span style={{ fontSize: "0.83rem", fontWeight: 700, color: "#cce8d8" }}>{cat}</span>
                    <span style={{ fontSize: "0.78rem", color: "#63E8AF" }}>{cd}/{ct.length} · {p}%</span>
                  </div>
                  <div style={{ height: "5px", borderRadius: "3px", background: "rgba(99,232,175,0.09)" }}>
                    <div style={{ height: "100%", borderRadius: "3px", width: `${p}%`, background: "linear-gradient(90deg,#63E8AF,#38b0ff)" }} />
                  </div>
                </div>
              );
            })}
            {tasks.length === 0 && <div style={{ textAlign: "center", padding: "2rem", color: "#2e4a3a" }}><div style={{ fontSize: "2rem" }}>📊</div><div style={{ marginTop: "0.5rem" }}>Add tasks to see your progress!</div></div>}
          </div>
        )}

        {/* NOTES */}
        {tab === "notes" && (
          <div>
            <div style={{ fontSize: "1rem", fontWeight: 800, color: "#b8dcc8", marginBottom: "0.9rem" }}>Quick Notes</div>
            <div style={{ marginBottom: "1.1rem" }}>
              <textarea style={{ width: "100%", background: "rgba(255,255,255,0.06)", border: "1.5px solid rgba(99,232,175,0.2)", borderRadius: "12px", padding: "0.82rem 0.95rem", color: "#dff0e8", fontSize: "0.87rem", outline: "none", resize: "vertical", minHeight: "78px", boxSizing: "border-box" }}
                placeholder="Jot down your thoughts..." value={nn} onChange={e => setNn(e.target.value)} />
              <button style={{ ...btnMain, marginTop: "0.55rem", width: "auto", padding: "0.68rem 1.4rem" }} onClick={noteAdd}>Save Note</button>
            </div>
            {notes.length === 0
              ? <div style={{ textAlign: "center", padding: "2rem", color: "#2e4a3a" }}><div style={{ fontSize: "2.3rem" }}>📝</div><div style={{ marginTop: "0.5rem" }}>No notes yet.</div></div>
              : notes.map(n => (
                <div key={n.id} style={{ background: "rgba(14,26,18,0.8)", border: "1px solid rgba(99,232,175,0.07)", borderRadius: "13px", padding: "0.95rem", marginBottom: "0.6rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: "0.5rem" }}>
                    <div style={{ fontSize: "0.86rem", color: "#b8d8c0", lineHeight: 1.6, flex: 1 }}>{n.text}</div>
                    <button style={{ background: "none", border: "none", cursor: "pointer", color: "#2e5040", fontSize: "0.82rem", flexShrink: 0 }} onClick={() => noteDel(n.id)}>✕</button>
                  </div>
                  <div style={{ fontSize: "0.68rem", color: "#2e5040", marginTop: "0.38rem" }}>{n.at}</div>
                </div>
              ))
            }
          </div>
        )}

        {/* REMINDERS */}
        {tab === "reminders" && (
          <div>
            <div style={{ fontSize: "1rem", fontWeight: 800, color: "#b8dcc8", marginBottom: "0.9rem" }}>Reminders</div>
            <div style={{ background: "rgba(14,26,18,0.8)", border: "1px solid rgba(99,232,175,0.09)", borderRadius: "15px", padding: "1.1rem", marginBottom: "0.9rem" }}>
              <div style={{ marginBottom: "0.82rem" }}><label style={lbl}>REMINDER TITLE</label><input style={inp} placeholder="What should I remind you?" value={nr.title} onChange={e => setNr({ ...nr, title: e.target.value })} /></div>
              <div style={{ marginBottom: "0.82rem" }}><label style={lbl}>TIME</label><input style={inp} type="time" value={nr.time} onChange={e => setNr({ ...nr, time: e.target.value })} /></div>
              <button style={{ ...btnMain, width: "auto", padding: "0.68rem 1.4rem" }} onClick={remAdd}>Set Reminder</button>
            </div>
            <div style={{ background: "rgba(56,176,255,0.05)", border: "1px solid rgba(56,176,255,0.12)", borderRadius: "11px", padding: "0.75rem 0.95rem", marginBottom: "0.9rem", fontSize: "0.78rem", color: "#5a9bbf" }}>
              📧 Email reminders would go to <strong style={{ color: "#38b0ff" }}>{ud?.email}</strong>
            </div>
            {rems.length === 0
              ? <div style={{ textAlign: "center", padding: "2rem", color: "#2e4a3a" }}><div style={{ fontSize: "2.3rem" }}>⏰</div><div style={{ marginTop: "0.5rem" }}>No reminders yet.</div></div>
              : rems.map(r => (
                <div key={r.id} style={{ background: "rgba(14,26,18,0.8)", border: "1px solid rgba(56,176,255,0.1)", borderRadius: "13px", padding: "0.9rem", marginBottom: "0.6rem", display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <div style={{ fontSize: "1.2rem" }}>🔔</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: "0.86rem", fontWeight: 700, color: "#cce8d8" }}>{r.title}</div>
                    <div style={{ fontSize: "0.73rem", color: "#38b0ff", marginTop: "0.2rem" }}>⏰ {r.time}</div>
                  </div>
                  <button style={{ background: "none", border: "none", cursor: "pointer", color: "#2e5040", fontSize: "0.82rem" }} onClick={() => remDel(r.id)}>✕</button>
                </div>
              ))
            }
          </div>
        )}

        {/* ABOUT */}
        {tab === "about" && (
          <div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: "1.4rem", gap: "0.7rem" }}>
              <div style={{ background: "linear-gradient(135deg,#63E8AF,#38b0ff)", borderRadius: "50%", width: "68px", height: "68px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.7rem", fontWeight: 800, color: "#071410" }}>
                {ud?.name?.[0]?.toUpperCase()}
              </div>
              <div style={{ fontSize: "1.35rem", fontWeight: 800, color: "#c8e8d8" }}>{ud?.name}</div>
              <div style={{ fontSize: "0.72rem", color: "#3a6050", letterSpacing: "0.18em" }}>GOALTRAIL MEMBER</div>
            </div>
            <div style={{ background: "rgba(14,26,18,0.8)", border: "1px solid rgba(99,232,175,0.09)", borderRadius: "18px", padding: "1.4rem", marginBottom: "0.9rem" }}>
              {[["Full Name", ud?.name], ["Age", ud?.age + " years"], ["Gender", ud?.gender], ["Mobile", ud?.mobile], ["Email", ud?.email]].map(([k, v]) => (
                <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "0.46rem 0", borderBottom: "1px solid rgba(99,232,175,0.05)", fontSize: "0.83rem" }}>
                  <span style={{ color: "#3a6050", fontWeight: 600 }}>{k}</span>
                  <span style={{ color: "#c8e8d8", fontWeight: 700, textAlign: "right", maxWidth: "58%", wordBreak: "break-word" }}>{v}</span>
                </div>
              ))}
            </div>
            <div style={{ background: "rgba(14,26,18,0.8)", border: "1px solid rgba(99,232,175,0.13)", borderRadius: "18px", padding: "1.2rem", marginBottom: "0.9rem" }}>
              <div style={{ fontSize: "0.68rem", color: "#3a6050", letterSpacing: "0.12em", fontWeight: 700, marginBottom: "0.45rem" }}>MY PURPOSE</div>
              <div style={{ fontSize: "0.86rem", color: "#b0d8c0", lineHeight: 1.65 }}>{ud?.purpose}</div>
            </div>
            <div style={{ background: "rgba(99,232,175,0.04)", border: "1px solid rgba(99,232,175,0.09)", borderRadius: "18px", padding: "1.1rem", marginBottom: "0.9rem" }}>
              <div style={{ fontSize: "0.68rem", color: "#3a6050", letterSpacing: "0.12em", fontWeight: 700, marginBottom: "0.7rem" }}>MY STATS</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", textAlign: "center" }}>
                {[{ v: tasks.length, l: "TASKS", c: "#63E8AF" }, { v: notes.length, l: "NOTES", c: "#38b0ff" }, { v: rems.length, l: "REMINDERS", c: "#FF6B9D" }].map(s => (
                  <div key={s.l}><div style={{ fontSize: "1.5rem", fontWeight: 800, color: s.c }}>{s.v}</div><div style={{ fontSize: "0.6rem", color: "#3a6050" }}>{s.l}</div></div>
                ))}
              </div>
            </div>
            <button style={{ ...btnOut, width: "100%" }} onClick={() => setChgPwd(true)}>🔑 Change Password</button>
          </div>
        )}
      </div>

      {/* FAB */}
      {tab === "tasks" && (
        <button onClick={() => setAddTask(true)} style={{ position: "fixed", bottom: "1.8rem", right: "1.4rem", width: "54px", height: "54px", borderRadius: "15px", border: "none", cursor: "pointer", background: "linear-gradient(135deg,#63E8AF,#38b0ff)", boxShadow: "0 7px 28px rgba(99,232,175,0.38)", fontSize: "1.7rem", color: "#071410", fontWeight: 900, zIndex: 50 }}>+</button>
      )}
    </div>
  );
}
