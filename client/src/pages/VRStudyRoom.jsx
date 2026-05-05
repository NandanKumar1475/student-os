import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  Box,
  CheckSquare,
  Flame,
  Goal,
  NotebookText,
  RotateCcw,
} from 'lucide-react';
import * as THREE from 'three';
import { VRButton } from 'three/examples/jsm/webxr/VRButton.js';
import { useAuth } from '../hooks/useAuth';
import { gamificationService } from '../services/gamificationService';
import { noteService } from '../services/noteService';
import { targetService } from '../services/targetService';
import { taskService } from '../services/taskService';

const safeArray = (value) => (Array.isArray(value) ? value : []);

const getInitialXrStatus = () => {
  if (typeof navigator !== 'undefined' && 'xr' in navigator) {
    return 'checking';
  }

  return typeof window !== 'undefined' && !window.isSecureContext ? 'needs-https' : 'unavailable';
};

const clampProgress = (value) => {
  const numeric = Number(value);

  if (Number.isNaN(numeric)) {
    return 0;
  }

  return Math.min(100, Math.max(0, numeric));
};

const formatDueDate = (value) => {
  if (!value) {
    return 'Flexible';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  });
};

const shortText = (value, fallback, limit = 68) => {
  const text = String(value || fallback || '').replace(/\s+/g, ' ').trim();

  if (text.length <= limit) {
    return text;
  }

  return `${text.slice(0, limit - 3)}...`;
};

const drawRoundedRect = (ctx, x, y, width, height, radius) => {
  const r = Math.min(radius, width / 2, height / 2);

  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + width - r, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + r);
  ctx.lineTo(x + width, y + height - r);
  ctx.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
  ctx.lineTo(x + r, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
};

const wrapCanvasText = (ctx, text, maxWidth) => {
  const words = String(text || '').split(/\s+/).filter(Boolean);
  const lines = [];
  let line = '';

  words.forEach((word) => {
    const candidate = line ? `${line} ${word}` : word;

    if (ctx.measureText(candidate).width <= maxWidth || !line) {
      line = candidate;
      return;
    }

    lines.push(line);
    line = word;
  });

  if (line) {
    lines.push(line);
  }

  return lines;
};

const drawWrappedText = (ctx, text, x, y, maxWidth, lineHeight, maxLines) => {
  const lines = wrapCanvasText(ctx, text, maxWidth).slice(0, maxLines);
  let cursorY = y;

  lines.forEach((line, index) => {
    const finalLine =
      index === maxLines - 1 && wrapCanvasText(ctx, text, maxWidth).length > maxLines
        ? `${line.replace(/\.*$/, '')}...`
        : line;

    ctx.fillText(finalLine, x, cursorY);
    cursorY += lineHeight;
  });

  return cursorY;
};

