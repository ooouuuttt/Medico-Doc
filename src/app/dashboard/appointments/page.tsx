
'use client';

import { useState } from 'react';
import { File, ListFilter, MoreHorizontal } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { appointments } from '@/lib/data';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import type { Appointment } from '@/lib/types';

export default function AppointmentsPage() {
  const [activeTab, setActiveTab] = useState('all');
  const [typeFilters, setTypeFilters] = useState<{ video: boolean; chat: boolean }>({
    video: true,
    chat: true,
  });

  const handleTypeFilterChange = (type: 'video' | 'chat', checked: boolean) => {
    setTypeFilters(prev => ({ ...prev, [type]: checked }));
  };
  
  const filteredAppointments = appointments.filter(appointment => {
    // Status filter (from tabs)
    const statusMatch = activeTab === 'all' || appointment.status.toLowerCase() === activeTab;

    // Type filter (from dropdown)
    const selectedTypes = [];
    if (typeFilters.video) selectedTypes.push('Video');
    if (typeFilters.chat) selectedTypes.push('Chat');
    const typeMatch = selectedTypes.length === 0 || selectedTypes.length === 2 || selectedTypes.includes(appointment.type);
    
    return statusMatch && typeMatch;
  });

  const renderTableRows = (appointments: Appointment[]) => (
    <TableBody>
      {appointments.map((appointment) => (
        <TableRow key={appointment.id}>
          <TableCell className="font-medium">
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={appointment.patientAvatar} alt={appointment.patientName} data-ai-hint="person portrait" />
                <AvatarFallback>{appointment.patientName.charAt(0)}</AvatarFallback>
              </Avatar>
              <span>{appointment.patientName}</span>
            </div>
          </TableCell>
          <TableCell>
            <Badge variant="outline">{appointment.type}</Badge>
          </TableCell>
          <TableCell>
            <Badge
              variant={
                appointment.status === 'Completed'
                  ? 'default'
                  : appointment.status === 'Cancelled'
                    ? 'destructive'
                    : 'secondary'
              }
              className={cn(appointment.status === "Upcoming" && "bg-primary/20 text-primary border-primary/20 hover:bg-primary/30")}
            >
              {appointment.status}
            </Badge>
          </TableCell>
          <TableCell>{appointment.time}</TableCell>
          <TableCell>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  aria-haspopup="true"
                  size="icon"
                  variant="ghost"
                >
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem>Start Consultation</DropdownMenuItem>
                <DropdownMenuItem>Reschedule</DropdownMenuItem>
                <DropdownMenuItem>Cancel</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  );

  return (
    <Tabs defaultValue="all" onValueChange={setActiveTab}>
      <div className="flex items-center">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="cancelled" className="hidden sm:flex">
            Cancelled
          </TabsTrigger>
        </TabsList>
        <div className="ml-auto flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 gap-1">
                <ListFilter className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  Filter by Type
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Filter by</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem
                checked={typeFilters.video}
                onCheckedChange={(checked) => handleTypeFilterChange('video', !!checked)}
              >
                Video
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={typeFilters.chat}
                onCheckedChange={(checked) => handleTypeFilterChange('chat', !!checked)}
              >
                Chat
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button size="sm" variant="outline" className="h-8 gap-1">
            <File className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-rap">
              Export
            </span>
          </Button>
        </div>
      </div>
      
      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Appointments</CardTitle>
          <CardDescription>
            Manage your appointments and view consultation details.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            {renderTableRows(filteredAppointments)}
          </Table>
        </CardContent>
        <CardFooter>
          <div className="text-xs text-muted-foreground">
            Showing <strong>{filteredAppointments.length}</strong> of <strong>{appointments.length}</strong> appointments
          </div>
        </CardFooter>
      </Card>
      
    </Tabs>
  );
}
