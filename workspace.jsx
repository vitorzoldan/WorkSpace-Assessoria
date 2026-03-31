import { useState, useContext, createContext, useReducer, useRef, useEffect } from "react";

// ─── GLOBAL STATE ──────────────────────────────────────────────────────────────
const AppContext = createContext(null);

const initialState = {
  user: null,
  activeTab: "dashboard",
  notifications: [
    { id: 1, text: "Lead Carlos Mendes qualificado pelo SDR", time: "5min", read: false },
    { id: 2, text: "Campanha Q2 aprovada para publicação", time: "1h", read: false },
    { id: 3, text: "Proposta enviada para Família Rodrigues", time: "3h", read: true },
  ],
  marketing: {
    campaigns: [
      { id: 1, name: "Campanha Renda Fixa Premium", status: "em andamento", channel: "Instagram", resp: "Ana Lima", start: "2026-03-10", end: "2026-04-10", budget: 8000 },
      { id: 2, name: "Webinar Carteira Diversificada", status: "planejado", channel: "YouTube", resp: "Pedro Costa", start: "2026-04-15", end: "2026-04-30", budget: 3500 },
      { id: 3, name: "Email Mkt – Oportunidades Internacionais", status: "concluído", channel: "Email", resp: "Ana Lima", start: "2026-02-01", end: "2026-02-28", budget: 1200 },
      { id: 4, name: "Anúncios LinkedIn – Alto Patrimônio", status: "em andamento", channel: "LinkedIn", resp: "Marcos Dini", start: "2026-03-20", end: "2026-05-20", budget: 15000 },
    ],
    editorialDays: {
      "2026-04-01": ["Post: Renda Fixa vs CDB"],
      "2026-04-03": ["Stories: Dica semanal"],
      "2026-04-07": ["Email: Newsletter Mensal"],
      "2026-04-10": ["Post: Fundos Multimercado"],
      "2026-04-14": ["Reels: Perfil investidor"],
      "2026-04-21": ["Post: Tesouro Direto 2026"],
      "2026-04-28": ["Webinar ao vivo"],
    },
  },
  copies: [
    { id: 1, title: "Email Boas-vindas Cliente Premium", type: "email", content: "Olá {{nome}},\n\nSeja bem-vindo à nossa assessoria. É com grande satisfação que iniciamos essa jornada juntos rumo à construção do seu patrimônio ideal.\n\nNossa equipe está à disposição para orientá-lo em cada decisão de investimento.\n\nAbraços,\nEquipe de Assessoria", version: 3, updated: "2026-03-28", tags: ["onboarding", "boas-vindas"] },
    { id: 2, title: "Landing Page – Diagnóstico Gratuito", type: "landing", content: "🎯 Descubra se seus investimentos estão trabalhando por você\n\nMuitos investidores deixam dinheiro na mesa todos os meses sem saber.\n\nFaça seu diagnóstico financeiro gratuito com um de nossos especialistas e descubra como otimizar sua carteira para os seus objetivos.\n\n✅ 100% gratuito e sem compromisso\n✅ Análise personalizada\n✅ Acesso imediato", version: 2, updated: "2026-03-25", tags: ["conversão", "diagnóstico"] },
    { id: 3, title: "Anúncio – Meta Ads (Alto Patrimônio)", type: "ads", content: "Você tem mais de R$ 500k investidos?\n\nSua carteira pode estar rendendo muito menos do que deveria.\n\nConverse com um assessor especializado em grandes patrimônios. Sem custo, sem burocracia.", version: 1, updated: "2026-03-20", tags: ["ads", "prospecto"] },
    { id: 4, title: "Script Webinar – Renda Fixa 2026", type: "email", content: "Abertura (5min): Boas vindas e apresentação do palestrante...\n\nContexto de mercado (10min): O cenário atual da renda fixa...\n\nOportunidades (20min): CDBs, LCIs, LCAs e Debêntures...\n\nFechamento (10min): Próximos passos e diagnóstico gratuito.", version: 4, updated: "2026-03-15", tags: ["webinar", "conteúdo"] },
  ],
  assets: [
    { id: 1, name: "Banner Renda Fixa", type: "banner", tag: "ads", url: null, color: "#1a3a5c", date: "2026-03-20" },
    { id: 2, name: "Post Instagram – Dica", type: "post", tag: "posts", url: null, color: "#0e6b5e", date: "2026-03-22" },
    { id: 3, name: "Story Fundos", type: "story", tag: "posts", url: null, color: "#6b3a0e", date: "2026-03-24" },
    { id: 4, name: "Banner LinkedIn", type: "banner", tag: "banners", url: null, color: "#3a1a5c", date: "2026-03-26" },
    { id: 5, name: "Ad Tesouro Direto", type: "ad", tag: "ads", url: null, color: "#1a5c3a", date: "2026-03-27" },
    { id: 6, name: "Logo Variação Dark", type: "logo", tag: "banners", url: null, color: "#2d2d2d", date: "2026-03-28" },
  ],
  leads: [
    { id: 1, name: "Carlos Mendes", email: "carlos@email.com", phone: "(11) 99999-0001", status: "qualificado", patrimonio: "R$ 1.2M", origem: "LinkedIn", sdr: "Beatriz Torres", notes: "Interessado em renda fixa premium. Tem vencimento de CDB em abril.", followup: "2026-04-02", created: "2026-03-15" },
    { id: 2, name: "Família Rodrigues", email: "frodrigues@email.com", phone: "(11) 99999-0002", status: "contato feito", patrimonio: "R$ 3.5M", origem: "Indicação", sdr: "João Paulo", notes: "Família com múltiplos CPFs. Buscam diversificação internacional.", followup: "2026-04-05", created: "2026-03-18" },
    { id: 3, name: "Dr. Alexandre Neves", email: "aneves@email.com", phone: "(11) 99999-0003", status: "novo", patrimonio: "R$ 800k", origem: "Webinar", sdr: "Beatriz Torres", notes: "Médico, perfil conservador. Primeiro contato via formulário.", followup: "2026-04-01", created: "2026-03-28" },
    { id: 4, name: "Luciana Freitas", email: "lfreitas@email.com", phone: "(11) 99999-0004", status: "perdido", patrimonio: "R$ 600k", origem: "Instagram", sdr: "João Paulo", notes: "Optou por outro assessor. Tentar recontato em 6 meses.", followup: "2026-09-01", created: "2026-02-10" },
    { id: 5, name: "Roberto Campos", email: "rcampos@email.com", phone: "(11) 99999-0005", status: "qualificado", patrimonio: "R$ 2.1M", origem: "LinkedIn", sdr: "Beatriz Torres", notes: "Empresário, interesse em fundos internacionais e previdência.", followup: "2026-04-03", created: "2026-03-22" },
  ],
  deals: [
    { id: 1, name: "Carlos Mendes", stage: "reunião", value: 1200000, probability: 60, closer: "Rafael Souza", product: "Carteira Diversificada", lastContact: "2026-03-28", notes: "Reunião agendada para 03/04" },
    { id: 2, name: "Família Rodrigues", stage: "proposta", value: 3500000, probability: 75, closer: "Mariana Vaz", product: "Gestão Patrimonial Completa", lastContact: "2026-03-27", notes: "Proposta enviada, aguardando feedback" },
    { id: 3, name: "Roberto Campos", stage: "lead", value: 2100000, probability: 30, closer: "Rafael Souza", product: "Carteira Internacional", lastContact: "2026-03-26", notes: "Primeiro contato feito pelo SDR" },
    { id: 4, name: "Ana Beatriz Torres", stage: "fechamento", value: 900000, probability: 90, closer: "Mariana Vaz", product: "Renda Fixa Premium", lastContact: "2026-03-29", notes: "Documentação em andamento" },
    { id: 5, name: "Grupo Cavalcanti", stage: "reunião", value: 5000000, probability: 50, closer: "Rafael Souza", product: "Family Office", lastContact: "2026-03-25", notes: "Reunião com sócios na semana que vem" },
  ],
};

