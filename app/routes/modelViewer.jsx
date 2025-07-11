import React, { useEffect, useRef, useContext } from 'react';
import * as THREE from 'three';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { ThreeMFLoader } from 'three/examples/jsm/loaders/3MFLoader';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { PLYLoader } from 'three/examples/jsm/loaders/PLYLoader';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Link } from '@remix-run/react';
import { ModelContext } from '../ModelContext'; 

export default function ModelViewer() {
  const mountRef = useRef();
  const { fileData, fileType } = useContext(ModelContext);

  useEffect(() => {
    if (!fileData || !fileType || !mountRef.current) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf4f6f9);

    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    camera.position.set(0, 0, 10);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = true;
    mountRef.current.innerHTML = '';
    mountRef.current.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.1;
    controls.update();

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(10, 10, 10);
    scene.add(ambientLight, directionalLight);

    const axesHelper = new THREE.AxesHelper(5);
    const gridHelper = new THREE.GridHelper(20, 40);
    scene.add(axesHelper, gridHelper);

    controls.enableRotate = true;
    controls.enableZoom = true;
    controls.enablePan = true;


    let loader;
    switch (fileType) {
      case '.stl':
        loader = new STLLoader();
        break;
      case '.obj':
        loader = new OBJLoader();
        break;
      case '.3mf':
        loader = new ThreeMFLoader();
        break;
      case '.glb':
      case '.gltf':
        loader = new GLTFLoader();
        break;
      case '.ply':
        loader = new PLYLoader();
        break;
      case '.fbx':
        loader = new FBXLoader();
        break;
      default:
        console.error('Unsupported file type:', fileType);
        return;
    }

    const blobURL = URL.createObjectURL(new Blob([fileData]));

    loader.load(
      blobURL,
      (object) => {
        console.log('Model loaded:', object);
        let model;

        if (fileType === '.stl') {
          const material = new THREE.MeshStandardMaterial({ color: 0x6a1b9a });
          model = new THREE.Mesh(object, material);
        } else if (fileType === '.glb' || fileType === '.gltf') {
          model = object.scene;
        } else if (fileType === '.ply') {
          const material = new THREE.MeshStandardMaterial({ color: 0x777777 });
          model = new THREE.Mesh(object, material);
        } else {
          model = object;
        }

        model.traverse?.((child) => {
     if (child.isMesh) {
    child.geometry.computeBoundingBox();
    const box = child.geometry.boundingBox;
    const center = new THREE.Vector3();
    box.getCenter(center);
    child.position.sub(center); 

    const yOffset = box.max.y - box.min.y;
    child.position.y += yOffset / 4; 
  }
   });


        model.scale.set(2, 2, 2);
        scene.add(model);
      },
      undefined,
      (error) => {
        console.error('Model failed to load:', error);
      }
    );

    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      URL.revokeObjectURL(blobURL);
      renderer.dispose();
    };
  }, [fileData, fileType]);

  return (
    <div
      style={{
        padding: '40px',
        maxWidth: '1000px',
        margin: 'auto',
        backgroundColor: '#ffffff',
        borderRadius: '16px',
        boxShadow: '0 12px 30px rgba(0, 0, 0, 0.08)',
        fontFamily: 'Inter, Segoe UI, sans-serif',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ margin: 0, fontSize: '2rem', color: '#333' }}>Your 3D Model Preview</h2>
        <Link to="/setup">
          <button
            style={{
              padding: '10px 20px',
              backgroundColor: '#6a1b9a',
              color: 'white',
              fontSize: '1rem',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
            }}
          >
            Customize Print Settings
          </button>
        </Link>
      </div>

      <div
        ref={mountRef}
        style={{
          marginTop: '30px',
          width: '100%',
          height: '500px',
          borderRadius: '12px',
          overflow: 'hidden',
          backgroundColor: '#f2f4f8',
        }}
      />
    </div>
  );
}
