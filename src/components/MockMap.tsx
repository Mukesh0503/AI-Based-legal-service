
import React, { useEffect, useRef } from 'react';
import { getDistrictBounds } from '@/utils/providers';

interface MockMapProps {
  markers?: Array<{id: string; lat: number; lng: number; title: string}>;
  center?: {lat: number; lng: number};
  onMarkerClick?: (id: string) => void;
  zoom?: number;
  selectedDistrict?: string;
}

const MockMap: React.FC<MockMapProps> = ({
  markers = [],
  center = { lat: 11.1271, lng: 78.6569 },
  onMarkerClick,
  zoom = 10,
  selectedDistrict
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    if (!canvasRef.current || !mapRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas size
    canvas.width = mapRef.current.clientWidth;
    canvas.height = mapRef.current.clientHeight;
    
    // Draw map background
    ctx.fillStyle = '#f0f0f0';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw some fake roads/terrain
    ctx.strokeStyle = '#e0e0e0';
    for (let i = 0; i < 20; i++) {
      ctx.beginPath();
      ctx.moveTo(Math.random() * canvas.width, 0);
      ctx.lineTo(Math.random() * canvas.width, canvas.height);
      ctx.stroke();
      
      ctx.beginPath();
      ctx.moveTo(0, Math.random() * canvas.height);
      ctx.lineTo(canvas.width, Math.random() * canvas.height);
      ctx.stroke();
    }
    
    // Draw water bodies
    ctx.fillStyle = '#e6f2ff';
    ctx.beginPath();
    ctx.ellipse(canvas.width * 0.7, canvas.height * 0.3, 60, 40, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Add district boundaries for the selected district
    if (selectedDistrict) {
      const bounds = getDistrictBounds(selectedDistrict);
      if (bounds) {
        // Calculate district boundaries on canvas based on center coordinates and zoom
        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;
        const centerPoint = { 
          x: canvasWidth / 2, 
          y: canvasHeight / 2 
        };
        
        // Scale factor for converting geo distances to canvas pixels
        const scaleFactor = (canvasWidth / 10) * zoom;
        
        // Calculate boundaries
        const northOffsetY = (center.lat - bounds.north) * scaleFactor;
        const southOffsetY = (center.lat - bounds.south) * scaleFactor;
        const eastOffsetX = (bounds.east - center.lng) * scaleFactor;
        const westOffsetX = (bounds.west - center.lng) * scaleFactor;
        
        // Draw district boundary
        ctx.strokeStyle = '#4169E1';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.rect(
          centerPoint.x - westOffsetX, 
          centerPoint.y + northOffsetY, 
          westOffsetX + eastOffsetX, 
          southOffsetY - northOffsetY
        );
        ctx.stroke();
        
        // Add a semi-transparent highlight for the selected district
        ctx.fillStyle = 'rgba(65, 105, 225, 0.1)';
        ctx.fill();
      }
    } else {
      // Draw general district boundaries
      ctx.strokeStyle = '#aaa';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.rect(canvas.width * 0.2, canvas.height * 0.2, canvas.width * 0.6, canvas.height * 0.6);
      ctx.stroke();
    }
    
    // Draw a dot for the center location
    ctx.fillStyle = '#4169E1';
    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height / 2, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height / 2, 4, 0, Math.PI * 2);
    ctx.fill();
    
    // Add a pulsing circle for user's current position
    if (selectedDistrict) {
      const animatePulse = () => {
        let radius = 5;
        const maxRadius = 20;
        const pulseInterval = setInterval(() => {
          if (radius >= maxRadius) {
            radius = 5;
          }
          
          // Clear previous circle
          ctx.clearRect(canvas.width/2 - maxRadius - 2, canvas.height/2 - maxRadius - 2, 
                        maxRadius * 2 + 4, maxRadius * 2 + 4);
          
          // Redraw center dot
          ctx.fillStyle = '#4169E1';
          ctx.beginPath();
          ctx.arc(canvas.width / 2, canvas.height / 2, 8, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#fff';
          ctx.beginPath();
          ctx.arc(canvas.width / 2, canvas.height / 2, 4, 0, Math.PI * 2);
          ctx.fill();
          
          // Draw pulse
          ctx.beginPath();
          ctx.arc(canvas.width / 2, canvas.height / 2, radius, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(65, 105, 225, ${1 - radius/maxRadius})`;
          ctx.lineWidth = 2;
          ctx.stroke();
          
          radius += 1;
        }, 50);
        
        return () => clearInterval(pulseInterval);
      };
      
      const cleanup = animatePulse();
      return cleanup;
    }
    
    // Draw markers
    markers.forEach((marker, index) => {
      // Calculate marker position relative to center
      // This is simplified - not geographically accurate
      const xOffset = (marker.lng - center.lng) * (canvas.width / (0.1 * zoom));
      const yOffset = (center.lat - marker.lat) * (canvas.height / (0.1 * zoom));
      
      const x = (canvas.width / 2) + xOffset;
      const y = (canvas.height / 2) + yOffset;
      
      // Draw marker pin
      ctx.fillStyle = '#E53935';
      ctx.beginPath();
      ctx.arc(x, y, 6, 0, Math.PI * 2);
      ctx.fill();
      
      // Store marker position for click handling
      marker['_renderedPosition'] = {x, y};
    });
  }, [markers, center, zoom, selectedDistrict]);
  
  const handleMapClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!onMarkerClick || !markers) return;
    
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Check if click is on any marker
    markers.forEach(marker => {
      const position = marker['_renderedPosition'] as {x: number, y: number} | undefined;
      if (!position) return;
      
      const distance = Math.sqrt(Math.pow(position.x - x, 2) + Math.pow(position.y - y, 2));
      if (distance <= 10) { // Click radius of 10px
        onMarkerClick(marker.id);
      }
    });
  };
  
  return (
    <div ref={mapRef} className="relative h-full w-full overflow-hidden rounded-md border border-gray-200">
      <canvas
        ref={canvasRef}
        onClick={handleMapClick}
        className="h-full w-full"
      />
      
      {/* Map controls */}
      <div className="absolute top-2 right-2 flex flex-col gap-2">
        <button className="bg-white p-1 rounded shadow text-xl font-bold">+</button>
        <button className="bg-white p-1 rounded shadow text-xl font-bold">−</button>
      </div>
      
      {/* Map attribution */}
      <div className="absolute bottom-1 right-1 text-xs text-gray-500 bg-white/70 px-1 rounded">
        MockMap © LegalElegance
      </div>
    </div>
  );
};

export default MockMap;
