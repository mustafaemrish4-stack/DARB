import React, { useRef, useState, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { RigidBody, RapierRigidBody, CapsuleCollider } from '@react-three/rapier';
import { Vector3, Quaternion } from 'three';
import { Html } from '@react-three/drei';

interface PlayerProps {
  position?: [number, number, number];
}

export const Player: React.FC<PlayerProps> = ({ position = [0, 5, 0] }) => {
  const bodyRef = useRef<RapierRigidBody>(null);
  const [inCar, setInCar] = useState(false);
  const { camera } = useThree();
  
  const [keys, setKeys] = useState({ forward: false, backward: false, left: false, right: false, enter: false });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'KeyW' || e.code === 'ArrowUp') setKeys(k => ({ ...k, forward: true }));
      if (e.code === 'KeyS' || e.code === 'ArrowDown') setKeys(k => ({ ...k, backward: true }));
      if (e.code === 'KeyA' || e.code === 'ArrowLeft') setKeys(k => ({ ...k, left: true }));
      if (e.code === 'KeyD' || e.code === 'ArrowRight') setKeys(k => ({ ...k, right: true }));
      if (e.code === 'KeyF') {
        setInCar(c => !c); // Toggle car mode
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'KeyW' || e.code === 'ArrowUp') setKeys(k => ({ ...k, forward: false }));
      if (e.code === 'KeyS' || e.code === 'ArrowDown') setKeys(k => ({ ...k, backward: false }));
      if (e.code === 'KeyA' || e.code === 'ArrowLeft') setKeys(k => ({ ...k, left: false }));
      if (e.code === 'KeyD' || e.code === 'ArrowRight') setKeys(k => ({ ...k, right: false }));
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  useFrame(() => {
    if (!bodyRef.current) return;

    const speed = inCar ? 15 : 5;
    const direction = new Vector3();
    const frontVector = new Vector3(0, 0, (keys.backward ? 1 : 0) - (keys.forward ? 1 : 0));
    const sideVector = new Vector3((keys.left ? 1 : 0) - (keys.right ? 1 : 0), 0, 0);
    
    direction.subVectors(frontVector, sideVector).normalize().multiplyScalar(speed);
    
    const currentVelocity = bodyRef.current.linvel();
    bodyRef.current.setLinvel({ x: direction.x, y: currentVelocity.y, z: direction.z }, true);

    // Update camera to follow player
    const pos = bodyRef.current.translation();
    const camTarget = new Vector3(pos.x, pos.y + 2, pos.z);
    const camOffset = new Vector3(0, inCar ? 4 : 3, inCar ? 8 : 5);
    camera.position.lerp(camTarget.clone().add(camOffset), 0.1);
    camera.lookAt(camTarget);
  });

  return (
    <>
      <RigidBody ref={bodyRef} colliders={false} mass={1} type="dynamic" position={position} enabledRotations={[false, false, false]}>
        <CapsuleCollider args={[0.5, 0.5]} />
        {inCar ? (
          <mesh castShadow>
            <boxGeometry args={[2, 1.5, 4]} />
            <meshStandardMaterial color="red" />
            <Html position={[0, 2, 0]} center>
              <div style={{ color: 'white', background: 'rgba(0,0,0,0.5)', padding: '2px 5px', borderRadius: '4px' }}>سيارة (اضغط F للنزول)</div>
            </Html>
          </mesh>
        ) : (
          <mesh castShadow>
            <capsuleGeometry args={[0.5, 1, 4, 8]} />
            <meshStandardMaterial color="blue" />
            <Html position={[0, 1.5, 0]} center>
              <div style={{ color: 'white', background: 'rgba(0,0,0,0.5)', padding: '2px 5px', borderRadius: '4px' }}>شخصية (اضغط F لركوب السيارة)</div>
            </Html>
          </mesh>
        )}
      </RigidBody>
    </>
  );
};
