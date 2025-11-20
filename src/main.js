import './style.css'
import { GlslCanvas } from './GlslCanvas.js';
import sketch1 from './glsl/sketch1.frag?raw'; // Vite raw import

console.log('Poster App Initialized');

// Interaction Logic
document.querySelectorAll('.zone').forEach(zone => {
  zone.addEventListener('click', (e) => {
    const section = e.target.dataset.section;
    const id = e.target.dataset.id;

    console.log('Clicked zone:', section || `Face ${id}`);

    // Visual feedback
    e.target.style.backgroundColor = 'rgba(0,0,0,0.2)';
    setTimeout(() => {
      e.target.style.backgroundColor = '';
    }, 200);

    if (id) {
      openGlslOverlay(id);
    }
  });
});

function openGlslOverlay(id) {
  // Create or get overlay container
  let overlay = document.getElementById('glsl-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'glsl-overlay';
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100vw';
    overlay.style.height = '100vh';
    overlay.style.backgroundColor = 'black';
    overlay.style.zIndex = '1000';
    overlay.style.display = 'flex';
    overlay.style.justifyContent = 'center';
    overlay.style.alignItems = 'center';

    // Close button
    const closeBtn = document.createElement('button');
    closeBtn.innerText = 'CLOSE';
    closeBtn.style.position = 'absolute';
    closeBtn.style.top = '20px';
    closeBtn.style.right = '20px';
    closeBtn.style.color = 'white';
    closeBtn.style.background = 'transparent';
    closeBtn.style.border = '1px solid white';
    closeBtn.style.padding = '10px';
    closeBtn.style.cursor = 'pointer';
    closeBtn.onclick = () => {
      overlay.style.display = 'none';
      // Stop animation loop if needed
    };
    overlay.appendChild(closeBtn);

    // Canvas
    const canvas = document.createElement('canvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    overlay.appendChild(canvas);

    document.body.appendChild(overlay);

    // Init GLSL
    const sandbox = new GlslCanvas(canvas);
    sandbox.load(sketch1);

    function render(time) {
      if (overlay.style.display !== 'none') {
        sandbox.render(time);
        requestAnimationFrame(render);
      }
    }
    requestAnimationFrame(render);
  } else {
    overlay.style.display = 'flex';
    // Restart loop
    const canvas = overlay.querySelector('canvas');
    const sandbox = new GlslCanvas(canvas); // Re-init for simplicity or reuse
    sandbox.load(sketch1);

    function render(time) {
      if (overlay.style.display !== 'none') {
        sandbox.render(time);
        requestAnimationFrame(render);
      }
    }
    requestAnimationFrame(render);
  }
}

