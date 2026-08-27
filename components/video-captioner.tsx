'use client'

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Upload, Play, Pause, FastForward, Rewind, Settings, Type, Palette, Layout, Download, Check, Move, List, Wand2, Loader2, Crosshair } from 'lucide-react';

const CAPTION_STYLES = [
  { id: 'style-1', name: 'Classic Pop', className: 'text-3xl font-bold text-white drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)] stroke-black stroke-2', highlightClass: 'text-yellow-400 scale-110 drop-shadow-[0_0_10px_rgba(250,204,21,0.8)]' },
  { id: 'style-2', name: 'Neon Glow', className: 'text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500', highlightClass: 'from-pink-500 to-purple-600 drop-shadow-[0_0_15px_rgba(236,72,153,0.8)] scale-125' },
  { id: 'style-3', name: 'Vintage Typewriter', className: 'text-2xl font-mono text-gray-200 bg-black/60 px-2 py-1 rounded', highlightClass: 'text-white bg-red-600/80 font-bold' },
  { id: 'style-4', name: 'Subtitle Minimalist', className: 'text-2xl font-sans text-white/90 drop-shadow-md', highlightClass: 'text-white font-semibold' },
  { id: 'style-5', name: 'Comic Book', className: 'text-4xl font-extrabold uppercase text-white tracking-wider', style: { WebkitTextStroke: '2px black' }, highlightClass: 'text-red-500 rotate-[-2deg] scale-110' },
  { id: 'style-6', name: 'Cinematic Gold', className: 'text-3xl font-serif text-yellow-100 drop-shadow-lg', highlightClass: 'text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]' },
  { id: 'style-7', name: 'Cyberpunk', className: 'text-3xl font-mono text-green-400 bg-black/80 px-2 border border-green-500/50', highlightClass: 'text-black bg-green-400 font-bold shadow-[0_0_10px_rgba(74,222,128,0.8)]' },
  { id: 'style-8', name: 'Soft Pastel', className: 'text-4xl font-medium text-pink-200 drop-shadow-md', highlightClass: 'text-pink-400 scale-105' },
  { id: 'style-9', name: 'Bold Impact', className: 'text-5xl font-black text-white uppercase tracking-tighter', style: { WebkitTextStroke: '1.5px black' }, highlightClass: 'text-orange-500' },
  { id: 'style-10', name: 'Elegant Script', className: 'text-4xl italic font-serif text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]', highlightClass: 'text-blue-300' },
  { id: 'style-11', name: 'Retro 8-Bit', className: 'text-xl font-mono text-white bg-blue-900/80 px-2 py-1 border-2 border-white', highlightClass: 'text-yellow-300' },
  { id: 'style-12', name: 'News Ticker', className: 'text-2xl font-sans font-bold text-black bg-yellow-400/90 px-3 py-1', highlightClass: 'bg-white text-black' },
  { id: 'style-13', name: 'Vlog Bubble', className: 'text-2xl font-sans text-gray-800 bg-white/90 px-4 py-2 rounded-full shadow-lg', highlightClass: 'text-blue-600 font-bold' },
  { id: 'style-14', name: 'Horror Blood', className: 'text-4xl font-serif font-bold text-red-700 drop-shadow-[0_4px_8px_rgba(0,0,0,1)]', highlightClass: 'text-red-500 drop-shadow-[0_0_10px_rgba(220,38,38,0.8)]' },
  { id: 'style-15', name: 'Sci-Fi HUD', className: 'text-2xl font-mono text-cyan-300 tracking-widest uppercase', highlightClass: 'text-white bg-cyan-900/50 border-b-2 border-cyan-300' },
  { id: 'style-16', name: 'Karaoke Classic', className: 'text-3xl font-bold text-blue-200 drop-shadow-md', highlightClass: 'text-blue-500 drop-shadow-[0_0_5px_rgba(59,130,246,0.8)]' },
  { id: 'style-17', name: 'Outline Only', className: 'text-5xl font-black text-transparent', style: { WebkitTextStroke: '2px white' }, highlightClass: 'text-white' },
  { id: 'style-18', name: 'Blurred Edge', className: 'text-4xl font-bold text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]', highlightClass: 'text-black bg-white/80 rounded px-1' },
  { id: 'style-19', name: 'Gradient Sunset', className: 'text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-orange-400 to-purple-600', highlightClass: 'from-yellow-300 to-red-500 drop-shadow-lg scale-110' },
  { id: 'style-20', name: 'Minimal Box', className: 'text-2xl font-sans text-white border-2 border-white px-3 py-1 bg-black/30', highlightClass: 'bg-white text-black' },
  { id: 'style-21', name: 'Shadow Drop', className: 'text-4xl font-bold text-white drop-shadow-[5px_5px_0_rgba(0,0,0,1)]', highlightClass: 'text-yellow-400 drop-shadow-[5px_5px_0_rgba(220,38,38,1)]' },
  { id: 'style-22', name: 'Typewriter Green', className: 'text-2xl font-mono text-green-500', highlightClass: 'bg-green-500 text-black' },
  { id: 'style-23', name: 'Floating Clouds', className: 'text-3xl font-sans font-medium text-white/80 drop-shadow-[0_10px_10px_rgba(255,255,255,0.2)]', highlightClass: 'text-white drop-shadow-[0_5px_15px_rgba(255,255,255,0.8)] -translate-y-1' },
  { id: 'style-24', name: 'Blocky Tech', className: 'text-3xl font-black uppercase text-gray-300 bg-gray-900 px-2 border-l-4 border-blue-500', highlightClass: 'text-white bg-blue-600 border-blue-300' },
  { id: 'style-25', name: 'Romantic Italic', className: 'text-4xl italic font-serif text-pink-100 drop-shadow-sm', highlightClass: 'text-pink-400 drop-shadow-[0_0_5px_rgba(244,114,182,0.5)]' },
  { id: 'style-26', name: 'Glitch Effect', className: 'text-4xl font-bold text-white drop-shadow-[-2px_0_red,2px_0_cyan]', highlightClass: 'text-white drop-shadow-[-4px_0_red,4px_0_cyan] scale-105' },
  { id: 'style-27', name: 'Sporty Action', className: 'text-4xl font-black italic text-white uppercase', style: { WebkitTextStroke: '1px black', textShadow: '2px 2px 0px #3b82f6' }, highlightClass: 'text-yellow-400' },
  { id: 'style-28', name: 'Simple Lower Third', className: 'text-2xl font-sans text-white w-full bg-gradient-to-t from-black/80 to-transparent p-4 pb-8', highlightClass: 'text-yellow-400 font-bold' },
  { id: 'style-29', name: 'Chalkboard', className: 'text-3xl font-mono text-gray-200 opacity-90', style: { textShadow: '0 0 2px #fff' }, highlightClass: 'text-white font-bold opacity-100' },
  { id: 'style-30', name: 'Ultra Bold 3D', className: 'text-5xl font-black text-white', style: { textShadow: '0 1px 0 #ccc, 0 2px 0 #c9c9c9, 0 3px 0 #bbb, 0 4px 0 #b9b9b9, 0 5px 0 #aaa, 0 6px 1px rgba(0,0,0,.1), 0 0 5px rgba(0,0,0,.1), 0 1px 3px rgba(0,0,0,.3), 0 3px 5px rgba(0,0,0,.2), 0 5px 10px rgba(0,0,0,.25), 0 10px 10px rgba(0,0,0,.2), 0 20px 20px rgba(0,0,0,.15)' }, highlightClass: 'text-yellow-400' },
];

