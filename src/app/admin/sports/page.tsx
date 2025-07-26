
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { PageTitle } from '@/components/shared/PageTitle';
import { Button } from '@/components/ui/button';
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
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, MoreHorizontal, Edit, Trash2, Dices } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import type { Sport } from '@/lib/types';
import { getAllSportsAction, deleteSportAction } from '@/app/actions';
import { IconComponent } from '@/components/shared/Icon';

export default function AdminSportsPage() {
  const [sports, setSports] = useState<Sport[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchSports = async () => {
      try {
        const sportsData = await getAllSportsAction();
        setSports(sportsData);
      } catch (error) {
        toast({ title: 'Error', description: 'Could not load sports data.', variant: 'destructive' });
      } finally {
        setIsLoading(false);
      }
    };
    fetchSports();
  }, [toast]);
  
  const handleDelete = async (sport: Sport) => {
      if(confirm(`Are you sure you want to delete the sport "${sport.name}"? This action cannot be undone.`)){
          try {
              await deleteSportAction(sport.id);
              toast({ title: "Sport Deleted", description: `"${sport.name}" has been removed.`});
              const sportsData = await getAllSportsAction();
              setSports(sportsData);
          } catch (error) {
              toast({ title: "Error", description: `Could not delete "${sport.name}".`, variant: "destructive"});
          }
      }
  };


  if (isLoading) {
    return (
      <div className="space-y-8">
        <PageTitle title="Manage Sports" />
        <Card className="shadow-lg"><CardHeader><CardTitle>Loading Sports...</CardTitle></CardHeader>
          <CardContent className="flex items-center justify-center min-h-[300px]"><LoadingSpinner size={48} /></CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <Card className="shadow-lg">
        <CardHeader className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <CardTitle className="flex items-center"><Dices className="mr-2 h-6 w-6 text-primary"/>Sports Management</CardTitle>
            <CardDescription>Add, edit, or remove sports available on the platform.</CardDescription>
          </div>
          <Link href="/admin/sports/new">
            <Button><PlusCircle className="mr-2 h-4 w-4" /> Add New Sport</Button>
          </Link>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Icon</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>ID</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sports.length === 0 ? (
                  <TableRow><TableCell colSpan={4} className="h-24 text-center">No sports found.</TableCell></TableRow>
                ) : (
                  sports.map((sport) => (
                    <TableRow key={sport.id}>
                      <TableCell>
                        <IconComponent name={sport.iconName} className="h-5 w-5 text-muted-foreground" />
                      </TableCell>
                      <TableCell className="font-medium">{sport.name}</TableCell>
                      <TableCell className="font-mono text-xs text-muted-foreground">{sport.id}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild><Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal /></Button></DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem asChild><Link href={`/admin/sports/${sport.id}/edit`}><Edit className="mr-2 h-4 w-4" />Edit</Link></DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive focus:text-destructive focus:bg-destructive/10" onClick={() => handleDelete(sport)}>
                              <Trash2 className="mr-2 h-4 w-4" /> Delete
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
    </div>
  );
}
