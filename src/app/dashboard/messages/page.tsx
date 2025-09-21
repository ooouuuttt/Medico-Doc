
'use client';

import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { patients, type Message } from '@/lib/data';
import { cn } from '@/lib/utils';
import { SendHorizonal, Search } from 'lucide-react';
import type { Patient } from '@/lib/types';

export default function MessagesPage() {
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(patients[0]);
  const [messages, setMessages] = useState<Message[]>(selectedPatient?.messages || []);
  const [newMessage, setNewMessage] = useState('');

  const handleSelectPatient = (patient: Patient) => {
    setSelectedPatient(patient);
    setMessages(patient.messages || []);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === '' || !selectedPatient) return;

    const message: Message = {
      id: (messages.length + 1).toString(),
      sender: 'doctor',
      text: newMessage.trim(),
      timestamp: 'Just now',
    };

    setMessages([...messages, message]);
    setNewMessage('');
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[calc(100vh-100px)]">
      <Card className="md:col-span-1 flex flex-col">
        <CardHeader>
          <CardTitle>Conversations</CardTitle>
           <div className="relative mt-2">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search conversations..."
              className="w-full appearance-none bg-background pl-8 shadow-none"
            />
          </div>
        </CardHeader>
        <CardContent className="p-0 flex-grow">
          <ScrollArea className="h-full">
            <div className="flex flex-col">
              {patients.map((patient) => (
                <button
                  key={patient.id}
                  onClick={() => handleSelectPatient(patient)}
                  className={cn(
                    'flex items-center gap-3 p-4 text-left hover:bg-muted/50 transition-colors w-full border-b',
                    selectedPatient?.id === patient.id && 'bg-muted'
                  )}
                >
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={patient.avatar} alt={patient.name} data-ai-hint="person portrait"/>
                    <AvatarFallback>{patient.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-grow">
                    <p className="font-semibold">{patient.name}</p>
                    <p className="text-sm text-muted-foreground truncate">
                      {patient.messages?.[patient.messages.length - 1]?.text}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      <Card className="md:col-span-2 flex flex-col h-full">
        {selectedPatient ? (
          <>
            <CardHeader className="flex flex-row items-center gap-3 border-b">
              <Avatar>
                <AvatarImage src={selectedPatient.avatar} alt={selectedPatient.name} data-ai-hint="person portrait"/>
                <AvatarFallback>{selectedPatient.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <CardTitle className="m-0">{selectedPatient.name}</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 p-0 overflow-y-auto">
                <ScrollArea className="h-full p-6">
                    <div className="flex flex-col gap-4">
                        {messages.map((message) => (
                        <div
                            key={message.id}
                            className={cn(
                            'flex items-end gap-2 max-w-xs',
                            message.sender === 'doctor' ? 'ml-auto flex-row-reverse' : 'mr-auto'
                            )}
                        >
                            <div
                            className={cn(
                                'rounded-lg px-4 py-2',
                                message.sender === 'doctor'
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-muted'
                            )}
                            >
                            <p>{message.text}</p>
                            <p className="text-xs text-right opacity-70 mt-1">{message.timestamp}</p>
                            </div>
                        </div>
                        ))}
                    </div>
                </ScrollArea>
            </CardContent>
            <div className="p-4 border-t">
              <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  autoComplete="off"
                />
                <Button type="submit" size="icon">
                  <SendHorizonal className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <p>Select a conversation to start chatting.</p>
          </div>
        )}
      </Card>
    </div>
  );
}
