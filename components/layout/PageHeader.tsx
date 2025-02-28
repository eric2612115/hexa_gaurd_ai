'use client';
// components/layout/PageHeader.tsx
import React from 'react';
import { Box, Typography, Breadcrumbs, Link, Chip } from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NextLink from 'next/link';

interface BreadcrumbItem {
  label: string;
  href: string;
}

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: BreadcrumbItem[];
  action?: React.ReactNode;
  chipLabel?: string;
  chipColor?: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
}

export default function PageHeader({ 
  title, 
  subtitle, 
  breadcrumbs = [], 
  action, 
  chipLabel, 
  chipColor
}: PageHeaderProps) {
  return (
    <Box 
      sx={{ 
        mb: 4, 
        display: 'flex', 
        flexDirection: { xs: 'column', md: 'row' },
        justifyContent: 'space-between',
        alignItems: { xs: 'flex-start', md: 'center' }
      }}
    >
      <Box>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Typography 
            variant="h4" 
            component="h1" 
            sx={{ fontWeight: 600, mr: 2 }}
          >
            {title}
          </Typography>
          {chipLabel && (
            <Chip 
              label={chipLabel} 
              color={chipColor || 'primary'} 
              size="small" 
            />
          )}
        </Box>
        
        {subtitle && (
          <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
            {subtitle}
          </Typography>
        )}
        
        {breadcrumbs.length > 0 && (
          <Breadcrumbs 
            separator={<NavigateNextIcon fontSize="small" />} 
            aria-label="breadcrumb"
            sx={{ mt: 1 }}
          >
            {breadcrumbs.map((item, index) => {
              const isLast = index === breadcrumbs.length - 1;
              return isLast ? (
                <Typography key={index} color="text.primary">
                  {item.label}
                </Typography>
              ) : (
                <Link 
                  key={index} 
                  underline="hover" 
                  color="inherit" 
                  component={NextLink}
                  href={item.href}
                >
                  {item.label}
                </Link>
              );
            })}
          </Breadcrumbs>
        )}
      </Box>
      
      {action && (
        <Box sx={{ mt: { xs: 2, md: 0 } }}>
          {action}
        </Box>
      )}
    </Box>
  );
}