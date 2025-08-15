import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import { useAuth } from '../hooks/useAuth';
import { LoadingSpinner } from '../components/LoadingSpinner';

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing[4]};
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing[2]};
`;

const Label = styled.label`
  font-size: ${props => props.theme.typography.fontSize.sm};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  color: ${props => props.theme.colors.text.primary};
`;

const InputWrapper = styled.div`
  position: relative;
`;

const Input = styled.input<{ hasError?: boolean }>`
  width: 100%;
  padding: ${props => props.theme.spacing[3]} ${props => props.theme.spacing[4]};
  padding-left: ${props => props.theme.spacing[10]};
  border: 2px solid ${props => props.hasError ? props.theme.colors.error : props.theme.colors.border.light};
  border-radius: ${props => props.theme.borderRadius.base};
  font-size: ${props => props.theme.typography.fontSize.base};
  transition: all 0.2s ease;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: ${props => props.hasError ? props.theme.colors.error : props.theme.colors.primary[500]};
    box-shadow: 0 0 0 3px ${props => props.hasError ? 
      `${props.theme.colors.error}20` : 
      `${props.theme.colors.primary[500]}20`
    };
  }

  &::placeholder {
    color: ${props => props.theme.colors.text.disabled};
  }
`;

const InputIcon = styled.div`
  position: absolute;
  left: ${props => props.theme.spacing[3]};
  top: 50%;
  transform: translateY(-50%);
  color: ${props => props.theme.colors.text.secondary};
  display: flex;
  align-items: center;
`;

const PasswordToggle = styled.button`
  position: absolute;
  right: ${props => props.theme.spacing[3]};
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: ${props => props.theme.colors.text.secondary};
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: ${props => props.theme.spacing[1]};

  &:hover {
    color: ${props => props.theme.colors.text.primary};
  }
`;

const ErrorMessage = styled.span`
  font-size: ${props => props.theme.typography.fontSize.sm};
  color: ${props => props.theme.colors.error};
  margin-top: ${props => props.theme.spacing[1]};
`;

const Button = styled.button<{ loading?: boolean }>`
  width: 100%;
  padding: ${props => props.theme.spacing[3]} ${props => props.theme.spacing[4]};
  background-color: ${props => props.theme.colors.primary[600]};
  color: white;
  border: none;
  border-radius: ${props => props.theme.borderRadius.base};
  font-size: ${props => props.theme.typography.fontSize.base};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${props => props.theme.spacing[2]};

  &:hover:not(:disabled) {
    background-color: ${props => props.theme.colors.primary[700]};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const ForgotPassword = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.colors.primary[600]};
  font-size: ${props => props.theme.typography.fontSize.sm};
  cursor: pointer;
  text-align: right;
  padding: 0;
  margin-top: ${props => props.theme.spacing[2]};

  &:hover {
    text-decoration: underline;
  }
`;

const Footer = styled.div`
  text-align: center;
  margin-top: ${props => props.theme.spacing[6]};
  padding-top: ${props => props.theme.spacing[6]};
  border-top: 1px solid ${props => props.theme.colors.border.light};
`;

const FooterText = styled.p`
  font-size: ${props => props.theme.typography.fontSize.xs};
  color: ${props => props.theme.colors.text.secondary};
  margin: 0;
`;

interface LoginFormData {
  email: string;
  senha: string;
}

const LoginPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<LoginFormData>();

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data);
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Erro no login:', error);
      
      // Tratamento de erros específicos
      if (error.response?.status === 401) {
        setError('email', { message: 'Email ou senha incorretos' });
        setError('senha', { message: 'Email ou senha incorretos' });
      } else {
        setError('email', { message: 'Erro ao fazer login. Tente novamente.' });
      }
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleForgotPassword = () => {
    // TODO: Implementar funcionalidade de esqueci minha senha
    alert('Funcionalidade em desenvolvimento');
  };

  return (
    <>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <FormGroup>
          <Label htmlFor="email">Email</Label>
          <InputWrapper>
            <InputIcon>
              <FiMail size={18} />
            </InputIcon>
            <Input
              id="email"
              type="email"
              placeholder="Digite seu email"
              hasError={!!errors.email}
              {...register('email', {
                required: 'Email é obrigatório',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Email inválido'
                }
              })}
            />
          </InputWrapper>
          {errors.email && <ErrorMessage>{errors.email.message}</ErrorMessage>}
        </FormGroup>

        <FormGroup>
          <Label htmlFor="senha">Senha</Label>
          <InputWrapper>
            <InputIcon>
              <FiLock size={18} />
            </InputIcon>
            <Input
              id="senha"
              type={showPassword ? 'text' : 'password'}
              placeholder="Digite sua senha"
              hasError={!!errors.senha}
              {...register('senha', {
                required: 'Senha é obrigatória',
                minLength: {
                  value: 6,
                  message: 'Senha deve ter pelo menos 6 caracteres'
                }
              })}
            />
            <PasswordToggle 
              type="button" 
              onClick={togglePasswordVisibility}
              tabIndex={-1}
            >
              {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
            </PasswordToggle>
          </InputWrapper>
          {errors.senha && <ErrorMessage>{errors.senha.message}</ErrorMessage>}
          
          <ForgotPassword type="button" onClick={handleForgotPassword}>
            Esqueci minha senha
          </ForgotPassword>
        </FormGroup>

        <Button type="submit" disabled={isLoading} loading={isLoading}>
          {isLoading ? (
            <>
              <LoadingSpinner size="sm" />
              Entrando...
            </>
          ) : (
            'Entrar'
          )}
        </Button>
      </Form>

      <Footer>
        <FooterText>
          Sistema de Gestão Pública - Município de Mendes/RJ
        </FooterText>
        <FooterText>
          © 2025 - Todos os direitos reservados
        </FooterText>
      </Footer>
    </>
  );
};

export default LoginPage;