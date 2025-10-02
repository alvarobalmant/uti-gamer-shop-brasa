// Export do modal simples como padrão (fallback, AuthModalFinal removido)
export { SimpleAuthModal as AuthModal } from './SimpleAuthModal';

// Exports dos componentes auxiliares
export { 
  ProfessionalInput,
  PasswordInput,
  ProfessionalButton,
  FormError,
  FormSuccess,
  FormLoadingOverlay,
  Divider,
  SocialButton
} from './FormComponents';

export {
  FloatingParticles,
  SuccessCelebration,
  TypingText,
  PulsingIcon,
  LoadingDots,
  SlideIn,
  ScaleIn,
  StaggerContainer,
  StaggerItem,
  HoverScale,
  Shake,
  ProgressBar,
  MorphingIcon,
  Glow
} from './AnimatedElements';

// Manter exports dos componentes antigos para compatibilidade
export { AuthModal as AuthModalLegacy } from './AuthModal';
export { AuthModalImproved } from './AuthModalImproved';
export { SimpleAuthModal } from './SimpleAuthModal';
export { EmailVerificationGuard } from './EmailVerificationGuard';
export { LoginForm } from './LoginForm';
export { SignUpForm } from './SignUpForm';
export { LoginPage } from './LoginPage';

