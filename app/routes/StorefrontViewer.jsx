import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { ThreeMFLoader } from 'three/examples/jsm/loaders/3MFLoader';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { PLYLoader } from 'three/examples/jsm/loaders/PLYLoader';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';


export default function StorefrontViewer({ modelUrl, onLoad }) {
  const mountRef = useRef();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!modelUrl || !mountRef.current) return;

    let renderer;
    let model;
    let animationFrame;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf4f6f9);

    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    camera.position.set(0, 0, 10);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = true;

    mountRef.current.innerHTML = '';
    mountRef.current.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    scene.add(new THREE.AmbientLight(0xffffff, 0.6));

    const dirLight = new THREE.DirectionalLight(0xffffff, 1);
    dirLight.position.set(10, 10, 10);
    dirLight.castShadow = true;
    scene.add(dirLight);

    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(40, 40),
      new THREE.ShadowMaterial({ opacity: 0.2 })
    );
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -1;
    floor.receiveShadow = true;
    scene.add(floor);

    const ext = modelUrl.slice(modelUrl.lastIndexOf('.')).toLowerCase();
    let loader;
    switch (ext) {
      case '.stl': loader = new STLLoader(); break;
      case '.obj': loader = new OBJLoader(); break;
      case '.3mf': loader = new ThreeMFLoader(); break;
      case '.glb':
      case '.gltf': loader = new GLTFLoader(); break;
      case '.ply': loader = new PLYLoader(); break;
      case '.fbx': loader = new FBXLoader(); break;
      default:
        setError(`Unsupported format: ${ext}`);
        setLoading(false);
        return;
    }

    loader.load(
      modelUrl,
      (object) => {
        if (ext === '.stl') {
          model = new THREE.Mesh(object, new THREE.MeshStandardMaterial({ color: 0x6a1b9a }));
        } else if (ext === '.glb' || ext === '.gltf') {
          model = object.scene;
        } else if (ext === '.ply') {
          model = new THREE.Mesh(object, new THREE.MeshStandardMaterial({ color: 0x777777 }));
        } else {
          model = object;
        }

        model.traverse?.((child) => {
          if (child.isMesh && child.geometry) {
            child.castShadow = true;
            child.receiveShadow = true;
            const box = child.geometry.boundingBox ?? child.geometry.computeBoundingBox();
            const center = new THREE.Vector3();
            box.getCenter(center);
            child.position.sub(center);
            child.position.y += (box.max.y - box.min.y) / 4;
          }
        });

        model.scale.set(2, 2, 2);
        scene.add(model);
        setLoading(false);
        if (typeof onLoad === 'function') onLoad(); // Trigger preview completion
      },
      undefined,
      (err) => {
        console.error('Model load error:', err);
        setError('❌ Failed to load model.');
        setLoading(false);
      }
    );

    const animate = () => {
      animationFrame = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    const resizeRenderer = () => {
      const width = mountRef.current.clientWidth;
      const height = mountRef.current.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener('resize', resizeRenderer);
    resizeRenderer();

    return () => {
      window.removeEventListener('resize', resizeRenderer);
      cancelAnimationFrame(animationFrame);
      renderer.dispose();
    };
  }, [modelUrl]);

  return (
    <div style={{ padding: '30px' }}>
      <h2>Preview Model</h2>
      {loading && <p style={{ textAlign: 'center' }}>⏳ Loading 3D model...</p>}
      {error && <p style={{ color: '#d32f2f', textAlign: 'center' }}>{error}</p>}
      <div
        ref={mountRef}
        style={{
          width: '100%',
          height: '500px',
          backgroundColor: '#f2f4f8',
          borderRadius: '12px',
          overflow: 'hidden',
        }}
      />
    </div>
  );
}
