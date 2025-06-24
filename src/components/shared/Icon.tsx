
'use client'; // This component will be used in client components

import type { LucideProps } from 'lucide-react';
import {
  ParkingCircle, Wifi, ShowerHead, Lock, Dumbbell, Zap, Users, Trophy, Award, CalendarDays, Utensils, Star, LocateFixed, Clock, DollarSign, Goal, Bike, Dices, Swords, Music, Tent, Drama, MapPin, Heart, Dribbble, Activity, Feather, CheckCircle, XCircle, MessageSquareText, Info, Gift, Edit3, PackageSearch, Shirt, Disc, Medal, Gem, Rocket, Gamepad2, MonitorPlay, Target, Drum, Guitar, Brain, Camera, PersonStanding, Building, HandCoins, Palette, Group, BikeIcon, DramaIcon, Film, Gamepad, GuitarIcon, Landmark, Lightbulb, MountainSnow, Pizza, ShoppingBag, VenetianMask, Warehouse, Weight, Wind, WrapText, Speech, HistoryIcon, BarChartIcon, UserCheck, UserX, Building2, BellRing, LayoutPanelLeft,
} from 'lucide-react';
import type { ElementType } from 'react';

// Using a map for efficient lookup
const iconMap: Record<string, ElementType> = {
  ParkingCircle, Wifi, ShowerHead, Lock, Dumbbell, Zap, Users, Trophy, Award, CalendarDays, Utensils, Star, LocateFixed, Clock, DollarSign, Goal, Bike, Dices, Swords, Music, Tent, Drama, MapPin, Heart, Dribbble, Activity, Feather, CheckCircle, XCircle, MessageSquareText, Info, Gift, Edit3, PackageSearch, Shirt, Disc, Medal, Gem, Rocket, Gamepad2, MonitorPlay, Target, Drum, Guitar, Brain, Camera, PersonStanding, Building, HandCoins, Palette, Group, BikeIcon, DramaIcon, Film, Gamepad, GuitarIcon, Landmark, Lightbulb, MountainSnow, Pizza, ShoppingBag, VenetianMask, Warehouse, Weight, Wind, WrapText, Speech, HistoryIcon, BarChartIcon, UserCheck, UserX, Building2, BellRing, LayoutPanelLeft,
};

// Renaming the component to avoid conflicts with the 'Icon' type
export const IconComponent = ({ name, ...props }: { name?: string } & LucideProps) => {
    if (!name) {
        return null; 
    }
    const IconElement = iconMap[name];

    if (!IconElement) {
        console.warn(`Icon "${name}" not found.`);
        return null; // Or return a default icon
    }

    return <IconElement {...props} />;
};

export const getIconComponent = (name?: string): ElementType | undefined => {
    if (!name) return undefined;
    return iconMap[name];
}
