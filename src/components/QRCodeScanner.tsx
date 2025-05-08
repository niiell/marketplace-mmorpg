"use client";

import { useEffect, useRef, useState } from "react";
import { Html5Qrcode, Html5QrcodeScannerState } from "html5-qrcode";

interface QRCodeScannerProps {
  onScan: (data: string | null) => void;
  onError?: (error: any) => void;
}

export default function QRCodeScanner({ onScan, onError }: QRCodeScannerProps) {
  const qrCodeRegionId = "qr-code-region";
  const html5QrcodeScannerRef = useRef<Html5Qrcode | null>(null);
  const [scannerState, setScannerState] = useState<Html5QrcodeScannerState | null>(null);

  useEffect(() => {
    if (!html5QrcodeScannerRef.current) {
      html5QrcodeScannerRef.current = new Html5Qrcode(qrCodeRegionId);
    }

    const config = { fps: 10, qrbox: 250 };

    html5QrcodeScannerRef.current
      .start(
        { facingMode: "environment" },
        config,
        (decodedText) => {
          onScan(decodedText);
        },
        (errorMessage) => {
          if (onError) onError(errorMessage);
        }
      )
      .then((scannerState) => {
        setScannerState(scannerState);
      })
      .catch((err) => {
        if (onError) onError(err);
      });

    return () => {
      if (html5QrcodeScannerRef.current) {
        html5QrcodeScannerRef.current.stop().catch(() => {
          // ignore errors on stop
        });
      }
    };
  }, [onScan, onError]);

  const handleStopScan = () => {
    if (html5QrcodeScannerRef.current) {
      html5QrcodeScannerRef.current.stop().catch(() => {
        // ignore errors on stop
      });
    }
  };

  return (
    <div id={qrCodeRegionId} style={{ width: "100%" }}>
      {scannerState && (
        <button onClick={handleStopScan}>Stop Scan</button>
      )}
    </div>
  );
}