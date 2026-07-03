import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Physics } from '@react-three/rapier';
import { Sky, Environment } from '@react-three/drei';
import { Player } from './Player';
import { Landmarks } from './Landmarks';

const JeninGame: React.FC = () => {
  return (
    <div style={{ width: '100vw', height: '100vh', position: 'absolute', top: 0, left: 0, overflow: 'hidden' }}>
      <Canvas shadows camera={{ position: [0, 5, 10], fov: 60 }}>
        <Suspense fallback={null}>
          <Sky sunPosition={[100, 20, 100]} />
          <Environment preset="city" />
          <ambientLight intensity={0.5} />
          <directionalLight castShadow position={[10, 20, 10]} intensity={1} shadow-mapSize={[1024, 1024]} />
          
          <Physics>
            <Landmarks />
            <Player position={[0, 5, 0]} />
          </Physics>
        </Suspense>
      </Canvas>
      <div style={{ position: 'absolute', bottom: 20, right: 20, background: 'rgba(255,255,255,0.8)', padding: '10px', borderRadius: '10px', direction: 'rtl', fontFamily: 'sans-serif' }}>
        <h3>أدوات التحكم:</h3>
        <ul>
          <li><strong>W, A, S, D</strong> أو الأسهم: للحركة</li>
          <li><strong>F</strong>: ركوب / النزول من السيارة</li>
        </ul>
      </div>
      <button 
        onClick={() => window.location.reload()} 
        style={{ position: 'absolute', top: 20, left: 20, background: 'red', color: 'white', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer', border: 'none', fontWeight: 'bold' }}>
        العودة للقائمة الرئيسية
      </button>
    </div>
  );
};

export default JeninGame;
