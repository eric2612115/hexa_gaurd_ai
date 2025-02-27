// components/layout/CardWithTitle.js
import React from 'react';
import { Card, CardHeader, CardContent, CardActions, Typography, Box, IconButton, Tooltip } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

export const CardWithTitle = ({ 
  title, 
  subtitle, 
  children, 
  action, 
  footer,
  tooltip,
  elevation = 1,
  sx = {} 
}) => {
  return (
    <Card 
      elevation={elevation} 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        borderRadius: 2,
        ...sx
      }}
    >
      <CardHeader
        title={
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="h6" component="h2">
              {title}
            </Typography>
            {tooltip && (
              <Tooltip title={tooltip} arrow placement="top">
                <IconButton size="small" sx={{ ml: 1 }}>
                  <InfoOutlinedIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
          </Box>
        }
        subheader={subtitle && <Typography color="text.secondary">{subtitle}</Typography>}
        action={action}
        sx={{ pb: 1 }}
      />
      <CardContent sx={{ flexGrow: 1, py: 1 }}>
        {children}
      </CardContent>
      {footer && (
        <CardActions sx={{ p: 2, pt: 0 }}>
          {footer}
        </CardActions>
      )}
    </Card>
  );
};