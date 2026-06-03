import React, { useMemo, useState } from 'react';
import axios from 'axios';

// pagination removed: always show all users

export default function UsersPage({ users, onCreated }: any) {
  const [query, setQuery] = useState('');
  // const [page, setPage] = useState(1);
  // const [showAll, setShowAll] = useState(false);

  const filtered = useMemo(() => users.filter((u: any) => u.name.toLowerCase().includes(query.toLowerCase())), [users, query]);
  const total = filtered.length;
  const visible = filtered;

  const handleDelete = async (id: string, e: any) => {
    e?.stopPropagation?.();
    if (!confirm('Remover este usuário?')) return;
    try {
      await axios.delete(`/users/${id}`);
      onCreated?.();
    } catch (err) {
      console.error('delete error', err);
      alert('Erro ao remover');
    }
  };

  const openNew = () => {
    window.history.pushState({}, '', '/users/new');
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  const openEdit = (id: string) => {
    window.history.pushState({}, '', `/users/${id}`);
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h2>Usuários</h2>
          <div className="result-count">{total} usuários</div>
        </div>
        <div style={{ width: 320 }}>
          <input className="search-input" placeholder="Pesquisar usuários" value={query} onChange={e => { setQuery(e.target.value); }} />
        </div>
      </div>

      <div>
        <div>
          {total === 0 && <div className="empty">Nenhum usuário cadastrado</div>}

          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Email</th>
                  <th style={{ width: 100, textAlign: 'right' }}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {visible.map((u: any) => (
                  <tr key={u._id} onClick={() => openEdit(u._id)} style={{ cursor: 'pointer' }}>
                    <td className="td-name">{u.name}</td>
                    <td className="td-sub">{u.email || '— sem email —'}</td>
                    <td className="td-actions">
                      <span style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                        <button className="action-btn danger" title="Remover" onClick={(e) => handleDelete(u._id, e)}>🗑️</button>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          
        </div>
        <aside style={{ display: 'none' }} />
      </div>

      <button className="fab" aria-label="Adicionar usuário" onClick={openNew}>+</button>
    </div>
  );
}
