const iconProps = { width: 18, height: 18, strokeWidth: 1.75, fill: 'none', stroke: 'currentColor', strokeLinecap: 'round', strokeLinejoin: 'round' };

export const Icons = {
  dashboard: <svg viewBox="0 0 24 24" {...iconProps}><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></svg>,
  brain: <svg viewBox="0 0 24 24" {...iconProps}><path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588 4 4 0 0 0 7.636 2.106 3 3 0 0 0 .164-1.857 3 3 0 0 0 3.13-3.13 3 3 0 0 0 1.857-.164 4 4 0 0 0 2.106-7.636 4 4 0 0 0-2.526-5.77A3 3 0 0 0 12 5z" /></svg>,
  target: <svg viewBox="0 0 24 24" {...iconProps}><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" /></svg>,
  chart: <svg viewBox="0 0 24 24" {...iconProps}><path d="M3 3v18h18" /><path d="M7 16l4-4 4 4 5-6" /></svg>,
  chat: <svg viewBox="0 0 24 24" {...iconProps}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>,
  activity: <svg viewBox="0 0 24 24" {...iconProps}><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg>,
  file: <svg viewBox="0 0 24 24" {...iconProps}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" /></svg>,
  rocket: <svg viewBox="0 0 24 24" {...iconProps}><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" /><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" /><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" /></svg>,
  users: <svg viewBox="0 0 24 24" {...iconProps}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></svg>,
  video: <svg viewBox="0 0 24 24" {...iconProps}><path d="m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5" /><rect x="2" y="6" width="14" height="12" rx="2" /></svg>,
  bot: <svg viewBox="0 0 24 24" {...iconProps}><path d="M12 8V4H8" /><rect x="4" y="8" width="16" height="12" rx="2" /><path d="M2 14h2M20 14h2M9 13v2M15 13v2" /></svg>,
};

export function Icon({ name, className = '' }) {
  return <span className={`icon ${className}`}>{Icons[name]}</span>;
}
