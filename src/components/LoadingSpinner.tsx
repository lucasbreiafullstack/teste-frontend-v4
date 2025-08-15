import React from 'react';
import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const SpinnerContainer = styled.div<{ size?: 'sm' | 'md' | 'lg' }>`
  display: inline-block;
  width: ${props => {
    switch (props.size) {
      case 'sm': return '16px';
      case 'lg': return '48px';
      default: return '32px';
    }
  }};
  height: ${props => {
    switch (props.size) {
      case 'sm': return '16px';
      case 'lg': return '48px';
      default: return '32px';
    }
  }};
`;

const Spinner = styled.div<{ size?: 'sm' | 'md' | 'lg' }>`
  box-sizing: border-box;
  display: block;
  position: absolute;
  width: ${props => {
    switch (props.size) {
      case 'sm': return '16px';
      case 'lg': return '48px';
      default: return '32px';
    }
  }};
  height: ${props => {
    switch (props.size) {
      case 'sm': return '16px';
      case 'lg': return '48px';
      default: return '32px';
    }
  }};
  border: ${props => {
    switch (props.size) {
      case 'sm': return '2px';
      case 'lg': return '4px';
      default: return '3px';
    }
  }} solid ${props => props.theme.colors.primary[500]};
  border-radius: 50%;
  border-top-color: transparent;
  animation: ${spin} 1s linear infinite;
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${props => props.theme.spacing[4]};
`;

const LoadingText = styled.span`
  font-size: ${props => props.theme.typography.fontSize.sm};
  color: ${props => props.theme.colors.text.secondary};
`;

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  text,
  className 
}) => {
  if (text) {
    return (
      <LoadingContainer className={className}>
        <SpinnerContainer size={size}>
          <Spinner size={size} />
        </SpinnerContainer>
        <LoadingText>{text}</LoadingText>
      </LoadingContainer>
    );
  }

  return (
    <SpinnerContainer size={size} className={className}>
      <Spinner size={size} />
    </SpinnerContainer>
  );
};