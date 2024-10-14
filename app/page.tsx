"use client";

import { useState } from 'react';
import QRCodeGenerator from '../components/QRCodeGenerator';
import SavedQRCodes from '../components/SavedQRCodes';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Home() {
  const [savedQRCodes, setSavedQRCodes] = useState<string[]>([]);

  const handleSave = (qrCodeData: string) => {
    setSavedQRCodes((prev) => [...prev, qrCodeData]);
    localStorage.setItem('savedQRCodes', JSON.stringify([...savedQRCodes, qrCodeData]));
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">QR Code Generator</h1>
      <Tabs defaultValue="generate" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="generate">Generate QR Code</TabsTrigger>
          <TabsTrigger value="saved">Saved QR Codes</TabsTrigger>
        </TabsList>
        <TabsContent value="generate">
          <QRCodeGenerator onSave={handleSave} />
        </TabsContent>
        <TabsContent value="saved">
          <SavedQRCodes savedQRCodes={savedQRCodes} />
        </TabsContent>
      </Tabs>
    </div>
  );
}