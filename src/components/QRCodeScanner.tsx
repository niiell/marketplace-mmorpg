"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SmokeButton } from "./SmokeButton";

interface QRCodeScannerProps {
  onScan: (data: string) => void;
  onError?: (error: string) => void;
}

export default function QRCodeScanner({ onScan, onError }: QRCodeScannerProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [selectedCamera, setSelectedCamera] = useState<string>("");
  const [availableCameras, setAvailableCameras] = useState<MediaDeviceInfo[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    const getAvailableCameras = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const cameras = devices.filter(device => device.kind === "videoinput");
        setAvailableCameras(cameras);
        if (cameras.length > 0) {
          setSelectedCamera(cameras[0].deviceId);
        }
      } catch (err) {
        console.error("Error getting cameras:", err);
        onError?.("Unable to access cameras");
      }
    };

    getAvailableCameras();
  }, [onError]);

  const startScanning = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { deviceId: selectedCamera }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setHasPermission(true);
        setIsScanning(true);
        scanQRCode();
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      setHasPermission(false);
      onError?.("Camera access denied");
    }
  };

  const stopScanning = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    setIsScanning(false);
  };

  const scanQRCode = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    if (!context) return;

    const scan = () => {
      if (video.readyState === video.HAVE_ENOUGH_DATA) {
        canvas.height = video.videoHeight;
        canvas.width = video.videoWidth;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        try {
          // Here you would integrate with a QR code scanning library
          // For example, using jsQR or ZXing
          // const code = jsQR(imageData.data, imageData.width, imageData.height);
          // if (code) {
          //   onScan(code.data);
          //   stopScanning();
          // }
        } catch (err) {
          console.error("QR scanning error:", err);
        }
      }
      animationFrameRef.current = requestAnimationFrame(scan);
    };

    scan();
  };

  useEffect(() => {
    return () => {
      stopScanning();
    };
  }, []);

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        {/* Camera Preview */}
        <div className="relative aspect-square">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
          <canvas ref={canvasRef} className="hidden" />

          {/* Scanning overlay */}
          <AnimatePresence>
            {isScanning && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0"
              >
                {/* Corner markers */}
                <div className="absolute top-0 left-0 w-16 h-16 border-l-4 border-t-4 border-blue-500" />
                <div className="absolute top-0 right-0 w-16 h-16 border-r-4 border-t-4 border-blue-500" />
                <div className="absolute bottom-0 left-0 w-16 h-16 border-l-4 border-b-4 border-blue-500" />
                <div className="absolute bottom-0 right-0 w-16 h-16 border-r-4 border-b-4 border-blue-500" />

                {/* Scanning line animation */}
                <motion.div
                  className="absolute left-0 w-full h-1 bg-blue-500/50"
                  initial={{ top: "0%" }}
                  animate={{ top: ["0%", "100%", "0%"] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Permission denied message */}
          {hasPermission === false && (
            <div className="absolute inset-0 bg-black/75 flex items-center justify-center text-white p-4 text-center">
              <div>
                <svg className="w-16 h-16 mx-auto mb-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <p className="text-lg font-medium">Camera Access Required</p>
                <p className="mt-2 text-sm text-gray-300">
                  Please allow camera access to scan QR codes
                </p>
                <SmokeButton
                  onClick={startScanning}
                  variant="primary"
                  className="mt-4"
                >
                  Try Again
                </SmokeButton>
              </div>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="p-4 space-y-4">
          {availableCameras.length > 1 && (
            <select
              value={selectedCamera}
              onChange={(e) => setSelectedCamera(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-colors duration-200"
            >
              {availableCameras.map(camera => (
                <option key={camera.deviceId} value={camera.deviceId}>
                  {camera.label || `Camera ${camera.deviceId.slice(0, 4)}`}
                </option>
              ))}
            </select>
          )}

          <div className="flex justify-center space-x-4">
            {!isScanning ? (
              <SmokeButton onClick={startScanning} variant="primary">
                Start Scanning
              </SmokeButton>
            ) : (
              <SmokeButton onClick={stopScanning} variant="danger">
                Stop Scanning
              </SmokeButton>
            )}
          </div>
        </div>
      </div>

      <p className="mt-4 text-sm text-center text-gray-600 dark:text-gray-400">
        Position the QR code within the frame to scan
      </p>
    </div>
  );
}