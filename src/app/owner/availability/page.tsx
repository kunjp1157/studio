
'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { PageTitle } from '@/components/shared/PageTitle';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CalendarClock, AlertCircle, PlusCircle, Trash2, Building2 } from 'lucide-react';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { useToast } from '@/hooks/use-toast';
import type { Facility, BlockedSlot, UserProfile } from '@/lib/types';
import { getFacilitiesByOwnerIdAction, getFacilityByIdAction, blockTimeSlot, unblockTimeSlot } from '@/app/actions';
import { format, parse, isValid } from 'date-fns';

export default function OwnerAvailabilityPage() {
  const [ownerFacilities, setOwnerFacilities] = useState<Facility[]>([]);
  const [selectedFacilityId, setSelectedFacilityId] = useState<string | undefined>(undefined);
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  
  const [blockedDate, setBlockedDate] = useState<Date | undefined>(new Date());
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [reason, setReason] = useState('');
  
  const [isLoadingFacilities, setIsLoadingFacilities] = useState(true);
  const [isSubmittingBlock, setIsSubmittingBlock] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const activeUser = sessionStorage.getItem('activeUser');
    if (activeUser) {
        setCurrentUser(JSON.parse(activeUser));
    }
  }, []);

  const fetchFacilities = useCallback(async () => {
    if (!currentUser) return;
    setIsLoadingFacilities(true);
    try {
      const facilities = await getFacilitiesByOwnerIdAction(currentUser.id);
      setOwnerFacilities(facilities);
      if (facilities.length > 0 && !selectedFacilityId) {
          // You can uncomment this to auto-select the first facility
          // setSelectedFacilityId(facilities[0].id);
      }
    } catch (error) {
        toast({title: "Error", description: "Could not fetch your facilities.", variant: "destructive"});
    } finally {
        setIsLoadingFacilities(false);
    }
  }, [currentUser, toast, selectedFacilityId]);

  useEffect(() => {
    fetchFacilities();
  }, [currentUser, fetchFacilities]);

  const fetchSelectedFacility = useCallback(async () => {
      if (selectedFacilityId) {
        // Optimistically update from the list we already have
        const existing = ownerFacilities.find(f => f.id === selectedFacilityId);
        if (existing) setSelectedFacility(existing);
        
        // Then fetch the latest version in the background
        const facility = await getFacilityByIdAction(selectedFacilityId);
        setSelectedFacility(facility || null);
      } else {
        setSelectedFacility(null);
      }
  }, [selectedFacilityId, ownerFacilities]);


  useEffect(() => {
    fetchSelectedFacility();
  }, [selectedFacilityId, fetchSelectedFacility]);


  const handleAddBlockedSlot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFacilityId || !blockedDate || !startTime || !endTime || !currentUser) {
      toast({ title: "Missing Information", description: "Please select a facility, date, start time, and end time.", variant: "destructive" });
      return;
    }
    if (endTime <= startTime) {
        toast({ title: "Invalid Time Range", description: "End time must be after start time.", variant: "destructive" });
        return;
    }

    setIsSubmittingBlock(true);
    const newBlock: BlockedSlot = {
      date: format(blockedDate, 'yyyy-MM-dd'),
      startTime,
      endTime,
      reason: reason.trim() || undefined,
    };
    
    // Server action for blocking
    const success = await blockTimeSlot(selectedFacilityId, currentUser.id, newBlock);
    
    if (success) {
      toast({ title: "Slot Blocked", description: `Time slot on ${newBlock.date} from ${startTime} to ${endTime} has been blocked.` });
      await fetchSelectedFacility(); // Refresh data
      setStartTime('');
      setEndTime('');
      setReason('');
    } else {
      toast({ title: "Error Blocking Slot", description: "Could not block the slot. It might already be blocked or an error occurred.", variant: "destructive" });
    }
    setIsSubmittingBlock(false);
  };

  const handleRemoveBlockedSlot = async (date: string, slotStartTime: string) => {
    if (!selectedFacilityId || !currentUser) return;
    
    const success = await unblockTimeSlot(selectedFacilityId, currentUser.id, date, slotStartTime);
    
    if (success) {
      toast({ title: "Slot Unblocked", description: `The blocked slot on ${date} at ${slotStartTime} is now available.` });
      await fetchSelectedFacility(); // Refresh data
    } else {
      toast({ title: "Error Unblocking Slot", description: "Could not unblock the slot.", variant: "destructive" });
    }
  };

  const sortedBlockedSlots = useMemo(() => {
    if (!selectedFacility || !selectedFacility.blockedSlots) return [];
    return [...selectedFacility.blockedSlots].sort((a, b) => {
      const dateComparison = new Date(a.date).getTime() - new Date(b.date).getTime();
      if (dateComparison !== 0) return dateComparison;
      return a.startTime.localeCompare(b.startTime);
    });
  }, [selectedFacility]);


  if (isLoadingFacilities) {
    return <div className="flex justify-center items-center min-h-[calc(100vh-200px)]"><LoadingSpinner size={48} /></div>;
  }

  return (
    <div className="space-y-8">
      <PageTitle title="Manage Facility Availability" description="Block out time slots for maintenance, private events, or special closures." />

      {ownerFacilities.length === 0 ? (
        <Alert>
            <Building2 className="h-4 w-4" />
            <AlertTitle>No Facilities Found</AlertTitle>
            <AlertDescription>
            You do not own any facilities yet. Add a facility through the "My Facilities" page to manage its availability.
            </AlertDescription>
        </Alert>
      ) : (
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Building2 className="mr-2 h-5 w-5 text-primary" />
              Select Facility
            </CardTitle>
            <Select value={selectedFacilityId} onValueChange={setSelectedFacilityId}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a facility to manage..." />
              </SelectTrigger>
              <SelectContent>
                {ownerFacilities.map(facility => (
                  <SelectItem key={facility.id} value={facility.id}>
                    {facility.name} ({facility.location})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardHeader>
        </Card>
      )}

      {selectedFacility && (
        <div className="grid md:grid-cols-2 gap-8 items-start">
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center"><CalendarClock className="mr-2 h-5 w-5 text-primary"/>Add New Blocked Slot</CardTitle>
              <CardDescription>Select date, time, and reason to block availability for {selectedFacility.name}.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddBlockedSlot} className="space-y-4">
                <div>
                  <Label htmlFor="block-date">Date</Label>
                  <Calendar
                    id="block-date"
                    mode="single"
                    selected={blockedDate}
                    onSelect={setBlockedDate}
                    className="rounded-md border mt-1"
                    disabled={(date) => date < new Date(new Date().setHours(0,0,0,0))}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="start-time">Start Time</Label>
                        <Input id="start-time" type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} required className="mt-1"/>
                    </div>
                    <div>
                        <Label htmlFor="end-time">End Time</Label>
                        <Input id="end-time" type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} required className="mt-1"/>
                    </div>
                </div>
                <div>
                  <Label htmlFor="reason">Reason (Optional)</Label>
                  <Textarea id="reason" placeholder="e.g., Maintenance, Private Event" value={reason} onChange={(e) => setReason(e.target.value)} className="mt-1" rows={2}/>
                </div>
                <Button type="submit" className="w-full" disabled={isSubmittingBlock}>
                  {isSubmittingBlock ? <LoadingSpinner size={20} className="mr-2"/> : <PlusCircle className="mr-2 h-4 w-4" />}
                  {isSubmittingBlock ? "Blocking..." : "Add Blocked Slot"}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="shadow-md">
            <CardHeader>
              <CardTitle>Currently Blocked Slots</CardTitle>
              <CardDescription>Review and manage existing blocks for {selectedFacility.name}.</CardDescription>
            </CardHeader>
            <CardContent>
              {sortedBlockedSlots.length === 0 ? (
                <p className="text-muted-foreground text-sm">No slots are currently blocked for this facility.</p>
              ) : (
                <div className="max-h-[400px] overflow-y-auto">
                    <Table>
                        <TableHeader>
                        <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Time</TableHead>
                            <TableHead>Reason</TableHead>
                            <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                        </TableHeader>
                        <TableBody>
                        {sortedBlockedSlots.map((slot, index) => (
                            <TableRow key={`${slot.date}-${slot.startTime}-${index}`}>
                            <TableCell>{format(parse(slot.date, 'yyyy-MM-dd', new Date()), 'MMM d, yyyy')}</TableCell>
                            <TableCell>{slot.startTime} - {slot.endTime}</TableCell>
                            <TableCell className="text-xs text-muted-foreground truncate max-w-[100px]">{slot.reason || 'N/A'}</TableCell>
                            <TableCell className="text-right">
                                <Button 
                                variant="destructive" 
                                size="sm" 
                                onClick={() => handleRemoveBlockedSlot(slot.date, slot.startTime)}
                                >
                                <Trash2 className="mr-1 h-3 w-3" /> Unblock
                                </Button>
                            </TableCell>
                            </TableRow>
                        ))}
                        </TableBody>
                    </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
       {!selectedFacilityId && ownerFacilities.length > 0 && (
         <Alert className="mt-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Select a Facility</AlertTitle>
            <AlertDescription>
                Please choose one of your facilities from the dropdown above to manage its availability.
            </AlertDescription>
        </Alert>
       )}
    </div>
  );
}
