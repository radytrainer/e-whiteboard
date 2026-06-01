import { useState, useEffect, useRef, useMemo } from 'react';
import { Stage, Layer, Line, Text, Rect, Group, Image as KonvaImage, Transformer, Circle, RegularPolygon, Arrow } from 'react-konva';
import { useBoardStore } from '../store/boardStore';
import TextEditor from './TextEditor';
import { isLineIntersectingEraser, isRectIntersectingEraser } from '../utils/canvasHelpers';

const generateUniqueId = () => `obj_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

// Custom image hook with CORS support
function useCanvasImage(src) {
  const [image, setImage] = useState(null);
  useEffect(() => {
    if (!src) return;
    const img = new Image();
    img.src = src;
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      setImage(img);
    };
  }, [src]);
  return image;
}

// Sub-component to render Konva Image
function RenderImage({ obj, onSelect, onChange }) {
  const tool = useBoardStore((s) => s.tool);
  const image = useCanvasImage(obj.src);
  const imageRef = useRef(null);

  return (
    <KonvaImage
      ref={imageRef}
      id={obj.id}
      image={image || undefined}
      x={obj.x}
      y={obj.y}
      width={obj.width}
      height={obj.height}
      rotation={obj.rotation}
      scaleX={obj.scaleX || 1}
      scaleY={obj.scaleY || 1}
      draggable={tool === 'select'}
      onClick={onSelect}
      onTouchStart={onSelect}
      onDragEnd={(e) => {
        onChange(obj.id, {
          x: e.target.x(),
          y: e.target.y(),
        });
      }}
      onTransformEnd={(e) => {
        const node = e.target;
        onChange(obj.id, {
          x: node.x(),
          y: node.y(),
          rotation: node.rotation(),
          scaleX: node.scaleX(),
          scaleY: node.scaleY(),
        });
      }}
    />
  );
}

// Sub-component to render Sticky Notes
function RenderStickyNote({ obj, onSelect, onDoubleClick, onChange }) {
  const tool = useBoardStore((s) => s.tool);
  const groupRef = useRef(null);

  return (
    <Group
      ref={groupRef}
      id={obj.id}
      x={obj.x}
      y={obj.y}
      rotation={obj.rotation}
      scaleX={obj.scaleX || 1}
      scaleY={obj.scaleY || 1}
      draggable={tool === 'select'}
      onClick={onSelect}
      onTouchStart={onSelect}
      onDblClick={onDoubleClick}
      onDblTap={onDoubleClick}
      onDragEnd={(e) => {
        onChange(obj.id, {
          x: e.target.x(),
          y: e.target.y(),
        });
      }}
      onTransformEnd={(e) => {
        const node = e.target;
        onChange(obj.id, {
          x: node.x(),
          y: node.y(),
          rotation: node.rotation(),
          scaleX: node.scaleX(),
          scaleY: node.scaleY(),
        });
      }}
    >
      {/* Sticky note card */}
      <Rect
        width={obj.width}
        height={obj.height}
        fill={obj.color || '#fef08a'}
        shadowColor="rgba(0,0,0,0.15)"
        shadowBlur={8}
        shadowOffset={{ x: 3, y: 3 }}
        shadowOpacity={0.8}
        cornerRadius={6}
      />
      {/* Tape style overlay on top for realistic feel */}
      <Rect
        x={obj.width / 2 - 25}
        y={-10}
        width={50}
        height={16}
        fill="rgba(255,255,255,0.4)"
        rotation={-2}
      />
      {/* Text Inside Note */}
      <Text
        text={obj.text}
        width={obj.width}
        height={obj.height}
        padding={15}
        fontSize={obj.fontSize || 18}
        fontFamily="'Inter', 'Kantumruy Pro', sans-serif"
        fill={obj.fontColor || '#1f2937'}
        align="center"
        verticalAlign="middle"
        wrap="char"
      />
    </Group>
  );
}

// Sub-component to render shapes with Konva primitives
function RenderShape({ obj, onSelect, onChange }) {
  const tool = useBoardStore((s) => s.tool);
  const shapeRef = useRef(null);

  const commonProps = {
    ref: shapeRef,
    id: obj.id,
    x: obj.x,
    y: obj.y,
    rotation: obj.rotation || 0,
    scaleX: obj.scaleX || 1,
    scaleY: obj.scaleY || 1,
    stroke: obj.stroke || '#aa3bff',
    strokeWidth: obj.strokeWidth || 3,
    fill: obj.fill || 'transparent',
    draggable: tool === 'select',
    onClick: onSelect,
    onTouchStart: onSelect,
    onDragEnd: (e) => {
      onChange(obj.id, {
        x: e.target.x(),
        y: e.target.y(),
      });
    },
    onTransformEnd: (e) => {
      const node = e.target;
      onChange(obj.id, {
        x: node.x(),
        y: node.y(),
        rotation: node.rotation(),
        scaleX: node.scaleX(),
        scaleY: node.scaleY(),
      });
    },
  };

  const w = obj.width || 100;
  const h = obj.height || 100;

  if (obj.shapeType === 'square') {
    return <Rect {...commonProps} width={w} height={h} cornerRadius={4} />;
  }

  if (obj.shapeType === 'circle') {
    const radius = w / 2;
    return (
      <Circle
        {...commonProps}
        radius={radius}
        offsetX={-radius}
        offsetY={-radius}
      />
    );
  }

  if (obj.shapeType === 'triangle') {
    const radius = w / 2;
    return (
      <RegularPolygon
        {...commonProps}
        sides={3}
        radius={radius}
        offsetX={-radius}
        offsetY={-radius}
      />
    );
  }

  if (obj.shapeType === 'polygon') {
    const radius = w / 2;
    return (
      <RegularPolygon
        {...commonProps}
        sides={obj.sides || 5}
        radius={radius}
        offsetX={-radius}
        offsetY={-radius}
      />
    );
  }

  if (obj.shapeType === 'line') {
    return (
      <Line
        {...commonProps}
        points={[0, 0, w, 0]}
      />
    );
  }

  if (obj.shapeType === 'arrow') {
    return (
      <Arrow
        {...commonProps}
        points={[0, h / 2, w, h / 2]}
        pointerLength={12}
        pointerWidth={12}
        fill={obj.stroke || '#aa3bff'}
      />
    );
  }

  return null;
}

export default function Canvas({ stageRef }) {
  const {
    objects,
    selectedId,
    setSelectedId,
    tool,
    scale,
    setScale,
    position,
    setPosition,
    theme,
    background,
    bgColor,
    gridSize,
    gridOpacity,
    pencilColor,
    pencilWidth,
    eraserWidth,
    textColor,
    textSize,
    textFont,
    addObject,
    updateObject,
    deleteObject,
    saveHistory,
  } = useBoardStore();

  const [isDrawing, setIsDrawing] = useState(false);
  const [currentLinePoints, setCurrentLinePoints] = useState([]);
  const [isSpacePressed, setIsSpacePressed] = useState(false);
  const [isDraggingStage, setIsDraggingStage] = useState(false);
  
  // State for active text editing
  const [editingId, setEditingId] = useState(null);

  // State for shape drag-drawing
  const [drawingShapeId, setDrawingShapeId] = useState(null);
  const [shapeStartPos, setShapeStartPos] = useState(null);

  const transformerRef = useRef(null);
  const containerRef = useRef(null);

  // Monitor Spacebar state for Pan mode
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'Space') {
        // Prevent default browser scroll
        e.preventDefault();
        setIsSpacePressed(true);
      }
    };
    const handleKeyUp = (e) => {
      if (e.code === 'Space') {
        setIsSpacePressed(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Update Transformer nodes when selection changes
  useEffect(() => {
    if (!transformerRef.current) return;
    const stage = stageRef.current;
    if (!stage) return;

    if (selectedId && !editingId) {
      const selectedNode = stage.findOne('#' + selectedId);
      if (selectedNode) {
        transformerRef.current.nodes([selectedNode]);
        transformerRef.current.getLayer().batchDraw();
      } else {
        transformerRef.current.nodes([]);
      }
    } else {
      transformerRef.current.nodes([]);
    }
  }, [selectedId, editingId, objects, stageRef]);

  // Create Background Pattern Image dynamically
  const bgPatternImage = useMemo(() => {
    if (background === 'plain') return null;

    const canvas = document.createElement('canvas');
    canvas.width = gridSize;
    canvas.height = gridSize;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    const strokeColor =
      theme === 'dark'
        ? `rgba(255, 255, 255, ${gridOpacity})`
        : `rgba(0, 0, 0, ${gridOpacity})`;

    ctx.strokeStyle = strokeColor;
    ctx.fillStyle = strokeColor;

    if (background === 'grid') {
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      // Draw grid lines
      ctx.moveTo(gridSize, 0);
      ctx.lineTo(gridSize, gridSize);
      ctx.moveTo(0, gridSize);
      ctx.lineTo(gridSize, gridSize);
      ctx.stroke();
    } else if (background === 'dotted') {
      ctx.beginPath();
      ctx.arc(gridSize / 2, gridSize / 2, 1.2, 0, Math.PI * 2);
      ctx.fill();
    } else if (background === 'lined') {
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      ctx.moveTo(0, gridSize);
      ctx.lineTo(gridSize, gridSize);
      ctx.stroke();
    }

    return canvas;
  }, [background, gridSize, gridOpacity, theme]);

  // Stage Mouse Events
  const handleStageMouseDown = (e) => {
    const stage = stageRef.current;
    if (!stage) return;

    // Deselect click (clicking plain canvas background or grid overlay)
    const clickedOnEmpty =
      e.target === stage ||
      e.target.name() === 'canvas-bg-rect' ||
      e.target.name() === 'canvas-grid-rect';

    if (clickedOnEmpty) {
      setSelectedId(null);
      setEditingId(null);
    }

    // 1. Pan Tool or Space Key
    if (tool === 'pan' || isSpacePressed) {
      setIsDraggingStage(true);
      stage.container().style.cursor = 'grabbing';
      return;
    }

    // 2. Pencil Drawing
    if (tool === 'pencil') {
      setIsDrawing(true);
      const pointer = stage.getPointerPosition();
      const x = (pointer.x - position.x) / scale;
      const y = (pointer.y - position.y) / scale;
      setCurrentLinePoints([x, y]);
      return;
    }

    // 3. Eraser Click / Drag
    if (tool === 'eraser') {
      setIsDrawing(true);
      const pointer = stage.getPointerPosition();
      const x = (pointer.x - position.x) / scale;
      const y = (pointer.y - position.y) / scale;
      handleEraseAt(x, y);
      return;
    }

    // 4. Text Tool Click
    if (tool === 'text' && clickedOnEmpty) {
      const pointer = stage.getPointerPosition();
      const x = (pointer.x - position.x) / scale;
      const y = (pointer.y - position.y) / scale;

      const newId = generateUniqueId();
      addObject({
        id: newId,
        type: 'text',
        text: 'Type text here',
        x,
        y,
        width: 180,
        height: 36,
        fontSize: textSize,
        fontFamily: textFont,
        fontColor: textColor,
        isBold: false,
        isItalic: false,
        isUnderline: false,
        align: 'left',
        rotation: 0,
        scaleX: 1,
        scaleY: 1,
      });

      // Instantly edit the new text
      setTimeout(() => {
        setEditingId(newId);
      }, 50);
      return;
    }

    // 5. Sticky Note Click
    if (tool === 'sticky' && clickedOnEmpty) {
      const pointer = stage.getPointerPosition();
      const x = (pointer.x - position.x) / scale;
      const y = (pointer.y - position.y) / scale;

      const newId = generateUniqueId();
      addObject({
        id: newId,
        type: 'sticky',
        text: 'Note Content',
        x: x - 75,
        y: y - 75,
        width: 150,
        height: 150,
        color: useBoardStore.getState().stickyColor,
        fontColor: '#1f2937',
        fontSize: 18,
        rotation: 0,
        scaleX: 1,
        scaleY: 1,
      });

      // Instantly edit the note
      setTimeout(() => {
        setEditingId(newId);
      }, 50);
      return;
    }

    // 6. Shape Click & Drag-Draw Start
    if (tool === 'shape' && clickedOnEmpty) {
      const pointer = stage.getPointerPosition();
      const x = (pointer.x - position.x) / scale;
      const y = (pointer.y - position.y) / scale;

      const store = useBoardStore.getState();
      const newId = generateUniqueId();
      
      addObject({
        id: newId,
        type: 'shape',
        shapeType: store.shapeType,
        sides: store.shapeSides,
        x: x,
        y: y,
        width: 5,
        height: 5,
        stroke: store.shapeStroke,
        strokeWidth: 3,
        fill: store.shapeFill,
        rotation: 0,
        scaleX: 1,
        scaleY: 1,
      });

      setIsDrawing(true);
      setDrawingShapeId(newId);
      setShapeStartPos({ x, y });
      return;
    }
  };

  const handleStageMouseMove = (e) => {
    const stage = stageRef.current;
    if (!stage) return;

    // 1. Pan Board
    if (isDraggingStage && (tool === 'pan' || isSpacePressed)) {
      const dx = e.evt.movementX;
      const dy = e.evt.movementY;
      setPosition({
        x: position.x + dx,
        y: position.y + dy,
      });
      return;
    }

    // 2. Pencil Draw
    if (isDrawing && tool === 'pencil') {
      const pointer = stage.getPointerPosition();
      const x = (pointer.x - position.x) / scale;
      const y = (pointer.y - position.y) / scale;
      
      // Prevent duplicate coordinate updates
      const lastX = currentLinePoints[currentLinePoints.length - 2];
      const lastY = currentLinePoints[currentLinePoints.length - 1];
      if (lastX !== x || lastY !== y) {
        setCurrentLinePoints([...currentLinePoints, x, y]);
      }
      return;
    }

    // 3. Eraser drag-erase
    if (isDrawing && tool === 'eraser') {
      const pointer = stage.getPointerPosition();
      const x = (pointer.x - position.x) / scale;
      const y = (pointer.y - position.y) / scale;
      handleEraseAt(x, y);
      return;
    }

    // 4. Shape drag-sizing
    if (isDrawing && tool === 'shape' && drawingShapeId && shapeStartPos) {
      const pointer = stage.getPointerPosition();
      const x = (pointer.x - position.x) / scale;
      const y = (pointer.y - position.y) / scale;

      const dx = x - shapeStartPos.x;
      const dy = y - shapeStartPos.y;

      updateObject(drawingShapeId, {
        width: Math.abs(dx) || 5,
        height: Math.abs(dy) || 5,
        x: dx < 0 ? x : shapeStartPos.x,
        y: dy < 0 ? y : shapeStartPos.y,
      });
      return;
    }
  };

  const handleStageMouseUp = () => {
    setIsDraggingStage(false);
    const stage = stageRef.current;
    if (stage) {
      stage.container().style.cursor = tool === 'pan' || isSpacePressed ? 'grab' : 'default';
    }

    // Commit drawn line
    if (isDrawing && tool === 'pencil' && currentLinePoints.length >= 4) {
      addObject({
        type: 'pencil',
        points: currentLinePoints,
        color: pencilColor,
        strokeWidth: pencilWidth,
      });
    }

    setIsDrawing(false);
    setCurrentLinePoints([]);

    // Shape drag-draw end
    if (isDrawing && tool === 'shape' && drawingShapeId) {
      const store = useBoardStore.getState();
      const shapeObj = store.objects.find((o) => o.id === drawingShapeId);
      if (shapeObj && (shapeObj.width <= 15 || shapeObj.height <= 15)) {
        // Safe default fallback for simple clicks
        updateObject(drawingShapeId, {
          x: shapeStartPos.x - 50,
          y: shapeStartPos.y - 50,
          width: 100,
          height: 100,
        });
      }
      
      // Save history after finishing drawing
      saveHistory();

      // Instantly highlight in select mode
      const finalId = drawingShapeId;
      setTimeout(() => {
        store.setTool('select');
        store.setSelectedId(finalId);
      }, 50);

      setDrawingShapeId(null);
      setShapeStartPos(null);
      return;
    }
  };

  // Zoom stage on Mouse Wheel
  const handleStageWheel = (e) => {
    e.evt.preventDefault();
    const stage = stageRef.current;
    if (!stage) return;

    const scaleBy = 1.08;
    const oldScale = scale;

    const pointer = stage.getPointerPosition();
    if (!pointer) return;

    // Calculate pointer relative to stage position
    const mousePointTo = {
      x: (pointer.x - position.x) / oldScale,
      y: (pointer.y - position.y) / oldScale,
    };

    // Zoom direction
    let newScale = e.evt.deltaY < 0 ? oldScale * scaleBy : oldScale / scaleBy;
    // Constrain Zoom bounds
    newScale = Math.max(0.15, Math.min(newScale, 15));

    setScale(newScale);
    setPosition({
      x: pointer.x - mousePointTo.x * newScale,
      y: pointer.y - mousePointTo.y * newScale,
    });
  };

  // Vector collision erase handler
  const handleEraseAt = (ex, ey) => {
    const radius = eraserWidth / 2;
    // Find intersected elements
    objects.forEach((obj) => {
      const hit = obj.type === 'pencil'
        ? (() => {
            const ox = obj.x || 0;
            const oy = obj.y || 0;
            const rot = obj.rotation || 0;
            const sx = obj.scaleX || 1;
            const sy = obj.scaleY || 1;

            // Translate
            const dx = ex - ox;
            const dy = ey - oy;

            // Rotate back
            const rad = (-rot * Math.PI) / 180;
            const cos = Math.cos(rad);
            const sin = Math.sin(rad);
            const rx = dx * cos - dy * sin;
            const ry = dx * sin + dy * cos;

            // Scale back
            const lx = rx / sx;
            const ly = ry / sy;

            return isLineIntersectingEraser(obj.points, lx, ly, radius / Math.max(sx, sy));
          })()
        : isRectIntersectingEraser(obj, ex, ey, radius);

      if (hit) {
        deleteObject(obj.id);
      }
    });
  };

  // Set cursor styles
  const getCursorStyle = () => {
    if (isSpacePressed || tool === 'pan') return isDraggingStage ? 'grabbing' : 'grab';
    if (tool === 'pencil') return 'crosshair';
    if (tool === 'eraser') return 'none'; // custom circular cursor
    if (tool === 'text') return 'text';
    return 'default';
  };

  // Double click editing handles
  const handleObjectDoubleClick = (id) => {
    if (tool === 'select' || tool === 'text' || tool === 'sticky') {
      setEditingId(id);
    }
  };

  // Find editing object to send props to overlay TextEditor
  const editingObject = useMemo(() => {
    return objects.find((o) => o.id === editingId);
  }, [objects, editingId]);

  return (
    <div
      ref={containerRef}
      style={{ cursor: getCursorStyle() }}
      className="w-full h-full relative outline-none select-none overflow-hidden"
      onDragOver={(e) => {
        e.preventDefault();
      }}
      onDrop={(e) => {
        const source = e.dataTransfer.getData('source');
        const textVal = e.dataTransfer.getData('text/plain');
        if ((source === 'math-symbol' || source === 'math-formula') && textVal) {
          e.preventDefault();
          const rect = containerRef.current.getBoundingClientRect();
          const clientX = e.clientX - rect.left;
          const clientY = e.clientY - rect.top;

          const x = (clientX - position.x) / scale;
          const y = (clientY - position.y) / scale;

          addObject({
            type: 'text',
            text: textVal,
            x: x - (source === 'math-formula' ? 60 : 18),
            y: y - 18,
            fontSize: source === 'math-formula' ? 28 : 36,
            fontColor: textColor,
            fontFamily: textFont,
            isBold: false,
            isItalic: false,
            isUnderline: false,
            align: 'left',
            rotation: 0,
            scaleX: 1,
            scaleY: 1,
          });
        } else if (source === 'shape-template') {
          e.preventDefault();
          const shapeType = e.dataTransfer.getData('shape-type');
          const shapeSidesStr = e.dataTransfer.getData('shape-sides');
          const sides = shapeSidesStr ? parseInt(shapeSidesStr) : 5;

          const rect = containerRef.current.getBoundingClientRect();
          const clientX = e.clientX - rect.left;
          const clientY = e.clientY - rect.top;

          const x = (clientX - position.x) / scale;
          const y = (clientY - position.y) / scale;

          const store = useBoardStore.getState();
          const newId = `obj_${Date.now()}`;

          addObject({
            id: newId,
            type: 'shape',
            shapeType: shapeType,
            sides: sides,
            x: x - 50,
            y: y - 50,
            width: 100,
            height: 100,
            stroke: store.shapeStroke,
            strokeWidth: 3,
            fill: store.shapeFill,
            rotation: 0,
            scaleX: 1,
            scaleY: 1,
          });

          setTimeout(() => {
            store.setTool('select');
            store.setSelectedId(newId);
          }, 50);
        }
      }}
    >
      <Stage
        ref={stageRef}
        width={window.innerWidth}
        height={window.innerHeight}
        onMouseDown={handleStageMouseDown}
        onMouseMove={handleStageMouseMove}
        onMouseUp={handleStageMouseUp}
        onTouchStart={handleStageMouseDown}
        onTouchMove={handleStageMouseMove}
        onTouchEnd={handleStageMouseUp}
        onWheel={handleStageWheel}
        scaleX={scale}
        scaleY={scale}
        x={position.x}
        y={position.y}
      >
        <Layer>
          {/* Canvas Background Rect */}
          <Rect
            name="canvas-bg-rect"
            className="canvas-background"
            x={(-position.x - 5000) / scale}
            y={(-position.y - 5000) / scale}
            width={(window.innerWidth + 10000) / scale}
            height={(window.innerHeight + 10000) / scale}
            fill={bgColor}
          />

          {/* Grid Pattern overlay */}
          {bgPatternImage && (
            <Rect
              name="canvas-grid-rect"
              className="canvas-grid-pattern"
              x={(-position.x - 5000) / scale}
              y={(-position.y - 5000) / scale}
              width={(window.innerWidth + 10000) / scale}
              height={(window.innerHeight + 10000) / scale}
              fillPatternImage={bgPatternImage}
              fillPatternRepeat="repeat"
              fillPatternOffset={{
                x: 0,
                y: 0,
              }}
            />
          )}

          {/* Render All Saved Canvas Objects */}
          {objects.map((obj) => {
            // Hide object if actively editing (overlay takes its place)
            const isEditing = editingId === obj.id;
            if (isEditing) return null;

            const isSelected = selectedId === obj.id;

            if (obj.type === 'pencil') {
              return (
                <Line
                  key={obj.id}
                  id={obj.id}
                  points={obj.points}
                  x={obj.x || 0}
                  y={obj.y || 0}
                  scaleX={obj.scaleX || 1}
                  scaleY={obj.scaleY || 1}
                  rotation={obj.rotation || 0}
                  stroke={obj.color}
                  strokeWidth={obj.strokeWidth}
                  tension={0.4}
                  lineCap="round"
                  lineJoin="round"
                  draggable={tool === 'select'}
                  onClick={() => tool === 'select' && setSelectedId(obj.id)}
                  onTouchStart={() => tool === 'select' && setSelectedId(obj.id)}
                  onDragEnd={(e) => {
                    updateObject(obj.id, {
                      x: e.target.x(),
                      y: e.target.y(),
                    });
                    saveHistory();
                  }}
                  onTransformEnd={(e) => {
                    const node = e.target;
                    updateObject(obj.id, {
                      x: node.x(),
                      y: node.y(),
                      scaleX: node.scaleX(),
                      scaleY: node.scaleY(),
                      rotation: node.rotation(),
                    });
                    saveHistory();
                  }}
                />
              );
            }

            if (obj.type === 'text') {
              return (
                <Text
                  key={obj.id}
                  id={obj.id}
                  text={obj.text}
                  x={obj.x}
                  y={obj.y}
                  width={obj.width}
                  height={obj.height}
                  fontSize={obj.fontSize || 24}
                  fontFamily={obj.fontFamily === 'Inter' ? "'Inter', 'Kantumruy Pro', sans-serif" : obj.fontFamily}
                  fill={obj.fontColor || textColor}
                  fontStyle={`${obj.isItalic ? 'italic' : ''} ${obj.isBold ? 'bold' : ''}`.trim() || 'normal'}
                  textDecoration={obj.isUnderline ? 'underline' : 'none'}
                  align={obj.align || 'left'}
                  rotation={obj.rotation}
                  scaleX={obj.scaleX || 1}
                  scaleY={obj.scaleY || 1}
                  draggable={tool === 'select'}
                  onClick={() => tool === 'select' && setSelectedId(obj.id)}
                  onTouchStart={() => tool === 'select' && setSelectedId(obj.id)}
                  onDblClick={() => handleObjectDoubleClick(obj.id)}
                  onDblTap={() => handleObjectDoubleClick(obj.id)}
                  onDragEnd={(e) => {
                    updateObject(obj.id, {
                      x: e.target.x(),
                      y: e.target.y(),
                    });
                    saveHistory();
                  }}
                  onTransformEnd={(e) => {
                    const node = e.target;
                    updateObject(obj.id, {
                      x: node.x(),
                      y: node.y(),
                      rotation: node.rotation(),
                      scaleX: node.scaleX(),
                      scaleY: node.scaleY(),
                    });
                    saveHistory();
                  }}
                />
              );
            }

            if (obj.type === 'sticky') {
              return (
                <RenderStickyNote
                  key={obj.id}
                  obj={obj}
                  isSelected={isSelected}
                  onSelect={() => tool === 'select' && setSelectedId(obj.id)}
                  onDoubleClick={() => handleObjectDoubleClick(obj.id)}
                  onChange={(id, updates) => {
                    updateObject(id, updates);
                    saveHistory();
                  }}
                />
              );
            }

            if (obj.type === 'image') {
              return (
                <RenderImage
                  key={obj.id}
                  obj={obj}
                  isSelected={isSelected}
                  onSelect={() => tool === 'select' && setSelectedId(obj.id)}
                  onChange={(id, updates) => {
                    updateObject(id, updates);
                    saveHistory();
                  }}
                />
              );
            }

            if (obj.type === 'shape') {
              return (
                <RenderShape
                  key={obj.id}
                  obj={obj}
                  isSelected={isSelected}
                  onSelect={() => tool === 'select' && setSelectedId(obj.id)}
                  onChange={(id, updates) => {
                    updateObject(id, updates);
                    saveHistory();
                  }}
                />
              );
            }

            return null;
          })}

          {/* Active drawing line preview */}
          {tool === 'pencil' && isDrawing && currentLinePoints.length > 0 && (
            <Line
              points={currentLinePoints}
              stroke={pencilColor}
              strokeWidth={pencilWidth}
              tension={0.4}
              lineCap="round"
              lineJoin="round"
            />
          )}

          {/* Selection Transformer Layer */}
          {tool === 'select' && selectedId && !editingId && (
            <Transformer
              ref={transformerRef}
              boundBoxFunc={(oldBox, newBox) => {
                // Minimum size constraints
                if (Math.abs(newBox.width) < 15 || Math.abs(newBox.height) < 15) {
                  return oldBox;
                }
                return newBox;
              }}
              anchorStroke="#aa3bff"
              anchorFill="#ffffff"
              anchorSize={8}
              borderStroke="#aa3bff"
              borderDash={[3, 3]}
            />
          )}
        </Layer>
      </Stage>

      {/* Eraser circle outline overlay (custom cursor for eraser) */}
      {tool === 'eraser' && isDrawing === false && (
        <EraserCursor stageRef={stageRef} size={eraserWidth} scale={scale} position={position} />
      )}

      {/* Absolute DOM HTML overlay text editing box */}
      {editingId && editingObject && (
        <TextEditor
          text={editingObject.text}
          x={editingObject.x}
          y={editingObject.y}
          width={editingObject.width}
          height={editingObject.height}
          scale={scale}
          position={position}
          rotation={editingObject.rotation}
          scaleX={editingObject.scaleX}
          scaleY={editingObject.scaleY}
          fontSize={editingObject.fontSize || 24}
          fontFamily={editingObject.fontFamily || 'Inter'}
          fontColor={editingObject.fontColor || textColor}
          isBold={editingObject.isBold}
          isItalic={editingObject.isItalic}
          isUnderline={editingObject.isUnderline}
          align={editingObject.align}
          onChange={(text) => updateObject(editingId, { text })}
          onBlur={() => {
            setEditingId(null);
            // Auto clean up if text is empty, whitespace only, or left as placeholder
            if (!editingObject.text || editingObject.text.trim() === '' || editingObject.text === 'Type text here') {
              deleteObject(editingObject.id);
            } else {
              saveHistory();
            }
          }}
        />
      )}
    </div>
  );
}

// Circular indicator cursor for Eraser mode
function EraserCursor({ stageRef, size, scale }) {
  const [coords, setCoords] = useState(null);

  useEffect(() => {
    const handleMouseMove = () => {
      const stage = stageRef.current;
      if (!stage) return;
      
      const pointer = stage.getPointerPosition();
      if (pointer) {
        setCoords({ x: pointer.x, y: pointer.y });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [stageRef]);

  if (!coords) return null;

  const scaledSize = size * scale;

  return (
    <div
      style={{
        position: 'absolute',
        left: `${coords.x - scaledSize / 2}px`,
        top: `${coords.y - scaledSize / 2}px`,
        width: `${scaledSize}px`,
        height: `${scaledSize}px`,
        border: '1px solid #ff4444',
        borderRadius: '50%',
        backgroundColor: 'rgba(255, 68, 68, 0.1)',
        pointerEvents: 'none',
        zIndex: 100,
      }}
    />
  );
}
