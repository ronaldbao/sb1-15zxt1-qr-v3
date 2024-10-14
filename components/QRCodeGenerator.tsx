"use client";

import { useState, useRef, useEffect } from 'react';
import QRCodeStyling from 'qr-code-styling';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface QRCodeGeneratorProps {
  onSave: (qrCodeData: string) => void;
}

const QRCodeGenerator: React.FC<QRCodeGeneratorProps> = ({ onSave }) => {
  const [url, setUrl] = useState('https://example.com');
  const [qrCode, setQrCode] = useState<QRCodeStyling | null>(null);
  const [width, setWidth] = useState(300);
  const [height, setHeight] = useState(300);
  const [margin, setMargin] = useState(10);
  const [dotStyle, setDotStyle] = useState('square');
  const [dotColor, setDotColor] = useState('#000000');
  const [dotGradient, setDotGradient] = useState({ type: 'linear', rotation: 0, colorStops: [{ offset: 0, color: '#000000' }, { offset: 1, color: '#000000' }] });
  const [cornerSquareStyle, setCornerSquareStyle] = useState('square');
  const [cornerSquareColor, setCornerSquareColor] = useState('#000000');
  const [cornerSquareGradient, setCornerSquareGradient] = useState({ type: 'linear', rotation: 0, colorStops: [{ offset: 0, color: '#000000' }, { offset: 1, color: '#000000' }] });
  const [cornerDotStyle, setCornerDotStyle] = useState('square');
  const [cornerDotColor, setCornerDotColor] = useState('#000000');
  const [cornerDotGradient, setCornerDotGradient] = useState({ type: 'linear', rotation: 0, colorStops: [{ offset: 0, color: '#000000' }, { offset: 1, color: '#000000' }] });
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');
  const [logoUrl, setLogoUrl] = useState('');
  const [logoSize, setLogoSize] = useState(0.2);
  const [logoRemoveBg, setLogoRemoveBg] = useState(false);

  const ref = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    updateQRCode();
  }, [url, width, height, margin, dotStyle, dotColor, dotGradient, cornerSquareStyle, cornerSquareColor, cornerSquareGradient, cornerDotStyle, cornerDotColor, cornerDotGradient, backgroundColor, logoUrl, logoSize, logoRemoveBg]);

  const updateQRCode = () => {
    const options = {
      width,
      height,
      type: 'svg' as const,
      data: url,
      margin,
      qrOptions: { typeNumber: 0, mode: 'Byte', errorCorrectionLevel: 'Q' },
      dotsOptions: { 
        type: dotStyle as any, 
        color: dotColor,
        gradient: dotGradient
      },
      cornersSquareOptions: { 
        type: cornerSquareStyle as any, 
        color: cornerSquareColor,
        gradient: cornerSquareGradient
      },
      cornersDotOptions: { 
        type: cornerDotStyle as any, 
        color: cornerDotColor,
        gradient: cornerDotGradient
      },
      backgroundOptions: { color: backgroundColor },
      imageOptions: { 
        hideBackgroundDots: true,
        imageSize: logoSize,
        crossOrigin: 'anonymous',
        margin: 0
      },
      image: logoUrl
    };

    const newQRCode = new QRCodeStyling(options);
    setQrCode(newQRCode);

    if (ref.current) {
      ref.current.innerHTML = '';
      newQRCode.append(ref.current);
    }
  };

  const handleDownload = () => {
    if (qrCode) {
      qrCode.download({ name: 'qr-code', extension: 'png' });
    }
  };

  const handleSave = () => {
    onSave(url);
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const ColorGradientInput = ({ color, setColor, gradient, setGradient, label }) => (
    <div>
      <Label>{label}</Label>
      <Tabs defaultValue="color">
        <TabsList>
          <TabsTrigger value="color">Color</TabsTrigger>
          <TabsTrigger value="gradient">Gradient</TabsTrigger>
        </TabsList>
        <TabsContent value="color">
          <Input type="color" value={color} onChange={(e) => setColor(e.target.value)} />
        </TabsContent>
        <TabsContent value="gradient">
          <div className="space-y-2">
            <Select value={gradient.type} onValueChange={(value) => setGradient({ ...gradient, type: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="linear">Linear</SelectItem>
                <SelectItem value="radial">Radial</SelectItem>
              </SelectContent>
            </Select>
            <Label>Rotation</Label>
            <Slider min={0} max={360} value={[gradient.rotation]} onValueChange={([value]) => setGradient({ ...gradient, rotation: value })} />
            <div className="flex space-x-2">
              <Input type="color" value={gradient.colorStops[0].color} onChange={(e) => setGradient({ ...gradient, colorStops: [{ ...gradient.colorStops[0], color: e.target.value }, gradient.colorStops[1]] })} />
              <Input type="color" value={gradient.colorStops[1].color} onChange={(e) => setGradient({ ...gradient, colorStops: [gradient.colorStops[0], { ...gradient.colorStops[1], color: e.target.value }] })} />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="url">URL</Label>
        <Input
          id="url"
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter URL"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Width</Label>
          <Slider min={100} max={500} step={10} value={[width]} onValueChange={([value]) => setWidth(value)} />
        </div>
        <div>
          <Label>Height</Label>
          <Slider min={100} max={500} step={10} value={[height]} onValueChange={([value]) => setHeight(value)} />
        </div>
        <div>
          <Label>Margin</Label>
          <Slider min={0} max={50} value={[margin]} onValueChange={([value]) => setMargin(value)} />
        </div>
        <div>
          <Label>Background Color</Label>
          <Input type="color" value={backgroundColor} onChange={(e) => setBackgroundColor(e.target.value)} />
        </div>
      </div>
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Foreground Options</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Dot Style</Label>
            <Select value={dotStyle} onValueChange={setDotStyle}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="square">Square</SelectItem>
                <SelectItem value="dots">Dots</SelectItem>
                <SelectItem value="rounded">Rounded</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <ColorGradientInput
            color={dotColor}
            setColor={setDotColor}
            gradient={dotGradient}
            setGradient={setDotGradient}
            label="Dot Color/Gradient"
          />
          <div>
            <Label>Corner Square Style</Label>
            <Select value={cornerSquareStyle} onValueChange={setCornerSquareStyle}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="square">Square</SelectItem>
                <SelectItem value="dot">Dot</SelectItem>
                <SelectItem value="extra-rounded">Extra Rounded</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <ColorGradientInput
            color={cornerSquareColor}
            setColor={setCornerSquareColor}
            gradient={cornerSquareGradient}
            setGradient={setCornerSquareGradient}
            label="Corner Square Color/Gradient"
          />
          <div>
            <Label>Corner Dot Style</Label>
            <Select value={cornerDotStyle} onValueChange={setCornerDotStyle}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="square">Square</SelectItem>
                <SelectItem value="dot">Dot</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <ColorGradientInput
            color={cornerDotColor}
            setColor={setCornerDotColor}
            gradient={cornerDotGradient}
            setGradient={setCornerDotGradient}
            label="Corner Dot Color/Gradient"
          />
        </div>
      </div>
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Logo Options</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Logo</Label>
            <Input type="file" accept="image/*" onChange={handleLogoUpload} ref={fileInputRef} />
          </div>
          <div>
            <Label>Logo Size</Label>
            <Slider min={0.1} max={0.5} step={0.05} value={[logoSize]} onValueChange={([value]) => setLogoSize(value)} />
          </div>
          <div className="flex items-center space-x-2">
            <Switch id="remove-bg" checked={logoRemoveBg} onCheckedChange={setLogoRemoveBg} />
            <Label htmlFor="remove-bg">Remove Logo Background</Label>
          </div>
        </div>
      </div>
      <div ref={ref} className="flex justify-center"></div>
      <div className="flex justify-center space-x-4">
        <Button onClick={handleDownload}>Download QR Code</Button>
        <Button onClick={handleSave}>Save to Database</Button>
      </div>
    </div>
  );
};

export default QRCodeGenerator;