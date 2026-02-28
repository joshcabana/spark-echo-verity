import { useState, useEffect, useRef, useCallback } from "react";
import AgoraRTC, {
  IAgoraRTCClient,
  ICameraVideoTrack,
  IMicrophoneAudioTrack,
  IAgoraRTCRemoteUser,
} from "agora-rtc-sdk-ng";

interface UseAgoraCallParams {
  appId: string;
  channel: string;
  token: string | null;
  uid: number;
  enabled: boolean;
}

export function useAgoraCall({ appId, channel, token, uid, enabled }: UseAgoraCallParams) {
  const clientRef = useRef<IAgoraRTCClient | null>(null);
  const localVideoRef = useRef<HTMLDivElement>(null);
  const remoteVideoRef = useRef<HTMLDivElement>(null);
  const localTracksRef = useRef<{ audio: IMicrophoneAudioTrack | null; video: ICameraVideoTrack | null }>({
    audio: null,
    video: null,
  });

  const [isRemoteConnected, setIsRemoteConnected] = useState(false);
  const [isJoined, setIsJoined] = useState(false);
  const [micOn, setMicOn] = useState(true);
  const [cameraOn, setCameraOn] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const join = useCallback(async () => {
    if (!appId || !channel || !enabled) return;

    try {
      const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
      clientRef.current = client;

      client.on("user-published", async (remoteUser: IAgoraRTCRemoteUser, mediaType) => {
        await client.subscribe(remoteUser, mediaType);
        if (mediaType === "video" && remoteVideoRef.current) {
          remoteUser.videoTrack?.play(remoteVideoRef.current);
          setIsRemoteConnected(true);
        }
        if (mediaType === "audio") {
          remoteUser.audioTrack?.play();
        }
      });

      client.on("user-unpublished", (remoteUser: IAgoraRTCRemoteUser, mediaType) => {
        if (mediaType === "video") {
          setIsRemoteConnected(false);
        }
      });

      client.on("user-left", () => {
        setIsRemoteConnected(false);
      });

      await client.join(appId, channel, token || null, uid);

      const [audioTrack, videoTrack] = await Promise.all([
        AgoraRTC.createMicrophoneAudioTrack(),
        AgoraRTC.createCameraVideoTrack(),
      ]);

      localTracksRef.current = { audio: audioTrack, video: videoTrack };

      if (localVideoRef.current) {
        videoTrack.play(localVideoRef.current);
      }

      await client.publish([audioTrack, videoTrack]);
      setIsJoined(true);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to join call";
      console.error("Agora join error:", err);
      setError(message);
      // Clean up resources on error to prevent leaks
      const { audio, video } = localTracksRef.current;
      audio?.close();
      video?.close();
      localTracksRef.current = { audio: null, video: null };
      if (clientRef.current) {
        try { await clientRef.current.leave(); } catch { /* ignore */ }
        clientRef.current = null;
      }
    }
  }, [appId, channel, token, uid, enabled]);

  const leave = useCallback(async () => {
    const { audio, video } = localTracksRef.current;
    audio?.close();
    video?.close();
    localTracksRef.current = { audio: null, video: null };

    if (clientRef.current) {
      await clientRef.current.leave();
      clientRef.current = null;
    }
    setIsJoined(false);
    setIsRemoteConnected(false);
  }, []);

  const toggleMic = useCallback(async () => {
    const track = localTracksRef.current.audio;
    if (track) {
      await track.setEnabled(!micOn);
      setMicOn(!micOn);
    }
  }, [micOn]);

  const toggleCamera = useCallback(async () => {
    const track = localTracksRef.current.video;
    if (track) {
      await track.setEnabled(!cameraOn);
      setCameraOn(!cameraOn);
    }
  }, [cameraOn]);

  useEffect(() => {
    if (enabled && appId && channel) {
      join();
    }
    return () => {
      leave();
    };
  }, [enabled, appId, channel, join, leave]);

  return {
    localVideoRef,
    remoteVideoRef,
    isRemoteConnected,
    isJoined,
    micOn,
    cameraOn,
    error,
    leave,
    toggleMic,
    toggleCamera,
  };
}
