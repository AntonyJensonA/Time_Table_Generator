import React, { useState } from 'react';
import { Calendar, Settings, Users, BookOpen, GraduationCap, Building } from 'lucide-react';
import Teachers from './components/Teachers';
import Subjects from './components/Subjects';
import Constraints from './components/Constraints';
import Classes from './components/Classes';
import Rooms from './components/Rooms';
import Dashboard from './components/Dashboard';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col md:flex-row">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-card border-r border-border p-4 flex flex-col gap-2">
        <div className="mb-8 px-2 flex items-center gap-2">
          <Calendar className="w-6 h-6 text-primary" />
          <h1 className="text-xl font-bold tracking-tight">TimeSync PWA</h1>
        </div>
        
        <nav className="flex flex-col gap-1">
          <NavItem 
            icon={<Calendar />} label="Timetable" active={activeTab === 'dashboard'} 
            onClick={() => setActiveTab('dashboard')} 
          />
          <NavItem 
            icon={<GraduationCap />} label="Classes" active={activeTab === 'classes'} 
            onClick={() => setActiveTab('classes')} 
          />
          <NavItem 
            icon={<Users />} label="Teachers" active={activeTab === 'teachers'} 
            onClick={() => setActiveTab('teachers')} 
          />
          <NavItem 
            icon={<BookOpen />} label="Subjects" active={activeTab === 'subjects'} 
            onClick={() => setActiveTab('subjects')} 
          />
          <NavItem 
            icon={<Building />} label="Rooms" active={activeTab === 'rooms'} 
            onClick={() => setActiveTab('rooms')} 
          />
          <NavItem 
            icon={<Settings />} label="Constraints" active={activeTab === 'constraints'} 
            onClick={() => setActiveTab('constraints')} 
          />
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 overflow-y-auto">
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'classes' && <Classes />}
        {activeTab === 'teachers' && <Teachers />}
        {activeTab === 'subjects' && <Subjects />}
        {activeTab === 'rooms' && <Rooms />}
        {activeTab === 'constraints' && <Constraints />}
      </main>
    </div>
  );
}

function NavItem({ icon, label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
        active 
          ? 'bg-primary/10 text-primary font-medium' 
          : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
      }`}
    >
      {React.cloneElement(icon, { className: 'w-5 h-5' })}
      <span>{label}</span>
    </button>
  );
}

export default App;
