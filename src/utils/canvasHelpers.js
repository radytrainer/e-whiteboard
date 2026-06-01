/**
 * Calculate the distance from a point (px, py) to a line segment (x1, y1) -> (x2, y2)
 */
export const getDistanceToSegment = (px, py, x1, y1, x2, y2) => {
  const dx = x2 - x1;
  const dy = y2 - y1;

  if (dx === 0 && dy === 0) {
    return Math.sqrt((px - x1) ** 2 + (py - y1) ** 2);
  }

  // Projection coefficient
  let t = ((px - x1) * dx + (py - y1) * dy) / (dx * dx + dy * dy);
  t = Math.max(0, Math.min(1, t)); // Clamp to segment

  const closestX = x1 + t * dx;
  const closestY = y1 + t * dy;

  return Math.sqrt((px - closestX) ** 2 + (py - closestY) ** 2);
};

/**
 * Check if a freehand drawing (represented as an array of points) intersects with the eraser circle
 */
export const isLineIntersectingEraser = (points, ex, ey, eraserRadius) => {
  if (!points || points.length < 4) return false;

  for (let i = 0; i < points.length - 2; i += 2) {
    const x1 = points[i];
    const y1 = points[i + 1];
    const x2 = points[i + 2];
    const y2 = points[i + 3];

    if (getDistanceToSegment(ex, ey, x1, y1, x2, y2) <= eraserRadius) {
      return true;
    }
  }
  return false;
};

/**
 * Check if a point (px, py) is inside a rotated rectangle
 */
export const isPointInRotatedRect = (px, py, rect) => {
  const { x, y, width, height, rotation = 0 } = rect;

  // If width or height are undefined/null, set defaults
  const w = width || 100;
  const h = height || 50;

  // Translate point to rect origin
  const dx = px - x;
  const dy = py - y;

  // Rotate point back to unrotated space
  const rad = (-rotation * Math.PI) / 180;
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);

  const lx = dx * cos - dy * sin;
  const ly = dx * sin + dy * cos;

  // Check bounds in local space
  return lx >= 0 && lx <= w && ly >= 0 && ly <= h;
};

/**
 * Check if a circle (the eraser) intersects with a rotated rectangle
 * We can approximate this by checking if the center is inside the rectangle,
 * or close to any of its edges.
 */
export const isRectIntersectingEraser = (rect, ex, ey, eraserRadius) => {
  // First check if the center is inside the rectangle
  if (isPointInRotatedRect(ex, ey, rect)) return true;

  const { x, y, width, height, rotation = 0 } = rect;
  const w = width || 100;
  const h = height || 50;

  // Define four corners of the rotated rectangle
  const rad = (rotation * Math.PI) / 180;
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);

  const getRotatedPoint = (lx, ly) => {
    return {
      x: x + lx * cos - ly * sin,
      y: y + lx * sin + ly * cos,
    };
  };

  const c1 = getRotatedPoint(0, 0);
  const c2 = getRotatedPoint(w, 0);
  const c3 = getRotatedPoint(w, h);
  const c4 = getRotatedPoint(0, h);

  // Check distance to all four segments
  if (getDistanceToSegment(ex, ey, c1.x, c1.y, c2.x, c2.y) <= eraserRadius) return true;
  if (getDistanceToSegment(ex, ey, c2.x, c2.y, c3.x, c3.y) <= eraserRadius) return true;
  if (getDistanceToSegment(ex, ey, c3.x, c3.y, c4.x, c4.y) <= eraserRadius) return true;
  if (getDistanceToSegment(ex, ey, c4.x, c4.y, c1.x, c1.y) <= eraserRadius) return true;

  return false;
};
