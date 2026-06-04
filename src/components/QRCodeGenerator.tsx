import React, { useEffect, useRef, useState } from 'react';
import QRCodeStyling, {
  DrawType,
  TypeNumber,
  Mode,
  ErrorCorrectionLevel,
  DotType,
  CornerSquareType,
  CornerDotType
} from 'qr-code-styling';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download, Image as ImageIcon, Link as LinkIcon, Palette, Settings, Trash2, Sparkles, Twitter, Github, Globe } from 'lucide-react';
import confetti from 'canvas-confetti';

const QR_FORMATS = ['png', 'svg', 'webp', 'jpeg'];

export default function QRCodeGenerator() {
  const [url, setUrl] = useState('https://google.com');
  const [dotsColor, setDotsColor] = useState('#1A1A1A');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [isTransparent, setIsTransparent] = useState(false);
  const [dotsType, setDotsType] = useState<DotType>('rounded');
  const [cornersType, setCornersType] = useState<CornerSquareType>('extra-rounded');
  const [cornersDotType, setCornersDotType] = useState<CornerDotType>('dot');
  const [logo, setLogo] = useState<string | null>(null);
  const [logoSize, setLogoSize] = useState(0.4);
  const [logoMargin, setLogoMargin] = useState(10);
  const [qrSize, setQrSize] = useState(320);
  const [errorCorrection, setErrorCorrection] = useState<ErrorCorrectionLevel>('H');
  
  const qrRef = useRef<HTMLDivElement>(null);
  const qrCode = useRef<QRCodeStyling | null>(null);

  useEffect(() => {
    qrCode.current = new QRCodeStyling({
      width: qrSize,
      height: qrSize,
      type: 'svg' as DrawType,
      data: url,
      image: logo || undefined,
      dotsOptions: {
        color: dotsColor,
        type: dotsType
      },
      backgroundOptions: {
        color: isTransparent ? 'transparent' : bgColor,
      },
      imageOptions: {
        crossOrigin: 'anonymous',
        margin: logoMargin,
        imageSize: logoSize
      },
      cornersSquareOptions: {
        color: dotsColor,
        type: cornersType
      },
      cornersDotOptions: {
        color: dotsColor,
        type: cornersDotType
      },
      qrOptions: {
        typeNumber: 0 as TypeNumber,
        mode: 'Byte' as Mode,
        errorCorrectionLevel: errorCorrection
      }
    });

    if (qrRef.current) {
      qrRef.current.innerHTML = '';
      qrCode.current.append(qrRef.current);
    }
  }, []);

  useEffect(() => {
    if (qrCode.current) {
      qrCode.current.update({
        data: url,
        image: logo || undefined,
        width: qrSize,
        height: qrSize,
        dotsOptions: {
          color: dotsColor,
          type: dotsType
        },
        backgroundOptions: {
          color: isTransparent ? 'transparent' : bgColor,
        },
        imageOptions: {
          margin: logoMargin,
          imageSize: logoSize
        },
        cornersSquareOptions: {
          color: dotsColor,
          type: cornersType
        },
        cornersDotOptions: {
          color: dotsColor,
          type: cornersDotType
        },
        qrOptions: {
          errorCorrectionLevel: errorCorrection
        }
      });
    }
  }, [url, dotsColor, bgColor, isTransparent, dotsType, cornersType, cornersDotType, logo, logoSize, logoMargin, qrSize, errorCorrection]);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setLogo(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const downloadQR = (extension: string) => {
    if (qrCode.current) {
      qrCode.current.download({
        name: 'qr-code',
        extension: extension as any
      });
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-full w-full">
      {/* Panel de configuracion */}
      <aside className="lg:w-[360px] border-r border-border p-8 flex flex-col gap-8 bg-white overflow-y-auto">
        <div className="logo-area">
          <div className="text-[14px] font-[800] tracking-[2px] uppercase border-b-2 border-primary pb-2 w-fit">
            QR Studio
          </div>
        </div>

        <div className="space-y-6">
          <Tabs defaultValue="content" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6 bg-zinc-100 p-1 rounded-md">
              <TabsTrigger value="content" className="text-[10px] uppercase font-bold tracking-wider">Contenido</TabsTrigger>
              <TabsTrigger value="design" className="text-[10px] uppercase font-bold tracking-wider">Diseño</TabsTrigger>
              <TabsTrigger value="logo" className="text-[10px] uppercase font-bold tracking-wider">Logo</TabsTrigger>
            </TabsList>

            <TabsContent value="content" className="space-y-6">
              <div className="space-y-2">
                <Label className="text-[11px] uppercase font-bold text-muted-foreground tracking-wider">URL de destino</Label>
                <Input
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="bg-[#FAFAFA] border-border h-11 text-sm rounded-sm focus:ring-1 focus:ring-primary"
                  placeholder="https://tu-marca.com"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[11px] uppercase font-bold text-muted-foreground tracking-wider">Corrección de Errores</Label>
                <Select value={errorCorrection} onValueChange={(v) => setErrorCorrection(v as ErrorCorrectionLevel)}>
                  <SelectTrigger className="bg-[#FAFAFA] border-border h-11 text-sm rounded-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="L">Bajo (7%)</SelectItem>
                    <SelectItem value="M">Medio (15%)</SelectItem>
                    <SelectItem value="Q">Cuartil (25%)</SelectItem>
                    <SelectItem value="H">Alto (30%) - Recomendado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </TabsContent>

            <TabsContent value="design" className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[11px] uppercase font-bold text-muted-foreground tracking-wider">Puntos</Label>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      value={dotsColor}
                      onChange={(e) => setDotsColor(e.target.value)}
                      className="w-10 h-10 p-1 cursor-pointer border-border rounded-full"
                    />
                    <Input
                      type="text"
                      value={dotsColor}
                      onChange={(e) => setDotsColor(e.target.value)}
                      className="flex-1 h-10 text-[10px] font-mono uppercase bg-[#FAFAFA]"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-[11px] uppercase font-bold text-muted-foreground tracking-wider">Fondo</Label>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      value={bgColor}
                      onChange={(e) => {
                        setBgColor(e.target.value);
                        setIsTransparent(false);
                      }}
                      disabled={isTransparent}
                      className="w-10 h-10 p-1 cursor-pointer border-border rounded-full disabled:opacity-30"
                    />
                    <Button 
                      variant={isTransparent ? "default" : "outline"} 
                      size="sm"
                      onClick={() => setIsTransparent(!isTransparent)}
                      className="h-10 text-[9px] uppercase font-bold px-2"
                    >
                      {isTransparent ? "Opaco" : "Transp."}
                    </Button>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-[11px] uppercase font-bold text-muted-foreground tracking-wider">Estilo de Puntos</Label>
                  <Select value={dotsType} onValueChange={(v) => setDotsType(v as DotType)}>
                    <SelectTrigger className="bg-[#FAFAFA] border-border h-10 text-xs rounded-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="square">Cuadrado</SelectItem>
                      <SelectItem value="dots">Puntos</SelectItem>
                      <SelectItem value="rounded">Redondeado</SelectItem>
                      <SelectItem value="extra-rounded">Extra Redondeado</SelectItem>
                      <SelectItem value="classy">Elegante</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-[11px] uppercase font-bold text-muted-foreground tracking-wider">Esquinas</Label>
                  <Select value={cornersType} onValueChange={(v) => setCornersType(v as CornerSquareType)}>
                    <SelectTrigger className="bg-[#FAFAFA] border-border h-10 text-xs rounded-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="square">Cuadrado</SelectItem>
                      <SelectItem value="dot">Punto</SelectItem>
                      <SelectItem value="rounded">Redondeado</SelectItem>
                      <SelectItem value="extra-rounded">Extra Redondeado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="logo" className="space-y-6">
              <div className="space-y-4">
                <Label htmlFor="logo-upload" className="cursor-pointer block">
                  <div className="border-2 border-dashed border-border rounded-lg p-6 text-center bg-[#FAFAFA] hover:border-primary transition-colors">
                    <ImageIcon className="w-6 h-6 mx-auto mb-2 text-muted-foreground" />
                    <span className="text-[11px] font-bold uppercase tracking-wider">Subir Logotipo</span>
                    <p className="text-[10px] text-muted-foreground mt-2 italic">SVG o PNG recomendado</p>
                  </div>
                  <Input id="logo-upload" type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
                </Label>

                {logo && (
                  <div className="space-y-4 p-4 border border-border rounded-md bg-[#FAFAFA]">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[10px] font-bold uppercase text-muted-foreground">Ajustes de Logo</span>
                      <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive" onClick={() => setLogo(null)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-[10px] font-mono">
                          <span>Tamaño</span>
                          <span>{(logoSize * 100).toFixed(0)}%</span>
                        </div>
                        <Slider value={[logoSize]} min={0.1} max={0.5} step={0.05} onValueChange={(v) => setLogoSize(Array.isArray(v) ? v[0] : v)} />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-[10px] font-mono">
                          <span>Margen</span>
                          <span>{logoMargin}px</span>
                        </div>
                        <Slider value={[logoMargin]} min={0} max={50} step={1} onValueChange={(v) => setLogoMargin(Array.isArray(v) ? v[0] : v)} />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <div className="mt-auto pt-8 border-t border-border">
          <div className="flex items-center gap-4 text-muted-foreground">
            <a href="#" className="hover:text-primary transition-colors"><Twitter className="w-4 h-4" /></a>
            <a href="#" className="hover:text-primary transition-colors"><Github className="w-4 h-4" /></a>
            <a href="#" className="hover:text-primary transition-colors"><Globe className="w-4 h-4" /></a>
          </div>
          <p className="text-[10px] text-muted-foreground mt-4 font-medium uppercase tracking-widest">
            © 2026 QR Brand Studio - Jonathan David Mata / C0d3k
          </p>
        </div>
      </aside>

      {/* Vista previa del codigo */}
      <main className="flex-1 bg-[#FDFDFD] relative flex flex-col items-center justify-center p-8">
        <div className="absolute top-10 right-10 hidden lg:flex items-center gap-3 text-[11px] text-muted-foreground font-bold uppercase tracking-wider">
          <div className="w-2 h-2 bg-[#10B981] rounded-full animate-pulse" />
          Vista previa en tiempo real
          <span className="bg-[#E8F0FE] text-[#3E5BFF] px-2 py-1 rounded-sm text-[9px] font-black ml-2">VECTOR READY</span>
        </div>

        <div className="relative group">
          <div className="absolute -inset-8 bg-black/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          <div className="relative bg-white p-6 border border-border shadow-[0_10px_30px_rgba(0,0,0,0.03)]">
            <div ref={qrRef} className="transition-transform duration-500 ease-out transform group-hover:scale-[1.01]" />
          </div>
        </div>

        <div className="mt-16 flex flex-wrap justify-center gap-3">
          {QR_FORMATS.map((format) => (
            <Button
              key={format}
              onClick={() => downloadQR(format)}
              variant={format === 'png' ? 'default' : 'outline'}
              className={`h-10 px-6 text-[11px] font-bold uppercase tracking-widest rounded-none border-primary transition-all duration-200 ${
                format === 'png' ? 'bg-primary text-white hover:bg-primary/90' : 'bg-transparent text-primary hover:bg-primary hover:text-white'
              }`}
            >
              <Download className="w-3 h-3 mr-2" />
              {format}
            </Button>
          ))}
        </div>
        
        <p className="mt-6 text-[10px] text-muted-foreground font-medium uppercase tracking-widest italic">
          Resolución optimizada para impresión profesional
        </p>
      </main>
    </div>
  );
}