const createPanelTexture = ({
  accent = '#60a5fa',
  body,
  eyebrow,
  rows,
  title,
  value,
}) => {
  const canvas = document.createElement('canvas');
  canvas.width = 1280;
  canvas.height = 720;

  const ctx = canvas.getContext('2d');
  const panelGradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  panelGradient.addColorStop(0, 'rgba(15, 23, 42, 0.97)');
  panelGradient.addColorStop(0.55, 'rgba(2, 6, 23, 0.92)');
  panelGradient.addColorStop(1, 'rgba(15, 23, 42, 0.96)');

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = panelGradient;
  drawRoundedRect(ctx, 24, 24, canvas.width - 48, canvas.height - 48, 58);
  ctx.fill();

  ctx.strokeStyle = 'rgba(226, 232, 240, 0.18)';
  ctx.lineWidth = 3;
  ctx.stroke();

  ctx.shadowColor = accent;
  ctx.shadowBlur = 34;
  ctx.fillStyle = accent;
  drawRoundedRect(ctx, 64, 64, 190, 16, 8);
  ctx.fill();
  ctx.shadowBlur = 0;

  ctx.font = '600 34px Inter, Arial, sans-serif';
  ctx.fillStyle = 'rgba(148, 163, 184, 0.92)';
  ctx.fillText(String(eyebrow || '').toUpperCase(), 64, 132);

  ctx.font = '700 70px Inter, Arial, sans-serif';
  ctx.fillStyle = '#f8fafc';
  drawWrappedText(ctx, title, 64, 222, 780, 78, 2);

  if (value) {
    ctx.font = '800 92px Inter, Arial, sans-serif';
    ctx.fillStyle = accent;
    ctx.fillText(value, 920, 220);
  }

  if (body) {
    ctx.font = '500 34px Inter, Arial, sans-serif';
    ctx.fillStyle = 'rgba(203, 213, 225, 0.9)';
    drawWrappedText(ctx, body, 64, 348, 820, 48, 3);
  }

  const startY = body ? 500 : 350;
  safeArray(rows).slice(0, 5).forEach((row, index) => {
    const y = startY + index * 58;

    ctx.fillStyle = 'rgba(255, 255, 255, 0.055)';
    drawRoundedRect(ctx, 64, y - 34, 1100, 44, 20);
    ctx.fill();

    ctx.fillStyle = row.accent || accent;
    drawRoundedRect(ctx, 82, y - 18, 18, 18, 8);
    ctx.fill();

    ctx.font = '600 28px Inter, Arial, sans-serif';
    ctx.fillStyle = '#e2e8f0';
    ctx.fillText(shortText(row.label, 'Item', 44), 122, y);

    if (row.value) {
      ctx.textAlign = 'right';
      ctx.fillStyle = 'rgba(226, 232, 240, 0.78)';
      ctx.fillText(String(row.value), 1134, y);
      ctx.textAlign = 'left';
    }
  });

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;

  return texture;
};

const createPanel = (config) => {
  const texture = createPanelTexture(config);
  const width = config.width || 3.4;
  const height = config.height || 1.92;
  const group = new THREE.Group();
  const glowMaterial = new THREE.MeshBasicMaterial({
    color: new THREE.Color(config.accent || '#60a5fa'),
    transparent: true,
    opacity: 0.08,
    side: THREE.DoubleSide,
  });
  const glow = new THREE.Mesh(new THREE.PlaneGeometry(width + 0.16, height + 0.16), glowMaterial);
  glow.position.z = -0.025;

  const material = new THREE.MeshBasicMaterial({
    map: texture,
    transparent: true,
    side: THREE.DoubleSide,
  });
  const panel = new THREE.Mesh(new THREE.PlaneGeometry(width, height), material);

  group.add(glow);
  group.add(panel);
  group.position.set(...config.position);
  group.rotation.y = config.rotationY || 0;
  group.userData.baseY = config.position[1];
  group.userData.floatOffset = config.floatOffset || 0;

  return group;
};

const createControllerRay = (color) => {
  const geometry = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(0, 0, -3),
  ]);
  const material = new THREE.LineBasicMaterial({
    color,
    transparent: true,
    opacity: 0.75,
  });

  return new THREE.Line(geometry, material);
};

const disposeScene = (scene) => {
  scene.traverse((object) => {
    if (object.geometry) {
      object.geometry.dispose();
    }

    const materials = Array.isArray(object.material) ? object.material : [object.material];

    materials.filter(Boolean).forEach((material) => {
      if (material.map) {
        material.map.dispose();
      }

      material.dispose();
    });
  });
};