// Sample transcript data with timings
const SAMPLE_TRANSCRIPT = [
  { start: 0.5, end: 1.5, word: "Welcome" },
  { start: 1.6, end: 2.0, word: "to" },
  { start: 2.1, end: 2.5, word: "our" },
  { start: 2.6, end: 3.5, word: "amazing" },
  { start: 3.6, end: 4.5, word: "platform!" },
  { start: 5.0, end: 5.5, word: "Here" },
  { start: 5.6, end: 6.0, word: "you" },
  { start: 6.1, end: 6.5, word: "can" },
  { start: 6.6, end: 7.2, word: "easily" },
  { start: 7.3, end: 8.0, word: "add" },
  { start: 8.1, end: 9.0, word: "beautiful" },
  { start: 9.1, end: 10.0, word: "captions." },
  { start: 10.5, end: 11.0, word: "Choose" },
  { start: 11.1, end: 11.5, word: "from" },
  { start: 11.6, end: 12.0, word: "30" },
  { start: 12.1, end: 13.0, word: "different" },
  { start: 13.1, end: 14.0, word: "styles" },
  { start: 14.5, end: 15.0, word: "and" },
  { start: 15.1, end: 16.0, word: "make" },
  { start: 16.1, end: 16.5, word: "it" },
  { start: 16.6, end: 17.5, word: "pop!" },
];

