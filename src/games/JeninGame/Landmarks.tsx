import React from 'react';
import { Html } from '@react-three/drei';
import { RigidBody } from '@react-three/rapier';

// شجرة بسيطة للتزيين
const Tree = ({ position }: { position: [number, number, number] }) => (
  <group position={position}>
    <mesh position={[0, 1, 0]} castShadow>
      <cylinderGeometry args={[0.2, 0.2, 2]} />
      <meshStandardMaterial color="#5C4033" />
    </mesh>
    <mesh position={[0, 2.5, 0]} castShadow>
      <sphereGeometry args={[1.5, 8, 8]} />
      <meshStandardMaterial color="#2E8B57" />
    </mesh>
  </group>
);

export const Landmarks: React.FC = () => {
  return (
    <>
      {/* الأرضية الرملية/العشبية */}
      <RigidBody type="fixed" colliders="cuboid">
        <mesh position={[0, -0.5, 0]} receiveShadow>
          <boxGeometry args={[200, 1, 200]} />
          <meshStandardMaterial color="#BDB76B" /> {/* لون عشبي جاف يميل للرملي */}
        </mesh>
      </RigidBody>

      {/* أشجار متفرقة */}
      <Tree position={[-15, 0, -25]} />
      <Tree position={[15, 0, -20]} />
      <Tree position={[35, 0, 15]} />
      <Tree position={[-25, 0, 20]} />

      {/* خربة بلعمة ونفق بلعمة */}
      <RigidBody type="fixed" colliders="cuboid">
        <group position={[-20, 0, -20]}>
          <mesh position={[0, 2.5, 0]} castShadow receiveShadow>
            <boxGeometry args={[10, 5, 10]} />
            <meshStandardMaterial color="#d4c4b7" />
          </mesh>
          <Html position={[0, 6, 0]} center transform style={{ backgroundColor: 'rgba(0,0,0,0.7)', padding: '5px', borderRadius: '5px', color: '#FFD700', fontWeight: 'bold' }}>
            <div dir="rtl">خربة بلعمة ونفق بلعمة</div>
          </Html>
        </group>
      </RigidBody>

      {/* كنيسة برقين */}
      <RigidBody type="fixed" colliders="cuboid">
        <group position={[20, 0, -15]}>
          <mesh position={[0, 3, 0]} castShadow receiveShadow>
            <boxGeometry args={[8, 6, 12]} />
            <meshStandardMaterial color="#e6d5b8" />
          </mesh>
          {/* برج الجرس */}
          <mesh position={[0, 7, 4]} castShadow receiveShadow>
            <boxGeometry args={[3, 4, 3]} />
            <meshStandardMaterial color="#e6d5b8" />
          </mesh>
          <Html position={[0, 10, 0]} center transform style={{ backgroundColor: 'rgba(0,0,0,0.7)', padding: '5px', borderRadius: '5px', color: '#FFD700', fontWeight: 'bold' }}>
            <div dir="rtl">كنيسة برقين</div>
          </Html>
        </group>
      </RigidBody>

      {/* الجامع الكبير (مسجد فاطمة خاتون) */}
      <RigidBody type="fixed" colliders="cuboid">
        <group position={[0, 0, -30]}>
          <mesh position={[0, 4, 0]} castShadow receiveShadow>
            <boxGeometry args={[15, 8, 15]} />
            <meshStandardMaterial color="#d3c2a8" />
          </mesh>
          {/* القبة */}
          <mesh position={[0, 8, 0]} castShadow receiveShadow>
            <sphereGeometry args={[4, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
            <meshStandardMaterial color="#2E8B57" /> {/* قبة خضراء */}
          </mesh>
          {/* المئذنة */}
          <mesh position={[6, 8, 6]} castShadow receiveShadow>
            <cylinderGeometry args={[1, 1, 12]} />
            <meshStandardMaterial color="#d3c2a8" />
          </mesh>
          <mesh position={[6, 15, 6]} castShadow receiveShadow>
            <coneGeometry args={[1.2, 2]} />
            <meshStandardMaterial color="#2E8B57" />
          </mesh>
          <Html position={[0, 16, 0]} center transform style={{ backgroundColor: 'rgba(0,0,0,0.7)', padding: '5px', borderRadius: '5px', color: '#FFD700', fontWeight: 'bold' }}>
            <div dir="rtl">الجامع الكبير (فاطمة خاتون)</div>
          </Html>
        </group>
      </RigidBody>

      {/* قلعة صانور */}
      <RigidBody type="fixed" colliders="cuboid">
        <group position={[30, 0, 20]}>
          {/* الجسم الرئيسي للقلعة */}
          <mesh position={[0, 4, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[8, 8, 8, 8]} />
            <meshStandardMaterial color="#b8a890" />
          </mesh>
          {/* أبراج القلعة */}
          {[[-6,-6],[6,-6],[-6,6],[6,6]].map((pos, i) => (
            <mesh key={i} position={[pos[0], 6, pos[1]]} castShadow>
              <cylinderGeometry args={[2, 2, 6, 8]} />
              <meshStandardMaterial color="#988870" />
            </mesh>
          ))}
          <Html position={[0, 11, 0]} center transform style={{ backgroundColor: 'rgba(0,0,0,0.7)', padding: '5px', borderRadius: '5px', color: '#FFD700', fontWeight: 'bold' }}>
            <div dir="rtl">قلعة صانور</div>
          </Html>
        </group>
      </RigidBody>

      {/* قصور عبد الهادي في عرابة */}
      <RigidBody type="fixed" colliders="cuboid">
        <group position={[-30, 0, 10]}>
          <mesh position={[0, 3.5, 0]} castShadow receiveShadow>
            <boxGeometry args={[18, 7, 14]} />
            <meshStandardMaterial color="#e0d0b0" />
          </mesh>
          {/* قباب القصر الصغيرة */}
          {[-4, 4].map((x) => (
            <mesh key={x} position={[x, 7, 0]} castShadow receiveShadow>
              <sphereGeometry args={[2.5, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
              <meshStandardMaterial color="#e0d0b0" />
            </mesh>
          ))}
          <Html position={[0, 10, 0]} center transform style={{ backgroundColor: 'rgba(0,0,0,0.7)', padding: '5px', borderRadius: '5px', color: '#FFD700', fontWeight: 'bold' }}>
            <div dir="rtl">قصور عبد الهادي في عرابة</div>
          </Html>
        </group>
      </RigidBody>

      {/* التلال الأثرية */}
      <RigidBody type="fixed" colliders="trimesh">
        <group position={[-40, 0, -30]}>
          <mesh position={[0, 2, 0]} castShadow receiveShadow>
            <sphereGeometry args={[8, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
            <meshStandardMaterial color="#556B2F" />
          </mesh>
          <Tree position={[0, 6, 0]} />
          <Html position={[0, 10, 0]} center transform style={{ backgroundColor: 'rgba(0,0,0,0.7)', padding: '5px', borderRadius: '5px', color: '#FFD700', fontWeight: 'bold' }}>
            <div dir="rtl">تل الحفيرة</div>
          </Html>
        </group>
      </RigidBody>

      <RigidBody type="fixed" colliders="trimesh">
        <group position={[40, 0, -30]}>
          <mesh position={[0, 3, 0]} castShadow receiveShadow>
            <sphereGeometry args={[10, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
            <meshStandardMaterial color="#6B8E23" />
          </mesh>
          <Tree position={[0, 8, 0]} />
          <Html position={[0, 13, 0]} center transform style={{ backgroundColor: 'rgba(0,0,0,0.7)', padding: '5px', borderRadius: '5px', color: '#FFD700', fontWeight: 'bold' }}>
            <div dir="rtl">تل تعنك</div>
          </Html>
        </group>
      </RigidBody>

      {/* الخرب والقرى */}
      <RigidBody type="fixed" colliders="cuboid">
        <group position={[10, 0, 30]}>
          <mesh position={[0, 1.5, 0]} castShadow receiveShadow>
            <boxGeometry args={[8, 3, 8]} />
            <meshStandardMaterial color="#b0a090" />
          </mesh>
          <mesh position={[0, 3, 0]} castShadow receiveShadow>
            <sphereGeometry args={[2, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
            <meshStandardMaterial color="#b0a090" />
          </mesh>
          <Html position={[0, 6, 0]} center transform style={{ backgroundColor: 'rgba(0,0,0,0.7)', padding: '5px', borderRadius: '5px', color: '#FFD700', fontWeight: 'bold' }}>
            <div dir="rtl">خربة كفر ياروب</div>
          </Html>
        </group>
      </RigidBody>

      <RigidBody type="fixed" colliders="cuboid">
        <group position={[-15, 0, 40]}>
          <mesh position={[0, 2, 0]} castShadow receiveShadow>
            <boxGeometry args={[10, 4, 10]} />
            <meshStandardMaterial color="#c0b0a0" />
          </mesh>
          <Html position={[0, 5, 0]} center transform style={{ backgroundColor: 'rgba(0,0,0,0.7)', padding: '5px', borderRadius: '5px', color: '#FFD700', fontWeight: 'bold' }}>
            <div dir="rtl">خربة النقب (جبع)</div>
          </Html>
        </group>
      </RigidBody>

      <RigidBody type="fixed" colliders="cuboid">
        <group position={[-28, 0, 35]}>
          <mesh position={[0, 1.5, 0]} castShadow receiveShadow>
            <boxGeometry args={[7, 3, 7]} />
            <meshStandardMaterial color="#908070" />
          </mesh>
          <Html position={[0, 4, 0]} center transform style={{ backgroundColor: 'rgba(0,0,0,0.7)', padding: '5px', borderRadius: '5px', color: '#FFD700', fontWeight: 'bold' }}>
            <div dir="rtl">خربة جافة (جبع)</div>
          </Html>
        </group>
      </RigidBody>

      <RigidBody type="fixed" colliders="cuboid">
        <group position={[25, 0, 35]}>
          <mesh position={[0, 2.5, 0]} castShadow receiveShadow>
            <boxGeometry args={[9, 5, 9]} />
            <meshStandardMaterial color="#d0c0b0" />
          </mesh>
          <Html position={[0, 6, 0]} center transform style={{ backgroundColor: 'rgba(0,0,0,0.7)', padding: '5px', borderRadius: '5px', color: '#FFD700', fontWeight: 'bold' }}>
            <div dir="rtl">خربة سباطة (جبع)</div>
          </Html>
        </group>
      </RigidBody>

      {/* سور يحيط بالمدينة بلون تراثي */}
      <RigidBody type="fixed" colliders="cuboid">
        <mesh position={[0, 3, -50]} castShadow receiveShadow>
          <boxGeometry args={[100, 6, 2]} />
          <meshStandardMaterial color="#a09080" />
        </mesh>
      </RigidBody>
      <RigidBody type="fixed" colliders="cuboid">
        <mesh position={[0, 3, 50]} castShadow receiveShadow>
          <boxGeometry args={[100, 6, 2]} />
          <meshStandardMaterial color="#a09080" />
        </mesh>
      </RigidBody>
      <RigidBody type="fixed" colliders="cuboid">
        <mesh position={[-50, 3, 0]} castShadow receiveShadow>
          <boxGeometry args={[2, 6, 100]} />
          <meshStandardMaterial color="#a09080" />
        </mesh>
      </RigidBody>
      <RigidBody type="fixed" colliders="cuboid">
        <mesh position={[50, 3, 0]} castShadow receiveShadow>
          <boxGeometry args={[2, 6, 100]} />
          <meshStandardMaterial color="#a09080" />
        </mesh>
      </RigidBody>
    </>
  );
};
