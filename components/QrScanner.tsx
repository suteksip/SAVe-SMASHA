
import React, { useEffect, useRef } from 'react';
// @ts-ignore because html5-qrcode is not a module
import { Html5Qrcode, Html5QrcodeScannerState } from 'html5-qrcode';

interface QrScannerProps {
    onScanSuccess: (decodedText: string) => void;
    onScanFailure: (error: string) => void;
}

const QrScanner: React.FC<QrScannerProps> = ({ onScanSuccess, onScanFailure }) => {
    const scannerRef = useRef<Html5Qrcode | null>(null);

    useEffect(() => {
        const qrCodeRegionId = "qr-reader";
        
        const html5QrCode = new Html5Qrcode(qrCodeRegionId);
        scannerRef.current = html5QrCode;

        const startScanner = async () => {
            try {
                const cameras = await Html5Qrcode.getCameras();
                if (cameras && cameras.length) {
                    const cameraId = cameras[0].id; // Use the first camera
                    await html5QrCode.start(
                        cameraId,
                        {
                            fps: 10,
                            qrbox: { width: 250, height: 250 }
                        },
                        onScanSuccess,
                        (errorMessage) => { 
                            // This is called frequently, so we don't call onScanFailure here
                            // to avoid spamming the UI with errors.
                        }
                    );
                } else {
                    onScanFailure("No cameras found.");
                }
            } catch (err) {
                 const errorMessage = err instanceof Error ? err.message : String(err);
                 onScanFailure(`Error initializing scanner: ${errorMessage}`);
            }
        };

        startScanner();

        return () => {
            if (scannerRef.current && scannerRef.current.getState() === Html5QrcodeScannerState.SCANNING) {
                scannerRef.current.stop().catch(err => {
                    console.error("Failed to stop the scanner.", err);
                });
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [onScanSuccess, onScanFailure]);

    return <div id="qr-reader" className="w-full max-w-md mx-auto rounded-lg overflow-hidden border-4 border-slate-300 dark:border-slate-700"></div>;
};

export default QrScanner;
