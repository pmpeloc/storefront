interface BadgeProps {
  children: React.ReactNode
  variant?: 'category' | 'stock' | 'featured'
  className?: string
}

export function Badge({ children, variant = 'category', className = '' }: BadgeProps) {
  const styles: Record<string, string> = {
    category: 'bg-stone-100 text-stone-600',
    stock: 'bg-green-100 text-green-700',
    featured: 'bg-amber-100 text-amber-700',
  }
  return (
    <span
      className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${styles[variant]} ${className}`}
    >
      {children}
    </span>
  )
}
