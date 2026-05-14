import React, { useEffect, useState } from 'react';
import axios from 'axios';

const WEEKDAYS = [
  { id: 6, label: 'SÁB' },
  { id: 7, label: 'DOM' }
];

const WEEKS = [1,2,3,4,5];

export default function TemplatesMonthlyPage() {
  const [templates, setTemplates] = useState<any[]>([]);
  const [selectedWeek, setSelectedWeek] = useState<number>(2); // default to 2ª semana
  const [selectedWeekday, setSelectedWeekday] = useState<number>(7); // default to domingo

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await axios.get('/shift-templates');
        if (mounted) setTemplates(res.data || []);
      } catch (err) { console.error('fetch templates', err); }
    })();
    return () => { mounted = false };
  }, []);

  const monthlyByWeekday = templates.filter(t => t.recurrence?.type === 'monthlyByWeekday');

  // group templates for the selected week into Saturday (6) and Sunday (7)
  const itemsForWeek = monthlyByWeekday.filter(t => (t.recurrence?.monthlyByWeekday?.weekOfMonth || 1) === selectedWeek);
  const saturdayItems = itemsForWeek.filter(t => (t.recurrence?.monthlyByWeekday?.weekday || 7) === 6);
  const sundayItems = itemsForWeek.filter(t => (t.recurrence?.monthlyByWeekday?.weekday || 7) === 7);

  const openEditTemplate = (templateId: string) => {
    if (!templateId) return;
    window.history.pushState({}, '', `/templates/${templateId}?from=/templates/monthly`);
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h2>Escalas — Mensal</h2>
        </div>
        <div style={{ width: 320 }} />
      </div>

      <div style={{ display: 'flex', gap: 10, marginBottom: 10, flexWrap: 'wrap' }}>
        {WEEKS.map(w => (
          <button key={w} className={`weekday-btn ${selectedWeek === w ? 'active' : ''}`} onClick={() => setSelectedWeek(w)}>
            {w}ª semana
          </button>
        ))}
      </div>

      <div>
        {saturdayItems.length === 0 && sundayItems.length === 0 ? (
          <div className="empty">Nenhuma escala para a {selectedWeek}ª semana</div>
        ) : (
          <>
            <div style={{ marginBottom: 8, marginTop: 6 }}>
              <h3 style={{ margin: '6px 0' }}>SÁBADO <span style={{ color:'#64748b', fontWeight:600, marginLeft:8 }}></span></h3>
              {saturdayItems.length === 0 ? (
                <div className="empty">Nenhuma escala neste dia</div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12 }}>
                  {saturdayItems.map(t => (
                    <div key={t._id} className="card square" onClick={() => openEditTemplate(t._id)} style={{ cursor: 'pointer' }}>
                      <div style={{ fontWeight: 700 }}>{t.locationId?.name || '— local —'}</div>
                      <div style={{ color: '#64748b', marginTop: 6 }}>{t.time?.start || '—'}</div>
                      <div style={{ marginTop: 10, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                        {(t.users || []).slice(0,4).map((u: any) => (
                          <div key={u._id} className="chip">{u.name}</div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <hr style={{ margin: '18px 0', border: 'none', borderTop: '1px solid #eef2f7' }} />

            <div style={{ marginBottom: 8 }}>
              <h3 style={{ margin: '6px 0' }}>DOMINGO <span style={{ color:'#64748b', fontWeight:600, marginLeft:8 }}></span></h3>
              {sundayItems.length === 0 ? (
                <div className="empty">Nenhuma escala neste dia</div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12 }}>
                  {sundayItems.map(t => (
                    <div key={t._id} className="card square" onClick={() => openEditTemplate(t._id)} style={{ cursor: 'pointer' }}>
                      <div style={{ fontWeight: 700 }}>{t.locationId?.name || '— local —'}</div>
                      <div style={{ color: '#64748b', marginTop: 6 }}>{t.time?.start || '—'}</div>
                      <div style={{ marginTop: 10, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                        {(t.users || []).slice(0,4).map((u: any) => (
                          <div key={u._id} className="chip">{u.name}</div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
