import React, { useState, useEffect } from 'react';

const stages = ["Applied", "Interview Scheduled", "Selected", "Rejected"];

function App() {
  const [candidates, setCandidates] = useState([]);
  const [newCandidateName, setNewCandidateName] = useState('');

  useEffect(() => {
    fetch('http://localhost:5000/candidates')
      .then(res => res.json())
      .then(data => setCandidates(data));
  }, []);

  const addCandidate = () => {
    if (!newCandidateName) return;
    fetch('http://localhost:5000/candidates', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newCandidateName })
    })
    .then(res => res.json())
    .then(candidate => {
      setCandidates([...candidates, candidate]);
      setNewCandidateName('');
    });
  };

  const updateCandidateStatus = (id, status) => {
    fetch(`http://localhost:5000/candidates/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    })
    .then(res => res.json())
    .then(updatedCandidate => {
      setCandidates(candidates.map(c => c.id === id ? updatedCandidate : c));
    });
  };

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
              <input value={newCandidateName} onChange={e => setNewCandidateName(e.target.value)} placeholder="Add candidate" />
              <button onClick={addCandidate}>Add</button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default App;
