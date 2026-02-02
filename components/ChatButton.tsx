'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const chatButtonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg font-medium transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*="size-"])]:size-4 shrink-0 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        // Voice recording button
        voice:
          'group relative bg-primary hover:bg-primary/90 active:bg-primary/80 text-primary-foreground shadow-md hover:shadow-lg data-[recording=true]:bg-destructive data-[recording=true]:hover:bg-destructive/90',
        
        // Send message button
        send:
          'bg-accent hover:bg-accent/90 active:bg-accent/80 text-accent-foreground shadow-md hover:shadow-lg disabled:shadow-none',
        
        // Gmail connect button
        connect:
          'bg-primary hover:bg-primary/90 active:bg-primary/80 text-primary-foreground shadow-md hover:shadow-lg w-full justify-center',
        
        // Toggle/feature buttons
        toggle:
          'bg-muted hover:bg-muted/80 active:bg-muted/70 text-foreground border border-border data-[active=true]:bg-primary data-[active=true]:text-primary-foreground data-[active=true]:border-primary',
        
        // Icon-only header button
        header:
          'text-foreground hover:bg-muted active:bg-muted/80 rounded-md',
        
        // Minimal ghost button
        ghost:
          'text-foreground hover:bg-muted/50 active:bg-muted/70',
      },
      size: {
        sm: 'h-8 px-3 text-xs gap-1.5 [&_svg:not([class*="size-"])]:size-3.5',
        md: 'h-10 px-4 text-sm gap-2 [&_svg:not([class*="size-"])]:size-4',
        lg: 'h-11 px-5 text-base gap-2.5 [&_svg:not([class*="size-"])]:size-5',
        icon: 'size-10 rounded-lg [&_svg:not([class*="size-"])]:size-5',
        'icon-sm': 'size-9 rounded-lg [&_svg:not([class*="size-"])]:size-4',
      },
    },
    defaultVariants: {
      variant: 'toggle',
      size: 'md',
    },
  },
);

interface ChatButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof chatButtonVariants> {
  isLoading?: boolean;
  isActive?: boolean;
  icon?: React.ReactNode;
  children?: React.ReactNode;
  fullWidth?: boolean;
}

const ChatButton = React.forwardRef<HTMLButtonElement, ChatButtonProps>(
  ({ className, variant, size, isLoading, isActive, icon, children, fullWidth, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          chatButtonVariants({ variant, size }),
          fullWidth && 'w-full',
          className,
        )}
        disabled={disabled || isLoading}
        data-active={isActive}
        {...props}
      >
        {icon && <span className="flex-shrink-0">{icon}</span>}
        {children}
        {isLoading && (
          <svg className="animate-spin" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="12" cy="12" r="10" strokeWidth="2" opacity="0.25" />
            <path
              d="M4 12a8 8 0 018-8v0a8 8 0 110 16v0a8 8 0 01-8-8z"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        )}
      </button>
    );
  },
);

ChatButton.displayName = 'ChatButton';

export { ChatButton, chatButtonVariants };
export type { ChatButtonProps };
