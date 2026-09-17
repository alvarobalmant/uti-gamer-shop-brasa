import { forwardRef, useImperativeHandle, useRef } from 'react';
import { Turnstile, type TurnstileInstance } from '@marsidev/react-turnstile';

// Site Key pública do Cloudflare Turnstile (pode ficar no frontend).
// A Secret Key fica APENAS no cofre do servidor (secret TURNSTILE_SECRET_KEY),
// usada pela validação server-side existente que consulta a Cloudflare.
export const TURNSTILE_SITE_KEY = '0x4AAAAAAE6ZxbpyLt9wf2lZ';

export type CaptchaStatus = 'loading' | 'pending' | 'ready' | 'expired' | 'error';

export interface TurnstileWidgetHandle {
  reset: () => void;
}

interface TurnstileWidgetProps {
  status: CaptchaStatus;
  onStatusChange: (status: CaptchaStatus) => void;
  onToken: (token: string | null) => void;
}

const statusMessages: Partial<Record<CaptchaStatus, string>> = {
  expired: 'A verificação expirou. Confirme novamente.',
  error: 'Falha na verificação de segurança. Tente novamente.',
};

export const TurnstileWidget = forwardRef<TurnstileWidgetHandle, TurnstileWidgetProps>(
  ({ status, onStatusChange, onToken }, ref) => {
    const instanceRef = useRef<TurnstileInstance | null>(null);

    useImperativeHandle(ref, () => ({
      reset: () => {
        onToken(null);
        onStatusChange('pending');
        instanceRef.current?.reset();
      },
    }));

    const message = statusMessages[status];

    return (
      <div className="space-y-2">
        <Turnstile
          ref={instanceRef}
          siteKey={TURNSTILE_SITE_KEY}
          options={{ theme: 'light', size: 'flexible', language: 'pt-BR' }}
          onWidgetLoad={() => onStatusChange('pending')}
          onSuccess={(token) => {
            onToken(token);
            onStatusChange('ready');
          }}
          onExpire={() => {
            onToken(null);
            onStatusChange('expired');
            instanceRef.current?.reset();
          }}
          onError={() => {
            onToken(null);
            onStatusChange('error');
          }}
          onTimeout={() => {
            onToken(null);
            onStatusChange('expired');
          }}
        />
        {status === 'loading' && (
          <p className="text-xs text-gray-400">Carregando verificação de segurança...</p>
        )}
        {message && <p className="text-xs text-red-500">{message}</p>}
      </div>
    );
  }
);

TurnstileWidget.displayName = 'TurnstileWidget';