const generateFullTranscript = (duration) => {
  if (!duration || duration <= 0) return SAMPLE_TRANSCRIPT;
  const originalDuration = 17.5;
  let newTranscript = [];
  let loops = Math.ceil(duration / originalDuration);
  
  for(let i = 0; i < loops; i++) {
    SAMPLE_TRANSCRIPT.forEach(item => {
      let offset = i * originalDuration;
      if (item.start + offset <= duration) {
        newTranscript.push({
          start: item.start + offset,
          end: item.end + offset,
          word: item.word
        });
      }
    });
  }
  return newTranscript;
};

// Helper to group words into sentences/phrases for display
const groupTranscriptIntoPhrases = (transcript) => {
  const phrases = [];
  let currentPhrase = [];
  let phraseStartTime = 0;
  
  // Simple heuristic: break phrase if gap between words is > 0.5s or if phrase gets too long (e.g., > 6 words)
  transcript.forEach((item, index) => {
    if (currentPhrase.length === 0) {
      phraseStartTime = item.start;
    }
    
    currentPhrase.push(item);
    
    const nextItem = transcript[index + 1];
    const isLongGap = nextItem && (nextItem.start - item.end > 0.6);
    const isLongPhrase = currentPhrase.length >= 6;
    const isLastItem = !nextItem;
    
    if (isLongGap || isLongPhrase || isLastItem) {
      phrases.push({
        id: `phrase-${phrases.length}`,
        words: [...currentPhrase],
        start: phraseStartTime,
        end: item.end + (isLastItem ? 1 : 0.5), // Linger slightly after last word
      });
      currentPhrase = [];
    }
  });
  
  return phrases;
};

