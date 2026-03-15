import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Play, Pause, RotateCcw, Clock } from 'lucide-react';

export default function TimerControl() {
  const [duration, setDuration] = useState(3600); // Default 1 hour in seconds
  const [timeLeft, setTimeLeft] = useState(3600);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
    }

    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(duration);
  };

  const handleDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const minutes = parseInt(e.target.value);
    if (!isNaN(minutes)) {
      setDuration(minutes * 60);
      setTimeLeft(minutes * 60);
      setIsActive(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="bg-[#0f1420] border-white/10 max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-white font-orbitron flex items-center gap-2">
          <Clock className="w-5 h-5 text-cyan-400" />
          Tournament Timer Control
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center p-8 bg-black/20 rounded-xl border border-white/5">
          <div className="text-6xl font-mono font-bold text-white tracking-widest mb-2">
            {formatTime(timeLeft)}
          </div>
          <p className="text-gray-400 text-sm uppercase tracking-widest">Time Remaining</p>
        </div>

        <div className="flex gap-4 justify-center">
          <Button
            onClick={toggleTimer}
            className={`w-32 font-bold ${isActive ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}`}
          >
            {isActive ? (
              <>
                <Pause className="w-4 h-4 mr-2" /> Pause
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" /> Start
              </>
            )}
          </Button>
          <Button variant="outline" onClick={resetTimer} className="border-white/20 text-white hover:bg-white/10">
            <RotateCcw className="w-4 h-4 mr-2" /> Reset
          </Button>
        </div>

        <div className="space-y-2">
          <label className="text-sm text-gray-400 font-medium">Set Duration (minutes)</label>
          <Input
            type="number"
            min="1"
            placeholder="Enter minutes"
            onChange={handleDurationChange}
            className="bg-white/5 border-white/10 text-white"
          />
        </div>
      </CardContent>
    </Card>
  );
}
