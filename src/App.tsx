import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Topbar } from './components/Topbar';
import { Dashboard } from './components/Dashboard';
import { getExerciseById } from './config/navigation';

export const App: React.FC = () => {
    const [activeTP, setActiveTP] = useState<string | null>(null);
    const [activeExo, setActiveExo] = useState<string | null>(null);

    const handleTPChange = (tpId: string) => {
        setActiveTP(tpId);
        setActiveExo(null);
    };

    const handleExoChange = (tpId: string, exoId: string) => {
        setActiveTP(tpId);
        setActiveExo(exoId);
    };

    const handleBackToDashboard = () => {
        setActiveTP(null);
        setActiveExo(null);
    };

    const currentExo = activeTP && activeExo ? getExerciseById(activeTP, activeExo) : null;
    const ExerciseComponent = currentExo?.component;

    return (
        <div className="flex h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-cyan-50/30">
            <Sidebar
                activeTP={activeTP || ''}
                activeExo={activeExo || ''}
                onTPChange={handleTPChange}
                onExoChange={handleExoChange}
            />

            <div className="flex-1 flex flex-col overflow-hidden">
                <Topbar
                    activeTP={activeTP}
                    activeExo={activeExo}
                    onBackToDashboard={handleBackToDashboard}
                />

                <main className="flex-1 overflow-auto">
                    <div className="max-w-7xl mx-auto p-8">
                        {ExerciseComponent ? (
                            <ExerciseComponent />
                        ) : (
                            <Dashboard onSelectExercise={handleExoChange} />
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default App;
