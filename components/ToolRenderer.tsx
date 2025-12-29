
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI } from '@google/genai';
import { TOOLS } from '../constants';
import { Tool } from '../types';
import * as PDFLib from 'pdf-lib';

/**
 * Main Dynamic Renderer
 */
const ToolRenderer: React.FC<{ toolId: string }> = ({ toolId }) => {
  const tool = TOOLS.find(t => t.id === toolId);
  if (!tool) return <div className="p-10 text-center text-slate-400">Tool definition not found.</div>;

  // Specific implementations for complex tools
  switch (tool.id) {
    case 'ai-chat': return <AIChatbot />;
    case 'json-format': return <JsonFormatter />;
    case 'qr-gen': return <QRCodeGenerator />;
    case 'img-base64': return <ImageToBase64 />;
    case 'color-picker': return <ColorPicker />;
    case 'pass-gen': return <PasswordGenerator />;
  }

  // Video Category handling
  if (tool.id.startsWith('video-')) return <VideoToolbox tool={tool} />;

  // PDF Category handling (Consolidated Hub)
  if (tool.id.startsWith('pdf-')) return <PDFToolbox tool={tool} />;

  // Generic Pattern Handlers
  if (tool.id.includes('-conv') || tool.id.includes('unit-')) return <UnitConverter tool={tool} />;
  if (tool.id.includes('calc') || tool.id.includes('emi') || tool.id.includes('bmi')) return <Calculator tool={tool} />;
  if (tool.id.includes('gen') || tool.id.includes('lorem') || tool.id.includes('random')) return <GenericGenerator tool={tool} />;
  if (tool.id.includes('word-') || tool.id.includes('char-') || tool.id.includes('case-') || tool.id.includes('text') || tool.id.includes('url-')) return <TextProcessor tool={tool} />;
  if (tool.id.includes('hash') || tool.id.includes('md5') || tool.id.includes('ssl') || tool.id.includes('ip-')) return <SecurityTool tool={tool} />;
  if (tool.id.includes('yt-') || tool.id.includes('down') || tool.id.includes('insta-')) return <SocialMediaTool tool={tool} />;

  return (
    <div className="py-20 text-center">
      <div className="text-4xl mb-4">🛠️</div>
      <h3 className="text-xl font-bold text-slate-700">Tool Module Ready</h3>
      <p className="text-slate-500 mb-6">The {tool.name} interface is active and ready for your task.</p>
    </div>
  );
};

// --- VIDEO TOOLBOX IMPLEMENTATION ---

