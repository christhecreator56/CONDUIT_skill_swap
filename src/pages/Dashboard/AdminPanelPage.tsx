import { useState } from 'react';

const mockSkills = [
  { id: '1', name: 'Spam Skill', description: 'Buy cheap products here!', user: 'spammer@example.com', status: 'pending' },
  { id: '2', name: 'Valid Skill', description: 'Learn React', user: 'user1@example.com', status: 'approved' },
];
const mockUsers = [
  { id: '1', email: 'spammer@example.com', banned: false },
  { id: '2', email: 'user1@example.com', banned: false },
];
const mockSwaps = [
  { id: '1', status: 'pending', users: ['user1', 'user2'] },
  { id: '2', status: 'accepted', users: ['user3', 'user4'] },
  { id: '3', status: 'cancelled', users: ['user5', 'user6'] },
];

const AdminPanelPage = () => {
  const [skills, setSkills] = useState(mockSkills);
  const [users, setUsers] = useState(mockUsers);
  const [swaps] = useState(mockSwaps);
  const [message, setMessage] = useState('');

  const rejectSkill = (id: string) => {
    setSkills(skills.map(skill => skill.id === id ? { ...skill, status: 'rejected' } : skill));
  };

  const banUser = (id: string) => {
    setUsers(users.map(user => user.id === id ? { ...user, banned: true } : user));
  };

  const sendMessage = () => {
    alert('Message sent to all users: ' + message);
    setMessage('');
  };

  const downloadReport = (type: string) => {
    alert('Downloading ' + type + ' report...');
  };

  return (
    <div className="space-y-6 sm:space-y-8 p-4 sm:p-6 max-w-5xl mx-auto pt-32 sm:pt-36">
      <h1 className="text-xl sm:text-2xl font-bold text-[#F2F3F5] mb-4 sm:mb-6">Admin Panel</h1>

      {/* Skill Moderation */}
      <div className="card discord-fade-in">
        <h2 className="text-lg font-semibold mb-3 sm:mb-4 text-[#F2F3F5]">Skill Moderation</h2>
        <ul className="divide-y divide-[#404249] space-y-2">
          {skills.map(skill => (
            <li key={skill.id} className="py-3 sm:py-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
              <div className="flex-1">
                <span className="font-medium text-sm sm:text-base text-[#F2F3F5]">{skill.name}</span> — <span className="text-[#949BA4] text-sm sm:text-base">{skill.description}</span> 
                <span className="text-xs text-[#6D6F78] block sm:inline">({skill.user})</span>
                {skill.status === 'rejected' && <span className="ml-2 text-[#ED4245] text-xs">Rejected</span>}
              </div>
              {skill.status === 'pending' && (
                <button 
                  onClick={() => rejectSkill(skill.id)} 
                  className="btn-danger text-xs sm:text-sm px-3 py-2 touch-manipulation self-start sm:self-auto discord-hover"
                >
                  Reject
                </button>
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* User Management */}
      <div className="card discord-fade-in">
        <h2 className="text-lg font-semibold mb-3 sm:mb-4 text-[#F2F3F5]">User Management</h2>
        <ul className="divide-y divide-[#404249] space-y-2">
          {users.map(user => (
            <li key={user.id} className="py-3 sm:py-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
              <span className="text-sm sm:text-base text-[#F2F3F5]">{user.email}</span>
              {user.banned ? (
                <span className="text-[#ED4245] text-xs sm:text-sm">Banned</span>
              ) : (
                <button 
                  onClick={() => banUser(user.id)} 
                  className="btn-danger text-xs sm:text-sm px-3 py-2 touch-manipulation self-start sm:self-auto discord-hover"
                >
                  Ban
                </button>
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* Swap Monitoring */}
      <div className="card discord-fade-in">
        <h2 className="text-lg font-semibold mb-3 sm:mb-4 text-[#F2F3F5]">Swap Monitoring</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          <div>
            <h3 className="font-medium mb-2 sm:mb-3 text-sm sm:text-base text-[#F2F3F5]">Pending</h3>
            <ul className="text-xs sm:text-sm text-[#949BA4] space-y-1">
              {swaps.filter(s => s.status === 'pending').map(s => <li key={s.id}>Swap #{s.id} ({s.users.join(' & ')})</li>)}
            </ul>
          </div>
          <div>
            <h3 className="font-medium mb-2 sm:mb-3 text-sm sm:text-base text-[#F2F3F5]">Accepted</h3>
            <ul className="text-xs sm:text-sm text-[#949BA4] space-y-1">
              {swaps.filter(s => s.status === 'accepted').map(s => <li key={s.id}>Swap #{s.id} ({s.users.join(' & ')})</li>)}
            </ul>
          </div>
          <div>
            <h3 className="font-medium mb-2 sm:mb-3 text-sm sm:text-base text-[#F2F3F5]">Cancelled</h3>
            <ul className="text-xs sm:text-sm text-[#949BA4] space-y-1">
              {swaps.filter(s => s.status === 'cancelled').map(s => <li key={s.id}>Swap #{s.id} ({s.users.join(' & ')})</li>)}
            </ul>
          </div>
        </div>
      </div>

      {/* Platform-wide Messaging */}
      <div className="card discord-fade-in">
        <h2 className="text-lg font-semibold mb-3 sm:mb-4 text-[#F2F3F5]">Platform-wide Message</h2>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <input
            type="text"
            value={message}
            onChange={e => setMessage(e.target.value)}
            placeholder="Enter message to send to all users"
            className="input-field flex-1 text-sm sm:text-base"
          />
          <button 
            onClick={sendMessage} 
            className="btn-primary px-4 py-2 text-sm sm:text-base touch-manipulation discord-hover"
          >
            Send
          </button>
        </div>
      </div>

      {/* Download Reports */}
      <div className="card discord-fade-in">
        <h2 className="text-lg font-semibold mb-3 sm:mb-4 text-[#F2F3F5]">Download Reports</h2>
        <div className="flex flex-wrap gap-2 sm:gap-3">
          <button 
            onClick={() => downloadReport('User Activity')} 
            className="btn-secondary text-xs sm:text-sm px-3 py-2 touch-manipulation discord-hover"
          >
            User Activity
          </button>
          <button 
            onClick={() => downloadReport('Feedback Logs')} 
            className="btn-secondary text-xs sm:text-sm px-3 py-2 touch-manipulation discord-hover"
          >
            Feedback Logs
          </button>
          <button 
            onClick={() => downloadReport('Swap Stats')} 
            className="btn-secondary text-xs sm:text-sm px-3 py-2 touch-manipulation discord-hover"
          >
            Swap Stats
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminPanelPage; 