const buildScene = ({ buttonHost, host, room }) => {
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    powerPreference: 'high-performance',
  });
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.xr.enabled = true;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.domElement.setAttribute('aria-label', 'Student OS VR scene');

  host.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  scene.background = new THREE.Color('#020617');
  scene.fog = new THREE.Fog('#020617', 7, 18);

  const camera = new THREE.PerspectiveCamera(70, 1, 0.1, 100);
  camera.position.set(0, 1.6, 5.6);
  camera.lookAt(0, 1.45, -2.4);

  scene.add(new THREE.HemisphereLight('#dbeafe', '#020617', 1.6));

  const keyLight = new THREE.PointLight('#60a5fa', 32, 11);
  keyLight.position.set(-3.4, 4.2, 3);
  scene.add(keyLight);

  const warmLight = new THREE.PointLight('#fb7185', 15, 9);
  warmLight.position.set(3, 2.5, 2.2);
  scene.add(warmLight);

  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(18, 18),
    new THREE.MeshStandardMaterial({
      color: '#06111f',
      metalness: 0.35,
      roughness: 0.58,
    }),
  );
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -0.04;
  scene.add(floor);

  const grid = new THREE.GridHelper(18, 36, '#38bdf8', '#1e293b');
  grid.material.transparent = true;
  grid.material.opacity = 0.22;
  scene.add(grid);

  const stage = new THREE.Group();
  scene.add(stage);

  room.panels.forEach((panel) => {
    stage.add(createPanel(panel));
  });

  const core = new THREE.Group();
  const torus = new THREE.Mesh(
    new THREE.TorusGeometry(0.72, 0.025, 18, 110),
    new THREE.MeshBasicMaterial({ color: '#67e8f9' }),
  );
  const innerTorus = new THREE.Mesh(
    new THREE.TorusGeometry(0.48, 0.018, 18, 96),
    new THREE.MeshBasicMaterial({ color: '#a7f3d0', transparent: true, opacity: 0.86 }),
  );
  const coreOrb = new THREE.Mesh(
    new THREE.IcosahedronGeometry(0.22, 2),
    new THREE.MeshStandardMaterial({
      color: '#c4b5fd',
      emissive: '#312e81',
      emissiveIntensity: 0.9,
      roughness: 0.28,
      metalness: 0.45,
    }),
  );
  core.position.set(0, 1.08, -1.4);
  core.add(torus);
  core.add(innerTorus);
  core.add(coreOrb);
  stage.add(core);

  const metricGroup = new THREE.Group();
  const blockGeometry = new THREE.BoxGeometry(0.36, 1, 0.36);
  room.metricBlocks.forEach((block, index) => {
    const height = Math.max(0.18, block.height);
    const material = new THREE.MeshStandardMaterial({
      color: block.color,
      emissive: block.color,
      emissiveIntensity: 0.12,
      roughness: 0.38,
      metalness: 0.35,
    });
    const mesh = new THREE.Mesh(blockGeometry, material);
    mesh.scale.y = height;
    mesh.position.set((index - 1.5) * 0.58, height / 2, -0.15);
    metricGroup.add(mesh);
  });
  metricGroup.position.set(0, 0, -2.2);
  stage.add(metricGroup);

  const starGeometry = new THREE.BufferGeometry();
  const starPositions = [];
  for (let index = 0; index < 170; index += 1) {
    starPositions.push(
      (Math.random() - 0.5) * 15,
      1 + Math.random() * 5.5,
      -2 - Math.random() * 11,
    );
  }
  starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starPositions, 3));
  const starField = new THREE.Points(
    starGeometry,
    new THREE.PointsMaterial({
      color: '#cbd5e1',
      size: 0.025,
      transparent: true,
      opacity: 0.58,
    }),
  );
  scene.add(starField);

  const controllerOne = renderer.xr.getController(0);
  controllerOne.add(createControllerRay('#60a5fa'));
  scene.add(controllerOne);

  const controllerTwo = renderer.xr.getController(1);
  controllerTwo.add(createControllerRay('#a7f3d0'));
  scene.add(controllerTwo);

  const xrButton = VRButton.createButton(renderer);
  buttonHost.appendChild(xrButton);

  let isDragging = false;
  let previousX = 0;
  let targetRotation = 0;

  const handlePointerDown = (event) => {
    isDragging = true;
    previousX = event.clientX;
    host.setPointerCapture?.(event.pointerId);
  };

  const handlePointerMove = (event) => {
    if (!isDragging) {
      return;
    }

    const delta = event.clientX - previousX;
    previousX = event.clientX;
    targetRotation += delta * 0.004;
  };

  const handlePointerUp = (event) => {
    isDragging = false;
    host.releasePointerCapture?.(event.pointerId);
  };

  const handleWheel = (event) => {
    camera.position.z = THREE.MathUtils.clamp(camera.position.z + event.deltaY * 0.002, 4.4, 7.1);
  };

  const handleResize = () => {
    const width = Math.max(1, host.clientWidth);
    const height = Math.max(1, host.clientHeight);

    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height, false);
  };

  host.addEventListener('pointerdown', handlePointerDown);
  host.addEventListener('pointermove', handlePointerMove);
  host.addEventListener('pointerup', handlePointerUp);
  host.addEventListener('pointerleave', handlePointerUp);
  host.addEventListener('wheel', handleWheel, { passive: true });

  const resizeObserver = new ResizeObserver(handleResize);
  resizeObserver.observe(host);
  handleResize();

  renderer.setAnimationLoop((time = 0) => {
    const elapsed = time / 1000;

    stage.rotation.y += (targetRotation - stage.rotation.y) * 0.055;
    core.rotation.y = elapsed * 0.52;
    core.rotation.x = Math.sin(elapsed * 0.7) * 0.16;
    innerTorus.rotation.y = elapsed * -0.72;
    starField.rotation.y = elapsed * 0.018;

    stage.children.forEach((child) => {
      if (child.userData.floatOffset === undefined) {
        return;
      }

      child.position.y = child.userData.baseY + Math.sin(elapsed + child.userData.floatOffset) * 0.045;
    });

    renderer.render(scene, camera);
  });

  return () => {
    renderer.setAnimationLoop(null);
    resizeObserver.disconnect();
    host.removeEventListener('pointerdown', handlePointerDown);
    host.removeEventListener('pointermove', handlePointerMove);
    host.removeEventListener('pointerup', handlePointerUp);
    host.removeEventListener('pointerleave', handlePointerUp);
    host.removeEventListener('wheel', handleWheel);
    xrButton.remove();

    if (host.contains(renderer.domElement)) {
      host.removeChild(renderer.domElement);
    }

    disposeScene(scene);
    renderer.dispose();
  };
};

