import { useRef, useCallback, useEffect } from 'react';

/**
 * Custom hook to manage the phone ringing sound effect
 * Plays a looping ring tone until stopped
 */
export const useRingingSound = () => {
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const isPlayingRef = useRef(false);
  const ringIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const createRingTone = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();
    }
    
    const ctx = audioContextRef.current;
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    // Classic phone ring frequencies (US dial tone pattern)
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(440, ctx.currentTime); // A4
    
    gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
    
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    oscillatorRef.current = oscillator;
    gainNodeRef.current = gainNode;
    
    return { oscillator, gainNode, ctx };
  }, []);

  const startRinging = useCallback(() => {
    if (isPlayingRef.current) return;
    isPlayingRef.current = true;

    const playRingBurst = () => {
      if (!isPlayingRef.current) return;
      
      const { oscillator, gainNode, ctx } = createRingTone();
      
      // Ring pattern: 2 seconds on, 4 seconds off (US standard)
      // We'll do a shorter pattern: 1s on, 2s off for better UX
      gainNode.gain.setValueAtTime(0, ctx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.25, ctx.currentTime + 0.05);
      
      // Add a second frequency for dual-tone effect
      const osc2 = ctx.createOscillator();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(480, ctx.currentTime); // Slightly higher
      const gain2 = ctx.createGain();
      gain2.gain.setValueAtTime(0, ctx.currentTime);
      gain2.gain.linearRampToValueAtTime(0.2, ctx.currentTime + 0.05);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      
      oscillator.start(ctx.currentTime);
      osc2.start(ctx.currentTime);
      
      // Fade out after 1 second
      setTimeout(() => {
        if (gainNode && gain2) {
          const now = ctx.currentTime;
          gainNode.gain.linearRampToValueAtTime(0, now + 0.1);
          gain2.gain.linearRampToValueAtTime(0, now + 0.1);
          
          setTimeout(() => {
            oscillator.stop();
            osc2.stop();
          }, 150);
        }
      }, 1000);
    };

    // Play first ring immediately
    playRingBurst();
    
    // Then ring every 3 seconds (1s ring + 2s pause)
    ringIntervalRef.current = setInterval(() => {
      if (isPlayingRef.current) {
        playRingBurst();
      }
    }, 3000);
  }, [createRingTone]);

  const stopRinging = useCallback(() => {
    isPlayingRef.current = false;
    
    if (ringIntervalRef.current) {
      clearInterval(ringIntervalRef.current);
      ringIntervalRef.current = null;
    }
    
    // Fade out any current sound
    if (gainNodeRef.current && audioContextRef.current) {
      try {
        gainNodeRef.current.gain.linearRampToValueAtTime(
          0,
          audioContextRef.current.currentTime + 0.1
        );
      } catch {
        // Ignore if already stopped
      }
    }
    
    if (oscillatorRef.current) {
      try {
        oscillatorRef.current.stop();
      } catch {
        // Ignore if already stopped
      }
      oscillatorRef.current = null;
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopRinging();
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, [stopRinging]);

  return { startRinging, stopRinging };
};
