// app/page.tsx
import React from 'react';
import { Typography, Box, Button } from '@mui/material';
import DashboardLayout from '@/components/layout/DashboardLayout';
import PageHeader from '@/components/layout/PageHeader';
import { Card, CardContent, CardHeader, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import Link from 'next/link';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export default function DashboardPage() {
  const faqData = [
    {
      question: "What is the function of the Wallet Management system?",
      answer: "The Wallet Management system allows you to create, manage, and monitor your MPC wallets.",
    },
    {
      question: "What is the function of the Transaction Signatures system?",
      answer: "The Transaction Signatures system allows you to view, approve, and reject transaction requests.",
    },
    {
      question: "What is the function of the Policy Management system?",
      answer: "The Policy Management system allows you to create and manage policies to control access and spending limits.",
    },
  ];

  return (
    <DashboardLayout>
      <PageHeader
        title="Hexa Guard Wallet Management System"
        subtitle="To manage and trace every transactions for AI MPC with Policies"
      />

      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 4 }}>
        <Card sx={{ width: { xs: '100%', sm: 'calc(50% - 8px)', md: 'calc(33.33% - 16px)' } }}>
          <CardHeader title="Wallet Management" />
          <CardContent>
            <Typography variant="body1" paragraph>
              This is a wallet management system. It allows you to create, manage, and monitor your MPC wallets.
            </Typography>
            <Link href="/dashboard" passHref>
              <Button variant="outlined" color="primary">
                More
              </Button>
            </Link>
          </CardContent>
        </Card>
        <Card sx={{ width: { xs: '100%', sm: 'calc(50% - 8px)', md: 'calc(33.33% - 16px)' } }}>
          <CardHeader title="Transaction Signatures" />
          <CardContent>
            <Typography variant="body1" paragraph>
              This is a transaction management system. You can view, approve, and reject transaction requests.
            </Typography>
            <Link href="/transactions" passHref>
              <Button variant="outlined" color="primary">
                More
              </Button>
            </Link>
          </CardContent>
        </Card>
        <Card sx={{ width: { xs: '100%', sm: 'calc(50% - 8px)', md: 'calc(33.33% - 16px)' } }}>
          <CardHeader title="Policies Management" />
          <CardContent>
            <Typography variant="body1" paragraph>
              This is a policy management system. Create and manage policies to control access and spending limits.
            </Typography>
            <Link href="/policies" passHref>
              <Button variant="outlined" color="primary">
                More
              </Button>
            </Link>
          </CardContent>
        </Card>
      </Box>

      {/* FAQ */}
      <Box>
        <Typography variant="h6" gutterBottom>FAQ</Typography> {/* FAQ 标题 */}
        {faqData.map((item, index) => (
          <Accordion key={index}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls={`panel${index + 1}a-content`}
              id={`panel${index + 1}a-header`}
            >
              <Typography>{item.question}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>{item.answer}</Typography>
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>
    </DashboardLayout>
  );
}