"use client";

import { useState } from 'react';
import Header from '../components/Header';
import Workspace from '../components/Workspace';
import { useTransportControls } from '../hooks/useTransportControls';

interface WindowData {id:number;x:number;y:number;width:number;height:number;title:string;content?:'timeline'|'mixer'|'stockchart'|'quotemonitor'|'chatbot'|null;}

export default function Home() {
  const [windows,setWindows] = useState<WindowData[]>([{id:1,x:50,y:50,width:1400,height:800,title:'Window 1',content:null}]);
  const [nextId,setNextId] = useState(2);
  const transport = useTransportControls();
  const addNewWindow = () => {
    const newWindow:WindowData={id:nextId,x:50+(nextId-1)*30,y:50+(nextId-1)*30,width:1400,height:800,title:`Window${nextId}`,content:null};
    setWindows(prev=>[...prev,newWindow]);
    setNextId(prev=>prev+1);
  };

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col">
      <Header onNewWindow={addNewWindow} />
      <main className="flex-1 flex">
        <Workspace 
          windows={windows} 
          setWindows={setWindows}
          transportState={{isPlaying:transport.isPlaying,playheadPosition:transport.playheadPosition}}
          onPlayheadMove={transport.setPlayheadPosition}
        />
      </main>
    </div>
  );
}