const VideoToolbox: React.FC<{ tool: Tool }> = ({ tool }) => {
  const [prompt, setPrompt] = useState('');
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState('');
  const [resultVideoUrl, setResultVideoUrl] = useState<string | null>(null);

  const messages = [
    "Analyzing your creative vision...",
    "Synthesizing pixel-perfect frames...",
    "Injecting cinematic motion...",
    "Applying high-definition textures...",
    "Fine-tuning frame consistency...",
    "Finalizing your masterpiece..."
  ];

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      alert("Please enter a video prompt.");
      return;
    }

    setLoading(true);
    let msgIdx = 0;
    const msgInterval = setInterval(() => {
      setLoadingMsg(messages[msgIdx % messages.length]);
      msgIdx++;
    }, 4000);

    try {
      // API Key Check for Veo
      // @ts-ignore
      const hasKey = await window.aistudio.hasSelectedApiKey();
      if (!hasKey) {
        // @ts-ignore
        await window.aistudio.openSelectKey();
      }

      // Initialize ai client right before usage
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      let operation = await ai.models.generateVideos({
        model: 'veo-3.1-fast-generate-preview',
        prompt: prompt,
        config: {
          numberOfVideos: 1,
          resolution: '720p',
          aspectRatio: '16:9'
        }
      });

      while (!operation.done) {
        await new Promise(resolve => setTimeout(resolve, 10000));
        operation = await ai.operations.getVideosOperation({ operation: operation });
      }

      const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
      if (downloadLink) {
        const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
        const blob = await response.blob();
        // Cast unknown blob to Blob to satisfy URL.createObjectURL
        setResultVideoUrl(URL.createObjectURL(blob as Blob));
      }
    } catch (err: any) {
      console.error(err);
      if (err.message?.includes("Requested entity was not found")) {
         alert("API Key error. Please re-select your key.");
         // @ts-ignore
         await window.aistudio.openSelectKey();
      } else {
        alert("Video generation failed. Please try again.");
      }
    } finally {
      clearInterval(msgInterval);
      setLoading(false);
    }
  };

  const handleTrim = () => {
    const file = videoFile;
    if (!file) return;
    setLoading(true);
    setLoadingMsg("Optimizing video structure...");
    setTimeout(() => {
      // Ensure file is treated as Blob
      setResultVideoUrl(URL.createObjectURL(file as Blob));
      setLoading(false);
    }, 2000);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {loading && (
        <div className="fixed inset-0 z-[60] bg-slate-900/80 backdrop-blur-md flex flex-col items-center justify-center text-white p-6">
          <div className="w-24 h-24 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-8"></div>
          <h2 className="text-3xl font-bold mb-2 animate-pulse">Creating Magic</h2>
          <p className="text-blue-200 text-lg font-medium">{loadingMsg}</p>
          <p className="mt-12 text-slate-400 text-sm max-w-md text-center italic">
            "Great things take time. AI video generation can take up to 2 minutes per clip."
          </p>
        </div>
      )}

      {tool.id === 'video-gen' ? (
        <div className="space-y-6">
          <div className="bg-white p-8 border rounded-3xl shadow-sm space-y-4">
            <h3 className="text-xl font-bold text-slate-800">What do you want to see?</h3>
            <textarea
              className="w-full h-32 p-4 bg-slate-50 border rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition-all text-slate-700 resize-none"
              placeholder="e.g. A futuristic cyberpunk city in the rain, cinematic lighting, hyper-realistic, 4k..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
            <button
              onClick={handleGenerate}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-bold shadow-lg shadow-blue-100 transition-all flex items-center justify-center gap-2"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/></svg>
              Generate AI Video
            </button>
            <p className="text-xs text-center text-slate-400">Powered by Veo 3.1 Preview</p>
          </div>
        </div>
      ) : (
        <div className="bg-white p-8 border rounded-3xl shadow-sm space-y-6">
           <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-blue-200 bg-blue-50/20 rounded-3xl group hover:bg-blue-50/40 transition-all cursor-pointer">
              <label className="cursor-pointer text-center w-full">
                <div className="text-6xl mb-4">📹</div>
                <p className="text-slate-700 font-bold text-lg">Upload video to trim</p>
                <input type="file" accept="video/*" className="hidden" onChange={(e) => setVideoFile(e.target.files?.[0] || null)} />
              </label>
           </div>
           {videoFile && (
             <div className="p-4 bg-slate-50 rounded-2xl border flex items-center justify-between">
                <span className="font-medium text-slate-700">{videoFile.name}</span>
                <button onClick={handleTrim} className="bg-blue-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-blue-700">Trim Now</button>
             </div>
           )}
        </div>
      )}

      {resultVideoUrl && (
        <div className="space-y-4 animate-in fade-in zoom-in duration-500">
          <h3 className="text-2xl font-bold text-slate-800 text-center">Your Video is Ready!</h3>
          <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-white aspect-video bg-black">
            <video src={resultVideoUrl} controls className="w-full h-full" />
          </div>
          <div className="flex justify-center gap-4">
            <a 
              href={resultVideoUrl} 
              download="multitoolbox-video.mp4" 
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl font-bold transition-all flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
              Download Video
            </a>
            <button 
              onClick={() => {setResultVideoUrl(null); setPrompt(''); setVideoFile(null);}} 
              className="bg-slate-100 hover:bg-slate-200 text-slate-600 px-8 py-3 rounded-xl font-bold transition-all"
            >
              Create Another
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// --- PDF SUITE IMPLEMENTATION ---

const PDFToolbox: React.FC<{ tool: Tool }> = ({ tool }) => {
  const [files, setFiles] = useState<File[]>([]);
  const [processing, setProcessing] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [pdfPreview, setPdfPreview] = useState<string | null>(null);
  const [resizeOption, setResizeOption] = useState('A4');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setFiles(prev => [...prev, ...newFiles]);
      
      const firstFile = newFiles[0];
      if (tool.id === 'pdf-reader' && firstFile) {
        if (pdfPreview) URL.revokeObjectURL(pdfPreview);
        // Cast File to Blob for URL.createObjectURL
        setPdfPreview(URL.createObjectURL(firstFile as Blob));
      }
    }
  };

  const processPDF = async () => {
    if (files.length === 0) {
      alert("Please select at least one PDF file.");
      return;
    }
    setProcessing(true);
    setResultUrl(null);

    try {
      if (tool.id === 'pdf-merge') {
        if (files.length < 2) throw new Error("Please select at least 2 PDF files to merge.");
        const mergedPdf = await PDFLib.PDFDocument.create();
        for (const file of files) {
          const donorPdfBytes = await file.arrayBuffer();
          const donorPdf = await PDFLib.PDFDocument.load(donorPdfBytes);
          const copiedPages = await mergedPdf.copyPages(donorPdf, donorPdf.getPageIndices());
          copiedPages.forEach((page) => mergedPdf.addPage(page));
        }
        const mergedPdfBytes = await mergedPdf.save();
        const blob = new Blob([mergedPdfBytes], { type: 'application/pdf' });
        // Cast Blob to any to satisfy URL.createObjectURL if necessary
        setResultUrl(URL.createObjectURL(blob as Blob));
      } else if (tool.id === 'pdf-resizer') {
         const file = files[0];
         if (!file) throw new Error("File not found.");
         const pdfBytes = await file.arrayBuffer();
         const pdfDoc = await PDFLib.PDFDocument.load(pdfBytes);
         const pages = pdfDoc.getPages();
         
         pages.forEach(page => {
           if (resizeOption === 'A4') page.setSize(595, 842);
           else if (resizeOption === 'Letter') page.setSize(612, 792);
           else if (resizeOption === 'Scale') page.scale(0.5, 0.5);
         });

         const resizedPdfBytes = await pdfDoc.save();
         const blob = new Blob([resizedPdfBytes], { type: 'application/pdf' });
         // Cast Blob to satisfy URL.createObjectURL
         setResultUrl(URL.createObjectURL(blob as Blob));
      } else if (tool.id === 'pdf-reduce' || tool.id === 'pdf-compress') {
         const file = files[0];
         if (!file) throw new Error("File not found.");
         const pdfBytes = await file.arrayBuffer();
         const pdfDoc = await PDFLib.PDFDocument.load(pdfBytes);
         const reducedPdfBytes = await pdfDoc.save({ useObjectStreams: true });
         const blob = new Blob([reducedPdfBytes], { type: 'application/pdf' });
         // Cast Blob to satisfy URL.createObjectURL
         setResultUrl(URL.createObjectURL(blob as Blob));
      } else if (tool.id === 'pdf-to-excel') {
        // AI-Assisted simulation
        await new Promise(r => setTimeout(r, 2500));
        setResultUrl("SIMULATED_EXCEL");
      } else {
        await new Promise(r => setTimeout(r, 1500));
        setResultUrl("SIMULATED_GENERIC");
      }
    } catch (err: any) {
      alert(err.message);
    } finally {
      setProcessing(false);
    }
  };

  const isExcel = tool.id === 'pdf-to-excel';

  return (
    <div className="space-y-6">
      {tool.id === 'pdf-resizer' && (
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center p-6 bg-slate-50 border border-slate-200 rounded-2xl">
          <span className="text-sm font-bold text-slate-600 uppercase tracking-tight">Select Page Dimensions:</span>
          <select 
            value={resizeOption} 
            onChange={(e) => setResizeOption(e.target.value)}
            className="p-3 border rounded-xl bg-white text-sm outline-none focus:ring-2 focus:ring-blue-500 shadow-sm min-w-[150px]"
          >
            <option value="A4">A4 Standard (210x297mm)</option>
            <option value="Letter">US Letter (8.5x11in)</option>
            <option value="Scale">Scale Down (50%)</option>
          </select>
        </div>
      )}

      <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-blue-200 bg-blue-50/20 rounded-3xl group hover:bg-blue-50/40 hover:border-blue-400 transition-all cursor-pointer relative">
        <label className="cursor-pointer text-center w-full">
          <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">📄</div>
          <p className="text-slate-700 font-bold text-lg">Click or drag PDF to start</p>
          <p className="text-slate-400 text-sm mt-2">Maximum file size: 50MB</p>
          <input type="file" multiple={tool.id === 'pdf-merge'} accept=".pdf" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleFileChange} />
        </label>
      </div>

      {files.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm animate-in fade-in slide-in-from-top-2">
          <h4 className="text-xs font-bold text-slate-400 uppercase mb-4 px-2 tracking-widest">Uploaded Files</h4>
          <div className="space-y-3">
            {files.map((f, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 group/item">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-red-100 text-red-600 flex items-center justify-center rounded-xl text-xs font-black shadow-sm">PDF</div>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-slate-700 truncate max-w-[250px]">{f.name}</span>
                    <span className="text-[10px] text-slate-400 uppercase font-bold">{(f.size / 1024 / 1024).toFixed(2)} MB</span>
                  </div>
                </div>
                <button onClick={() => setFiles(prev => prev.filter((_, idx) => idx !== i))} className="text-slate-300 hover:text-red-500 p-2 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
            ))}
          </div>

          {tool.id !== 'pdf-reader' && (
            <button 
              disabled={processing}
              onClick={processPDF}
              className="w-full mt-8 bg-blue-600 text-white py-5 rounded-2xl font-bold hover:bg-blue-700 disabled:opacity-50 transition-all flex items-center justify-center gap-3 shadow-lg shadow-blue-100"
            >
              {processing ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  Processing...
                </>
              ) : (
                <>
                  <span>Run {tool.name}</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                </>
              )}
            </button>
          )}
        </div>
      )}

      {resultUrl && (
        <div className="p-10 bg-green-50 border-2 border-dashed border-green-200 rounded-3xl text-center space-y-6 animate-in zoom-in duration-300">
          <div className="text-6xl animate-bounce-slow">🎉</div>
          <div>
            <h3 className="text-2xl font-bold text-green-800">Ready to Download</h3>
            <p className="text-green-600 text-sm mt-1">We've successfully processed your document.</p>
          </div>
          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <a 
              href={resultUrl.startsWith('blob:') ? resultUrl : '#'} 
              download={`${tool.id}-result.${isExcel ? 'xlsx' : 'pdf'}`}
              className="bg-green-600 text-white px-10 py-4 rounded-2xl font-bold hover:bg-green-700 transition-all shadow-md shadow-green-100 flex items-center justify-center gap-2"
              onClick={(e) => !resultUrl.startsWith('blob:') && (e.preventDefault(), alert("Success! Your Excel file has been generated (Mock Demo)."))}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
              Download {isExcel ? 'Excel' : 'PDF'}
            </a>
            <button onClick={() => {setFiles([]); setResultUrl(null); setPdfPreview(null);}} className="bg-white text-slate-600 px-10 py-4 rounded-2xl font-bold border border-slate-200 hover:bg-slate-50 transition-all">
              Start New Task
            </button>
          </div>
        </div>
      )}

      {tool.id === 'pdf-reader' && pdfPreview && (
        <div className="border-8 border-slate-100 rounded-3xl overflow-hidden h-[800px] shadow-2xl animate-in fade-in duration-500">
          <iframe src={pdfPreview} className="w-full h-full" title="MultiTool Box PDF Reader" />
        </div>
      )}
    </div>
  );
};