function reducer(state, action) {
  switch (action.type) {
    case "LOGIN": return { ...state, user: action.payload };
    case "LOGOUT": return { ...state, user: null, activeTab: "dashboard" };
    case "SET_TAB": return { ...state, activeTab: action.payload };
    case "MARK_NOTIF_READ": return { ...state, notifications: state.notifications.map(n => n.id === action.payload ? { ...n, read: true } : n) };
    case "ADD_LEAD": return { ...state, leads: [...state.leads, { ...action.payload, id: Date.now(), created: new Date().toISOString().slice(0, 10) }] };
    case "UPDATE_LEAD_STATUS": return { ...state, leads: state.leads.map(l => l.id === action.payload.id ? { ...l, status: action.payload.status } : l) };
    case "ADD_COPY": return { ...state, copies: [...state.copies, { ...action.payload, id: Date.now(), version: 1, updated: new Date().toISOString().slice(0, 10) }] };
    case "UPDATE_DEAL_STAGE": return { ...state, deals: state.deals.map(d => d.id === action.payload.id ? { ...d, stage: action.payload.stage } : d) };
    case "ADD_CAMPAIGN": return { ...state, marketing: { ...state.marketing, campaigns: [...state.marketing.campaigns, { ...action.payload, id: Date.now() }] } };
    default: return state;
  }
}

// ─── HELPERS ──────────────────────────────────────────────────────────────────
const fmtCurrency = (v) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", notation: "compact", maximumFractionDigits: 1 }).format(v);
const statusColor = { "planejado": "#3b82f6", "em andamento": "#f59e0b", "concluído": "#10b981", "novo": "#6366f1", "contato feito": "#3b82f6", "qualificado": "#10b981", "perdido": "#ef4444" };
const stageLabel = { lead: "Lead", reunião: "Reunião", proposta: "Proposta", fechamento: "Fechamento" };

// ─── ICONS ────────────────────────────────────────────────────────────────────
const Icon = ({ name, size = 18 }) => {
  const icons = {
    dashboard: <svg width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>,
    marketing: <svg width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>,
    copy: <svg width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
    designer: <svg width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="13.5" cy="6.5" r="2.5"/><circle cx="19" cy="17" r="2"/><circle cx="6" cy="17" r="2"/><path d="M12 20v-8"/><path d="M12 12l-5 5"/><path d="M12 12l5 5"/></svg>,
    sdr: <svg width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>,
    sales: <svg width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>,
    bell: <svg width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>,
    search: <svg width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
    plus: <svg width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
    chevron: <svg width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>,
    x: <svg width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
    logout: <svg width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
    calendar: <svg width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
    tag: <svg width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>,
    upload: <svg width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0018 9h-1.26A8 8 0 103 16.3"/></svg>,
    trending: <svg width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>,
    users: <svg width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>,
    check: <svg width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>,
    eye: <svg width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
    edit: <svg width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
    image: <svg width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>,
    filter: <svg width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>,
    menu: <svg width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>,
    figma: <svg width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M5 5.5A3.5 3.5 0 018.5 2H12v7H8.5A3.5 3.5 0 015 5.5z"/><path d="M12 2h3.5a3.5 3.5 0 110 7H12V2z"/><path d="M12 12.5a3.5 3.5 0 117 0 3.5 3.5 0 01-7 0z"/><path d="M5 19.5A3.5 3.5 0 018.5 16H12v3.5a3.5 3.5 0 11-7 0z"/><path d="M5 12.5A3.5 3.5 0 018.5 9H12v7H8.5A3.5 3.5 0 015 12.5z"/></svg>,
  };
  return icons[name] || null;
};

