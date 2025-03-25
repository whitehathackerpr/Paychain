import React from 'react';
import { styled, keyframes } from '@mui/material/styles';
import NavBar from './NavBar';

const gradientAnimation = keyframes`
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
`;

const MainContent = styled('div')(({ theme }) => ({
  display: 'flex',
  minHeight: '100vh',
  background: 'linear-gradient(135deg, #050b2e 0%, #1a1035 50%, #0d253f 100%)',
  backgroundSize: '400% 400%',
  animation: `${gradientAnimation} 15s ease infinite`,
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'400\' height=\'400\' viewBox=\'0 0 800 800\'%3E%3Cg fill=\'none\' stroke=\'%231A237E\' stroke-width=\'1\'%3E%3Cpath d=\'M769 229L1037 260.9M927 880L731 737 520 660 309 538 40 599 295 764 126.5 879.5 40 599-197 493 102 382-31 229 126.5 79.5-69-63\'/%3E%3Cpath d=\'M-31 229L237 261 390 382 603 493 308.5 537.5 101.5 381.5M370 905L295 764\'/%3E%3Cpath d=\'M520 660L578 842 731 737 840 599 603 493 520 660 295 764 309 538 390 382 539 269 769 229 577.5 41.5 370 105 295 -36 126.5 79.5 237 261 102 382 40 599 -69 737 127 880\'/%3E%3Cpath d=\'M520-140L578.5 42.5 731-63M603 493L539 269 237 261 370 105M902 382L539 269M390 382L102 382\'/%3E%3Cpath d=\'M-222 42L126.5 79.5 370 105 539 269 577.5 41.5 927 80 769 229 902 382 603 493 731 737M295-36L577.5 41.5M578 842L295 764M40-201L127 80M102 382L-261 269\'/%3E%3C/g%3E%3Cg fill=\'%232979FF\' opacity=\'0.05\'%3E%3Ccircle cx=\'769\' cy=\'229\' r=\'5\'/%3E%3Ccircle cx=\'539\' cy=\'269\' r=\'5\'/%3E%3Ccircle cx=\'603\' cy=\'493\' r=\'5\'/%3E%3Ccircle cx=\'731\' cy=\'737\' r=\'5\'/%3E%3Ccircle cx=\'520\' cy=\'660\' r=\'5\'/%3E%3Ccircle cx=\'309\' cy=\'538\' r=\'5\'/%3E%3Ccircle cx=\'295\' cy=\'764\' r=\'5\'/%3E%3Ccircle cx=\'40\' cy=\'599\' r=\'5\'/%3E%3Ccircle cx=\'102\' cy=\'382\' r=\'5\'/%3E%3Ccircle cx=\'127\' cy=\'80\' r=\'5\'/%3E%3Ccircle cx=\'370\' cy=\'105\' r=\'5\'/%3E%3Ccircle cx=\'578\' cy=\'42\' r=\'5\'/%3E%3Ccircle cx=\'237\' cy=\'261\' r=\'5\'/%3E%3Ccircle cx=\'390\' cy=\'382\' r=\'5\'/%3E%3C/g%3E%3C/svg%3E")',
    opacity: 0.2,
    zIndex: 0,
  },
}));

const floatingGlow = keyframes`
  0% {
    box-shadow: 0 0 20px rgba(33, 150, 243, 0.2);
  }
  50% {
    box-shadow: 0 0 30px rgba(33, 150, 243, 0.4);
  }
  100% {
    box-shadow: 0 0 20px rgba(33, 150, 243, 0.2);
  }
`;

const ContentArea = styled('div')(({ theme }) => ({
  flexGrow: 1,
  padding: theme.spacing(4),
  marginTop: 64, // Space for the AppBar
  position: 'relative',
  zIndex: 1,
  [theme.breakpoints.up('sm')]: {
    marginLeft: 280,
    width: 'calc(100% - 280px)',
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(9, 14, 44, 0.3)',
    backdropFilter: 'blur(10px)',
    borderRadius: 16,
    border: '1px solid rgba(79, 209, 255, 0.1)',
    boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
    animation: `${floatingGlow} 4s ease-in-out infinite`,
    zIndex: -1,
  },
}));

const gridLines = keyframes`
  0% {
    background-position: 0px 0px, 0px 0px, 0px 0px;
  }
  100% {
    background-position: 50px 50px, 50px 50px, 0px 0px;
  }
`;

const GridBackground = styled('div')(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: `
    linear-gradient(rgba(33, 150, 243, 0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(33, 150, 243, 0.05) 1px, transparent 1px),
    linear-gradient(rgba(33, 150, 243, 0.02) 1px, transparent 1px),
    linear-gradient(90deg, rgba(33, 150, 243, 0.02) 1px, transparent 1px)
  `,
  backgroundSize: '50px 50px, 50px 50px, 10px 10px, 10px 10px',
  backgroundPosition: '0px 0px, 0px 0px, 0px 0px, 0px 0px',
  animation: `${gridLines} 20s linear infinite`,
  zIndex: 0,
}));

interface AppLayoutProps {
  children: React.ReactElement | React.ReactElement[];
}

const AppLayout = (props: AppLayoutProps) => {
  return (
    <MainContent>
      <GridBackground />
      <NavBar />
      <ContentArea>
        {props.children}
      </ContentArea>
    </MainContent>
  );
};

export default AppLayout; 