const VRStudyRoom = () => {
  const { user } = useAuth();
  const canvasHostRef = useRef(null);
  const xrButtonHostRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [xrStatus, setXrStatus] = useState(getInitialXrStatus);
  const [roomData, setRoomData] = useState({
    gamification: null,
    notes: [],
    targets: [],
    tasks: [],
  });

  useEffect(() => {
    let isMounted = true;

    const loadRoomData = async () => {
      setLoading(true);

      const [tasksResult, targetsResult, notesResult, gamificationResult] = await Promise.allSettled([
        taskService.getToday(),
        targetService.getAll(),
        noteService.getAll(),
        gamificationService.getDashboard(),
      ]);

      if (!isMounted) {
        return;
      }

      setRoomData({
        tasks: tasksResult.status === 'fulfilled' ? safeArray(tasksResult.value.data) : [],
        targets: targetsResult.status === 'fulfilled' ? safeArray(targetsResult.value.data) : [],
        notes: notesResult.status === 'fulfilled' ? safeArray(notesResult.value.data) : [],
        gamification:
          gamificationResult.status === 'fulfilled' ? gamificationResult.value.data : null,
      });
      setLoading(false);
    };

    void loadRoomData();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    if (!('xr' in navigator)) {
      return undefined;
    }

    navigator.xr
      .isSessionSupported('immersive-vr')
      .then((supported) => {
        if (!cancelled) {
          setXrStatus(supported ? 'ready' : 'preview');
        }
      })
      .catch(() => {
        if (!cancelled) {
          setXrStatus('preview');
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const model = useMemo(() => {
    const tasks = safeArray(roomData.tasks);
    const targets = safeArray(roomData.targets);
    const notes = safeArray(roomData.notes);
    const completedTasks = tasks.filter((task) => task.completed).length;
    const activeTargets = targets.filter((target) => target.status === 'ACTIVE');
    const pinnedNotes = notes.filter((note) => note.pinned);
    const focusedTarget = targets.find((target) => target.isFocused) || activeTargets[0] || targets[0];
    const streak = roomData.gamification?.streak?.currentStreak || 0;
    const firstName = user?.name?.split(' ')?.[0] || 'Student';
    const completionRate = tasks.length ? Math.round((completedTasks / tasks.length) * 100) : 0;

    const taskRows = tasks.length
      ? tasks.slice(0, 5).map((task) => ({
          accent: task.completed ? '#34d399' : '#60a5fa',
          label: shortText(task.title, 'Untitled task', 46),
          value: task.completed ? 'Done' : formatDueDate(task.dueDate),
        }))
      : [
          {
            accent: '#a7f3d0',
            label: 'No tasks scheduled for today',
            value: 'Clear',
          },
        ];

    const targetRows = (activeTargets.length ? activeTargets : targets).length
      ? (activeTargets.length ? activeTargets : targets).slice(0, 5).map((target) => ({
          accent: '#c4b5fd',
          label: shortText(target.title, 'Untitled target', 44),
          value: `${clampProgress(target.progressPercentage)}%`,
        }))
      : [
          {
            accent: '#fbbf24',
            label: 'Create your first active target',
            value: '0%',
          },
        ];

    const noteRows = (pinnedNotes.length ? pinnedNotes : notes).length
      ? (pinnedNotes.length ? pinnedNotes : notes).slice(0, 5).map((note) => ({
          accent: note.pinned ? '#fb7185' : '#38bdf8',
          label: shortText(note.title, 'Untitled note', 44),
          value: note.pinned ? 'Pinned' : 'Note',
        }))
      : [
          {
            accent: '#38bdf8',
            label: 'Pin notes to surface review context',
            value: 'Empty',
          },
        ];

    const panels = [
      {
        accent: '#67e8f9',
        body: focusedTarget
          ? `${shortText(focusedTarget.title, 'Your focus target', 78)} is currently at ${clampProgress(
              focusedTarget.progressPercentage,
            )}% progress.`
          : 'Your immersive workspace is ready for tasks, targets, notes, and streak momentum.',
        eyebrow: 'Immersive command center',
        floatOffset: 0,
        position: [0, 2.05, -3.05],
        rows: [
          { accent: '#34d399', label: 'Today completion', value: `${completionRate}%` },
          { accent: '#fbbf24', label: 'Focused streak', value: `${streak}d` },
          { accent: '#c4b5fd', label: 'Active targets', value: `${activeTargets.length}` },
        ],
        title: `Welcome back, ${firstName}`,
        value: `${completionRate}%`,
        width: 3.95,
      },
      {
        accent: '#60a5fa',
        body: `${completedTasks}/${tasks.length || 0} tasks complete today.`,
        eyebrow: 'Execution queue',
        floatOffset: 1.7,
        position: [-3.0, 1.82, -2.35],
        rotationY: 0.48,
        rows: taskRows,
        title: 'Today tasks',
        value: `${completedTasks}/${tasks.length || 0}`,
      },
      {
        accent: '#a78bfa',
        body: focusedTarget
          ? `${formatDueDate(focusedTarget.deadline)} checkpoint visible from inside the room.`
          : 'Targets become spatial progress boards here.',
        eyebrow: 'Goal arcs',
        floatOffset: 3.2,
        position: [3.0, 1.82, -2.35],
        rotationY: -0.48,
        rows: targetRows,
        title: 'Targets',
        value: `${activeTargets.length}`,
      },
      {
        accent: '#fb7185',
        body: `${pinnedNotes.length} pinned notes ready for review.`,
        eyebrow: 'Knowledge wall',
        floatOffset: 4.8,
        position: [0, 1.55, -5.25],
        rows: noteRows,
        title: 'Notes vault',
        value: `${notes.length}`,
        width: 3.55,
      },
    ].map((panel) => ({
      ...panel,
      height: panel.height || 1.98,
    }));

    panels.forEach((panel) => {
      panel.baseY = panel.position[1];
    });

    const metricBlocks = [
      { color: '#34d399', height: 0.35 + completionRate / 80 },
      { color: '#60a5fa', height: 0.45 + Math.min(tasks.length, 8) * 0.12 },
      { color: '#a78bfa', height: 0.45 + Math.min(activeTargets.length, 6) * 0.18 },
      { color: '#fb7185', height: 0.45 + Math.min(notes.length, 8) * 0.1 },
    ];

    return {
      activeTargets,
      completedTasks,
      completionRate,
      metricBlocks,
      notes,
      panels,
      pinnedNotes,
      streak,
      targets,
      tasks,
    };
  }, [roomData, user?.name]);

  useEffect(() => {
    if (!canvasHostRef.current || !xrButtonHostRef.current) {
      return undefined;
    }

    canvasHostRef.current.replaceChildren();
    xrButtonHostRef.current.replaceChildren();

    return buildScene({
      buttonHost: xrButtonHostRef.current,
      host: canvasHostRef.current,
      room: model,
    });
  }, [model]);

  const statCards = [
    {
      icon: CheckSquare,
      label: 'Tasks',
      value: `${model.completedTasks}/${model.tasks.length || 0}`,
    },
    {
      icon: Goal,
      label: 'Targets',
      value: `${model.activeTargets.length}`,
    },
    {
      icon: NotebookText,
      label: 'Notes',
      value: `${model.notes.length}`,
    },
    {
      icon: Flame,
      label: 'Streak',
      value: `${model.streak}d`,
    },
  ];

  const xrLabel = {
    checking: 'Checking WebXR',
    'needs-https': 'HTTPS needed',
    preview: 'Desktop preview',
    ready: 'WebXR ready',
    unavailable: 'Desktop preview',
  }[xrStatus];

  return (
    <div className="vr-canvas-root relative min-h-screen overflow-hidden bg-[#020617] text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(20,184,166,0.18),transparent_28%),radial-gradient(circle_at_86%_16%,rgba(244,114,182,0.16),transparent_24%),linear-gradient(135deg,#020617_0%,#0f172a_48%,#030712_100%)]" />

      <div className="relative z-20 flex min-h-screen flex-col">
        <header className="flex flex-col gap-4 border-b border-white/10 bg-slate-950/60 px-4 py-4 backdrop-blur-2xl sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <Link
              to="/"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] text-slate-200 transition hover:bg-white/[0.1] hover:text-white"
              aria-label="Back to dashboard"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>

            <div className="min-w-0">
              <p className="text-xs uppercase tracking-[0.32em] text-slate-500">Student OS</p>
              <h1 className="truncate text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                VR Study Room
              </h1>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.05] px-3 py-2 text-sm text-slate-200">
              <Box className="h-4 w-4 text-cyan-200" />
              {xrLabel}
            </div>
            <div className="inline-flex items-center gap-2 rounded-2xl border border-emerald-300/20 bg-emerald-400/10 px-3 py-2 text-sm text-emerald-100">
              <RotateCcw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              {loading ? 'Syncing data' : 'Live data'}
            </div>
          </div>
        </header>

        <main className="relative min-h-0 flex-1">
          <div ref={canvasHostRef} className="absolute inset-0 cursor-grab active:cursor-grabbing" />
          <div ref={xrButtonHostRef} className="vr-xr-button-slot pointer-events-none absolute inset-0 z-30" />

          <div className="pointer-events-none absolute inset-x-4 bottom-4 z-20 grid gap-3 sm:grid-cols-4">
            {statCards.map((stat) => {
              const Icon = stat.icon;

              return (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 shadow-[0_18px_50px_rgba(2,6,23,0.35)] backdrop-blur-2xl"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.06] text-cyan-100">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.24em] text-slate-500">{stat.label}</p>
                      <p className="text-lg font-semibold text-white">{stat.value}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </main>
      </div>
    </div>
  );
};

export default VRStudyRoom;