// ─── LOGIN PAGE ───────────────────────────────────────────────────────────────
function LoginPage({ dispatch }) {
  const [email, setEmail] = useState("admin@assessoria.com");
  const [pass, setPass] = useState("123456");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const handle = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      if (email === "admin@assessoria.com" && pass === "123456") {
        dispatch({ type: "LOGIN", payload: { name: "Rafael Andrade", role: "Gestor Geral", avatar: "RA" } });
      } else { setErr("Credenciais inválidas. Use o e-mail e senha padrão."); }
      setLoading(false);
    }, 800);
  };

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #0a1628 0%, #0f2044 50%, #0a1628 100%)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Playfair+Display:wght@600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #0a1628; }
        .login-input { width: 100%; padding: 12px 16px; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.12); border-radius: 10px; color: #e2e8f0; font-size: 14px; font-family: 'DM Sans', sans-serif; outline: none; transition: border-color 0.2s; }
        .login-input:focus { border-color: #3b82f6; }
        .login-btn { width: 100%; padding: 13px; background: linear-gradient(135deg, #1d4ed8, #3b82f6); border: none; border-radius: 10px; color: white; font-size: 15px; font-weight: 600; font-family: 'DM Sans', sans-serif; cursor: pointer; transition: opacity 0.2s; }
        .login-btn:hover { opacity: 0.9; }
      `}</style>
      <div style={{ width: "100%", maxWidth: 420, padding: "0 24px" }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ width: 56, height: 56, background: "linear-gradient(135deg, #1d4ed8, #3b82f6)", borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", fontSize: 22, fontWeight: 700, color: "white", fontFamily: "'Playfair Display', serif" }}>A</div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 700, color: "#f8fafc", marginBottom: 8 }}>Assessoria HNW</h1>
          <p style={{ color: "#94a3b8", fontSize: 14 }}>Plataforma de Gestão Interna</p>
        </div>
        <form onSubmit={handle}>
          <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: 32 }}>
            {err && <div style={{ background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 8, padding: "10px 14px", color: "#fca5a5", fontSize: 13, marginBottom: 20 }}>{err}</div>}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", color: "#94a3b8", fontSize: 12, fontWeight: 500, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>E-mail</label>
              <input className="login-input" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="seu@email.com" />
            </div>
            <div style={{ marginBottom: 24 }}>
              <label style={{ display: "block", color: "#94a3b8", fontSize: 12, fontWeight: 500, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>Senha</label>
              <input className="login-input" type="password" value={pass} onChange={e => setPass(e.target.value)} placeholder="••••••••" />
            </div>
            <button className="login-btn" type="submit" disabled={loading}>{loading ? "Autenticando..." : "Entrar"}</button>
          </div>
          <p style={{ textAlign: "center", color: "#475569", fontSize: 12, marginTop: 16 }}>admin@assessoria.com · senha: 123456</p>
        </form>
      </div>
    </div>
  );
}

// ─── SIDEBAR ──────────────────────────────────────────────────────────────────
function Sidebar({ activeTab, dispatch, user, sidebarOpen, setSidebarOpen }) {
  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: "dashboard" },
    { id: "marketing", label: "Marketing", icon: "marketing" },
    { id: "copywriter", label: "Copywriter", icon: "copy" },
    { id: "designer", label: "Designer", icon: "designer" },
    { id: "sdrs", label: "SDRs", icon: "sdr" },
    { id: "vendedores", label: "Vendedores", icon: "sales" },
  ];

  return (
    <>
      {sidebarOpen && <div onClick={() => setSidebarOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 40, display: "none" }} className="sidebar-overlay" />}
      <aside style={{ width: 240, minHeight: "100vh", background: "#0f172a", borderRight: "1px solid rgba(255,255,255,0.06)", display: "flex", flexDirection: "column", position: "fixed", top: 0, left: 0, bottom: 0, zIndex: 50, transition: "transform 0.3s" }}>
        <div style={{ padding: "24px 20px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 36, height: 36, background: "linear-gradient(135deg, #1d4ed8, #3b82f6)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Playfair Display', serif", fontSize: 16, fontWeight: 700, color: "white" }}>A</div>
            <div>
              <div style={{ color: "#f1f5f9", fontWeight: 700, fontSize: 15, fontFamily: "'Playfair Display', serif" }}>Assessoria</div>
              <div style={{ color: "#475569", fontSize: 11 }}>HNW Platform</div>
            </div>
          </div>
        </div>
        <nav style={{ flex: 1, padding: "16px 12px" }}>
          <div style={{ color: "#334155", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", padding: "0 8px 12px" }}>Workspace</div>
          {navItems.map(item => (
            <button key={item.id} onClick={() => { dispatch({ type: "SET_TAB", payload: item.id }); setSidebarOpen(false); }}
              style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", borderRadius: 8, border: "none", cursor: "pointer", marginBottom: 2, transition: "all 0.15s", background: activeTab === item.id ? "rgba(59,130,246,0.12)" : "transparent", color: activeTab === item.id ? "#60a5fa" : "#64748b", fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: activeTab === item.id ? 600 : 400, textAlign: "left" }}>
              <Icon name={item.icon} size={16} />
              {item.label}
              {activeTab === item.id && <div style={{ marginLeft: "auto", width: 3, height: 3, borderRadius: "50%", background: "#3b82f6" }} />}
            </button>
          ))}
        </nav>
        <div style={{ padding: "16px 20px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg, #1d4ed8, #6366f1)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: 12, fontWeight: 700 }}>{user?.avatar}</div>
            <div>
              <div style={{ color: "#e2e8f0", fontSize: 13, fontWeight: 600 }}>{user?.name}</div>
              <div style={{ color: "#475569", fontSize: 11 }}>{user?.role}</div>
            </div>
          </div>
          <button onClick={() => dispatch({ type: "LOGOUT" })} style={{ width: "100%", display: "flex", alignItems: "center", gap: 8, padding: "8px 10px", borderRadius: 8, border: "none", background: "rgba(239,68,68,0.08)", color: "#f87171", cursor: "pointer", fontSize: 13, fontFamily: "'DM Sans', sans-serif" }}>
            <Icon name="logout" size={14} /> Sair
          </button>
        </div>
      </aside>
    </>
  );
}

// ─── HEADER ───────────────────────────────────────────────────────────────────
function Header({ state, dispatch, setSidebarOpen }) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [searchVal, setSearchVal] = useState("");
  const unread = state.notifications.filter(n => !n.read).length;

  const tabLabels = { dashboard: "Dashboard", marketing: "Marketing", copywriter: "Copywriter", designer: "Designer", sdrs: "SDRs", vendedores: "Vendedores" };

  return (
    <header style={{ height: 64, background: "rgba(15,23,42,0.95)", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", padding: "0 24px", gap: 16, position: "sticky", top: 0, zIndex: 30, backdropFilter: "blur(12px)" }}>
      <button onClick={() => setSidebarOpen(o => !o)} style={{ display: "none", background: "none", border: "none", color: "#94a3b8", cursor: "pointer" }} className="menu-btn">
        <Icon name="menu" size={20} />
      </button>
      <h2 style={{ color: "#f1f5f9", fontWeight: 700, fontSize: 18, fontFamily: "'Playfair Display', serif", flex: 1 }}>{tabLabels[state.activeTab]}</h2>
      <div style={{ position: "relative" }}>
        {searchOpen
          ? <input autoFocus value={searchVal} onChange={e => setSearchVal(e.target.value)} onBlur={() => { setSearchOpen(false); setSearchVal(""); }} placeholder="Buscar leads, campanhas…" style={{ padding: "8px 14px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 8, color: "#e2e8f0", fontSize: 13, width: 260, fontFamily: "'DM Sans', sans-serif", outline: "none" }} />
          : <button onClick={() => setSearchOpen(true)} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, padding: "7px 12px", color: "#64748b", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontFamily: "'DM Sans', sans-serif" }}><Icon name="search" size={15} /><span>Buscar</span></button>}
      </div>
      <div style={{ position: "relative" }}>
        <button onClick={() => setNotifOpen(o => !o)} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, padding: 8, color: "#64748b", cursor: "pointer", position: "relative" }}>
          <Icon name="bell" size={18} />
          {unread > 0 && <span style={{ position: "absolute", top: 4, right: 4, width: 8, height: 8, background: "#ef4444", borderRadius: "50%" }} />}
        </button>
        {notifOpen && (
          <div style={{ position: "absolute", right: 0, top: "calc(100% + 8px)", width: 320, background: "#1e293b", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, overflow: "hidden", boxShadow: "0 20px 60px rgba(0,0,0,0.5)", zIndex: 100 }}>
            <div style={{ padding: "14px 16px", borderBottom: "1px solid rgba(255,255,255,0.08)", display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "#f1f5f9", fontWeight: 600, fontSize: 14 }}>Notificações</span>
              <span style={{ color: "#3b82f6", fontSize: 12, cursor: "pointer" }}>Marcar todas lidas</span>
            </div>
            {state.notifications.map(n => (
              <div key={n.id} onClick={() => dispatch({ type: "MARK_NOTIF_READ", payload: n.id })} style={{ padding: "12px 16px", borderBottom: "1px solid rgba(255,255,255,0.04)", cursor: "pointer", background: n.read ? "transparent" : "rgba(59,130,246,0.04)", display: "flex", gap: 10, alignItems: "flex-start" }}>
                {!n.read && <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#3b82f6", marginTop: 5, flexShrink: 0 }} />}
                <div style={{ flex: 1 }}>
                  <p style={{ color: "#cbd5e1", fontSize: 13, lineHeight: 1.4 }}>{n.text}</p>
                  <span style={{ color: "#475569", fontSize: 11 }}>há {n.time}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}

// ─── DASHBOARD ────────────────────────────────────────────────────────────────
function Dashboard({ state, dispatch }) {
  const totalPipeline = state.deals.reduce((a, d) => a + d.value, 0);
  const fechados = state.deals.filter(d => d.stage === "fechamento").reduce((a, d) => a + d.value, 0);
  const leadsQualif = state.leads.filter(l => l.status === "qualificado").length;
  const campanhas = state.marketing.campaigns.filter(c => c.status === "em andamento").length;

  const metrics = [
    { label: "Pipeline Total", value: fmtCurrency(totalPipeline), icon: "trending", color: "#3b82f6", sub: `${state.deals.length} negócios ativos` },
    { label: "Em Fechamento", value: fmtCurrency(fechados), icon: "sales", color: "#10b981", sub: "Taxa esperada" },
    { label: "Leads Qualificados", value: leadsQualif, icon: "sdr", color: "#6366f1", sub: `de ${state.leads.length} leads totais` },
    { label: "Campanhas Ativas", value: campanhas, icon: "marketing", color: "#f59e0b", sub: "em andamento" },
  ];

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16, marginBottom: 32 }}>
        {metrics.map((m, i) => (
          <div key={i} style={{ background: "#1e293b", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: "20px 22px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: `${m.color}20`, display: "flex", alignItems: "center", justifyContent: "center", color: m.color }}><Icon name={m.icon} size={20} /></div>
            </div>
            <div style={{ fontSize: 28, fontWeight: 700, color: "#f1f5f9", fontFamily: "'Playfair Display', serif", marginBottom: 4 }}>{m.value}</div>
            <div style={{ fontSize: 13, color: "#64748b", fontWeight: 500 }}>{m.label}</div>
            <div style={{ fontSize: 11, color: "#475569", marginTop: 2 }}>{m.sub}</div>
          </div>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div style={{ background: "#1e293b", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: 22 }}>
          <h3 style={{ color: "#f1f5f9", fontWeight: 700, fontSize: 15, marginBottom: 16, fontFamily: "'Playfair Display', serif" }}>Pipeline de Vendas</h3>
          {["lead", "reunião", "proposta", "fechamento"].map(stage => {
            const count = state.deals.filter(d => d.stage === stage).length;
            const val = state.deals.filter(d => d.stage === stage).reduce((a, d) => a + d.value, 0);
            const colors = { lead: "#6366f1", reunião: "#3b82f6", proposta: "#f59e0b", fechamento: "#10b981" };
            return (
              <div key={stage} style={{ marginBottom: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ color: "#94a3b8", fontSize: 13, textTransform: "capitalize" }}>{stageLabel[stage]}</span>
                  <span style={{ color: "#e2e8f0", fontSize: 13, fontWeight: 600 }}>{count} · {fmtCurrency(val)}</span>
                </div>
                <div style={{ height: 4, background: "rgba(255,255,255,0.06)", borderRadius: 4 }}>
                  <div style={{ height: "100%", width: `${(count / state.deals.length) * 100}%`, background: colors[stage], borderRadius: 4 }} />
                </div>
              </div>
            );
          })}
        </div>
        <div style={{ background: "#1e293b", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: 22 }}>
          <h3 style={{ color: "#f1f5f9", fontWeight: 700, fontSize: 15, marginBottom: 16, fontFamily: "'Playfair Display', serif" }}>Atividades Recentes</h3>
          {[
            { txt: "Lead Roberto Campos qualificado", time: "agora", color: "#10b981" },
            { txt: "Proposta enviada para Família Rodrigues", time: "2h", color: "#3b82f6" },
            { txt: "Campanha LinkedIn aprovada", time: "3h", color: "#f59e0b" },
            { txt: "Copy landing page atualizado (v2)", time: "5h", color: "#6366f1" },
            { txt: "Follow-up agendado: Dr. Alexandre", time: "7h", color: "#94a3b8" },
          ].map((a, i) => (
            <div key={i} style={{ display: "flex", gap: 12, marginBottom: 12, alignItems: "flex-start" }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: a.color, marginTop: 5, flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <p style={{ color: "#cbd5e1", fontSize: 13 }}>{a.txt}</p>
                <span style={{ color: "#475569", fontSize: 11 }}>há {a.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── MARKETING ────────────────────────────────────────────────────────────────
function Marketing({ state, dispatch }) {
  const [view, setView] = useState("campaigns");
  const [filterStatus, setFilterStatus] = useState("todos");
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: "", status: "planejado", channel: "Instagram", resp: "", budget: "" });

  const filtered = filterStatus === "todos" ? state.marketing.campaigns : state.marketing.campaigns.filter(c => c.status === filterStatus);

  const addCampaign = () => {
    dispatch({ type: "ADD_CAMPAIGN", payload: { ...form, budget: Number(form.budget), start: new Date().toISOString().slice(0, 10), end: "" } });
    setShowAdd(false);
    setForm({ name: "", status: "planejado", channel: "Instagram", resp: "", budget: "" });
  };

  const calDays = Array.from({ length: 30 }, (_, i) => {
    const d = new Date(2026, 3, i + 1);
    return { day: i + 1, date: `2026-04-${String(i + 1).padStart(2, "0")}`, dow: d.getDay() };
  });

  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
        {["campaigns", "editorial"].map(v => (
          <button key={v} onClick={() => setView(v)} style={{ padding: "8px 16px", borderRadius: 8, border: "1px solid", borderColor: view === v ? "#3b82f6" : "rgba(255,255,255,0.1)", background: view === v ? "rgba(59,130,246,0.12)" : "transparent", color: view === v ? "#60a5fa" : "#64748b", cursor: "pointer", fontSize: 13, fontFamily: "'DM Sans', sans-serif", fontWeight: 500 }}>
            {v === "campaigns" ? "Campanhas" : "Calendário Editorial"}
          </button>
        ))}
        <button onClick={() => setShowAdd(true)} style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 8, border: "none", background: "#1d4ed8", color: "white", cursor: "pointer", fontSize: 13, fontFamily: "'DM Sans', sans-serif", fontWeight: 600 }}><Icon name="plus" size={14} />Nova Campanha</button>
      </div>

      {showAdd && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ background: "#1e293b", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 16, padding: 28, width: 440 }}>
            <h3 style={{ color: "#f1f5f9", fontWeight: 700, fontSize: 16, marginBottom: 20, fontFamily: "'Playfair Display', serif" }}>Nova Campanha</h3>
            {["name", "resp", "budget"].map(f => (
              <div key={f} style={{ marginBottom: 14 }}>
                <label style={{ display: "block", color: "#94a3b8", fontSize: 12, marginBottom: 6, textTransform: "capitalize" }}>{f === "resp" ? "Responsável" : f === "budget" ? "Orçamento (R$)" : "Nome"}</label>
                <input value={form[f]} onChange={e => setForm(p => ({ ...p, [f]: e.target.value }))} style={{ width: "100%", padding: "10px 12px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "#e2e8f0", fontSize: 13, fontFamily: "'DM Sans', sans-serif", outline: "none" }} />
              </div>
            ))}
            <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
              <button onClick={addCampaign} style={{ flex: 1, padding: "10px", background: "#1d4ed8", border: "none", borderRadius: 8, color: "white", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontWeight: 600 }}>Criar</button>
              <button onClick={() => setShowAdd(false)} style={{ flex: 1, padding: "10px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "#94a3b8", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>Cancelar</button>
            </div>
          </div>
        </div>
      )}

      {view === "campaigns" && (
        <div>
          <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
            {["todos", "planejado", "em andamento", "concluído"].map(s => (
              <button key={s} onClick={() => setFilterStatus(s)} style={{ padding: "5px 12px", borderRadius: 20, border: "1px solid", borderColor: filterStatus === s ? (statusColor[s] || "#3b82f6") : "rgba(255,255,255,0.1)", background: filterStatus === s ? `${statusColor[s] || "#3b82f6"}18` : "transparent", color: filterStatus === s ? (statusColor[s] || "#60a5fa") : "#64748b", cursor: "pointer", fontSize: 12, fontFamily: "'DM Sans', sans-serif", textTransform: "capitalize" }}>
                {s}
              </button>
            ))}
          </div>
          <div style={{ display: "grid", gap: 10 }}>
            {filtered.map(c => (
              <div key={c.id} style={{ background: "#1e293b", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: "16px 20px", display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ color: "#f1f5f9", fontWeight: 600, fontSize: 14, marginBottom: 4 }}>{c.name}</div>
                  <div style={{ display: "flex", gap: 16, color: "#64748b", fontSize: 12 }}>
                    <span>📢 {c.channel}</span>
                    <span>👤 {c.resp}</span>
                    <span>📅 {c.start}</span>
                    <span>💰 R$ {c.budget?.toLocaleString("pt-BR")}</span>
                  </div>
                </div>
                <span style={{ padding: "4px 12px", borderRadius: 20, fontSize: 12, fontWeight: 600, background: `${statusColor[c.status]}18`, color: statusColor[c.status], whiteSpace: "nowrap" }}>{c.status}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {view === "editorial" && (
        <div style={{ background: "#1e293b", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: 22 }}>
          <h3 style={{ color: "#f1f5f9", fontWeight: 700, fontSize: 15, marginBottom: 20, fontFamily: "'Playfair Display', serif" }}>Calendário Editorial – Abril 2026</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4 }}>
            {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map(d => (
              <div key={d} style={{ textAlign: "center", color: "#475569", fontSize: 11, fontWeight: 700, padding: "8px 4px", textTransform: "uppercase" }}>{d}</div>
            ))}
            {Array.from({ length: calDays[0].dow }).map((_, i) => <div key={`empty-${i}`} />)}
            {calDays.map(d => {
              const events = state.marketing.editorialDays[d.date] || [];
              return (
                <div key={d.day} style={{ minHeight: 60, background: events.length ? "rgba(59,130,246,0.08)" : "rgba(255,255,255,0.02)", border: events.length ? "1px solid rgba(59,130,246,0.2)" : "1px solid rgba(255,255,255,0.04)", borderRadius: 8, padding: 6 }}>
                  <div style={{ color: events.length ? "#60a5fa" : "#475569", fontSize: 12, fontWeight: 600, marginBottom: 4 }}>{d.day}</div>
                  {events.map((e, i) => <div key={i} style={{ color: "#94a3b8", fontSize: 10, lineHeight: 1.3 }}>{e}</div>)}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── COPYWRITER ───────────────────────────────────────────────────────────────
function Copywriter({ state, dispatch }) {
  const [selected, setSelected] = useState(null);
  const [editContent, setEditContent] = useState("");
  const [filterType, setFilterType] = useState("todos");
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ title: "", type: "email", content: "", tags: "" });

  const types = ["todos", "email", "landing", "ads"];
  const filtered = filterType === "todos" ? state.copies : state.copies.filter(c => c.type === filterType);
  const typeColors = { email: "#3b82f6", landing: "#10b981", ads: "#f59e0b" };
  const typeLabel = { email: "E-mail", landing: "Landing Page", ads: "Anúncio" };

  const openCopy = (c) => { setSelected(c); setEditContent(c.content); };

  return (
    <div style={{ display: "grid", gridTemplateColumns: selected ? "320px 1fr" : "1fr", gap: 16, height: "calc(100vh - 130px)" }}>
      <div style={{ background: "#1e293b", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, overflow: "hidden", display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "16px 16px 0" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <h3 style={{ color: "#f1f5f9", fontWeight: 700, fontSize: 15, fontFamily: "'Playfair Display', serif" }}>Biblioteca</h3>
            <button onClick={() => setShowAdd(true)} style={{ background: "#1d4ed8", border: "none", borderRadius: 6, padding: "5px 10px", color: "white", cursor: "pointer", fontSize: 12 }}><Icon name="plus" size={12} /></button>
          </div>
          <div style={{ display: "flex", gap: 4, marginBottom: 12, flexWrap: "wrap" }}>
            {types.map(t => (
              <button key={t} onClick={() => setFilterType(t)} style={{ padding: "3px 10px", borderRadius: 20, border: "1px solid", borderColor: filterType === t ? (typeColors[t] || "#3b82f6") : "rgba(255,255,255,0.08)", background: "transparent", color: filterType === t ? (typeColors[t] || "#60a5fa") : "#475569", cursor: "pointer", fontSize: 11, fontFamily: "'DM Sans', sans-serif", textTransform: "capitalize" }}>{t === "todos" ? "Todos" : typeLabel[t]}</button>
            ))}
          </div>
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: "0 8px 16px" }}>
          {filtered.map(c => (
            <div key={c.id} onClick={() => openCopy(c)} style={{ padding: "12px", borderRadius: 10, marginBottom: 4, cursor: "pointer", background: selected?.id === c.id ? "rgba(59,130,246,0.12)" : "transparent", border: "1px solid", borderColor: selected?.id === c.id ? "rgba(59,130,246,0.3)" : "transparent", transition: "all 0.15s" }}>
              <div style={{ color: "#e2e8f0", fontSize: 13, fontWeight: 600, marginBottom: 6 }}>{c.title}</div>
              <div style={{ display: "flex", gap: 8 }}>
                <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 4, background: `${typeColors[c.type]}20`, color: typeColors[c.type] }}>{typeLabel[c.type]}</span>
                <span style={{ fontSize: 11, color: "#475569" }}>v{c.version}</span>
                <span style={{ fontSize: 11, color: "#475569", marginLeft: "auto" }}>{c.updated}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selected && (
        <div style={{ background: "#1e293b", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          <div style={{ padding: "16px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <h3 style={{ color: "#f1f5f9", fontWeight: 700, fontSize: 15, fontFamily: "'Playfair Display', serif" }}>{selected.title}</h3>
              <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
                {selected.tags.map(t => <span key={t} style={{ fontSize: 11, padding: "2px 8px", borderRadius: 4, background: "rgba(99,102,241,0.12)", color: "#a5b4fc" }}>#{t}</span>)}
              </div>
            </div>
            <button onClick={() => setSelected(null)} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: 6, color: "#94a3b8", cursor: "pointer" }}><Icon name="x" size={16} /></button>
          </div>
          <textarea value={editContent} onChange={e => setEditContent(e.target.value)}
            style={{ flex: 1, background: "transparent", border: "none", outline: "none", padding: "20px", color: "#cbd5e1", fontSize: 14, lineHeight: 1.8, fontFamily: "'DM Sans', sans-serif", resize: "none" }} />
          <div style={{ padding: "12px 20px", borderTop: "1px solid rgba(255,255,255,0.06)", display: "flex", gap: 10 }}>
            <button style={{ padding: "8px 16px", background: "#1d4ed8", border: "none", borderRadius: 8, color: "white", cursor: "pointer", fontSize: 13, fontFamily: "'DM Sans', sans-serif", fontWeight: 600 }}>Salvar v{selected.version + 1}</button>
            <button style={{ padding: "8px 16px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "#94a3b8", cursor: "pointer", fontSize: 13, fontFamily: "'DM Sans', sans-serif" }}>Duplicar</button>
          </div>
        </div>
      )}

      {!selected && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", background: "#1e293b", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14 }}>
          <div style={{ textAlign: "center", color: "#475569" }}>
            <Icon name="copy" size={40} />
            <p style={{ marginTop: 12, fontSize: 14 }}>Selecione um copy para editar</p>
          </div>
        </div>
      )}

      {showAdd && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ background: "#1e293b", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 16, padding: 28, width: 480 }}>
            <h3 style={{ color: "#f1f5f9", fontWeight: 700, fontSize: 16, marginBottom: 20 }}>Novo Copy</h3>
            <div style={{ marginBottom: 14 }}>
              <label style={{ display: "block", color: "#94a3b8", fontSize: 12, marginBottom: 6 }}>Título</label>
              <input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} style={{ width: "100%", padding: "10px 12px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "#e2e8f0", fontSize: 13, fontFamily: "'DM Sans', sans-serif", outline: "none" }} />
            </div>
            <div style={{ marginBottom: 14 }}>
              <label style={{ display: "block", color: "#94a3b8", fontSize: 12, marginBottom: 6 }}>Tipo</label>
              <select value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))} style={{ width: "100%", padding: "10px 12px", background: "#0f172a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "#e2e8f0", fontSize: 13, fontFamily: "'DM Sans', sans-serif", outline: "none" }}>
                <option value="email">E-mail</option><option value="landing">Landing Page</option><option value="ads">Anúncio</option>
              </select>
            </div>
            <div style={{ marginBottom: 14 }}>
              <label style={{ display: "block", color: "#94a3b8", fontSize: 12, marginBottom: 6 }}>Conteúdo</label>
              <textarea value={form.content} onChange={e => setForm(p => ({ ...p, content: e.target.value }))} rows={6} style={{ width: "100%", padding: "10px 12px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "#e2e8f0", fontSize: 13, fontFamily: "'DM Sans', sans-serif", outline: "none", resize: "vertical" }} />
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => { dispatch({ type: "ADD_COPY", payload: { ...form, tags: form.tags.split(",").map(t => t.trim()) } }); setShowAdd(false); }} style={{ flex: 1, padding: "10px", background: "#1d4ed8", border: "none", borderRadius: 8, color: "white", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontWeight: 600 }}>Criar</button>
              <button onClick={() => setShowAdd(false)} style={{ flex: 1, padding: "10px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "#94a3b8", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── DESIGNER ─────────────────────────────────────────────────────────────────
function Designer({ state }) {
  const [filter, setFilter] = useState("todos");
  const tags = ["todos", "ads", "posts", "banners"];

  const filtered = filter === "todos" ? state.assets : state.assets.filter(a => a.tag === filter);

  const tagColors = { ads: "#f59e0b", posts: "#10b981", banners: "#6366f1" };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div style={{ display: "flex", gap: 8 }}>
          {tags.map(t => (
            <button key={t} onClick={() => setFilter(t)} style={{ padding: "6px 14px", borderRadius: 20, border: "1px solid", borderColor: filter === t ? (tagColors[t] || "#3b82f6") : "rgba(255,255,255,0.1)", background: "transparent", color: filter === t ? (tagColors[t] || "#60a5fa") : "#64748b", cursor: "pointer", fontSize: 12, fontFamily: "'DM Sans', sans-serif", textTransform: "capitalize" }}>{t}</button>
          ))}
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.03)", color: "#94a3b8", cursor: "pointer", fontSize: 13, fontFamily: "'DM Sans', sans-serif" }}><Icon name="figma" size={14} /> Figma (em breve)</button>
          <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 8, border: "none", background: "#1d4ed8", color: "white", cursor: "pointer", fontSize: 13, fontFamily: "'DM Sans', sans-serif", fontWeight: 600 }}><Icon name="upload" size={14} /> Upload</button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 14 }}>
        {filtered.map(a => (
          <div key={a.id} style={{ background: "#1e293b", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, overflow: "hidden", cursor: "pointer", transition: "transform 0.2s", position: "relative" }}
            onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
            onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}>
            <div style={{ height: 140, background: `linear-gradient(135deg, ${a.color}ee, ${a.color}88)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Icon name="image" size={40} />
            </div>
            <div style={{ padding: "12px 14px" }}>
              <div style={{ color: "#e2e8f0", fontSize: 13, fontWeight: 600, marginBottom: 6 }}>{a.name}</div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 4, background: `${tagColors[a.tag] || "#3b82f6"}20`, color: tagColors[a.tag] || "#60a5fa" }}>{a.tag}</span>
                <span style={{ fontSize: 11, color: "#475569" }}>{a.date}</span>
              </div>
            </div>
          </div>
        ))}
        <div style={{ background: "#1e293b", border: "2px dashed rgba(255,255,255,0.08)", borderRadius: 12, minHeight: 220, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#475569" }}>
          <Icon name="plus" size={28} />
          <p style={{ fontSize: 13, marginTop: 8 }}>Adicionar criativo</p>
        </div>
      </div>
    </div>
  );
}

