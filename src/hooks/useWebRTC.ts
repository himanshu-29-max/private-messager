import { useEffect, useRef, useState } from "react";
import Peer from "simple-peer";
import { Socket } from "socket.io-client";

export const useWebRTC = (socket: Socket | null, roomId: string) => {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [isCalling, setIsCalling] = useState(false);
  const [callIncoming, setCallIncoming] = useState(false);
  const [callerId, setCallerId] = useState("");
  const [incomingOffer, setIncomingOffer] = useState<any>(null);
  const [callType, setCallType] = useState<'video' | 'voice'>('video');

  const peerRef = useRef<Peer.Instance | null>(null);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!socket) return;

    socket.on("webrtc-offer", (data) => {
      setCallIncoming(true);
      setCallerId(data.caller);
      setIncomingOffer(data.offer);
    });

    return () => {
      socket.off("webrtc-offer");
    };
  }, [socket]);

  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  const startMedia = async (type: 'video' | 'voice') => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: type === 'video', 
        audio: true 
      });
      setLocalStream(stream);
      return stream;
    } catch (err) {
      console.error("Failed to get local stream", err);
      return null;
    }
  };

  const initiateCall = async (type: 'video' | 'voice') => {
    const stream = await startMedia(type);
    if (!stream || !socket) return;
    setCallType(type);
    setIsCalling(true);

    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: stream,
    });

    peer.on("signal", (data) => {
      socket.emit("send-message", {
        roomId,
        message: JSON.stringify({ type: "offer", offer: data, caller: socket.id, callType: type }),
        sender: "System_WebRTC"
      });
    });

    peer.on("stream", (currentStream) => {
      setRemoteStream(currentStream);
    });

    socket.on("receive-message", (msg) => {
      if (msg.sender === "System_WebRTC") {
        const payload = JSON.parse(msg.message);
        if (payload.type === "answer") {
          peer.signal(payload.answer);
        }
      }
    });

    peerRef.current = peer;
  };

  const answerCall = async (offer: any, type: 'video' | 'voice') => {
    const stream = await startMedia(type);
    if (!stream || !socket) return;
    
    setCallType(type);
    setCallIncoming(false);
    setIsCalling(true);

    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: stream,
    });

    peer.on("signal", (data) => {
      socket.emit("send-message", {
        roomId,
        message: JSON.stringify({ type: "answer", answer: data }),
        sender: "System_WebRTC"
      });
    });

    peer.on("stream", (currentStream) => {
      setRemoteStream(currentStream);
    });

    peer.signal(offer);
    peerRef.current = peer;
  };

  const endCall = () => {
    if (peerRef.current) {
      peerRef.current.destroy();
    }
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
    }
    setLocalStream(null);
    setRemoteStream(null);
    setIsCalling(false);
    setCallIncoming(false);
    
    socket?.off("receive-message");
  };

  const sendFile = (file: File) => {
    if (!peerRef.current) return;
    file.arrayBuffer().then(buffer => {
      peerRef.current?.send(JSON.stringify({ type: "file-meta", name: file.name, size: file.size }));
      peerRef.current?.send(buffer);
    });
  };

  return {
    localVideoRef,
    remoteVideoRef,
    isCalling,
    callIncoming,
    incomingOffer,
    callType,
    initiateCall,
    answerCall,
    endCall,
    sendFile
  };
};