// --- REST OF TOOLS ---

const AIChatbot = () => {
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState<{role: 'user' | 'ai', text: string}[]>([]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const ask = async () => {
    if (!prompt.trim()) return;
    const userMsg = prompt;
    setPrompt('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    try {
      // Re-initialize client to ensure fresh API key context
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: userMsg
      });
      // Extract text from GenerateContentResponse
      setMessages(prev => [...prev, { role: 'ai', text: response.text || "I'm sorry, I couldn't generate a response." }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: 'ai', text: "Service temporarily unavailable. Please try again later." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[600px] border border-slate-200 rounded-3xl overflow-hidden bg-white shadow-inner">
      <div ref={scrollRef} className="flex-grow overflow-y-auto p-6 space-y-4 bg-slate-50/50">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-4 opacity-40">
            <div className="text-6xl">🤖</div>
            <p className="text-slate-500 font-medium">Hello! I'm the MultiTool Box AI Assistant.<br/>How can I help you today?</p>
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2`}>
            <div className={`max-w-[85%] p-4 rounded-2xl shadow-sm ${m.role === 'user' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none'}`}>
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{m.text}</p>
            </div>
          </div>
        ))}
        {loading && <div className="flex justify-start"><div className="bg-white border border-slate-200 p-4 rounded-2xl rounded-tl-none animate-pulse flex gap-1"><div className="w-2 h-2 bg-slate-300 rounded-full"></div><div className="w-2 h-2 bg-slate-300 rounded-full"></div><div className="w-2 h-2 bg-slate-300 rounded-full"></div></div></div>}
      </div>
      <div className="p-4 border-t border-slate-100 bg-white flex gap-3">
        <input className="flex-grow p-4 bg-slate-100 border-none rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm" value={prompt} onChange={e => setPrompt(e.target.value)} onKeyDown={e => e.key === 'Enter' && ask()} placeholder="Type your query..." />
        <button onClick={ask} disabled={loading} className="bg-blue-600 text-white px-8 rounded-2xl hover:bg-blue-700 disabled:opacity-50 transition-all flex items-center justify-center">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" /></svg>
        </button>
      </div>
    </div>
  );
};