// ─── SDRs ─────────────────────────────────────────────────────────────────────
function SDRs({ state, dispatch }) {
  const [selected, setSelected] = useState(null);
  const [filterStatus, setFilterStatus] = useState("todos");
  const [editNote, setEditNote] = useState("");

  const statuses = ["todos", "novo", "contato feito", "qualificado", "perdido"];
  const filtered = filterStatus === "todos" ? state.leads : state.leads.filter(l => l.status === filterStatus);

  const statusIcon = { novo: "⚡", "contato feito": "📞", qualificado: "✅", perdido: "❌" };

  return (
    <div style={{ display: "grid", gridTemplateColumns: selected ? "1fr 360px" : "1fr", gap: 16 }}>
      <div>
        <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
          {statuses.map(s => (
            <button key={s} onClick={() => setFilterStatus(s)} style={{ padding: "5px 12px", borderRadius: 20, border: "1px solid", borderColor: filterStatus === s ? (statusColor[s] || "#3b82f6") : "rgba(255,255,255,0.1)", background: "transparent", color: filterStatus === s ? (statusColor[s] || "#60a5fa") : "#64748b", cursor: "pointer", fontSize: 12, fontFamily: "'DM Sans', sans-serif", textTransform: "capitalize" }}>{statusIcon[s] || "📋"} {s}</button>
          ))}
          <button style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 6, padding: "6px 14px", borderRadius: 8, border: "none", background: "#1d4ed8", color: "white", cursor: "pointer", fontSize: 12, fontFamily: "'DM Sans', sans-serif", fontWeight: 600 }}><Icon name="plus" size={13} />Novo Lead</button>
        </div>

        <div style={{ background: "#1e293b", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                {["Nome", "Patrimônio", "Origem", "SDR", "Status", "Follow-up"].map(h => (
                  <th key={h} style={{ padding: "12px 16px", textAlign: "left", color: "#475569", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(l => (
                <tr key={l.id} onClick={() => { setSelected(l); setEditNote(l.notes); }} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)", cursor: "pointer", background: selected?.id === l.id ? "rgba(59,130,246,0.06)" : "transparent", transition: "background 0.15s" }}
                  onMouseEnter={e => { if (selected?.id !== l.id) e.currentTarget.style.background = "rgba(255,255,255,0.02)"; }}
                  onMouseLeave={e => { if (selected?.id !== l.id) e.currentTarget.style.background = "transparent"; }}>
                  <td style={{ padding: "12px 16px" }}>
                    <div style={{ color: "#e2e8f0", fontWeight: 600, fontSize: 13 }}>{l.name}</div>
                    <div style={{ color: "#475569", fontSize: 11 }}>{l.email}</div>
                  </td>
                  <td style={{ padding: "12px 16px", color: "#10b981", fontSize: 13, fontWeight: 600 }}>{l.patrimonio}</td>
                  <td style={{ padding: "12px 16px", color: "#94a3b8", fontSize: 12 }}>{l.origem}</td>
                  <td style={{ padding: "12px 16px", color: "#94a3b8", fontSize: 12 }}>{l.sdr}</td>
                  <td style={{ padding: "12px 16px" }}>
                    <span style={{ padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600, background: `${statusColor[l.status]}18`, color: statusColor[l.status] }}>{l.status}</span>
                  </td>
                  <td style={{ padding: "12px 16px", color: "#64748b", fontSize: 12 }}>{l.followup}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selected && (
        <div style={{ background: "#1e293b", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: 22 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
            <div>
              <h3 style={{ color: "#f1f5f9", fontWeight: 700, fontSize: 16, fontFamily: "'Playfair Display', serif" }}>{selected.name}</h3>
              <p style={{ color: "#475569", fontSize: 12, marginTop: 2 }}>{selected.email} · {selected.phone}</p>
            </div>
            <button onClick={() => setSelected(null)} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: 6, color: "#94a3b8", cursor: "pointer" }}><Icon name="x" size={16} /></button>
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", color: "#64748b", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>Status</label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
              {["novo", "contato feito", "qualificado", "perdido"].map(s => (
                <button key={s} onClick={() => dispatch({ type: "UPDATE_LEAD_STATUS", payload: { id: selected.id, status: s } })}
                  style={{ padding: "7px", borderRadius: 8, border: "1px solid", borderColor: selected.status === s ? statusColor[s] : "rgba(255,255,255,0.08)", background: selected.status === s ? `${statusColor[s]}18` : "transparent", color: selected.status === s ? statusColor[s] : "#64748b", cursor: "pointer", fontSize: 11, fontFamily: "'DM Sans', sans-serif", textTransform: "capitalize" }}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
            {[["Patrimônio", selected.patrimonio], ["Origem", selected.origem], ["SDR", selected.sdr], ["Follow-up", selected.followup]].map(([k, v]) => (
              <div key={k} style={{ background: "rgba(255,255,255,0.03)", borderRadius: 8, padding: "10px 12px" }}>
                <div style={{ color: "#475569", fontSize: 11, marginBottom: 2 }}>{k}</div>
                <div style={{ color: "#e2e8f0", fontSize: 13, fontWeight: 600 }}>{v}</div>
              </div>
            ))}
          </div>

          <div>
            <label style={{ display: "block", color: "#64748b", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>Anotações</label>
            <textarea value={editNote} onChange={e => setEditNote(e.target.value)} rows={5}
              style={{ width: "100%", padding: "10px 12px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, color: "#cbd5e1", fontSize: 13, fontFamily: "'DM Sans', sans-serif", outline: "none", resize: "none", lineHeight: 1.6 }} />
            <button style={{ marginTop: 8, width: "100%", padding: "9px", background: "#1d4ed8", border: "none", borderRadius: 8, color: "white", cursor: "pointer", fontSize: 13, fontFamily: "'DM Sans', sans-serif", fontWeight: 600 }}>Salvar Anotação</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── VENDEDORES ───────────────────────────────────────────────────────────────
function Vendedores({ state, dispatch }) {
  const stages = ["lead", "reunião", "proposta", "fechamento"];
  const stageColors = { lead: "#6366f1", reunião: "#3b82f6", proposta: "#f59e0b", fechamento: "#10b981" };
  const stageEmoji = { lead: "🎯", reunião: "📅", proposta: "📄", fechamento: "🏆" };

  const totalFechado = state.deals.filter(d => d.stage === "fechamento").reduce((a, d) => a + d.value * (d.probability / 100), 0);
  const totalPipeline = state.deals.reduce((a, d) => a + d.value, 0);
  const taxaConv = Math.round((state.deals.filter(d => d.stage === "fechamento").length / state.deals.length) * 100);

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginBottom: 24 }}>
        {[
          { label: "Pipeline Total", value: fmtCurrency(totalPipeline), color: "#3b82f6" },
          { label: "Receita Esperada", value: fmtCurrency(totalFechado), color: "#10b981" },
          { label: "Taxa de Conversão", value: `${taxaConv}%`, color: "#f59e0b" },
        ].map((m, i) => (
          <div key={i} style={{ background: "#1e293b", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: "18px 20px" }}>
            <div style={{ color: "#64748b", fontSize: 12, marginBottom: 6 }}>{m.label}</div>
            <div style={{ color: m.color, fontSize: 24, fontWeight: 800, fontFamily: "'Playfair Display', serif" }}>{m.value}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
        {stages.map(stage => {
          const stageDeals = state.deals.filter(d => d.stage === stage);
          const stageTotal = stageDeals.reduce((a, d) => a + d.value, 0);
          return (
            <div key={stage}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10, padding: "8px 12px", background: `${stageColors[stage]}15`, borderRadius: 8, border: `1px solid ${stageColors[stage]}30` }}>
                <span style={{ color: stageColors[stage], fontSize: 13, fontWeight: 700, textTransform: "capitalize" }}>{stageEmoji[stage]} {stageLabel[stage]}</span>
                <span style={{ color: "#64748b", fontSize: 11 }}>{fmtCurrency(stageTotal)}</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {stageDeals.map(deal => (
                  <div key={deal.id} style={{ background: "#1e293b", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 10, padding: "12px 14px", cursor: "pointer", transition: "border-color 0.15s" }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = `${stageColors[stage]}50`}
                    onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"}>
                    <div style={{ color: "#e2e8f0", fontWeight: 600, fontSize: 13, marginBottom: 4 }}>{deal.name}</div>
                    <div style={{ color: "#10b981", fontSize: 13, fontWeight: 700, marginBottom: 6 }}>{fmtCurrency(deal.value)}</div>
                    <div style={{ color: "#475569", fontSize: 11, marginBottom: 8 }}>{deal.product}</div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ fontSize: 11, color: "#64748b" }}>👤 {deal.closer}</span>
                      <span style={{ fontSize: 11, padding: "2px 6px", borderRadius: 4, background: `${stageColors[stage]}20`, color: stageColors[stage] }}>{deal.probability}%</span>
                    </div>
                    <div style={{ marginTop: 8, display: "flex", gap: 4 }}>
                      {stages.map(s => (
                        <button key={s} onClick={() => dispatch({ type: "UPDATE_DEAL_STAGE", payload: { id: deal.id, stage: s } })}
                          style={{ flex: 1, padding: "4px", borderRadius: 4, border: "none", background: deal.stage === s ? stageColors[s] : "rgba(255,255,255,0.04)", cursor: "pointer", transition: "background 0.15s" }} title={stageLabel[s]} />
                      ))}
                    </div>
                  </div>
                ))}
                {stageDeals.length === 0 && <div style={{ background: "rgba(255,255,255,0.02)", border: "2px dashed rgba(255,255,255,0.06)", borderRadius: 10, padding: 16, textAlign: "center", color: "#334155", fontSize: 13 }}>Vazio</div>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!state.user) return <LoginPage dispatch={dispatch} />;

  const renderTab = () => {
    switch (state.activeTab) {
      case "dashboard": return <Dashboard state={state} dispatch={dispatch} />;
      case "marketing": return <Marketing state={state} dispatch={dispatch} />;
      case "copywriter": return <Copywriter state={state} dispatch={dispatch} />;
      case "designer": return <Designer state={state} dispatch={dispatch} />;
      case "sdrs": return <SDRs state={state} dispatch={dispatch} />;
      case "vendedores": return <Vendedores state={state} dispatch={dispatch} />;
      default: return null;
    }
  };

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Playfair+Display:wght@600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #0f172a; font-family: 'DM Sans', sans-serif; }
        ::-webkit-scrollbar { width: 5px; height: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 3px; }
        textarea::placeholder, input::placeholder { color: #334155; }
        @media (max-width: 768px) {
          .sidebar-overlay { display: block !important; }
          .menu-btn { display: flex !important; }
          aside { transform: translateX(-100%); }
          aside.open { transform: translateX(0); }
          .main-layout { margin-left: 0 !important; }
        }
      `}</style>
      <Sidebar activeTab={state.activeTab} dispatch={dispatch} user={state.user} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="main-layout" style={{ marginLeft: 240, minHeight: "100vh", background: "#0f172a" }}>
        <Header state={state} dispatch={dispatch} setSidebarOpen={setSidebarOpen} />
        <main style={{ padding: "28px 32px", maxWidth: 1400 }}>
          {renderTab()}
        </main>
      </div>
    </AppContext.Provider>
  );
}