export default function VideoCaptioner() {
  const [videoFile, setVideoFile] = useState(null);
  const [videoUrl, setVideoUrl] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [selectedStyle, setSelectedStyle] = useState(CAPTION_STYLES[0]);
  const [transcript, setTranscript] = useState(SAMPLE_TRANSCRIPT);
  const [phrases, setPhrases] = useState([]);
  const [activePhrase, setActivePhrase] = useState(null);
  const [activeWordIndex, setActiveWordIndex] = useState(-1);
  const [captionPosition, setCaptionPosition] = useState({ x: 50, y: 85 });
  const [isDragging, setIsDragging] = useState(false);
  const [videoSize, setVideoSize] = useState({ width: 16, height: 9 });
  const [activeTab, setActiveTab] = useState('styles');
  const [captionSize, setCaptionSize] = useState(100);
  const [captionColors, setCaptionColors] = useState({ background: '#111827', text: '#ffffff', highlight: '#facc15' });
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcriptionMessage, setTranscriptionMessage] = useState('');
  
  const videoRef = useRef(null);
  const videoContainerRef = useRef(null);

  const handleTranscriptChange = (index, field, value) => {
    const newTranscript = [...transcript];
    if (field === 'word') {
        newTranscript[index].word = value;
    } else {
        newTranscript[index][field] = parseFloat(value) || 0;
    }
    setTranscript(newTranscript);
  };

  const syncWordToPlayhead = (index) => {
    const next = transcript.map((item, i) => i === index ? { ...item, start: Math.max(0, currentTime - 0.15), end: Math.max(currentTime, currentTime + 0.45) } : item);
    setTranscript(next.map((item, i) => i > 0 ? { ...item, start: Math.max(item.start, next[i - 1].end + 0.01), end: Math.max(item.end, item.start + 0.05) } : item));
  };

  const transcribeVideo = async () => {
    if (!videoFile || !videoFile.type?.startsWith('video/')) {
      setTranscriptionMessage('Upload an MP4 first to transcribe its voiceover.');
      return;
    }
    setIsTranscribing(true); setTranscriptionMessage('Extracting audio and matching words…');
    try {
      const formData = new FormData(); formData.append('file', videoFile);
      const response = await fetch('/api/transcribe', { method: 'POST', body: formData });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Transcription failed');
      if (!result.words?.length) throw new Error('No speech was detected. Use the manual timing editor below.');
      setTranscript(result.words); setTranscriptionMessage(`Matched ${result.words.length} words to the voiceover.`);
    } catch (error) { setTranscriptionMessage(error instanceof Error ? error.message : 'Transcription failed.'); }
    finally { setIsTranscribing(false); }
  };

  // Process transcript into phrases on load
  useEffect(() => {
    setPhrases(groupTranscriptIntoPhrases(transcript));
  }, [transcript]);

  // Handle time updates to sync captions
  useEffect(() => {
    if (!videoRef.current || phrases.length === 0) return;

    const handleTimeUpdate = () => {
      const time = videoRef.current.currentTime;
      setCurrentTime(time);

      // Find active phrase
      let current = phrases.find(p => time >= p.start && time <= p.end);
      
      if (!current) {
          // Find upcoming phrase
          current = phrases.find(p => p.start > time);
      }
      if (!current) {
          // Fallback to last phrase
          current = phrases[phrases.length - 1];
      }
      
      if (current) {
        if (!activePhrase || activePhrase.id !== current.id) {
          setActivePhrase(current);
        }
        
        // Find active word within the phrase
        let wordIdx = current.words.findIndex(w => time >= w.start && time <= (w.end + 0.1)); // tiny buffer
        
        if (wordIdx === -1) {
            if (time < current.words[0].start) {
                wordIdx = -1;
            } else {
                // Keep last spoken word highlighted if we are between words
                const pastWords = current.words.filter(w => time > w.end);
                if (pastWords.length > 0) {
                    wordIdx = current.words.indexOf(pastWords[pastWords.length - 1]);
                }
            }
        }

        // Only update if changed to avoid unnecessary re-renders
        if (wordIdx !== activeWordIndex) {
            setActiveWordIndex(wordIdx);
        }
      }
    };

    const videoEl = videoRef.current;
    videoEl.addEventListener('timeupdate', handleTimeUpdate);
    
    return () => {
      videoEl.removeEventListener('timeupdate', handleTimeUpdate);
    };
  }, [phrases, activePhrase, activeWordIndex]);

  // Clean up object URL
  useEffect(() => {
    return () => {
      if (videoUrl && !videoUrl.startsWith('http')) {
        URL.revokeObjectURL(videoUrl);
      }
    };
  }, [videoUrl]);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    // Clear the native input so selecting the same file again still triggers onChange.
    e.target.value = '';
    setErrorMessage('');
    if (file && file.type === 'video/mp4') {
      setVideoFile(file);
      const url = URL.createObjectURL(file);
      setVideoUrl(url);
      setIsPlaying(false);
      setCurrentTime(0);
      setActivePhrase(null);
      setActiveWordIndex(-1);
    } else if (file) {
      setErrorMessage("Please upload a valid MP4 file.");
    }
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      const { duration, videoWidth, videoHeight } = videoRef.current;
      setDuration(duration);
      if (videoWidth && videoHeight) {
          setVideoSize({ width: videoWidth, height: videoHeight });
      }
      // Generate transcript that spans the entire video duration
      setTranscript(generateFullTranscript(duration));
    }
  };

  const handlePointerDown = (e) => {
    setIsDragging(true);
    e.target.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e) => {
    if (!isDragging || !videoContainerRef.current) return;
    const rect = videoContainerRef.current.getBoundingClientRect();
    let x = ((e.clientX - rect.left) / rect.width) * 100;
    let y = ((e.clientY - rect.top) / rect.height) * 100;
    
    // Keep within bounds
    x = Math.max(5, Math.min(95, x));
    y = Math.max(5, Math.min(95, y));
    
    setCaptionPosition({ x, y });
  };

  const handlePointerUp = (e) => {
    setIsDragging(false);
    e.target.releasePointerCapture(e.pointerId);
  };

  const seek = (amount) => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.max(0, Math.min(videoRef.current.duration, videoRef.current.currentTime + amount));
    }
  };

  const handleTimelineClick = (e) => {
    if (videoRef.current) {
      const rect = e.currentTarget.getBoundingClientRect();
      const pos = (e.clientX - rect.left) / rect.width;
      videoRef.current.currentTime = pos * duration;
    }
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const loadSampleVideo = () => {
    // using a highly reliable public placeholder video for demo purposes
    setVideoUrl('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4');
    setVideoFile({ name: 'Sample Video.mp4' });
    setIsPlaying(false);
  };

  return (
    <div className="h-screen bg-gray-50 text-gray-900 font-sans flex flex-col overflow-hidden">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 p-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <div className="bg-indigo-600 p-2 rounded-lg shadow-sm">
            <Type className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-bold tracking-tight">KaraokeCaptioner<span className="text-indigo-600">Pro</span></h1>
        </div>
        <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-md transition-colors text-sm font-medium text-gray-700 shadow-sm">
                <Download className="w-4 h-4" />
                Export Video
            </button>
        </div>
      </header>

      <main className="flex-1 flex flex-row overflow-hidden min-h-0">
        
        {/* Left Column: Video Player & Editor */}
        <div className="flex-1 flex flex-col min-w-0 bg-gray-100 relative p-4 overflow-hidden h-full">
          
          {/* Video Container */}
          <div className="w-full max-w-5xl mx-auto flex flex-col bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden h-full">
            {!videoUrl ? (
              <div 
                className="flex-1 flex flex-col items-center justify-center p-8 text-center border-2 border-dashed border-gray-300 rounded-xl m-8 bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer" 
                onClick={() => document.getElementById('video-upload').click()}
              >
                <Upload className="w-12 h-12 text-indigo-500 mb-4" />
                <h2 className="text-2xl font-semibold mb-2">Upload your video</h2>
                <p className="text-gray-500 mb-6">MP4 format supported</p>
                
                {errorMessage && (
                  <div className="mb-4 text-red-600 bg-red-50 px-4 py-2 rounded-md text-sm font-medium border border-red-100">
                    {errorMessage}
                  </div>
                )}
                
                <div className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition-colors shadow-sm">
                  Select File
                  <input 
                    id="video-upload"
                    type="file" 
                    accept="video/mp4" 
                    className="hidden" 
                    onChange={handleFileUpload} 
                  />
                </div>
                
                <div className="mt-8 pt-6 border-t border-gray-200 w-full" onClick={(e) => e.stopPropagation()}>
                  <p className="text-sm text-gray-500 mb-3">Or try it out with a sample</p>
                  <button 
                    onClick={loadSampleVideo}
                    className="text-indigo-600 hover:text-indigo-700 text-sm font-medium hover:underline"
                  >
                    Load Sample Video & Transcript
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col relative min-h-0">
                {/* Video Area */}
                <div className="flex-1 bg-black relative flex items-center justify-center overflow-hidden">
                    <div className="absolute right-4 top-4 z-[60]">
                      <label className="flex cursor-pointer items-center gap-2 rounded-md bg-white/95 px-3 py-2 text-sm font-medium text-gray-700 shadow-lg transition-colors hover:bg-white">
                        <Upload className="h-4 w-4" />
                        Replace video
                        <input
                          type="file"
                          accept="video/mp4"
                          className="sr-only"
                          onChange={handleFileUpload}
                        />
                      </label>
                    </div>
                    
                    {/* Aspect Ratio Wrapper for precise caption positioning */}
                    <div 
                        ref={videoContainerRef}
                        className="relative flex-shrink-0"
                        style={{ 
                            aspectRatio: `${videoSize.width}/${videoSize.height}`,
                            maxHeight: '100%',
                            maxWidth: '100%'
                        }}
                    >
                        <video
                        ref={videoRef}
                        src={videoUrl}
                        className="w-full h-full block"
                        onLoadedMetadata={handleLoadedMetadata}
                        onEnded={() => setIsPlaying(false)}
                        onClick={togglePlay}
                        playsInline
                        />

                        {/* Caption Overlay */}
                        {(activePhrase || (currentTime === 0 && phrases.length > 0)) && (
                        <div 
                          className={`absolute flex flex-col items-center justify-center transition-opacity duration-200 
                            ${isDragging ? 'cursor-grabbing' : 'cursor-grab hover:bg-black/10'}`}
                          style={{
                            left: `${captionPosition.x}%`,
                            top: `${captionPosition.y}%`,
                            transform: 'translate(-50%, -50%)',
                            touchAction: 'none',
                            zIndex: 50,
                            width: '90%'
                          }}
                          onPointerDown={handlePointerDown}
                          onPointerMove={handlePointerMove}
                          onPointerUp={handlePointerUp}
                          onPointerCancel={handlePointerUp}
                        >
                            <div className={`mb-1 p-1 bg-black/60 rounded text-white backdrop-blur-sm transition-opacity duration-200 shadow-md ${isDragging ? 'opacity-100' : 'opacity-0'}`}>
                               <Move className="w-4 h-4" />
                            </div>
                            <div 
                            className={`text-center transition-all duration-200 ${selectedStyle.className} ${selectedStyle.id === 'style-28' ? 'w-full' : ''}`}
                            style={{ ...(selectedStyle.style || {}), fontSize: `calc(1em * ${captionSize / 100})`, color: captionColors.text, backgroundColor: captionColors.background }}
                            >
                            {(activePhrase || phrases[0]).words.map((wordObj, i) => {
                                // Determine if this word is currently active or has already been passed in this phrase
                                const currentActivePhrase = activePhrase || phrases[0];
                                const isActive = activePhrase ? activeWordIndex === i : i === 0; // Highlight first word in preview mode
                                const isPast = activePhrase ? (activeWordIndex > i || (activeWordIndex === -1 && currentTime > wordObj.end)) : false;
                                
                                // Apply highlighting logic
                                const applyHighlight = isActive || (isPast && selectedStyle.id === 'style-22');

                                return (
                                <span 
                                    key={`${currentActivePhrase.id}-word-${i}`}
                                    className={`inline-block mx-[0.15em] transition-all duration-150 transform-gpu
                                    ${applyHighlight ? selectedStyle.highlightClass : ''}
                                    `}
                                    style={applyHighlight ? { color: captionColors.highlight } : undefined}
                                >
                                    {wordObj.word}
                                </span>
                                );
                            })}
                            </div>
                        </div>
                        )}
                    </div>
                </div>

                {/* Custom Video Controls */}
                <div className="h-20 bg-white border-t border-gray-200 px-6 flex flex-col justify-center gap-2 flex-shrink-0 z-10">
                    {/* Timeline */}
                    <div 
                        className="h-2 bg-gray-200 rounded-full cursor-pointer relative group"
                        onClick={handleTimelineClick}
                    >
                        <div 
                            className="absolute top-0 left-0 h-full bg-indigo-500 rounded-full group-hover:bg-indigo-600 transition-colors"
                            style={{ width: `${(currentTime / (duration || 1)) * 100}%` }}
                        />
                        <div 
                            className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-indigo-600 rounded-full shadow opacity-0 group-hover:opacity-100 transition-opacity transform -translate-x-1/2"
                            style={{ left: `${(currentTime / (duration || 1)) * 100}%` }}
                        />
                    </div>
                    
                    {/* Controls Row */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button onClick={() => seek(-5)} className="text-gray-500 hover:text-gray-900 transition-colors">
                                <Rewind className="w-5 h-5" />
                            </button>
                            <button 
                                onClick={togglePlay}
                                className="w-10 h-10 flex items-center justify-center bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors shadow-sm"
                            >
                                {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-1" />}
                            </button>
                            <button onClick={() => seek(5)} className="text-gray-500 hover:text-gray-900 transition-colors">
                                <FastForward className="w-5 h-5" />
                            </button>
                            
                            <div className="text-sm font-mono text-gray-500 ml-2">
                                {formatTime(currentTime)} / {formatTime(duration)}
                            </div>
                        </div>
                    </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Style & Transcript Controls */}
        <div className="w-64 md:w-80 lg:w-96 bg-white border-l border-gray-200 flex flex-col shrink-0 h-full overflow-hidden shadow-[-4px_0_15px_-3px_rgba(0,0,0,0.05)] z-20">
          
          <div className="flex border-b border-gray-200 bg-gray-50/50 shrink-0">
            <button 
                onClick={() => setActiveTab('styles')}
                className={`flex-1 p-4 flex items-center justify-center gap-2 font-medium text-sm transition-colors ${activeTab === 'styles' ? 'bg-white text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
                <Palette className="w-4 h-4" />
                Styles
            </button>
            <button 
                onClick={() => setActiveTab('transcript')}
                className={`flex-1 p-4 flex items-center justify-center gap-2 font-medium text-sm transition-colors ${activeTab === 'transcript' ? 'bg-white text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
                <List className="w-4 h-4" />
                Transcript
            </button>
          </div>

          {activeTab === 'styles' ? (
              <>
                  {/* Positioning Controls */}
                  <div className="p-4 border-b border-gray-200 bg-gray-50 shrink-0">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="text-sm font-medium text-gray-600 flex items-center gap-2">
                          <Layout className="w-4 h-4" /> Position
                      </h3>
                      <span className="text-xs text-gray-400 font-medium hidden md:block">Drag text on video</span>
                    </div>
                    <div className="flex p-1 bg-gray-200/80 rounded-lg shadow-inner">
                        {[
                          { label: 'top', y: 15 }, 
                          { label: 'middle', y: 50 }, 
                          { label: 'bottom', y: 85 }
                        ].map(pos => (
                            <button
                                key={pos.label}
                                onClick={() => setCaptionPosition({ x: 50, y: pos.y })}
                                className={`flex-1 py-1.5 text-xs font-medium capitalize rounded-md transition-all ${
                                    Math.abs(captionPosition.y - pos.y) < 10
                                    ? 'bg-white text-gray-900 shadow-sm ring-1 ring-gray-900/5' 
                                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                {pos.label}
                            </button>
                        ))}
                    </div>
                  </div>

                  <div className="p-4 border-b border-gray-200 space-y-3">
                    <div className="flex items-center justify-between"><h3 className="text-sm font-medium text-gray-600">Appearance</h3><span className="text-xs text-gray-500">{captionSize}%</span></div>
                    <label className="flex items-center justify-between gap-3 text-xs text-gray-600">Size<input aria-label="Caption size" type="range" min="50" max="200" step="5" value={captionSize} onChange={(e) => setCaptionSize(Number(e.target.value))} className="w-32 accent-indigo-600" /></label>
                    <div className="grid grid-cols-3 gap-2">{([['background','Background'],['text','Main text'],['highlight','Highlight']] as const).map(([key,label]) => <label key={key} className="flex flex-col gap-1 text-[11px] text-gray-500"><span>{label}</span><input aria-label={`${label} color`} type="color" value={captionColors[key]} onChange={(e) => setCaptionColors((colors) => ({ ...colors, [key]: e.target.value }))} className="h-8 w-full cursor-pointer rounded border border-gray-200" /></label>)}</div>
                  </div>

                  {/* Styles Grid */}
                  <div className="flex-1 overflow-y-auto p-4 custom-scrollbar bg-gray-50/30">
                    <h3 className="text-sm font-medium text-gray-500 mb-3">Templates ({CAPTION_STYLES.length})</h3>
                    
                    <div className="grid grid-cols-1 gap-3">
                      {CAPTION_STYLES.map((style) => (
                        <button
                          key={style.id}
                          onClick={() => setSelectedStyle(style)}
                          className={`
                            relative text-left p-4 rounded-xl border transition-all duration-200 overflow-hidden group bg-white shadow-sm
                            ${selectedStyle.id === style.id 
                              ? 'border-indigo-500 ring-1 ring-indigo-500 shadow-[0_4px_15px_-3px_rgba(99,102,241,0.2)]' 
                              : 'border-gray-200 hover:border-gray-300 hover:shadow-md'}
                          `}
                        >
                          {/* Style Preview Area */}
                          <div className="h-16 flex items-center justify-center mb-3 bg-gray-900 rounded-lg overflow-hidden relative shadow-inner">
                            {/* Checkerboard pattern for transparent styles */}
                            <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(45deg, #fff 25%, transparent 25%), linear-gradient(-45deg, #fff 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #fff 75%), linear-gradient(-45deg, transparent 75%, #fff 75%)', backgroundSize: '20px 20px', backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px' }}></div>
                            
                            <div className={`text-center w-full truncate px-2 ${style.className}`} style={style.style || {}}>
                               <span className={style.highlightClass}>Word</span> <span>Sample</span>
                            </div>
                          </div>
                          
                          {/* Info Area */}
                          <div className="flex items-center justify-between mt-1">
                            <span className={`text-sm font-medium ${selectedStyle.id === style.id ? 'text-indigo-700' : 'text-gray-700'}`}>{style.name}</span>
                            {selectedStyle.id === style.id && (
                              <div className="bg-indigo-500 rounded-full p-1 shadow-sm">
                                <Check className="w-3 h-3 text-white" />
                              </div>
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
              </>
          ) : (
              <div className="flex-1 overflow-y-auto p-4 custom-scrollbar bg-gray-50/30">
                 <button onClick={transcribeVideo} disabled={isTranscribing || !videoFile?.type?.startsWith('video/')} className="w-full mb-3 flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"><Wand2 className="h-4 w-4" />{isTranscribing ? 'Matching voiceover…' : 'Auto-sync voiceover'}</button>
                 {transcriptionMessage && <p className="mb-3 rounded-lg border border-indigo-100 bg-indigo-50 p-3 text-xs text-indigo-800">{transcriptionMessage}</p>}
                 <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-lg text-sm mb-5 shadow-sm">
                    <strong>Why isn't my video synced?</strong>
                    <p className="mt-1 text-amber-700/90 leading-relaxed">Browser apps cannot automatically transcribe audio without a backend AI. A looping <strong>Demo Transcript</strong> is currently applied.</p>
                    <p className="mt-2 text-amber-700/90 leading-relaxed">You can manually edit the words and timings below to perfectly match your video!</p>
                 </div>
                 
                 <div className="flex flex-col gap-2">
                     <div className="grid grid-cols-[1fr_1fr_2fr] gap-2 px-2 text-xs font-bold text-gray-500 uppercase tracking-wider">
                         <div>Start (s)</div>
                         <div>End (s)</div>
                         <div>Word</div>
                     </div>
                     {transcript.map((item, index) => (
                         <div key={`transcript-edit-${index}`} className="grid grid-cols-[1fr_1fr_2fr] gap-2 items-center bg-white p-2 rounded-lg border border-gray-200 shadow-sm hover:border-indigo-300 transition-colors focus-within:ring-1 focus-within:ring-indigo-500">
                            <input 
                                type="number" 
                                step="0.1"
                                value={item.start} 
                                onChange={(e) => handleTranscriptChange(index, 'start', e.target.value)}
                                className="w-full p-1.5 text-sm border border-gray-200 rounded bg-gray-50 focus:bg-white focus:outline-none"
                            />
                            <input 
                                type="number" 
                                step="0.1"
                                value={item.end} 
                                onChange={(e) => handleTranscriptChange(index, 'end', e.target.value)}
                                className="w-full p-1.5 text-sm border border-gray-200 rounded bg-gray-50 focus:bg-white focus:outline-none"
                            />
                            <button type="button" title="Set this word to the current playhead" onClick={() => syncWordToPlayhead(index)} className="rounded p-1 text-indigo-600 hover:bg-indigo-50"><Crosshair className="h-4 w-4" /></button>
                            <input 
                                type="text" 
                                value={item.word} 
                                onChange={(e) => handleTranscriptChange(index, 'word', e.target.value)}
                                className="w-full p-1.5 text-sm font-medium border border-gray-200 rounded focus:outline-none focus:border-indigo-400"
                            />
                         </div>
                     ))}
                 </div>
              </div>
          )}
        </div>

      </main>
      
      {/* Basic custom scrollbar CSS for the styles list */}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f9fafb; 
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #d1d5db; 
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #9ca3af; 
        }
      `}} />
    </div>
  );
}
