
import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const ThreeDVisualization = ({ data, chartType }) => {
  const mountRef = useRef(null);
  
  useEffect(() => {
    if (data.length === 0) return;
    
   
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0);
    
    const camera = new THREE.PerspectiveCamera(75, mountRef.current.clientWidth / mountRef.current.clientHeight, 0.1, 1000);
    camera.position.z = 15;
    camera.position.y = 10;
    camera.position.x = 5;
    
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    
   
    while (mountRef.current.firstChild) {
      mountRef.current.removeChild(mountRef.current.firstChild);
    }
    mountRef.current.appendChild(renderer.domElement);
    
    
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(20, 20, 20);
    scene.add(directionalLight);
    
    
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    
   
    const axesHelper = new THREE.AxesHelper(10);
    scene.add(axesHelper);
    
  
    const gridHelper = new THREE.GridHelper(20, 20, 0x000000, 0x000000);
    gridHelper.material.opacity = 0.2;
    gridHelper.material.transparent = true;
    scene.add(gridHelper);
    
  
    let maxValue = 0;
    data.forEach(record => {
      const values = [
        record.q1_sales, 
        record.q2_sales, 
        record.q3_sales, 
        record.q4_sales,
        record.target
      ];
      maxValue = Math.max(maxValue, ...values);
    });
    
    const scaleFactor = 10 / maxValue;
    const barWidth = 0.8;
    const spacing = 1.2;
    
  
    const bars = [];
    const labels = [];
    
    data.forEach((record, recordIndex) => {
     
      const productLabel = createTextLabel(record.product_name);
      productLabel.position.set(recordIndex * spacing, -0.5, -5);
      scene.add(productLabel);
      labels.push(productLabel);
      
      if (chartType === 'quarterly-comparison') {
      
        const quarters = [
          { value: record.q1_sales, color: 0x4caf50, label: 'Q1' },
          { value: record.q2_sales, color: 0x2196f3, label: 'Q2' },
          { value: record.q3_sales, color: 0xff9800, label: 'Q3' },
          { value: record.q4_sales, color: 0xf44336, label: 'Q4' }
        ];
        
        quarters.forEach((quarter, quarterIndex) => {
          const height = quarter.value * scaleFactor;
          const geometry = new THREE.BoxGeometry(barWidth, height, barWidth);
          const material = new THREE.MeshPhongMaterial({ color: quarter.color });
          const bar = new THREE.Mesh(geometry, material);
          
          bar.position.x = recordIndex * spacing;
          bar.position.y = height / 2;
          bar.position.z = quarterIndex * spacing - 1.5;
          
          bar.userData = { 
            value: quarter.value, 
            label: `${record.product_name} ${quarter.label}: ${quarter.value}` 
          };
          scene.add(bar);
          bars.push(bar);
          
         
          const quarterLabel = createTextLabel(quarter.label);
          quarterLabel.position.set(recordIndex * spacing, -1, quarterIndex * spacing - 1.5);
          scene.add(quarterLabel);
          labels.push(quarterLabel);
        });
      }
      else if (chartType === 'performance-vs-target') {
       
        const metrics = [
          { value: (record.q1_sales + record.q2_sales + record.q3_sales + record.q4_sales) / 4, 
            color: 0x2196f3, label: 'Avg Sales' },
          { value: record.target, color: 0xff9800, label: 'Target' }
        ];
        
        metrics.forEach((metric, metricIndex) => {
          const height = metric.value * scaleFactor;
          const geometry = new THREE.BoxGeometry(barWidth, height, barWidth);
          const material = new THREE.MeshPhongMaterial({ color: metric.color });
          const bar = new THREE.Mesh(geometry, material);
          
          bar.position.x = recordIndex * spacing;
          bar.position.y = height / 2;
          bar.position.z = metricIndex * spacing - 0.5;
          
          bar.userData = { 
            value: metric.value, 
            label: `${record.product_name} ${metric.label}: ${metric.value.toFixed(2)}` 
          };
          scene.add(bar);
          bars.push(bar);
          
         
          const metricLabel = createTextLabel(metric.label);
          metricLabel.position.set(recordIndex * spacing, -1, metricIndex * spacing - 0.5);
          scene.add(metricLabel);
          labels.push(metricLabel);
        });
      }
      else if (chartType === 'product-comparison') {
      
        const totalSales = record.q1_sales + record.q2_sales + record.q3_sales + record.q4_sales;
        const height = totalSales * scaleFactor;
        
        const hue = (recordIndex / data.length) * 0.8;
        const color = new THREE.Color().setHSL(hue, 0.8, 0.5);
        
        const geometry = new THREE.BoxGeometry(barWidth, height, barWidth);
        const material = new THREE.MeshPhongMaterial({ color });
        const bar = new THREE.Mesh(geometry, material);
        
        bar.position.x = recordIndex * spacing;
        bar.position.y = height / 2;
        bar.position.z = 0;
        
        bar.userData = { 
          value: totalSales, 
          label: `${record.product_name} Total Sales: ${totalSales}` 
        };
        scene.add(bar);
        bars.push(bar);
      }
    });
    
    for (let i = 0; i <= 10; i += 2) {
      const value = (i / scaleFactor).toFixed(0);
      const label = createTextLabel(value);
      label.position.set(-5, i, 0);
      scene.add(label);
      labels.push(label);
    }
    
   
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let hoveredBar = null;
    
    function onMouseMove(event) {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    }
    
    mountRef.current.addEventListener('mousemove', onMouseMove);
    
    

    const tooltip = document.createElement('div');
    tooltip.style.position = 'absolute';
    tooltip.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    tooltip.style.color = 'white';
    tooltip.style.padding = '8px';
    tooltip.style.borderRadius = '4px';
    tooltip.style.pointerEvents = 'none';
    tooltip.style.display = 'none';
    mountRef.current.appendChild(tooltip);
    
   
    const animate = () => {
      requestAnimationFrame(animate);
      
    
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(bars);
      
      if (intersects.length > 0) {
        if (hoveredBar !== intersects[0].object) {
          if (hoveredBar) hoveredBar.material.emissive.setHex(0x000000);
          hoveredBar = intersects[0].object;
          hoveredBar.material.emissive.setHex(0x333333);
          
        
          const vector = hoveredBar.position.clone().project(camera);
          const x = (vector.x * 0.5 + 0.5) * mountRef.current.clientWidth;
          const y = (-vector.y * 0.5 + 0.5) * mountRef.current.clientHeight;
          
          tooltip.style.display = 'block';
          tooltip.style.left = `${x}px`;
          tooltip.style.top = `${y}px`;
          tooltip.textContent = hoveredBar.userData.label;
        }
      } else if (hoveredBar) {
        hoveredBar.material.emissive.setHex(0x000000);
        hoveredBar = null;
        tooltip.style.display = 'none';
      }
      
      controls.update();
      renderer.render(scene, camera);
    };
    
    animate();
    
    
    const handleResize = () => {
      camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    };
    
    window.addEventListener('resize', handleResize);
    
   
    return () => {
      window.removeEventListener('resize', handleResize);
      mountRef.current.removeEventListener('mousemove', onMouseMove);
      if (tooltip.parentNode) {
        tooltip.parentNode.removeChild(tooltip);
      }
      renderer.dispose();
    };
  }, [data, chartType]);
  
  return <div ref={mountRef} className="w-full h-full" />;
};


function createTextLabel(text) {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  canvas.width = 256;
  canvas.height = 64;
  
  context.fillStyle = '#000000';
  context.font = 'Bold 24px Arial';
  context.textAlign = 'center';
  context.fillText(text, canvas.width / 2, canvas.height / 2);
  
  const texture = new THREE.CanvasTexture(canvas);
  const material = new THREE.SpriteMaterial({ map: texture });
  const sprite = new THREE.Sprite(material);
  sprite.scale.set(4, 1, 1);
  
  return sprite;
}

export default ThreeDVisualization;