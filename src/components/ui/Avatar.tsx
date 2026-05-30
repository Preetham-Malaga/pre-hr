interface AvatarProps { name: string; size?: 'sm' | 'md' | 'lg'; className?: string; }

const initials = (name: string) =>
  name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

const SIZES = { sm: 'w-7 h-7 text-xs', md: 'w-9 h-9 text-sm', lg: 'w-11 h-11 text-base' };

export function Avatar({ name, size = 'md', className = '' }: AvatarProps) {
  return (
    <div
      className={`${SIZES[size]} rounded-full flex items-center justify-center font-semibold font-display shrink-0 ${className}`}
      style={{
        backgroundColor: 'color-mix(in srgb, var(--color-primary) 25%, transparent)',
        color: 'var(--color-primary-muted)',
        boxShadow: '0 0 0 1px color-mix(in srgb, var(--color-primary) 30%, transparent)',
      }}
    >
      {initials(name)}
    </div>
  );
}