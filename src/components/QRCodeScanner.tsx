"use client";

import { useState } from "react";
import dynamic from "next/dynamic";

const QrReader = dynamic(() => import("react-qr-reader"), { ssr: false });

interface QRCodeScannerProps {
  onScan: (data: string | null) => void;
  onError?: (error: any) => void;
}

export default function QRCodeScanner({ onScan, onError }: QRCodeScannerProps) {
  const [delay] = useState(300);

  return (
    <div>
      <QrReader
        delay={delay}
        onError={onError}
        onScan={onScan}
        style={{ width: "100%" }}
      />
    </div>
  );
}
