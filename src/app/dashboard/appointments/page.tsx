
'use client';

import { useState, useEffect } from 'react';
import { File, ListFilter, MoreHorizontal, Loader2, Video } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth.tsx';
import { getAppointmentsForDoctor } from '@/services/appointmentService';

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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import type { Appointment } from '@/lib/types';
import Link from 'next/link';

export default function AppointmentsPage() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [typeFilters, setTypeFilters] = useState<{ video: boolean; chat: boolean }>({
    video: true,
    chat: true,
  });

  useEffect(() => {
    async function fetchAppointments() {
      if (user) {
        setIsLoading(true);
        const fetchedAppointments = await getAppointmentsForDoctor(user.uid);
        setAppointments(fetchedAppointments);
        setIsLoading(false);
      }
    }
    fetchAppointments();
  }, [user]);

  const handleTypeFilterChange = (type: 'video' | 'chat', checked: boolean) => {
    setTypeFilters(prev => ({ ...prev, [type]: checked }));
  };
  
  const filteredAppointments = appointments.filter(appointment => {
    const statusMatch = activeTab === 'all' || appointment.status.toLowerCase() === activeTab;
    const selectedTypes = [];
    if (typeFilters.video) selectedTypes.push('video');
    if (typeFilters.chat) selectedTypes.push('chat');
    const typeMatch = selectedTypes.length === 0 || selectedTypes.length === 2 || selectedTypes.includes(appointment.type.toLowerCase());
    return statusMatch && typeMatch;
  });

  const renderTableRows = (appointmentsToRender: Appointment[]) => (
    <TableBody>
      {appointmentsToRender.map((appointment) => (
        <TableRow key={appointment.id}>
          <TableCell className="font-medium">
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={appointment.patientAvatar} alt={appointment.patientName} data-ai-hint="person portrait" />
                <AvatarFallback>{appointment.patientName?.charAt(0) || ''}</AvatarFallback>
              </Avatar>
              <span>{appointment.patientName}</span>
            </div>
          </TableCell>
          <TableCell>
            <Badge variant="outline" className="capitalize">{appointment.type}</Badge>
          </TableCell>
          <TableCell>
            <Badge
              variant={
                appointment.status === 'completed'
                  ? 'default'
                  : appointment.status === 'cancelled'
                    ? 'destructive'
                    : 'secondary'
              }
              className={cn(appointment.status === "upcoming" && "bg-primary/20 text-primary border-primary/20 hover:bg-primary/30", "capitalize")}
            >
              {appointment.status}
            </Badge>
          </TableCell>
          <TableCell>{appointment.time} <br/> <span className="text-xs text-muted-foreground">{appointment.date}</span></TableCell>
          <TableCell>
             {appointment.status === 'upcoming' && (
              <Button asChild size="sm" variant="outline">
                <Link href={`/dashboard/consultation/${appointment.id}`}>
                  <Video className="mr-2 h-4 w-4" /> Join
                </Link>
              </Button>
            )}
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
          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredAppointments.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Patient</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Time & Date</TableHead>
                  <TableHead>
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              {renderTableRows(filteredAppointments)}
            </Table>
          ) : (
            <div className="text-center py-10 text-muted-foreground">
              No appointments found for the selected filters.
            </div>
          )}
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
