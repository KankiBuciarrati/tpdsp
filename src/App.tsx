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
        <div className="flex h-screen bg-gray-900 relative overflow-hidden">
            <div className="animated-background" />
            <div className="floating-orb orb-1" style={{ top: '10%', left: '-5%' }} />
            <div className="floating-orb orb-2" style={{ top: '60%', right: '-10%' }} />
            <div className="floating-orb orb-3" style={{ bottom: '10%', left: '50%' }} />

            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

            <div className="flex h-screen relative z-10">
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
        </div>
    );
};

export default App;
