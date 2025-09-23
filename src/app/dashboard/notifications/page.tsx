
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { getNotificationsForDoctor, type Notification } from '@/services/notificationService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BellRing, Loader2, MailCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

export default function NotificationsPage() {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchNotifications() {
            if (user) {
                setIsLoading(true);
                const fetchedNotifications = await getNotificationsForDoctor(user.uid);
                setNotifications(fetchedNotifications);
                setIsLoading(false);
            }
        }
        fetchNotifications();
    }, [user]);
    
    const markAllAsRead = () => {
        // In a real app, you would also update the read status in Firestore
        setNotifications(notifications.map(n => ({ ...n, read: true })));
    };

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Notifications</CardTitle>
                    <CardDescription>View all your recent alerts and updates.</CardDescription>
                </div>
                 <Button size="sm" variant="outline" onClick={markAllAsRead} disabled={notifications.every(n => n.read)}>
                    <MailCheck className="mr-2 h-4 w-4"/> Mark all as read
                </Button>
            </CardHeader>
            <CardContent>
                {isLoading ? (
                    <div className="flex justify-center items-center h-40">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                ) : notifications.length > 0 ? (
                    <div className="space-y-4">
                        {notifications.map(notification => (
                            <div key={notification.id} className={cn(
                                "flex items-start gap-4 p-4 rounded-lg border",
                                !notification.read && "bg-primary/5 border-primary/20"
                            )}>
                                <div className={cn("mt-1", !notification.read && "text-primary")}>
                                    <BellRing className="h-5 w-5"/>
                                </div>
                                <div className="flex-1">
                                    <p className="font-semibold">{notification.title}</p>
                                    <p className="text-sm text-muted-foreground">{notification.message}</p>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        {formatDistanceToNow(notification.createdAt, { addSuffix: true })}
                                    </p>
                                </div>
                                {!notification.read && (
                                    <div className="w-2 h-2 mt-2 rounded-full bg-primary" aria-label="Unread"/>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 text-muted-foreground">
                        <BellRing className="mx-auto h-12 w-12 mb-4" />
                        <h3 className="text-lg font-semibold">No notifications yet</h3>
                        <p className="text-sm">We'll let you know when something important happens.</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
