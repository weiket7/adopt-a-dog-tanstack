export function SocialLink({
  href,
  label,
  children,
}: {
  href?: string;
  label: string;
  children: React.ReactNode;
}) {
  if (!href) return null;
  return (
    <a
      className="group-social"
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      aria-label={label}
      title={label}
    >
      {children}
    </a>
  );
}
