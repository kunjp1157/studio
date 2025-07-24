
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { PageTitle } from '@/components/shared/PageTitle';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import type { UserProfile, UserRole, UserStatus, Facility } from '@/lib/types';
import { updateUser as updateMockUser, addNotification } from '@/lib/data';
import { getUsersAction, getFacilitiesByOwnerIdAction } from '@/app/actions';
import { MoreHorizontal, Eye, Edit, Trash2, ToggleLeft, ToggleRight, Search, FilterX, ShieldCheck, UserCircle, Mail, Phone, UserCheck, UserX, Building2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { format, parseISO } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const userFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email." }),
  role: z.enum(['Admin', 'User', 'FacilityOwner']),
  status: z.enum(['Active', 'Suspended', 'PendingApproval']),
  membershipLevel: z.enum(['Basic', 'Premium', 'Pro']).optional(),
});

type UserFormValues = z.infer<typeof userFormSchema>;

export default function AdminUsersPage() {
  const [allUsers, setAllUsers] = useState<UserProfile[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [ownedFacilities, setOwnedFacilities] = useState<Facility[]>([]);

  const { toast } = useToast();
  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
  });

  useEffect(() => {
    const fetchUsers = async () => {
        setIsLoading(true);
        try {
            const usersData = await getUsersAction();
            setAllUsers(usersData);
        } catch (error) {
             toast({ title: "Error", description: "Could not load user data.", variant: "destructive" });
        } finally {
            setIsLoading(false);
        }
    };
    fetchUsers();
  }, [toast]);


  useEffect(() => {
    let results = allUsers;
    if (searchTerm) {
      results = results.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setFilteredUsers(results);
  }, [searchTerm, allUsers]);

  const handleViewDetails = async (user: UserProfile) => {
    setSelectedUser(user);
    if (user.role === 'FacilityOwner') {
        const facilities = await getFacilitiesByOwnerIdAction(user.id);
        setOwnedFacilities(facilities);
    } else {
        setOwnedFacilities([]);
    }
    setIsViewModalOpen(true);
  };

  const handleEditUser = (user: UserProfile) => {
    setSelectedUser(user);
    form.reset({
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      membershipLevel: user.membershipLevel,
    });
    setIsEditModalOpen(true);
  };
  
  const handleToggleStatus = async (user: UserProfile) => {
    const newStatus: UserStatus = user.status === 'Active' ? 'Suspended' : 'Active';
    
    try {
        await updateMockUser(user.id, { status: newStatus });
        toast({
            title: `User ${newStatus === 'Active' ? 'Activated' : 'Suspended'}`,
            description: `${user.name}'s status has been changed to ${newStatus}.`,
        });
        addNotification(user.id, {
            type: 'user_status_changed',
            title: `Account Status Changed`,
            message: `Your account status has been updated to ${newStatus} by an administrator.`,
            link: '/account/profile',
        });
    } catch (error) {
        toast({ title: "Error", description: "Failed to update user status.", variant: "destructive" });
    }
  };

  const onEditSubmit = async (data: UserFormValues) => {
    if (!selectedUser) return;
    
    try {
        await updateMockUser(selectedUser.id, {
            name: data.name,
            email: data.email,
            role: data.role,
            status: data.status,
            membershipLevel: data.membershipLevel,
        });

        toast({
            title: "User Updated",
            description: `${data.name}'s profile has been successfully updated.`,
        });
        addNotification(selectedUser.id, {
            type: 'general',
            title: 'Profile Updated by Admin',
            message: 'An administrator has updated your profile information.',
            link: '/account/profile',
        });
        setIsEditModalOpen(false);
    } catch (error) {
         toast({ title: "Error", description: "Failed to update user.", variant: "destructive"});
    }
  };


  const getStatusBadgeVariant = (status: UserStatus): "default" | "secondary" | "destructive" | "outline" => {
    if (status === 'Active') return 'default'; // Greenish
    if (status === 'Suspended') return 'destructive';
    if (status === 'PendingApproval') return 'secondary'; // Yellowish
    return 'outline';
  };

  const getRoleBadgeVariant = (role: UserRole): "default" | "secondary" | "outline" => {
    if (role === 'Admin') return 'default';
    if (role === 'FacilityOwner') return 'secondary';
    return 'outline';
  };


  if (isLoading) {
    return (
      <div className="space-y-8">
        <PageTitle title="User Management" description="Oversee and manage user accounts on the platform." />
        <Card className="shadow-lg"><CardHeader><CardTitle>Loading Users...</CardTitle></CardHeader>
          <CardContent className="flex items-center justify-center min-h-[300px]"><LoadingSpinner size={48} /></CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <PageTitle title="User Management" description="Oversee and manage user accounts on the platform." />

      <Card className="shadow-lg">
        <CardHeader className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <CardTitle className="flex items-center"><Users className="mr-2 h-6 w-6 text-primary" />Registered Users</CardTitle>
            <CardDescription>View, edit details, and manage user statuses and roles.</CardDescription>
          </div>
          {/* Add User button can be added here later */}
        </CardHeader>
        <CardContent>
          <div className="mb-6 flex gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search by Name, Email, or User ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full"
              />
            </div>
            <Button 
                variant="outline" 
                onClick={() => setSearchTerm('')}
                disabled={!searchTerm}
            >
                <FilterX className="mr-2 h-4 w-4" /> Clear Search
            </Button>
          </div>

          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">Avatar</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length === 0 ? (
                  <TableRow><TableCell colSpan={7} className="h-24 text-center text-muted-foreground">No users match your search.</TableCell></TableRow>
                ) : (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <Avatar className="h-9 w-9">
                          <AvatarImage src={user.profilePictureUrl} alt={user.name} data-ai-hint="user avatar" />
                          <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                      </TableCell>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell><Badge variant={getRoleBadgeVariant(user.role)}>{user.role}</Badge></TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(user.status)} className={user.status === 'Active' ? 'bg-green-500 text-white hover:bg-green-600' : ''}>
                          {user.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{format(parseISO(user.joinedAt), 'MMM d, yyyy')}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild><Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => handleViewDetails(user)}><Eye className="mr-2 h-4 w-4" /> View Details</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEditUser(user)}><Edit className="mr-2 h-4 w-4" /> Edit User</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleToggleStatus(user)} className={user.status === 'Active' ? "text-orange-600 focus:text-orange-600 focus:bg-orange-50" : "text-green-600 focus:text-green-600 focus:bg-green-50"}>
                              {user.status === 'Active' ? <UserX className="mr-2 h-4 w-4" /> : <UserCheck className="mr-2 h-4 w-4" />}
                              {user.status === 'Active' ? 'Suspend User' : 'Activate User'}
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive focus:text-destructive focus:bg-destructive/10" onClick={() => toast({ title: "Feature Coming Soon", description: "User deletion will be available soon."})}>
                              <Trash2 className="mr-2 h-4 w-4" /> Delete User
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* View User Details Modal */}
      {selectedUser && (
        <AlertDialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
          <AlertDialogContent className="max-w-xl">
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center"><UserCircle className="mr-2 h-6 w-6 text-primary"/>User Profile: {selectedUser.name}</AlertDialogTitle>
              <AlertDialogDescription>Detailed information for {selectedUser.email}.</AlertDialogDescription>
            </AlertDialogHeader>
            <div className="py-4 space-y-3 max-h-[60vh] overflow-y-auto px-1 text-sm">
                <p><strong>User ID:</strong> <span className="font-mono text-xs">{selectedUser.id}</span></p>
                <p><strong>Full Name:</strong> {selectedUser.name}</p>
                <p><strong>Email:</strong> {selectedUser.email}</p>
                <p><strong>Phone:</strong> {selectedUser.phone || 'N/A'}</p>
                <p><strong>Role:</strong> <Badge variant={getRoleBadgeVariant(selectedUser.role)}>{selectedUser.role}</Badge></p>
                <p><strong>Status:</strong> <Badge variant={getStatusBadgeVariant(selectedUser.status)} className={selectedUser.status === 'Active' ? 'bg-green-500 text-white' : ''}>{selectedUser.status}</Badge></p>
                <p><strong>Membership:</strong> {selectedUser.membershipLevel || 'None'}</p>
                <p><strong>Joined:</strong> {format(parseISO(selectedUser.joinedAt), 'MMMM d, yyyy, p')}</p>
                <p><strong>Loyalty Points:</strong> {selectedUser.loyaltyPoints || 0}</p>
                <p><strong>Bio:</strong> <span className="italic text-muted-foreground">{selectedUser.bio || 'No bio provided.'}</span></p>
                 {selectedUser.role === 'FacilityOwner' && (
                    <>
                        <hr className="my-2"/>
                        <div>
                        <h4 className="font-semibold mb-2 flex items-center"><Building2 className="mr-2 h-4 w-4 text-muted-foreground"/>Owned Facilities ({ownedFacilities.length})</h4>
                        {ownedFacilities.length > 0 ? (
                            <ul className="list-disc list-inside space-y-1">
                                {ownedFacilities.map(facility => (
                                    <li key={facility.id}>
                                        <Link href={`/admin/facilities/${facility.id}/edit`} className="text-primary hover:underline">
                                            {facility.name}
                                        </Link>
                                        <span className="text-muted-foreground text-xs"> - {facility.location}</span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-muted-foreground italic text-xs">This owner has not added any facilities yet.</p>
                        )}
                        </div>
                    </>
                )}
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setIsViewModalOpen(false)}>Close</AlertDialogCancel>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}

    {/* Edit User Modal */}
    {selectedUser && (
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
            <DialogContent className="sm:max-w-[525px]">
                <DialogHeader>
                    <DialogTitle>Edit User: {selectedUser.name}</DialogTitle>
                    <DialogDescription>Modify the user's details below.</DialogDescription>
                </DialogHeader>
                <form onSubmit={form.handleSubmit(onEditSubmit)} className="space-y-6 py-4">
                    <FormField control={form.control} name="name" render={({ field }) => (
                        <FormItem>
                            <Label htmlFor="edit-name">Full Name</Label>
                            <Input id="edit-name" {...field} />
                            {form.formState.errors.name && <p className="text-xs text-destructive mt-1">{form.formState.errors.name.message}</p>}
                        </FormItem>
                    )} />
                    <FormField control={form.control} name="email" render={({ field }) => (
                        <FormItem>
                            <Label htmlFor="edit-email">Email Address</Label>
                            <Input id="edit-email" type="email" {...field} />
                            {form.formState.errors.email && <p className="text-xs text-destructive mt-1">{form.formState.errors.email.message}</p>}
                        </FormItem>
                    )} />
                     <FormField control={form.control} name="membershipLevel" render={({ field }) => (
                        <FormItem>
                            <Label htmlFor="edit-membershipLevel">Membership Level</Label>
                             <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <SelectTrigger id="edit-membershipLevel"><SelectValue placeholder="Select membership" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Basic">Basic</SelectItem>
                                    <SelectItem value="Premium">Premium</SelectItem>
                                    <SelectItem value="Pro">Pro</SelectItem>
                                </SelectContent>
                            </Select>
                            {form.formState.errors.membershipLevel && <p className="text-xs text-destructive mt-1">{form.formState.errors.membershipLevel.message}</p>}
                        </FormItem>
                    )} />
                    <div className="grid grid-cols-2 gap-4">
                        <FormField control={form.control} name="role" render={({ field }) => (
                            <FormItem>
                                <Label htmlFor="edit-role">Role</Label>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <SelectTrigger id="edit-role"><SelectValue placeholder="Select role" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="User">User</SelectItem>
                                        <SelectItem value="FacilityOwner">Facility Owner</SelectItem>
                                        <SelectItem value="Admin">Admin</SelectItem>
                                    </SelectContent>
                                </Select>
                                {form.formState.errors.role && <p className="text-xs text-destructive mt-1">{form.formState.errors.role.message}</p>}
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="status" render={({ field }) => (
                            <FormItem>
                                <Label htmlFor="edit-status">Status</Label>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <SelectTrigger id="edit-status"><SelectValue placeholder="Select status" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Active">Active</SelectItem>
                                        <SelectItem value="Suspended">Suspended</SelectItem>
                                        <SelectItem value="PendingApproval">Pending Approval</SelectItem>
                                    </SelectContent>
                                </Select>
                                {form.formState.errors.status && <p className="text-xs text-destructive mt-1">{form.formState.errors.status.message}</p>}
                            </FormItem>
                        )} />
                    </div>
                    <DialogClose asChild>
                         <Button type="button" variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button type="submit">
                       'Save Changes'
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    )}

    </div>
  );
}
