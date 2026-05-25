import { getQuery } from '@/lib/deepgram/shop';
import { create } from 'zustand';

interface AudioRecording {
  id: string;
  blob: Blob;
  url: string;
  createdAt: Date;
  size: number;
  mimeType: string;
}

interface AudioStore {
  // Recording state (serializable)
  isRecording: boolean;
  isInitialized: boolean;
  text: string | null;
  // Current recording data (serializable)
  currentChunks: Blob[];

  // Single latest recording (serializable)
  latestRecording: AudioRecording | null;

  // Configuration (serializable)
  mimeType: string;

  // Actions
  initializeRecording: () => Promise<boolean>;
  startRecording: () => boolean;
  stopRecording: () => boolean;
  getLatestRecording: () => AudioRecording | null;
  clearRecording: () => void;
  formatSize: (bytes: number) => string;
  cleanup: () => void;
}

// Keep MediaRecorder and MediaStream outside of Zustand store
let mediaRecorder: MediaRecorder | null = null;
let audioStream: MediaStream | null = null;

const useAudioStore = create<AudioStore>((set, get) => ({
  // Recording state
  isRecording: false,
  isInitialized: false,

  // Current recording data
  currentChunks: [],

  // Single latest recording
  latestRecording: null,
  text: null,
  // Configuration
  mimeType: 'audio/webm;codecs=opus',

  // Initialize audio recording
  initializeRecording: async (): Promise<boolean> => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100,
        }
      });

      // Check supported MIME types
      const supportedTypes = [
        'audio/webm;codecs=opus',
        'audio/webm',
        'audio/mp4',
        'audio/ogg;codecs=opus',
        'audio/wav'
      ];

      const mimeType = supportedTypes.find(type =>
        MediaRecorder.isTypeSupported(type)
      ) || 'audio/webm';

      const recorder = new MediaRecorder(stream, {
        mimeType,
        audioBitsPerSecond: 128000,
      });

      // Handle data available event
      recorder.ondataavailable = (event: BlobEvent) => {
        if (event.data.size > 0) {
          set((state) => ({
            currentChunks: [...state.currentChunks, event.data]
          }));
        }
      };

      // Handle recording stop - create blob and replace latest recording
      recorder.onstop = async () => {
        const { currentChunks, latestRecording } = get();

        // Clean up previous recording URL to prevent memory leaks
        if (latestRecording) {
          URL.revokeObjectURL(latestRecording.url);
        }

        if (currentChunks.length > 0) {
          const blob = new Blob(currentChunks, { type: mimeType });
          const recording: AudioRecording = {
            id: Date.now().toString(),
            blob,
            url: URL.createObjectURL(blob),
            createdAt: new Date(),
            size: blob.size,
            mimeType,
          };

          const text = await getQuery(await blob.arrayBuffer())

          set({ text })
          set({
            latestRecording: recording,
            currentChunks: [],
            isRecording: false,
          });
        } else {
          set({
            currentChunks: [],
            isRecording: false,
          });
        }
      };

      // Store references outside of Zustand
      mediaRecorder = recorder;
      audioStream = stream;

      set({
        isInitialized: true,
        mimeType,
      });

      return true;
    } catch (error) {
      console.error('Failed to initialize audio recording:', error);
      return false;
    }
  },

  // Start recording
  startRecording: (): boolean => {
    const { isInitialized, isRecording } = get();

    if (!isInitialized || !mediaRecorder || isRecording) {
      return false;
    }

    try {
      // Clear current chunks
      set({ currentChunks: [] });

      mediaRecorder.start(100); // Collect data every 100ms for responsiveness

      set({ isRecording: true });

      return true;
    } catch (error) {
      console.error('Failed to start recording:', error);
      return false;
    }
  },

  // Stop recording (will automatically create and store blob)
  stopRecording: () => {
    const { isRecording } = get();
    if (!isRecording || !mediaRecorder) { return false };
    try {
      mediaRecorder.stop();
      return (true);
    } catch (error) {
      console.error('Failed to stop recording:', error);
      return false
    }

  },

  // Get the latest recording
  getLatestRecording: (): AudioRecording | null => {
    return get().latestRecording;
  },
  // Clear the latest recording
  clearRecording: (): void => {
    const { latestRecording } = get();

    // Revoke blob URL to free memory
    if (latestRecording) {
      URL.revokeObjectURL(latestRecording.url);
    }

    set({ latestRecording: null });
  },

  // Format size for display
  formatSize: (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  },

  // Clean up resources
  cleanup: (): void => {
    const { latestRecording } = get();

    // Stop audio stream
    if (audioStream) {
      audioStream.getTracks().forEach(track => track.stop());
      audioStream = null;
    }

    // Clean up MediaRecorder
    if (mediaRecorder) {
      if (mediaRecorder.state !== 'inactive') {
        mediaRecorder.stop();
      }
      mediaRecorder = null;
    }

    // Clean up blob URL
    if (latestRecording) {
      URL.revokeObjectURL(latestRecording.url);
    }

    set({
      isRecording: false,
      isInitialized: false,
      currentChunks: [],
      latestRecording: null,
    });
  },
}));

export default useAudioStore;
export type { AudioRecording, AudioStore };