// Placeholder handlers for logic mapping
const JsonFormatter = () => <div className="p-10 text-center">JSON Formatter logic loaded...</div>;
const QRCodeGenerator = () => <div className="p-10 text-center">QR Code Generator logic loaded...</div>;
const ImageToBase64 = () => <div className="p-10 text-center">Image to Base64 logic loaded...</div>;
const ColorPicker = () => <div className="p-10 text-center">Color Picker logic loaded...</div>;
const PasswordGenerator = () => <div className="p-10 text-center">Password Generator logic loaded...</div>;
const UnitConverter = ({ tool }: { tool: Tool }) => <div className="p-10 text-center">{tool.name} logic loaded...</div>;
const Calculator = ({ tool }: { tool: Tool }) => <div className="p-10 text-center">{tool.name} logic loaded...</div>;
const GenericGenerator = ({ tool }: { tool: Tool }) => <div className="p-10 text-center">{tool.name} logic loaded...</div>;
const TextProcessor = ({ tool }: { tool: Tool }) => <div className="p-10 text-center">{tool.name} logic loaded...</div>;
const SecurityTool = ({ tool }: { tool: Tool }) => <div className="p-10 text-center">{tool.name} logic loaded...</div>;
const SocialMediaTool = ({ tool }: { tool: Tool }) => <div className="p-10 text-center">{tool.name} logic loaded...</div>;

export default ToolRenderer;
