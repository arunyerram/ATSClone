import React, { useState, useEffect } from 'react';

const stages = ["Applied", "Interview Scheduled", "Selected", "Rejected"];

function App() {
  const [candidates, setCandidates] = useState([]);
  const [newCandidateName, setNewCandidateName] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL || 'https://atsclone-3.onrender.com';

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        setLoading(true);
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error('Failed to fetch candidates');
        const data = await res.json();
        setCandidates(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCandidates();
  }, [API_URL]);

  const addCandidate = async () => {
    if (!newCandidateName) return;
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newCandidateName })
      });
      if (!res.ok) throw new Error('Failed to add candidate');
      const candidate = await res.json();
      setCandidates([...candidates, candidate]);
      setNewCandidateName('');
    } catch (err) {
      setError(err.message);
    }
  };

  const updateCandidateStatus = async (id, status) => {
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (!res.ok) throw new Error('Failed to update candidate status');
      const updatedCandidate = await res.json();
      setCandidates(candidates.map(c => c.id === id ? updatedCandidate : c));
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div style={{ display: 'flex', justifyContent: 'space-around' }}>
      {stages.map(stage => (
        <div key={stage} style={{ width: '20%', border: '1px solid black', padding: '10px' }}>
          <h3>{stage}</h3>
          {candidates.filter(c => c.status === stage).map(candidate => (
            <div key={candidate.id} style={{ margin: '5px', padding: '5px', border: '1px solid gray' }}>
              {candidate.name}
              <select value={candidate.status} onChange={e => updateCandidateStatus(candidate.id, e.target.value)}>
                {stages.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          ))}
          {stage === 'Applied' && (
            <div>
              <input 
                value={newCandidateName} 
                onChange={e => setNewCandidateName(e.target.value)} 
                placeholder="Add candidate"
                onKeyPress={e => e.key === 'Enter' && addCandidate()}
              />
              <button onClick={addCandidate}>Add</button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default App;
