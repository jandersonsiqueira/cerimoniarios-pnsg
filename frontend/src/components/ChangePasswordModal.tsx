import React, { useState } from 'react';
import axios from 'axios';

export default function ChangePasswordModal({ onDone }: { onDone: () => void }) {
  const [newPassword, setNewPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e?: any) => {
    if (e) e.preventDefault();
    setError(null);
    if (!newPassword || newPassword.length < 6) return setError('Senha deve ter ao menos 6 caracteres');
    if (newPassword !== confirm) return setError('Senhas não coincidem');
    setLoading(true);
    try {
      await axios.post('/auth/change-password', { newPassword });
      onDone();
    } catch (err: any) {
      console.error('change-password', err);
      setError(err?.response?.data?.error || 'Falha ao trocar senha');
    } finally { setLoading(false); }
  };

  return (
    <div style={{ position: 'fixed', left: 0, right: 0, top: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(2,6,23,0.4)', zIndex: 300 }}>
      <div style={{ background: '#fff', padding: 18, borderRadius: 8, width: '100%', maxWidth: 420 }}>
        <h3>Definir nova senha</h3>
        <p style={{ color: '#64748b' }}>Sua conta requer que você defina uma senha. Escolha uma senha segura.</p>
        <form onSubmit={submit}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <input className="input" type="password" placeholder="Nova senha" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
            <input className="input" type="password" placeholder="Confirmar senha" value={confirm} onChange={e => setConfirm(e.target.value)} />
            {error && <div style={{ color: '#b91c1c' }}>{error}</div>}
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <button className="btn" type="submit" disabled={loading}>{loading ? 'Salvando...' : 'Salvar senha'}</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
