import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { usePostApiAuthVerifyRecover} from '../../services/api';

const CODE_LENGTH = 12;

const ForgotPassword: React.FC = () => {
  const { t } = useTranslation('admin');
  const navigate = useNavigate();

  const [chars, setChars] = useState<string[]>(Array(CODE_LENGTH).fill(''));
  const inputsRef = useRef<HTMLInputElement[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const verifyMutation = usePostApiAuthVerifyRecover({
    mutation: {
      onSuccess: () => {
        navigate('/admin/reset-password');
      },
      onError: (err: unknown) => {
        console.error('Verify recover failed', err);
        setError(t('forgot.errorVerify', 'Recovery code is invalid or expired'));
      },
      onSettled: () => setLoading(false),
    }
  });

  const focusInput = (index: number) => {
    const input = inputsRef.current[index];
    if (input) input.focus();
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>, idx: number) => {
    const v = e.target.value.slice(-1); // only last char
    setChars((prev) => {
      const next = [...prev];
      next[idx] = v;
      return next;
    });

    if (v && idx < CODE_LENGTH - 1) focusInput(idx + 1);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, idx: number) => {
    if (e.key === 'Backspace') {
      if (chars[idx]) {
        setChars((prev) => {
          const next = [...prev];
          next[idx] = '';
          return next;
        });
      } else if (idx > 0) {
        focusInput(idx - 1);
        setChars((prev) => {
          const next = [...prev];
          next[idx - 1] = '';
          return next;
        });
      }
    }

    if (e.key === 'ArrowLeft' && idx > 0) {
      focusInput(idx - 1);
    }
    if (e.key === 'ArrowRight' && idx < CODE_LENGTH - 1) {
      focusInput(idx + 1);
    }
  };

  const onPaste = (e: React.ClipboardEvent<HTMLInputElement>, idx: number) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text');
    const cleanData = pastedData.replace(/-/g, '');
    
    if (!cleanData) return;

    setChars((prev) => {
      const next = [...prev];
      for (let i = 0; i < cleanData.length; i++) {
        if (idx + i < CODE_LENGTH) {
          next[idx + i] = cleanData[i];
        }
      }
      return next;
    });

    const targetIdx = Math.min(idx + cleanData.length, CODE_LENGTH - 1);
    focusInput(targetIdx);
  };

  const submit = (e?: React.FormEvent) => {
    e?.preventDefault();
    setError(null);

    const code = chars.join('');
    if (code.length !== CODE_LENGTH || chars.some((c) => c === '')) {
      setError(t('forgot.errorLength', 'Please enter full 12-character recovery code'));
      return;
    }

    setLoading(true);
    verifyMutation.mutate({ data: { recoveryCode: code } });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />

      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-lg">
          <div className="bg-white border border-gray-100 rounded-2xl shadow-lg p-8">
            <h1 className="text-xl font-semibold text-slate-800 mb-2">{t('forgot.title', 'Forgot Password')}</h1>
            <p className="text-sm text-slate-500 mb-4">{t('forgot.hint', 'If you are an admin contact the superadmin. If you are the superadmin, enter recovery code below.')}</p>

            {error && <div className="mb-4 text-sm text-red-700 bg-red-50 p-3 rounded">{error}</div>}

            <form onSubmit={submit} className="space-y-6">
              <div className="flex justify-center gap-2">
                {Array.from({ length: CODE_LENGTH }).map((_, i) => (
                  <input
                    key={i}
                    ref={(el) => { if (el) inputsRef.current[i] = el; }}
                    value={chars[i]}
                    onChange={(e) => onChange(e, i)}
                    onKeyDown={(e) => onKeyDown(e, i)}
                    onPaste={(e) => onPaste(e, i)}
                    maxLength={1}
                    inputMode="text"
                    className="w-10 h-12 text-center border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-lg"
                    aria-label={`code-${i + 1}`}
                  />
                ))}
              </div>

              <div className="flex justify-end">
                <button type="submit" disabled={loading} className="px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-60">
                  {loading ? t('forgot.verifying', 'Verifying...') : t('forgot.verify', 'Verify')}
                </button>
              </div>

              <div className="text-xs text-slate-400 text-center">
                {t('forgot.support', 'Need help? Contact superadmin for assistance.')}
              </div>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ForgotPassword;
